import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, props: Props) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await props.params;
    const { status } = await request.json(); // 'approved' | 'rejected'

    await query("UPDATE school_feedback SET status = ? WHERE id = ?", [
      status,
      params.id,
    ]);

    return NextResponse.json({ message: "Status updated" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: Props) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await props.params;
    await query("DELETE FROM school_feedback WHERE id = ?", [params.id]);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
