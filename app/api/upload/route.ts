import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
// 👇 IMPORT AUTH (Wajib)
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // 👇 1. CEK LOGIN DULU (KEAMANAN)
    // Jangan biarkan orang asing upload file
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

    // 2. Proses File
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Pastikan folder ada
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // 4. Nama file unik
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const filepath = path.join(uploadDir, filename);

    // 5. Simpan
    await writeFile(filepath, buffer);

    // 6. Return URL
    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl, message: "Upload berhasil" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengupload file" },
      { status: 500 }
    );
  }
}
