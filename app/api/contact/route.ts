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

    // --- PERBAIKAN POSTGRESQL ---
    // Ganti (?, ?, ?, ?, ?) menjadi ($1, $2, $3, $4, $5)
    await query(
      "INSERT INTO messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)",
      [
        name,
        email,
        phone || "-", // $3
        subject || "Tanpa Subjek", // $4
        message, // $5
      ]
    );

    return NextResponse.json({ message: "Pesan terkirim" }, { status: 201 });
  } catch (error) {
    console.error("Contact Form Error:", error); // Tambahkan log agar mudah debug
    return NextResponse.json(
      { error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
