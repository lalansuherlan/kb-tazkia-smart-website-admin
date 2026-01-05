import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Query ini sudah AMAN untuk PostgreSQL (Standard SQL).
    // Tidak menggunakan parameter input, jadi tidak perlu $1.
    // ORDER BY role ASC akan mengurutkan: Admin (A) dulu, baru Teacher (T).
    const sql = `
      SELECT id, name, role, photo_url 
      FROM admin_users 
      WHERE role IN ('admin', 'teacher')
      ORDER BY role ASC, name ASC
    `;

    console.log("Menjalankan Query Guru...");

    const rows = await query(sql);

    // console.log("Data Guru berhasil diambil:", rows); // Uncomment jika ingin lihat data mentah

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("❌ ERROR API GURU:", error); // Log error lengkap

    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}
