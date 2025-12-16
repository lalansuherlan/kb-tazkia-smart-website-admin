"use client";

import { useEffect, useState, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  message: string;
  rating: number;
}

export function LandingTestimonials() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/public/testimonials")
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) setData(res);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }, []);

  // Fungsi untuk tombol Next/Prev
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Scroll sejauh lebar container (agar pindah 1 halaman slide)
      const scrollAmount =
        direction === "left" ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) return null;
  if (data.length === 0) return null;

  return (
    <section className="py-20 bg-emerald-50 relative overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section dengan Tombol Navigasi */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Kata Mereka Tentang Kami
            </h2>
            <p className="text-gray-600">
              Kebahagiaan orang tua dan perkembangan anak adalah prioritas utama
              kami. Berikut cerita pengalaman mereka.
            </p>
          </div>

          {/* Tombol Navigasi (Desktop) */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* --- SLIDER CONTAINER --- */}
        <div className="relative group">
          {/* Tombol Navigasi (Mobile - Muncul di atas slider) */}
          <div className="md:hidden flex justify-between absolute top-1/2 -translate-y-1/2 w-full z-20 px-2 pointer-events-none">
            <button
              onClick={() => scroll("left")}
              className="pointer-events-auto p-2 rounded-full bg-white/80 backdrop-blur shadow-md text-gray-800"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="pointer-events-auto p-2 rounded-full bg-white/80 backdrop-blur shadow-md text-gray-800"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Hide scrollbar Firefox/IE
          >
            {data.map((item, idx) => (
              <div
                key={idx}
                className="snap-center shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                  {/* Bintang */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < item.rating ? "#FACC15" : "none"}
                        className={
                          i < item.rating ? "text-yellow-400" : "text-gray-200"
                        }
                      />
                    ))}
                  </div>

                  {/* Pesan */}
                  <div className="flex-1 mb-6 relative">
                    <Quote
                      className="absolute -top-2 -left-2 text-emerald-100 transform -scale-x-100"
                      size={40}
                    />
                    <p className="text-gray-700 relative z-10 italic leading-relaxed text-sm md:text-base">
                      "{item.message}"
                    </p>
                  </div>

                  {/* Profil */}
                  <div className="flex items-center gap-4 mt-auto border-t border-gray-50 pt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
