import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    const user = verifyToken(token || ""); // Kita butuh ID dan Role user yang login

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Cek Role User (Fix: Ganti ? jadi $1)
    const userData: any = await query(
      "SELECT role FROM admin_users WHERE id = $1",
      [user.userId]
    );
    const role = userData[0]?.role;

    // Query Dasar
    let sql = `
      SELECT 
        s.*, 
        t.name as teacher_name 
      FROM students s
      LEFT JOIN admin_users t ON s.teacher_id = t.id
    `;

    const params: any[] = [];

    // 2. LOGIKA PEMISAHAN DATA
    if (role === "teacher") {
      // Fix: Ganti ? jadi $1
      // Karena params awalnya kosong [], maka item pertama yang di-push pasti adalah $1
      sql += " WHERE s.teacher_id = $1 AND s.status = 'active'";
      params.push(user.userId);
    }

    // 3. ORDER BY (Sebaiknya ditaruh di luar if/else agar Guru juga dapat data urut)
    sql += " ORDER BY s.class_name ASC, s.full_name ASC";

    const results = await query(sql, params);
    return NextResponse.json(results);
  } catch (error) {
    console.error("GET Students Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
