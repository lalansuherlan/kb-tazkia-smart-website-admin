import { Button } from "@/components/ui/button";
import { query } from "@/lib/db";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ArrowRight, Star, Heart, Smile } from "lucide-react";
import Link from "next/link";

// ✅ Ganti interface menjadi tipe standar
type PageContent = {
  title: string;
  content: string;
  image_url: string;
};

async function getHeroContent() {
  try {
    // Query ini aman (Standard SQL) karena nilainya hardcoded string
    const sql = `
      SELECT title, content, image_url 
      FROM page_content 
      WHERE page_name = 'home' AND section_name = 'hero' 
      LIMIT 1
    `;

    // Casting ke tipe generic kita
    const rows = (await query(sql)) as PageContent[];
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Gagal mengambil data hero:", error);
    return null;
  }
}

export async function Hero() {
  const dbData = await getHeroContent();

  const title = dbData?.title || "Taman Cerdas untuk Buah Hati Anda";
  const content =
    dbData?.content ||
    "Lingkungan belajar yang menyenangkan dengan pendekatan holistik. Kami menumbuhkan kebahagiaan, kreativitas, dan potensi setiap anak.";
  const imageUrl =
    dbData?.image_url || "/anak-anak-bermain-di-taman-kanak-kanak.jpg";

  return (
    <section
      id="hero"
      className="w-full relative overflow-hidden bg-slate-50 pt-32 pb-20 lg:pt-32 lg:pb-32"
    >
      {/* 1. BACKGROUND PATTERN (Dotted) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* 2. BACKGROUND BLOB (Gradient) */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 to-cyan-200/40 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-[500px] h-[500px] bg-gradient-to-tr from-yellow-200/40 to-orange-200/40 rounded-full blur-3xl opacity-50"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* --- KOLOM KIRI: TEKS & CTA --- */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge Selamat Datang */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm mb-4 mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-emerald-800 tracking-wide">
                Penerimaan Siswa Baru Dibuka!
              </span>
            </div>

            {/* Judul Utama */}
            <h1 className="text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {title.split(" ").map((word, i) => (
                <span
                  key={i}
                  className={
                    i < 2
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600"
                      : ""
                  }
                >
                  {word}{" "}
                </span>
              ))}
            </h1>

            {/* Deskripsi */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              {content}
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
              <Link href="/#ppdb">
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all hover:-translate-y-1 w-full sm:w-auto"
                >
                  Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-bold text-lg bg-white/80 backdrop-blur w-full sm:w-auto"
                >
                  Hubungi Kami
                </Button>
              </Link>
            </div>

            {/* Statistik Ringkas */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 lg:gap-12 opacity-90">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-black text-slate-800">15+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tahun Pengalaman
                </p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-black text-slate-800">500+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Alumni Bahagia
                </p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-black text-slate-800">A</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Terakreditasi
                </p>
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: GAMBAR & KOMPOSISI --- */}
          <div className="relative lg:h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
            {/* Floating Elements (Background) */}
            <div className="absolute top-10 right-10 p-4 bg-yellow-100 rounded-3xl rotate-12 shadow-sm animate-bounce duration-[3000ms]">
              <Star className="text-yellow-500 h-8 w-8" fill="currentColor" />
            </div>
            <div className="absolute bottom-20 left-0 p-4 bg-pink-100 rounded-full -rotate-12 shadow-sm animate-bounce duration-[4000ms]">
              <Heart className="text-pink-500 h-8 w-8" fill="currentColor" />
            </div>
            <div className="absolute top-1/2 left-10 p-3 bg-blue-100 rounded-2xl shadow-sm animate-pulse">
              <Smile className="text-blue-500 h-6 w-6" />
            </div>

            {/* Main Image Container dengan Bentuk Organik */}
            <div className="relative w-full max-w-lg aspect-square">
              {/* Border Abstrak */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] rotate-6 opacity-20 scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-orange-300 to-yellow-300 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] -rotate-3 opacity-20 scale-105"></div>

              {/* Frame Gambar Utama */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl bg-white rotate-3 hover:rotate-0 transition-transform duration-500">
                <ImageWithFallback
                  src={imageUrl}
                  alt="Anak-anak Belajar di KB Tazkia Smart"
                  fallbackSrc="/anak-anak-bermain-di-taman-kanak-kanak.jpg"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay Gradien Halus di Bawah Gambar */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 text-white pointer-events-none">
                  <p className="font-bold text-lg">Ceria & Berkarakter ✨</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
