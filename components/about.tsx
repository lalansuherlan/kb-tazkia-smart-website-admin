import { query } from "@/lib/db";
import { CheckCircle2, Leaf } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

// ✅ Ganti interface menjadi tipe standar TypeScript
type PageContent = {
  title: string;
  content: string;
  image_url: string;
};

// 1. Fetch Data from Database
async function getAboutContent() {
  try {
    // Query ini AMAN untuk PostgreSQL (Standard SQL)
    // Tidak perlu ubah ke $1 karena parameternya hardcoded string ('home', 'about')
    const sql = `
      SELECT title, content, image_url
      FROM page_content
      WHERE page_name = 'home' AND section_name = 'about'
      LIMIT 1
    `;

    // Casting ke tipe generic PageContent[]
    const rows = (await query(sql)) as PageContent[];
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Failed to fetch about content:", error);
    return null;
  }
}

export async function About() {
  const dbData = await getAboutContent();

  // 2. Fallback Data (If DB is empty)
  const title = dbData?.title || "Membangun Generasi Cerdas dan Berkarakter";
  const content =
    dbData?.content ||
    "KB Tazkia Smart berkomitmen memberikan pendidikan berkualitas tinggi yang mengintegrasikan nilai-nilai akhlak, keterampilan akademik, dan pengembangan karakter sejak dini dengan suasana yang ceria dan menyenangkan seperti di taman bermain.";
  const imageUrl =
    dbData?.image_url || "/anak-anak-bermain-di-kelas-taman-kanak-kanak.jpg";

  // Static highlights (keep hardcoded for simplicity unless needed otherwise)
  const highlights = [
    "Membentuk anak usia dini yang cerdas, sehat, mandiri, dan berakhlak",
    "Menyediakan lingkungan belajar yang aman, ramah anak dan menyenangkan",
    "Menumbuhkan rasa percaya diri dan kemampuan sosial anak",
    "Menjadi lembaga PAUD yang dipercaya masyarakat dan mampu bersaing secara sehat",
  ];

  return (
    <section
      id="about"
      className="w-full py-20 md:py-32 relative overflow-hidden bg-white"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 opacity-10">
        <div className="text-6xl">🌿</div>
      </div>
      <div className="absolute bottom-0 right-0 opacity-10">
        <div className="text-6xl">🌻</div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* --- LEFT: IMAGE (Dynamic) --- */}
          <div className="flex items-center justify-center order-2 md:order-1">
            <div className="w-full max-w-md h-96 bg-gradient-to-br from-cyan-200/40 via-emerald-100/40 to-blue-200/40 rounded-2xl flex items-center justify-center border-4 border-emerald-300/50 shadow-lg p-1">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={imageUrl}
                  alt="Tentang Kami"
                  fallbackSrc="/placeholder.jpg"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* --- RIGHT: TEXT (Dynamic) --- */}
          <div className="space-y-6 order-1 md:order-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
                  Misi dan Tujuan Tazkia Smart
                </p>
              </div>

              {/* Title from DB */}
              <h2 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                {title}
              </h2>

              {/* Description from DB */}
              <p className="text-lg text-slate-700 leading-relaxed">
                {content}
              </p>
            </div>

            {/* Highlights List (Static) */}
            <div className="space-y-4">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start p-3 bg-gradient-to-r from-cyan-100/50 to-emerald-100/50 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700 font-medium">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
