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

    const sql = `
      UPDATE ppdb_categories SET 
      name=?, age_range=?, emoji=?, color_class=?, short_desc=?, full_desc=?, 
      objectives=?, curriculum=?, facilities=?, schedule=?, costs=?, requirements=?, benefits=?, admission=?, order_index=?
      WHERE id=?
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
      body.order_index,
      id,
    ]);

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
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
    await query("DELETE FROM ppdb_categories WHERE id = ?", [id]);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
