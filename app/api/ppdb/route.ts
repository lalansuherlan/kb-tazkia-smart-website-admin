import { query } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2/promise";

export async function GET() {
  try {
    const result = await query(
      "SELECT * FROM ppdb_applications ORDER BY created_at DESC"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("[v0] GET PPDB error:", error);
    return NextResponse.json(
      { error: "Failed to fetch PPDB applications" },
      { status: 500 }
    );
  }
}
