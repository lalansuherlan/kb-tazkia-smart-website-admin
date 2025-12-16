import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getAuthCookie, verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getAuthCookie()

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    const validStatuses = ["pending", "approved", "rejected", "waiting_list"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await query("UPDATE ppdb_applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, id])

    return NextResponse.json({ message: "Status updated successfully" })
  } catch (error) {
    console.error("PPDB update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
