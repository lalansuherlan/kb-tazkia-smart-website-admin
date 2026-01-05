import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validasi status (sesuai ENUM di database postgres yang kita buat)
    const validStatuses = [
      "pending",
      "approved",
      "rejected",
      "waiting_list",
      "enrolled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // --- PERBAIKAN UTAMA (PostgreSQL Syntax) ---
    // Ganti ? menjadi $1 dan $2
    await query(
      "UPDATE ppdb_applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [status, id]
    );

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("PPDB update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
