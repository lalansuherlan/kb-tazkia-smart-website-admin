import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    // --- PERBAIKAN UTAMA (PostgreSQL Syntax) ---
    // Ganti ? menjadi $1, $2 ... sampai $16
    // Perhatikan urutannya harus sama persis dengan array parameter di bawah
    const sql = `
      UPDATE ppdb_categories SET 
      name=$1, age_range=$2, emoji=$3, color_class=$4, short_desc=$5, full_desc=$6, 
      objectives=$7, curriculum=$8, facilities=$9, schedule=$10, costs=$11, requirements=$12, benefits=$13, admission=$14, order_index=$15
      WHERE id=$16
    `;

    await query(sql, [
      body.name,
      body.age_range,
      body.emoji,
      body.color_class,
      body.short_desc,
      body.full_desc,
      JSON.stringify(body.objectives || []),
      JSON.stringify(body.curriculum || {}),
      JSON.stringify(body.facilities || []),
      JSON.stringify(body.schedule || {}),
      JSON.stringify(body.costs || {}),
      JSON.stringify(body.requirements || []),
      JSON.stringify(body.benefits || []),
      body.admission,
      Number(body.order_index), // $15
      id, // $16 (WHERE clause)
    ]);

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("PUT Category Error:", error); // Log error
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // --- PERBAIKAN DELETE ---
    // Ganti ? menjadi $1
    await query("DELETE FROM ppdb_categories WHERE id = $1", [id]);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE Category Error:", error); // Log error
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
