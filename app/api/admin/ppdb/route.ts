import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

// GET: Ambil Semua Data PPDB
export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query Standar (Aman untuk Postgres & MySQL)
    const results = await query(
      "SELECT * FROM ppdb_applications ORDER BY created_at DESC"
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("PPDB GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update Status Pendaftaran (Contoh: Approve/Reject)
export async function PUT(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, notes } = body; // notes opsional jika ada catatan

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and Status required" },
        { status: 400 }
      );
    }

    // --- SYNTAX POSTGRESQL ---
    // Menggunakan $1, $2, $3
    await query(
      "UPDATE ppdb_applications SET status = $1, notes = $2 WHERE id = $3",
      [
        status,
        notes || null, // Handle jika notes kosong
        id,
      ]
    );

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("PPDB Update Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus Data PPDB (Jika diperlukan)
export async function DELETE(request: NextRequest) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    // Syntax Postgres $1
    await query("DELETE FROM ppdb_applications WHERE id = $1", [id]);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("PPDB Delete Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
