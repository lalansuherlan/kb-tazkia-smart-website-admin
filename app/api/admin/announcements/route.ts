import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

// GET ALL (Untuk Admin Table)
export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const results = await query(
      "SELECT * FROM announcements ORDER BY created_at DESC"
    );
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// CREATE NEW
export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, type, content, event_date, is_active } = body;

    await query(
      "INSERT INTO announcements (title, type, content, event_date, is_active) VALUES (?, ?, ?, ?, ?)",
      [title, type, content, event_date || null, is_active ? 1 : 0]
    );

    return NextResponse.json(
      { message: "Created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
