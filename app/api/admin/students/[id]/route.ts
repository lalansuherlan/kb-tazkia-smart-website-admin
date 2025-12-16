import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, props: Props) {
  try {
    // 1. Cek Token
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- PERBAIKAN UTAMA DI SINI ---
    // params harus di-await dulu!
    const params = await props.params;
    const id = params.id;

    // Cek apakah ID terbaca
    console.log("=== DEBUG API ===");
    console.log("ID dari URL:", id); // Harusnya muncul angka, misal "1"

    if (!id || id === "undefined") {
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

    // Bersihkan teacher_id
    let safeTeacherId = null;
    if (teacher_id && teacher_id !== "") {
      safeTeacherId = teacher_id;
    }

    // Susun Parameter
    const sqlParams = [
      status,
      full_name,
      nis,
      class_name,
      academic_year,
      safeTeacherId,
      photo_url,
      id, // Pastikan ID ini masuk di akhir
    ];

    // Sanitasi undefined -> null
    const safeParams = sqlParams.map((val) => (val === undefined ? null : val));

    console.log("Parameter SQL Final:", safeParams);

    // Eksekusi Query
    const result: any = await query(
      `UPDATE students 
       SET status=?, full_name=?, nis=?, class_name=?, academic_year=?, teacher_id=?, photo_url=? 
       WHERE id=?`,
      safeParams
    );

    // Cek hasil
    if (result.affectedRows === 0) {
      console.warn("⚠️ Query dijalankan tapi ID tidak ditemukan di database.");
      return NextResponse.json(
        { message: "ID tidak ditemukan", result },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Data updated successfully", result });
  } catch (error: any) {
    console.error("❌ Database Error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Hapus Permanen (Hanya untuk kesalahan input fatal)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await query("DELETE FROM students WHERE id = ?", [id]);
    return NextResponse.json({ message: "Siswa dihapus permanen" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
