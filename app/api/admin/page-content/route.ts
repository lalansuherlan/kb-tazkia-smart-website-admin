import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Ambil semua konten halaman (Query standar, aman)
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

    // 3. Update Query SQL untuk PostgreSQL
    // - Gunakan $1, $2, dst.
    // - Gunakan ON CONFLICT (page_name, section_name) karena itu unique key-nya
    // - Gunakan EXCLUDED.nama_kolom untuk mengambil nilai baru
    const sql = `
      INSERT INTO page_content (page_name, section_name, title, content, image_url) 
      VALUES ($1, $2, $3, $4, $5) 
      ON CONFLICT (page_name, section_name) 
      DO UPDATE SET 
        title = EXCLUDED.title, 
        content = EXCLUDED.content,
        image_url = EXCLUDED.image_url
    `;

    // 4. Masukkan parameter (sesuai urutan $1 s/d $5)
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
