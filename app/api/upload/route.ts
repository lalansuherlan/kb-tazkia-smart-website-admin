import { type NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAuthCookie, verifyToken } from "@/lib/auth";

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // 1. CEK LOGIN
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. AMBIL DATA FILE
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Validasi Ukuran (Opsional: Misal max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar (Maks 5MB)" },
        { status: 400 }
      );
    }

    // 3. KONVERSI KE BUFFER & BASE64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // 4. UPLOAD KE CLOUDINARY
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileBase64,
        {
          folder: "kb_tazkia_uploads", // Folder tujuan
          resource_type: "auto", // Auto detect (img/video/pdf)
          public_id: `upload_${Date.now()}`, // Opsional: Nama file unik
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Casting result agar TypeScript tidak bingung
    const result = uploadResult as any;

    return NextResponse.json({
      url: result.secure_url, // URL HTTPS aman
      public_id: result.public_id,
      message: "Upload berhasil",
    });
  } catch (error: any) {
    console.error("Cloudinary Error:", error);
    return NextResponse.json(
      { error: "Gagal upload file", details: error.message },
      { status: 500 }
    );
  }
}
