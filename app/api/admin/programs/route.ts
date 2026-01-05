import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

// GET: Ambil Data (Aman, tidak ada parameter)
export async function GET(request: NextRequest) {
  try {
    // Validasi Token Admin
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await query(
      "SELECT * FROM programs ORDER BY order_index ASC"
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("Programs API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Tambah Data
export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, icon, bg_emoji, color_class, order_index } =
      body;

    // --- PERBAIKAN UTAMA (PostgreSQL Syntax) ---
    // Ganti (?, ?, ?, ?, ?, ?) menjadi ($1, $2, $3, $4, $5, $6)
    await query(
      `INSERT INTO programs 
       (name, description, icon, bg_emoji, color_class, order_index) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        name,
        description,
        icon,
        bg_emoji || "✨", // Default jika kosong
        color_class || "from-green-100 to-emerald-100", // Default warna
        Number(order_index || 0), // Pastikan tipe number
      ]
    );

    return NextResponse.json({ message: "Program created successfully" });
  } catch (error) {
    console.error("Program create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
