import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

// PUT: Update Program
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Destructure data
    const { name, description, icon, bg_emoji, color_class, order_index } =
      body;

    // --- PERBAIKAN POSTGRESQL ---
    // Ganti ? menjadi $1 s/d $7
    await query(
      `UPDATE programs 
       SET name = $1, description = $2, icon = $3, bg_emoji = $4, color_class = $5, order_index = $6 
       WHERE id = $7`,
      [
        name,
        description,
        icon,
        bg_emoji || "✨", // Fallback ke default emoji
        color_class || "from-green-100 to-emerald-100", // Fallback ke default warna
        Number(order_index ?? 0), // Pastikan menjadi Number
        id, // Parameter ke-7 (WHERE clause)
      ]
    );

    return NextResponse.json({ message: "Program updated successfully" });
  } catch (error) {
    console.error("Program update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus Program
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // --- PERBAIKAN POSTGRESQL ---
    // Ganti ? menjadi $1
    await query("DELETE FROM programs WHERE id = $1", [id]);

    return NextResponse.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Program delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
