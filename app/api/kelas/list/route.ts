import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Ambil kelas yang unik, tidak boleh kosong/null
    const sql = `
      SELECT DISTINCT class_name 
      FROM students 
      WHERE status = 'active' 
        AND class_name IS NOT NULL 
        AND class_name != ''
      ORDER BY class_name ASC
    `;
    const data = await query(sql);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Gagal ambil kelas:", error);
    return NextResponse.json({ success: false, data: [] });
  }
}
