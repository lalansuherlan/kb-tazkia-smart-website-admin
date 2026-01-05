import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Ambil data yang aktif saja, urutkan event terdekat dulu

    // --- PERBAIKAN POSTGRESQL ---
    // Ganti 'is_active = 1' menjadi 'is_active = true'
    const sql = `
      SELECT * FROM announcements 
      WHERE is_active = true 
      ORDER BY event_date DESC, created_at DESC 
      LIMIT 6
    `;

    const results = await query(sql);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Public Announcement API Error:", error); // Tambahkan log error
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
