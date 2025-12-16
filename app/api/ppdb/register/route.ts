import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[API] Data masuk:", body);

    // Validasi sederhana
    if (!body.child_name || !body.parent_name) {
      return NextResponse.json(
        { error: "Data wajib belum diisi" },
        { status: 400 }
      );
    }

    // QUERY SQL SESUAI DDL ANDA:
    // 1. Kolom 'program_id' wajib ada
    // 2. Kolom tanggal lahir adalah 'child_birth_date'
    const sql = `
      INSERT INTO ppdb_applications 
      (program_id, program_name, child_name, child_birth_date, child_gender, parent_name, parent_phone, parent_email, address, notes, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      body.program_id, // Wajib: ID Program (Int)
      body.program_name, // Nama Program
      body.child_name,
      body.child_dob, // Frontend kirim 'child_dob', kita masukkan ke kolom 'child_birth_date'
      body.child_gender,
      body.parent_name,
      body.parent_phone,
      body.parent_email,
      body.address,
      body.notes || null,
      "pending",
    ];

    const result = await query(sql, values);
    const header = result as ResultSetHeader;

    if (!header.insertId) {
      throw new Error("Gagal mendapatkan ID insert");
    }

    return NextResponse.json(
      { id: header.insertId, message: "Pendaftaran Berhasil" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menyimpan ke database" },
      { status: 500 }
    );
  }
}
