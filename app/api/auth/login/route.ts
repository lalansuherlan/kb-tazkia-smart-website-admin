import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password diperlukan" },
        { status: 400 }
      );
    }

    // 1. CEK USER DI DATABASE
    // UBAH: Gunakan $1 (Postgres) menggantikan ? (MySQL)
    const sql = "SELECT * FROM admin_users WHERE email = $1";
    const users = (await query(sql, [email])) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    const user = users[0];

    // 2. VERIFIKASI PASSWORD
    // Pastikan fungsi verifyPassword di lib/auth Anda menggunakan bcrypt.compare
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // 3. GENERATE TOKEN & COOKIE
    const token = generateToken(user.id, user.email);
    await setAuthCookie(token);

    return NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        photo_url: user.photo_url, // Tambahkan ini jika ingin menampilkan foto profil
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
