import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Tambahkan phone di sini
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Data wajib diisi" }, { status: 400 });
    }

    // Update Query untuk menyimpan phone
    await query(
      "INSERT INTO messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone || "-", subject || "Tanpa Subjek", message]
    );

    return NextResponse.json({ message: "Pesan terkirim" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
