import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

// PUT: Update Data berdasarkan ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { title, type, content, event_date, is_active } = body;

    // --- PERBAIKAN DATA UNTUK POSTGRESQL ---
    // 1. Convert Boolean (Postgres butuh true/false, bukan 1/0)
    const activeVal = Boolean(is_active);
    // 2. Handle Date (Postgres error jika string kosong "")
    const dateVal = event_date && event_date !== "" ? event_date : null;

    // --- PERBAIKAN QUERY ---
    // Ganti ? menjadi $1, $2, dst sesuai urutan array
    await query(
      "UPDATE announcements SET title=$1, type=$2, content=$3, event_date=$4, is_active=$5 WHERE id=$6",
      [title, type, content, dateVal, activeVal, id]
    );

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("PUT Error:", error); // Log error agar mudah debugging
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Hapus Data berdasarkan ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // --- PERBAIKAN QUERY ---
    // Ganti ? menjadi $1
    await query("DELETE FROM announcements WHERE id = $1", [id]);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
