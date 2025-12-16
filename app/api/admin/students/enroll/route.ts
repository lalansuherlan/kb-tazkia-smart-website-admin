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
    const ppdbData: any = await query(
      "SELECT * FROM ppdb_applications WHERE id = ?",
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
    const sqlInsert = `
      INSERT INTO students 
      (ppdb_id, nis, full_name, birth_date, gender, class_name, program_name, academic_year, parent_name, parent_phone, parent_email, address, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `;

    await query(sqlInsert, [
      p.id,
      nis,
      p.child_name,
      p.child_birth_date,
      p.child_gender,
      class_name,
      p.program_name,
      academic_year,
      p.parent_name,
      p.parent_phone,
      p.parent_email,
      p.address,
    ]);

    // 4. UPDATE STATUS PPDB MENJADI 'ENROLLED' (Ini yang sebelumnya kurang)
    await query(
      "UPDATE ppdb_applications SET status = 'enrolled' WHERE id = ?",
      [p.id]
    );

    return NextResponse.json(
      { message: "Siswa berhasil didaftarkan" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Enroll error:", error);
    // Handle error duplikat NIS
    if (error.code === "ER_DUP_ENTRY") {
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
