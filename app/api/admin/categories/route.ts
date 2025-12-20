import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Ambil id dan name, urutkan berdasarkan order_index (biar KB -> TK B urut)
    const results = await query(
      "SELECT id, name FROM ppdb_categories ORDER BY order_index ASC"
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 }
    );
  }
}
