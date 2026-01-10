import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Ambil konfigurasi
export async function GET() {
  try {
    // Ambil baris pertama saja (id = 1 atau LIMIT 1)
    const sql = "SELECT * FROM site_settings ORDER BY id ASC LIMIT 1";
    const result: any = await query(sql);

    // Jika kosong (belum di-seed), return object kosong
    const settings = result.length > 0 ? result[0] : {};

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil pengaturan" },
      { status: 500 }
    );
  }
}

// PUT: Update konfigurasi
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Kita update row pertama.
    // Di Postgres, syntax update standard:
    const sql = `
      UPDATE site_settings 
      SET 
        school_name = $1,
        email = $2,
        phone = $3,
        whatsapp_number = $4,
        address = $5,
        maps_link = $6,
        instagram_url = $7,
        facebook_url = $8,
        tiktok_url = $9,
        academic_year = $10,
        ppdb_is_open = $11,
        wa_message_template = $12,
        updated_at = NOW()
      WHERE id = (SELECT id FROM site_settings ORDER BY id ASC LIMIT 1)
    `;

    const values = [
      body.school_name,
      body.email,
      body.phone,
      body.whatsapp_number,
      body.address,
      body.maps_link,
      body.instagram_url,
      body.facebook_url,
      body.tiktok_url,
      body.academic_year,
      body.ppdb_is_open, // Pastikan frontend kirim boolean true/false
      body.wa_message_template,
    ];

    await query(sql, values);

    return NextResponse.json({ message: "Pengaturan berhasil disimpan" });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan" },
      { status: 500 }
    );
  }
}
