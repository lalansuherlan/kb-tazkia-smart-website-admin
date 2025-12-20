import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Tanggal awal dan akhir wajib diisi" },
      { status: 400 }
    );
  }

  try {
    // Query "Sakti" untuk Rekapitulasi
    // Menggunakan LEFT JOIN agar siswa yang belum pernah absen pun tetap muncul (dengan nilai 0)
    const sql = `
      SELECT 
        s.id, 
        s.full_name as nama, 
        s.nis, 
        s.class_name as kelas,
        COUNT(CASE WHEN a.status = 'Hadir' THEN 1 END) as hadir,
        COUNT(CASE WHEN a.status = 'Sakit' THEN 1 END) as sakit,
        COUNT(CASE WHEN a.status = 'Izin' THEN 1 END) as izin,
        COUNT(CASE WHEN a.status = 'Alpha' THEN 1 END) as alpha,
        COUNT(a.id) as total_hari
      FROM students s
      LEFT JOIN absensi a ON s.id = a.siswa_id 
        AND a.tanggal >= ? AND a.tanggal <= ?
      WHERE s.status = 'active'
      GROUP BY s.id, s.full_name, s.nis, s.class_name
      ORDER BY s.class_name ASC, s.full_name ASC
    `;

    const data = await query(sql, [startDate, endDate]);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error Rekap Absensi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data rekap" },
      { status: 500 }
    );
  }
}
