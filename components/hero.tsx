import { Button } from "@/components/ui/button";
import { query } from "@/lib/db";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ArrowRight, Star, Heart, Smile, ExternalLink } from "lucide-react"; // Tambah ExternalLink
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { HeroAgendaCard } from "@/components/hero-agenda-card";

// --- TIPE DATA ---
type PageContent = {
  title: string;
  content: string;
  image_url: string;
};

type AgendaItem = {
  id: number;
  title: string;
  content: string;
  event_date: string;
};

// --- FUNGSI 1: AMBIL KONTEN HERO ---
async function getHeroContent() {
  noStore();
  try {
    const sql = `
      SELECT title, content, image_url 
      FROM page_content 
      WHERE page_name = 'home' AND section_name = 'hero' 
      LIMIT 1
    `;
    const rows = (await query(sql)) as PageContent[];
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Gagal ambil hero content:", error);
    return null;
  }
}

// --- FUNGSI 2: AMBIL AGENDA (Fix LOWER::text) ---
async function getUpcomingAgenda() {
  noStore();
  try {
    const sql = `
      SELECT id, title, content, event_date 
      FROM announcements 
      WHERE 
        LOWER(type::text) = 'event' 
        AND is_active = true 
        AND event_date >= CURRENT_DATE 
      ORDER BY event_date ASC 
      LIMIT 1
    `;

    const rows = (await query(sql)) as AgendaItem[];
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Gagal ambil agenda:", error);
    return null;
  }
}

// --- KOMPONEN UTAMA ---
export async function Hero() {
  const [dbData, upcomingAgenda] = await Promise.all([
    getHeroContent(),
    getUpcomingAgenda(),
  ]);

  const title = dbData?.title || "Taman Cerdas untuk Buah Hati Anda";
  const content =
    dbData?.content ||
    "Lingkungan belajar yang menyenangkan dengan pendekatan holistik. Kami menumbuhkan kebahagiaan, kreativitas, dan potensi setiap anak.";
  const imageUrl =
    dbData?.image_url || "/anak-anak-bermain-di-taman-kanak-kanak.jpg";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { day: "-", month: "-" };
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString("id-ID", { month: "short" });
    return { day, month };
  };

  return (
    <section
      id="hero"
      className="w-full relative overflow-hidden bg-slate-50 pt-32 pb-20 lg:pt-32 lg:pb-32"
    >
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 to-cyan-200/40 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-[500px] h-[500px] bg-gradient-to-tr from-yellow-200/40 to-orange-200/40 rounded-full blur-3xl opacity-50"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* --- KOLOM KIRI --- */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm mb-4 mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-emerald-800 tracking-wide">
                Penerimaan Siswa Baru Dibuka!
              </span>
            </div>

            {/* Title */}
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

            {/* Content */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              {content}
            </p>

            {/* Buttons */}
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

            {/* --- CUPLIKAN AGENDA TERDEKAT (CLICKABLE) --- */}
            {upcomingAgenda ? (
              <div className="pt-8 mt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 flex justify-center lg:justify-start">
                {/* LINK WRAPPER:
                   Ini membuat seluruh kartu bisa diklik dan lari ke section 'announcements'.
                   Pastikan di file announcements.tsx bagian section punya id="announcements"
                */}
                <HeroAgendaCard
                  id={upcomingAgenda.id}
                  title={upcomingAgenda.title}
                  content={upcomingAgenda.content}
                  dateDay={formatDate(upcomingAgenda.event_date).day}
                  dateMonth={formatDate(upcomingAgenda.event_date).month}
                />
              </div>
            ) : (
              // FALLBACK (Jika Kosong)
              <div className="pt-8 mt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-3 text-slate-500 text-sm bg-white/60 border border-slate-200/60 px-5 py-2.5 rounded-full shadow-sm">
                  <span className="text-lg">✨</span>
                  <span className="font-medium">
                    Mari bergabung bersama keluarga besar KB Tazkia Smart
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* --- KOLOM KANAN (GAMBAR) --- */}
          <div className="relative lg:h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
            {/* Floating Elements */}
            <div className="absolute top-10 right-10 p-4 bg-yellow-100 rounded-3xl rotate-12 shadow-sm animate-bounce duration-[3000ms]">
              <Star className="text-yellow-500 h-8 w-8" fill="currentColor" />
            </div>
            <div className="absolute bottom-20 left-0 p-4 bg-pink-100 rounded-full -rotate-12 shadow-sm animate-bounce duration-[4000ms]">
              <Heart className="text-pink-500 h-8 w-8" fill="currentColor" />
            </div>
            <div className="absolute top-1/2 left-10 p-3 bg-blue-100 rounded-2xl shadow-sm animate-pulse">
              <Smile className="text-blue-500 h-6 w-6" />
            </div>

            {/* Image Frame */}
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] rotate-6 opacity-20 scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-orange-300 to-yellow-300 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] -rotate-3 opacity-20 scale-105"></div>

              <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl bg-white rotate-3 hover:rotate-0 transition-transform duration-500">
                <ImageWithFallback
                  src={imageUrl}
                  alt="Anak-anak Belajar di KB Tazkia Smart"
                  fallbackSrc="/anak-anak-bermain-di-taman-kanak-kanak.jpg"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                />
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
