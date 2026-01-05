import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Query standar (Aman untuk Postgres & MySQL karena tidak ada parameter)
    const rows = await query(
      "SELECT * FROM school_feedback ORDER BY created_at DESC"
    );

    return NextResponse.json(rows, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GET Feedback Error:", error); // Tambahkan log error agar mudah debug
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
