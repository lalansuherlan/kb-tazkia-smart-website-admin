import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken, hashPassword } from "@/lib/auth";

// GET: Ambil Semua User
export async function GET() {
  try {
    const token = await getAuthCookie();
    // Validasi token
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query Standar (Aman untuk Postgres & MySQL)
    // Tidak perlu placeholder karena tidak ada parameter WHERE
    const sql = `
      SELECT id, name, email, role, created_at, photo_url 
      FROM admin_users 
      ORDER BY created_at DESC
    `;

    const users = await query(sql);

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
    const { email, name, role, password, photo_url } = body;

    // Cek kelengkapan data wajib
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // --- PERBAIKAN UTAMA (PostgreSQL Syntax) ---
    // 1. Ganti ? menjadi $1, $2, $3, $4, $5
    await query(
      "INSERT INTO admin_users (email, name, role, password_hash, photo_url) VALUES ($1, $2, $3, $4, $5)",
      [
        email,
        name,
        role,
        passwordHash,
        photo_url || null, // Handle undefined
      ]
    );

    return NextResponse.json({ message: "User created successfully" });
  } catch (error: any) {
    console.error("Error creating user:", error);

    // --- TAMBAHAN: Handle Duplicate Email ---
    // Kode '23505' adalah kode error Postgres untuk Unique Violation
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Email sudah terdaftar!" },
        { status: 409 } // 409 Conflict
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
