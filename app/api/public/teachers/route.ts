import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // KITA UBAH QUERY-NYA JADI LEBIH SEDERHANA
    // Hapus logika 'FIELD' yang mungkin bikin error
    const sql = `
      SELECT id, name, role, photo_url 
      FROM admin_users 
      WHERE role IN ('admin', 'teacher')
      ORDER BY role ASC, name ASC
    `;

    // Debugging: Cek apakah query jalan
    console.log("Menjalankan Query Guru...");

    const rows = await query(sql);

    console.log("Data Guru berhasil diambil:", rows); // Cek hasil di terminal

    return NextResponse.json(rows);
  } catch (error: any) {
    // PENTING: Tampilkan error asli di terminal agar ketahuan salahnya apa
    console.error("❌ ERROR API GURU:", error.message);

    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}
