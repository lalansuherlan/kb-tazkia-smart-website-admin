"use client"; // Wajib karena ada state dan interaksi

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback"; // Kita pakai komponen gambar aman yg tadi

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  emoji: string;
}

interface GalleryClientProps {
  images: GalleryItem[];
}

export function GalleryClient({ images }: GalleryClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Fungsi menutup modal
  const closeModal = () => setSelectedIndex(null);

  // Fungsi navigasi Next/Prev
  const showNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    );
  }, [images.length]);

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );
  }, [images.length]);

  // Handle Keyboard (Esc, Arrow Left, Arrow Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, showNext, showPrev]);

  return (
    <>
      {/* --- GRID TAMPILAN AWAL --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div
            key={image.id}
            onClick={() => setSelectedIndex(index)} // Klik untuk membuka
            className="group relative overflow-hidden rounded-2xl h-72 cursor-pointer shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="w-full h-full bg-gradient-to-br from-cyan-100 via-emerald-100 to-blue-100 flex items-center justify-center">
              <ImageWithFallback
                src={image.image_url}
                alt={image.title}
                fallbackSrc={`https://source.unsplash.com/random/800x600?school&sig=${image.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Overlay Text (Hover) */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-800/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-end p-6 gap-2">
              <div className="text-4xl animate-bounce">
                {image.emoji || "📸"}
              </div>
              <p className="text-white font-bold text-lg text-right">
                {image.title}
              </p>
              <p className="text-cyan-100 text-sm text-right line-clamp-2">
                Klik untuk memperbesar
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL FULL SCREEN (LIGHTBOX) --- */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeModal} // Klik background untuk tutup
        >
          {/* Tombol Close */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
          >
            <X size={32} />
          </button>

          {/* Tombol Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50 hidden md:block"
          >
            <ChevronLeft size={48} />
          </button>

          {/* Tombol Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50 hidden md:block"
          >
            <ChevronRight size={48} />
          </button>

          {/* Kontainer Gambar Full Screen */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Supaya klik gambar tidak menutup modal
          >
            <div className="relative w-full h-full flex justify-center items-center overflow-hidden rounded-lg shadow-2xl">
              <ImageWithFallback
                src={images[selectedIndex].image_url}
                alt={images[selectedIndex].title}
                fallbackSrc={`https://source.unsplash.com/random/1200x800?school&sig=${images[selectedIndex].id}`}
                className="max-w-full max-h-[80vh] object-contain select-none"
              />
            </div>

            {/* Caption di bawah gambar */}
            <div className="mt-4 text-center text-white">
              <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                <span>{images[selectedIndex].emoji}</span>{" "}
                {images[selectedIndex].title}
              </h3>
              <p className="text-gray-300 mt-1 max-w-2xl mx-auto">
                {images[selectedIndex].description}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {selectedIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
