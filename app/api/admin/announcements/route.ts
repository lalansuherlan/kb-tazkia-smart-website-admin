import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

// GET ALL (Untuk Admin Table)
export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Query standar (kompatibel mysql/postgres)
    const results = await query(
      "SELECT * FROM announcements ORDER BY created_at DESC"
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("GET Error:", error);
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

    // --- PERBAIKAN DATA UNTUK POSTGRESQL ---

    // 1. Convert ke Boolean murni (bukan 1/0)
    const activeVal = Boolean(is_active);

    // 2. Handle tanggal: jika kosong string "", ubah jadi null
    const dateVal = event_date && event_date !== "" ? event_date : null;

    // --- PERBAIKAN QUERY ---
    // Ganti ? menjadi $1, $2, $3, $4, $5
    await query(
      "INSERT INTO announcements (title, type, content, event_date, is_active) VALUES ($1, $2, $3, $4, $5)",
      [title, type, content, dateVal, activeVal]
    );

    return NextResponse.json(
      { message: "Created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error); // Log error agar terlihat di terminal
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, title, type, content, event_date, is_active } = body;

    const activeVal = Boolean(is_active);
    const dateVal = event_date && event_date !== "" ? event_date : null;

    // Perhatikan urutan $1 sampai $6
    await query(
      "UPDATE announcements SET title=$1, type=$2, content=$3, event_date=$4, is_active=$5 WHERE id=$6",
      [title, type, content, dateVal, activeVal, id]
    );

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    await query("DELETE FROM announcements WHERE id = $1", [id]);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
