import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Query SELECT aman (Standard SQL)
    const results = await query(
      "SELECT * FROM ppdb_categories ORDER BY order_index ASC"
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    // Pastikan data JSON di-stringify sebelum masuk database
    // Karena kolom di database bertipe TEXT, kita harus mengubah Object/Array menjadi String JSON valid.

    // --- PERBAIKAN UTAMA: Ganti ? menjadi $1 s/d $15 ---
    const sql = `
      INSERT INTO ppdb_categories 
      (name, age_range, emoji, color_class, short_desc, full_desc, objectives, curriculum, facilities, schedule, costs, requirements, benefits, admission, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `;

    await query(sql, [
      body.name,
      body.age_range,
      body.emoji,
      body.color_class,
      body.short_desc,
      body.full_desc,
      JSON.stringify(body.objectives || []), // $7
      JSON.stringify(body.curriculum || {}), // $8
      JSON.stringify(body.facilities || []), // $9
      JSON.stringify(body.schedule || {}), // $10
      JSON.stringify(body.costs || {}), // $11
      JSON.stringify(body.requirements || []), // $12
      JSON.stringify(body.benefits || []), // $13
      body.admission,
      Number(body.order_index || 0), // $15 (Pastikan number)
    ]);

    return NextResponse.json({ message: "Category created" }, { status: 201 });
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
