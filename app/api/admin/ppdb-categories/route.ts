import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const results = await query(
      "SELECT * FROM ppdb_categories ORDER BY order_index ASC"
    );
    return NextResponse.json(results);
  } catch (error) {
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
    // Frontend mengirim Object/Array, Database butuh String
    const sql = `
      INSERT INTO ppdb_categories 
      (name, age_range, emoji, color_class, short_desc, full_desc, objectives, curriculum, facilities, schedule, costs, requirements, benefits, admission, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      body.name,
      body.age_range,
      body.emoji,
      body.color_class,
      body.short_desc,
      body.full_desc,
      JSON.stringify(body.objectives || []), // Array -> JSON String
      JSON.stringify(body.curriculum || {}), // Object -> JSON String
      JSON.stringify(body.facilities || []),
      JSON.stringify(body.schedule || {}),
      JSON.stringify(body.costs || {}),
      JSON.stringify(body.requirements || []),
      JSON.stringify(body.benefits || []),
      body.admission,
      body.order_index || 0,
    ]);

    return NextResponse.json({ message: "Category created" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
