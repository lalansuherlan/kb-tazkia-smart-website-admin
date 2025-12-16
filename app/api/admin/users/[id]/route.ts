import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken, hashPassword } from "@/lib/auth";

// Definisi tipe props untuk Next.js 15+
type Props = {
  params: Promise<{
    id: string;
  }>;
};

// Ubah PUT menjadi PATCH (sesuai frontend)
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

    // 4. Susun Query SQL Dinamis
    // Mulai dengan data dasar (email, name, role, photo_url)
    let sql = "UPDATE admin_users SET email=?, name=?, role=?, photo_url=?";

    // Sanitasi data: ubah undefined menjadi null
    const values: any[] = [
      email,
      name,
      role,
      photo_url ?? null, // Jika photo_url tidak dikirim/undefined, set NULL
    ];

    // Cek apakah User ingin ganti password?
    if (password && password.trim() !== "") {
      const passwordHash = await hashPassword(password);
      // Tambahkan field password_hash ke query
      sql += ", password_hash=?";
      values.push(passwordHash);
    }

    // Akhiri query dengan WHERE id
    sql += " WHERE id=?";
    values.push(id);

    // 5. Eksekusi Query
    await query(sql, values);

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, props: Props) {
  try {
    const token = await getAuthCookie();

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const { id } = params;

    await query("DELETE FROM admin_users WHERE id = ?", [id]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
