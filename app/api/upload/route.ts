import { type NextRequest, NextResponse } from "next/server";
// 👇 IMPORT CLOUDINARY (Hapus fs dan path karena tidak dipakai lagi)
import { v2 as cloudinary } from "cloudinary";
// 👇 IMPORT AUTH (Tetap dipertahankan)
import { getAuthCookie, verifyToken } from "@/lib/auth";

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // 👇 1. CEK LOGIN (Sama seperti sebelumnya)
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // 👇 2. Konversi File ke Buffer (Persiapan kirim ke Cloudinary)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 👇 3. Upload ke Cloudinary (Bagian Utama)
    // Kita ubah file jadi format base64 agar bisa dikirim langsung tanpa simpan di disk
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        fileBase64,
        {
          folder: "kb_tazkia_uploads", // Nama folder di Cloudinary (Bebas ganti)
          resource_type: "auto", // Otomatis deteksi (gambar/pdf/dll)
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // 👇 4. Return URL dari Cloudinary
    // result.secure_url adalah link https yang aman dan permanen
    return NextResponse.json({
      url: result.secure_url,
      message: "Upload ke Cloudinary berhasil",
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { error: "Gagal mengupload file ke Cloud" },
      { status: 500 }
    );
  }
}
