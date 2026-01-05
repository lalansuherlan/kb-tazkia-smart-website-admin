import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Query standar tanpa parameter (Aman untuk Postgres & MySQL)
    const sql = "SELECT id, name FROM ppdb_categories ORDER BY order_index ASC";

    // Tidak butuh array parameter [] karena tidak ada $1
    const results = await query(sql);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Database Error (Get Categories):", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 }
    );
  }
}
