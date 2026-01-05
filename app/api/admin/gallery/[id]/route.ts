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
    const { title, description, image_url, category } = body;

    // --- PERBAIKAN SQL UPDATE ---
    // Ganti ? menjadi $1, $2, $3, $4, $5 sesuai urutan array
    await query(
      "UPDATE gallery_images SET title = $1, description = $2, image_url = $3, category = $4 WHERE id = $5",
      [title, description, image_url, category, id]
    );

    return NextResponse.json({ message: "Gallery image updated successfully" });
  } catch (error) {
    console.error("Gallery update error:", error);
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

    // --- PERBAIKAN SQL DELETE ---
    // Ganti ? menjadi $1
    await query("DELETE FROM gallery_images WHERE id = $1", [id]);

    return NextResponse.json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
