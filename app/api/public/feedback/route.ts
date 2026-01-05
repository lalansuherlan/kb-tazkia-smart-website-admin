import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, message, type, rating } = body;

    // Validasi sederhana
    if (!name || !message || !role) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // --- PERBAIKAN POSTGRESQL ---
    // Ganti (?, ?, ?, ?, ?) menjadi ($1, $2, $3, $4, $5)
    await query(
      `INSERT INTO school_feedback (name, role, message, type, rating, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [
        name,
        role,
        message,
        type,
        rating || 5, // Default rating 5 jika kosong
      ]
    );

    return NextResponse.json({ message: "Terima kasih atas masukan Anda!" });
  } catch (error) {
    console.error("Feedback Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
