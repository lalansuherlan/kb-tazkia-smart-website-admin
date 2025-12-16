import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Ambil semua konten halaman
    const results = await query("SELECT * FROM page_content");
    return NextResponse.json(results);
  } catch (error) {
    console.error("Fetch page content error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Cek Auth
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // 2. Ambil image_url dari body
    const { page_name, section_name, title, content, image_url } = body;

    // 3. Update Query SQL untuk menyertakan image_url
    const sql = `
      INSERT INTO page_content (page_name, section_name, title, content, image_url) 
      VALUES (?, ?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE 
      title = VALUES(title), 
      content = VALUES(content),
      image_url = VALUES(image_url)
    `;

    // 4. Masukkan parameter (image_url || null agar tidak undefined)
    await query(sql, [
      page_name,
      section_name,
      title,
      content,
      image_url || null,
    ]);

    return NextResponse.json({ message: "Content updated successfully" });
  } catch (error) {
    console.error("Content update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
