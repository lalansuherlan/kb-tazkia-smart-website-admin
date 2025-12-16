import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getAuthCookie, verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie()

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const results = await query("SELECT * FROM ppdb_applications ORDER BY created_at DESC")
    return NextResponse.json(results)
  } catch (error) {
    console.error("PPDB API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
