import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    // 👇 WAJIB ADA 'await' di Next.js versi baru
    const headersList = await headers();
    const userId = headersList.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID tidak ditemukan di header" },
        { status: 401 }
      );
    }

    // Ambil data user
    const sql = `SELECT id, name, role FROM admin_users WHERE id = ?`;
    const rows: any = await query(sql, [userId]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "User tidak ditemukan di DB" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error Auth Me:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
