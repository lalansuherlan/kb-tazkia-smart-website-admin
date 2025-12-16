import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    const user = verifyToken(token || ""); // Kita butuh ID dan Role user yang login

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Cek Role User dari Database (untuk keamanan ganda)
    const userData: any = await query(
      "SELECT role FROM admin_users WHERE id = ?",
      [user.userId]
    );
    const role = userData[0]?.role;

    let sql = `
      SELECT 
        s.*, 
        t.name as teacher_name 
      FROM students s
      LEFT JOIN admin_users t ON s.teacher_id = t.id
    `;

    const params: any[] = [];

    // LOGIKA PEMISAHAN DATA:
    // Jika yang login adalah GURU (teacher), tambahkan filter WHERE teacher_id = ...
    if (role === "teacher") {
      sql += " WHERE s.teacher_id = ? AND s.status = 'active'";
      params.push(user.userId);
    } else {
      // Jika Admin, tampilkan semua tapi urutkan biar rapi
      sql += " ORDER BY s.class_name ASC, s.full_name ASC";
    }

    const results = await query(sql, params);
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
