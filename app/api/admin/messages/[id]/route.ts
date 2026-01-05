import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // --- PERBAIKAN POSTGRESQL ---
    // Ganti ? menjadi $1
    await query("DELETE FROM messages WHERE id = $1", [id]);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE Message Error:", error); // Log error agar mudah debugging
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
