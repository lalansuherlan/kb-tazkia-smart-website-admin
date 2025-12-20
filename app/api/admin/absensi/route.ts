import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// 1. GET: Ambil Data Siswa + Status Absensi Hari Ini
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tanggal = searchParams.get("tanggal");
  const kelas = searchParams.get("kelas"); // Parameter dari Admin (Pilih Kelas)
  const academicYear = searchParams.get("academic_year");
  const teacherId = searchParams.get("teacher_id"); // Parameter dari Guru (Login ID)

  if (!tanggal || !academicYear) {
    return NextResponse.json(
      { error: "Tanggal dan Tahun Akademik wajib diisi" },
      { status: 400 }
    );
  }

  try {
    // Query Dasar
    let sql = `
      SELECT 
        s.id as siswa_id, 
        s.full_name as nama, 
        s.nis, 
        s.program_name as kelas, 
        a.status as status_absensi, 
        a.keterangan
      FROM students s
      LEFT JOIN absensi a 
        ON s.id = a.siswa_id 
        AND a.tanggal = ? 
        AND a.academic_year = ?  -- Join Absensi juga harus cek tahun akademik
      WHERE s.status = 'active'
      AND s.academic_year = ? 
    `;

    // Params Awal (Tanggal untuk JOIN, Tahun untuk JOIN, Tahun untuk WHERE Students)
    // Perhatikan urutan tanda tanya (?) di SQL di atas:
    // 1. a.tanggal = ?
    // 2. a.academic_year = ?
    // 3. s.academic_year = ?
    const params: any[] = [tanggal, academicYear, academicYear];

    // 👇 LOGIC FILTER PENTING DISINI 👇

    if (teacherId) {
      // KONDISI 1: Jika yang request adalah GURU
      // Filter berdasarkan kolom 'teacher_id' di tabel students
      sql += ` AND s.teacher_id = ?`;
      params.push(teacherId);
    } else if (kelas) {
      // KONDISI 2: Jika yang request adalah ADMIN (Pilih Dropdown)
      // Filter berdasarkan 'program_name' (sesuai screenshot database Anda)
      sql += ` AND s.program_name = ?`;
      params.push(kelas);
    }

    sql += ` ORDER BY s.full_name ASC`;

    const data = await query(sql, params);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error GET Absensi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data siswa" },
      { status: 500 }
    );
  }
}

// 2. POST: Simpan Absensi
// app/api/admin/absensi/route.ts

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 1. Pastikan ambil 'academic_year' dari body
    const { tanggal, academic_year, data_absensi } = body;

    // Validasi input
    if (!tanggal || !academic_year || !Array.isArray(data_absensi)) {
      return NextResponse.json(
        { error: "Data tidak valid (missing date/year)" },
        { status: 400 }
      );
    }

    await Promise.all(
      data_absensi.map(async (item: any) => {
        // 2. SQL HARUS MENYERTAKAN 'academic_year'
        const sql = `
          INSERT INTO absensi (siswa_id, academic_year, tanggal, status, keterangan)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            status = VALUES(status), 
            keterangan = VALUES(keterangan),
            academic_year = VALUES(academic_year)
        `;

        const statusFix = item.status || "Hadir";

        // 3. Masukkan variable 'academic_year' ke urutan parameter yang benar (urutan ke-2)
        await query(sql, [
          item.siswa_id,
          academic_year, // <-- INI YANG PENTING AGAR TIDAK NULL
          tanggal,
          statusFix,
          item.keterangan || "",
        ]);
      })
    );

    return NextResponse.json({
      success: true,
      message: `Absensi berhasil disimpan.`,
    });
  } catch (error) {
    console.error("Error POST Absensi:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan absensi" },
      { status: 500 }
    );
  }
}
