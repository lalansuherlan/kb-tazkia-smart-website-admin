import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken, hashPassword } from "@/lib/auth";

// Definisi tipe props untuk Next.js 15+
type Props = {
  params: Promise<{
    id: string;
  }>;
};

// PATCH: Update User
export async function PATCH(request: NextRequest, props: Props) {
  try {
    // 1. Cek Token
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Baca ID (Await params)
    const params = await props.params;
    const { id } = params;

    // 3. Baca Body JSON
    const body = await request.json();
    const { email, name, role, password, photo_url } = body;

    // 4. Susun Query SQL Dinamis untuk PostgreSQL
    // Kita mulai dengan 4 parameter dasar ($1, $2, $3, $4)
    let sql = "UPDATE admin_users SET email=$1, name=$2, role=$3, photo_url=$4";

    const values: any[] = [
      email,
      name,
      role,
      photo_url ?? null, // Sanitasi undefined -> null
    ];

    // Counter untuk parameter berikutnya (Mulai dari 5)
    let paramIndex = 5;

    // Cek apakah User ingin ganti password?
    if (password && password.trim() !== "") {
      const passwordHash = await hashPassword(password);

      // Tambahkan ke query dengan index dinamis ($5)
      sql += `, password_hash=$${paramIndex}`;
      values.push(passwordHash);

      // Naikkan counter agar parameter berikutnya jadi $6
      paramIndex++;
    }

    // Akhiri query dengan WHERE id (Bisa jadi $5 atau $6 tergantung password diisi atau tidak)
    sql += ` WHERE id=$${paramIndex}`;
    values.push(id);

    // 5. Eksekusi Query
    await query(sql, values);

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error: any) {
    console.error("User update error:", error);

    // Handle error jika email sudah dipakai orang lain
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Email sudah digunakan user lain" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus User
export async function DELETE(request: NextRequest, props: Props) {
  try {
    const token = await getAuthCookie();

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const { id } = params;

    // Ganti ? menjadi $1
    await query("DELETE FROM admin_users WHERE id = $1", [id]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
