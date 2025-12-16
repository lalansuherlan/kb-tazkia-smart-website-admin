import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Hanya ambil yang sudah DISETUJUI admin
    const sql = `
      SELECT name, role, message, rating, created_at 
      FROM school_feedback 
      WHERE status = 'approved' AND type = 'testimonial' 
      ORDER BY created_at DESC 
      LIMIT 6
    `;

    const rows = await query(sql);

    return NextResponse.json(rows, {
      headers: { "Cache-Control": "no-store" }, // Agar data selalu fresh
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
