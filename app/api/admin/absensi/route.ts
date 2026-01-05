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
    // Query Dasar (PostgreSQL Syntax)
    // $1 = tanggal (untuk join absensi)
    // $2 = academicYear (untuk join absensi)
    // $3 = academicYear (untuk filter siswa aktif tahun ini)
    let sql = `
      SELECT 
        s.id as siswa_id, 
        s.full_name as nama, 
        s.nis, 
        s.class_name as kelas, 
        a.status as status_absensi, 
        a.keterangan
      FROM students s
      LEFT JOIN absensi a 
        ON s.id = a.siswa_id 
        AND a.tanggal = $1 
        AND a.academic_year = $2 
      WHERE s.status = 'active'
      AND s.academic_year = $3 
    `;

    const params: any[] = [tanggal, academicYear, academicYear];

    // 👇 LOGIC FILTER (Dynamic Parameter Index) 👇

    // Karena kita sudah pakai $1, $2, $3, maka parameter berikutnya adalah $4
    if (teacherId) {
      // KONDISI 1: Jika yang request adalah GURU
      sql += ` AND s.teacher_id = $4`;
      params.push(teacherId);
    } else if (kelas) {
      // KONDISI 2: Jika yang request adalah ADMIN
      // Sesuaikan kolom filter dengan tabel Anda (class_name atau program_name)
      // Di migrasi sebelumnya Anda pakai 'class_name' di tabel students,
      // tapi di request sebelumnya 'program_name'.
      // Saya gunakan 'program_name' sesuai kode asli Anda,
      // TAPI pastikan kolom ini ada di tabel students (atau ganti jadi class_name).
      sql += ` AND s.program_name = $4`;
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
export async function POST(request: Request) {
  try {
    const body = await request.json();
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
        // SQL PostgreSQL untuk UPSERT (Insert or Update)
        // ON CONFLICT (siswa_id, tanggal) -> Berdasarkan Unique Constraint yang kita buat di migrasi
        // EXCLUDED.kolom -> Mengambil nilai baru yang hendak diinsert
        const sql = `
          INSERT INTO absensi (siswa_id, academic_year, tanggal, status, keterangan)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (siswa_id, tanggal) 
          DO UPDATE SET 
            status = EXCLUDED.status, 
            keterangan = EXCLUDED.keterangan,
            academic_year = EXCLUDED.academic_year
        `;

        const statusFix = item.status || "Hadir";

        await query(sql, [
          item.siswa_id,
          academic_year,
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
