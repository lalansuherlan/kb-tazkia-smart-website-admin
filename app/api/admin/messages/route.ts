import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

// GET: Ambil Pesan
export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const results = await query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Hapus Pesan (via DELETE method di route yg sama dengan query param ?id=...)
// Atau buat file terpisah [id]/route.ts
