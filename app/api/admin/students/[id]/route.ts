import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// PATCH: Update Data Siswa
export async function PATCH(request: NextRequest, props: Props) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const id = params.id;

    // Pastikan ID dikonversi ke integer agar aman
    const studentId = parseInt(id);

    if (!studentId || isNaN(studentId)) {
      return NextResponse.json(
        { error: "ID Siswa tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      status,
      full_name,
      nis,
      class_name,
      academic_year,
      teacher_id,
      photo_url,
    } = body;

    let safeTeacherId = null;
    if (teacher_id && teacher_id !== "") {
      safeTeacherId = teacher_id;
    }

    const sqlParams = [
      status, // $1
      full_name, // $2
      nis, // $3
      class_name, // $4
      academic_year, // $5
      safeTeacherId, // $6
      photo_url, // $7
      studentId, // $8 (WHERE clause)
    ];

    const safeParams = sqlParams.map((val) => (val === undefined ? null : val));

    // --- PERBAIKAN UTAMA DI SINI ---
    // Tambahkan "RETURNING id" di akhir query.
    // Ini memaksa Postgres mengembalikan ID jika update berhasil.
    const result: any = await query(
      `UPDATE students 
       SET status=$1, full_name=$2, nis=$3, class_name=$4, academic_year=$5, teacher_id=$6, photo_url=$7 
       WHERE id=$8 
       RETURNING id`,
      safeParams
    );

    // Cek apakah ada data yang dikembalikan
    // Asumsi fungsi query mengembalikan array rows
    const updatedRows = Array.isArray(result) ? result : result.rows;

    // Jika array kosong, berarti tidak ada baris yang di-update (ID tidak ketemu)
    if (!updatedRows || updatedRows.length === 0) {
      console.warn(`⚠️ Query dijalankan tapi ID ${studentId} tidak ditemukan.`);
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Data updated successfully" });
  } catch (error: any) {
    console.error("❌ Database Error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Hapus Permanen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // --- PERBAIKAN POSTGRESQL ---
    // Ganti ? menjadi $1
    await query("DELETE FROM students WHERE id = $1", [id]);

    return NextResponse.json({ message: "Siswa dihapus permanen" });
  } catch (error) {
    console.error("DELETE Student Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
