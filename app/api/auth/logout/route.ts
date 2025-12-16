import { type NextRequest, NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await clearAuthCookie()
    return NextResponse.json({ message: "Logout berhasil" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
