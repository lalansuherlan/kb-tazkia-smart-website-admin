import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ambil user yang role-nya 'teacher' atau 'admin' (siapa tau kepsek jadi wali kelas)
    const teachers = await query(
      "SELECT id, name FROM admin_users WHERE role IN ('teacher', 'admin') ORDER BY name ASC"
    );
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
