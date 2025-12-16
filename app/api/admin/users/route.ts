import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken, hashPassword } from "@/lib/auth";

// GET: Ambil Semua User
export async function GET() {
  try {
    const token = await getAuthCookie();
    // Validasi token (Opsional: tergantung kebijakan Anda apakah endpoint ini perlu login)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // PERBAIKAN: Tambahkan 'photo_url' di SELECT atau gunakan (*)
    const sql = `
      SELECT id, name, email, role, created_at, photo_url 
      FROM admin_users 
      ORDER BY created_at DESC
    `;

    const users = await query(sql);

    // Tambahkan header no-store agar data tidak di-cache browser
    return NextResponse.json(users, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Tambah User Baru
export async function POST(request: Request) {
  try {
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, role, password, photo_url } = body; // Ambil photo_url

    // Cek kelengkapan data wajib
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Masukkan photo_url ke database
    // Gunakan (photo_url || null) untuk mencegah undefined
    await query(
      "INSERT INTO admin_users (email, name, role, password_hash, photo_url) VALUES (?, ?, ?, ?, ?)",
      [email, name, role, passwordHash, photo_url || null]
    );

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
