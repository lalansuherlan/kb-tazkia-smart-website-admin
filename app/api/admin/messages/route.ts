import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

// GET: Ambil Semua Pesan
export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Query standar (Aman untuk Postgres & MySQL)
    const results = await query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("GET Messages Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Hapus Pesan berdasarkan Query Param (?id=123)
export async function DELETE(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ambil ID dari URL (contoh: /api/messages?id=5)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // --- PERBAIKAN UTAMA (PostgreSQL) ---
    // Gunakan $1, bukan ?
    await query("DELETE FROM messages WHERE id = $1", [id]);

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("DELETE Message Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
