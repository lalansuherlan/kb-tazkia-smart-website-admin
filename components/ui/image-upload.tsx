"use client";

import { useState } from "react";
import { UploadCloud, Loader2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload Gambar",
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");

      const data = await res.json();
      // Panggil fungsi parent untuk update state form dengan URL baru
      onChange(data.url);
    } catch (error) {
      alert("Gagal mengupload gambar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onChange(""); // Kosongkan value
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* 1. Jika sudah ada gambar, tampilkan preview */}
      {value ? (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          {/* Tombol Hapus */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        /* 2. Jika belum ada gambar, tampilkan area upload */
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {loading ? (
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
              ) : (
                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              )}
              <p className="text-sm text-gray-500">
                {loading ? "Sedang mengupload..." : "Klik untuk pilih gambar"}
              </p>
              <p className="text-xs text-gray-400">JPG, PNG (Max 2MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
