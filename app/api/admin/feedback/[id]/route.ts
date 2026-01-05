import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

// PATCH: Update Status Feedback
export async function PATCH(request: NextRequest, props: Props) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await props.params;
    const { status } = await request.json(); // 'approved' | 'rejected'

    // PERBAIKAN: Ganti ? menjadi $1 dan $2
    await query("UPDATE school_feedback SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);

    return NextResponse.json({ message: "Status updated" });
  } catch (error) {
    console.error("PATCH Feedback Error:", error); // Log error
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// DELETE: Hapus Feedback
export async function DELETE(request: NextRequest, props: Props) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await props.params;

    // PERBAIKAN: Ganti ? menjadi $1
    await query("DELETE FROM school_feedback WHERE id = $1", [id]);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE Feedback Error:", error); // Log error
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
