import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password diperlukan" }, { status: 400 })
    }

    // Check user in database
    const results = await query("SELECT * FROM admin_users WHERE email = ?", [email])
    const users = results as any[]

    if (users.length === 0) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    const user = users[0]
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    // Generate token
    const token = generateToken(user.id, user.email)
    await setAuthCookie(token)

    return NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
