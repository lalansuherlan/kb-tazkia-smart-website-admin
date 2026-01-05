import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

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

    // --- PERBAIKAN POSTGRESQL ---
    // 1. Ganti ? menjadi $1, $2, dst.
    // 2. Tambahkan 'RETURNING id' di akhir query untuk mengambil ID baru
    const sql = `
      INSERT INTO ppdb_applications 
      (program_id, program_name, child_name, child_birth_date, child_gender, parent_name, parent_phone, parent_email, address, notes, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `;

    const values = [
      body.program_id, // $1
      body.program_name, // $2
      body.child_name, // $3
      body.child_dob, // $4 (Frontend kirim 'child_dob')
      body.child_gender, // $5
      body.parent_name, // $6
      body.parent_phone, // $7
      body.parent_email, // $8
      body.address, // $9
      body.notes || null, // $10
      "pending", // $11
    ];

    // Eksekusi Query
    // Hasil dari query dengan RETURNING id adalah array of objects: [{ id: 123 }]
    const result: any = await query(sql, values);

    if (result.length === 0) {
      throw new Error("Gagal menyimpan data (No ID returned)");
    }

    const newId = result[0].id;

    return NextResponse.json(
      { id: newId, message: "Pendaftaran Berhasil" },
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
