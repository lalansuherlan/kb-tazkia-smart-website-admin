import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

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

    // PERBAIKAN DI SINI:
    // Gunakan "||" atau "??" untuk memastikan nilai tidak undefined.
    // Jika undefined, ganti dengan nilai default atau null.

    await query(
      `UPDATE programs 
       SET name = ?, description = ?, icon = ?, bg_emoji = ?, color_class = ?, order_index = ? 
       WHERE id = ?`,
      [
        name,
        description,
        icon,
        bg_emoji || "✨", // Fallback ke default emoji
        color_class || "from-green-100 to-emerald-100", // Fallback ke default warna
        order_index ?? 0, // Gunakan ?? agar angka 0 tidak dianggap false
        id,
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

    await query("DELETE FROM programs WHERE id = ?", [id]);

    return NextResponse.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Program delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
