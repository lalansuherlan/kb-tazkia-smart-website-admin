import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Query ini AMAN untuk PostgreSQL & MySQL (Standard SQL)
    // Tidak perlu ubah ke $1 karena tidak ada input dari user (hardcoded strings)
    const teachers = await query(
      "SELECT id, name FROM admin_users WHERE role IN ('teacher', 'admin') ORDER BY name ASC"
    );

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("GET Teachers Error:", error); // Tambahkan log agar mudah debug
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
