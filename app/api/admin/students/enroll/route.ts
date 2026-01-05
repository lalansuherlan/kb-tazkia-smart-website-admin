import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 1. Cek Login
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { ppdb_id, nis, class_name, academic_year } = body;

    if (!ppdb_id || !nis || !class_name || !academic_year) {
      return NextResponse.json(
        { error: "Data siswa (NIS/Kelas) wajib diisi" },
        { status: 400 }
      );
    }

    // 2. Ambil data dari tabel PPDB
    // Ganti ? menjadi $1
    const ppdbData: any = await query(
      "SELECT * FROM ppdb_applications WHERE id = $1",
      [ppdb_id]
    );

    if (Array.isArray(ppdbData) && ppdbData.length === 0) {
      return NextResponse.json(
        { error: "Data PPDB tidak ditemukan" },
        { status: 404 }
      );
    }
    const p = ppdbData[0];

    // 3. Masukkan ke tabel Students
    // Ganti ? menjadi $1 s/d $12
    const sqlInsert = `
      INSERT INTO students 
      (ppdb_id, nis, full_name, birth_date, gender, class_name, program_name, academic_year, parent_name, parent_phone, parent_email, address, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active')
    `;

    await query(sqlInsert, [
      p.id, // $1
      nis, // $2
      p.child_name, // $3
      p.child_birth_date, // $4
      p.child_gender, // $5
      class_name, // $6
      p.program_name, // $7
      academic_year, // $8
      p.parent_name, // $9
      p.parent_phone, // $10
      p.parent_email, // $11
      p.address, // $12
    ]);

    // 4. UPDATE STATUS PPDB MENJADI 'ENROLLED'
    // Ganti ? menjadi $1
    await query(
      "UPDATE ppdb_applications SET status = 'enrolled' WHERE id = $1",
      [p.id]
    );

    return NextResponse.json(
      { message: "Siswa berhasil didaftarkan" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Enroll error:", error);

    // --- PERBAIKAN ERROR CODE ---
    // MySQL: "ER_DUP_ENTRY"
    // PostgreSQL: "23505" (Unique Constraint Violation)
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "NIS sudah terdaftar!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
