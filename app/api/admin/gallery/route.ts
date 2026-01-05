import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query SELECT aman (Standard SQL)
    const results = await query(
      "SELECT * FROM gallery_images ORDER BY order_index ASC"
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, image_url, category } = body;

    // --- PERBAIKAN UTAMA ---
    // Ganti VALUES (?, ?, ?, ?) menjadi VALUES ($1, $2, $3, $4)
    await query(
      "INSERT INTO gallery_images (title, description, image_url, category) VALUES ($1, $2, $3, $4)",
      [title, description, image_url, category]
    );

    return NextResponse.json({ message: "Gallery image created successfully" });
  } catch (error) {
    console.error("Gallery create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
