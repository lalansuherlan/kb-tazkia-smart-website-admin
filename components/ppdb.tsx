import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { MessageCircle, PhoneCall } from "lucide-react";
import Link from "next/link";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Definisi tipe data sesuai database
interface PPDBCategory extends RowDataPacket {
  id: number;
  name: string;
  age_range: string;
  emoji: string;
  color_class: string;
  benefits: string; // Di DB tipe TEXT (JSON String)
  is_popular: number; // MySQL mengembalikan boolean sebagai 0 atau 1
}

// Fungsi ambil data dari DB
async function getPPDBCategories() {
  try {
    const sql = `SELECT * FROM ppdb_categories ORDER BY order_index ASC`;
    const rows = (await query(sql)) as PPDBCategory[];
    return rows;
  } catch (error) {
    console.error("Gagal mengambil kategori PPDB:", error);
    return [];
  }
}

export async function PPDB() {
  const dbCategories = await getPPDBCategories();

  // Data default/fallback jika database kosong
  const fallbackCategories = [
    {
      id: 1,
      name: "Kelompok Bermain",
      age_range: "2 - 3 Tahun",
      emoji: "🐣",
      color_class: "from-yellow-200/50 to-orange-200/50",
      benefits: JSON.stringify([
        "Adaptasi sosial awal",
        "Bermain sensori",
        "Aktivitas ringan",
      ]),
      is_popular: 0,
    },
  ];

  const categories =
    dbCategories.length > 0 ? dbCategories : fallbackCategories;

  // 1. Ambil dari .env, jika kosong gunakan fallback nomor default
  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890";

  // 2. Ambil pesan dari .env
  const rawMessage =
    process.env.NEXT_PUBLIC_WA_MESSAGE || "Halo Admin, saya butuh info.";

  // 3. Encode pesan agar aman untuk URL
  const message = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <section
      id="ppdb"
      className="w-full py-20 md:py-32 bg-gradient-to-b from-blue-50/50 to-emerald-50/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-block">
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                <span className="text-2xl">
                  <Sparkles className="w-5 h-5" />
                </span>{" "}
                Pendaftaran Siswa Baru
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Program Pendidikan Sesuai Usia
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Pilih program yang sesuai dengan usia dan kebutuhan perkembangan
              anak Anda. Setiap program dirancang khusus untuk memastikan
              pembelajaran optimal.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              // Parsing JSON string benefits kembali menjadi Array
              let benefitsList: string[] = [];
              try {
                benefitsList = JSON.parse(category.benefits);
              } catch (e) {
                benefitsList = ["Manfaat program tersedia"];
              }

              return (
                <Card
                  key={category.id}
                  className={`p-6 flex flex-col gap-6 relative bg-gradient-to-br ${
                    category.color_class
                  } border-2 border-emerald-200 hover:shadow-xl transition-shadow ${
                    category.is_popular
                      ? "ring-2 ring-orange-400 md:scale-105"
                      : ""
                  }`}
                >
                  {/* Badge Populer */}
                  {category.is_popular ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                      Paling Populer
                    </div>
                  ) : null}

                  <div className="space-y-3 text-center">
                    <div className="text-5xl">{category.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-cyan-700 font-semibold">
                        {category.age_range}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1">
                    {benefitsList.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex gap-2 items-start text-sm text-slate-700"
                      >
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 font-bold" />
                        <span className="font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={`/ppdb/${category.id}#form-pendaftaran`}>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-lg">
                      Daftar Sekarang
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>

          {/* CTA Footer */}
          <div className="text-center space-y-6 p-8 bg-gradient-to-br from-emerald-100/80 via-teal-50 to-cyan-100/80 rounded-3xl border border-emerald-200 shadow-lg shadow-emerald-100/50 relative overflow-hidden">
            {/* Dekorasi Tambahan (Opsional: Lingkaran Pudar di pojok) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl translate-y-10 -translate-x-10 pointer-events-none"></div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl font-bold text-emerald-900">
                Mau program yang mana?
              </h3>
              <p className="text-emerald-800/80 max-w-2xl mx-auto text-lg font-medium">
                Kami siap membantu Ayah & Bunda menentukan program terbaik untuk
                tumbuh kembang Ananda. Yuk, ngobrol santai dulu!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              {/* ... TOMBOL WHATSAPP & TELEPON (Tetap Sama) ... */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 h-12 px-8 text-base rounded-xl transition-all hover:-translate-y-1">
                  <MessageCircle className="w-5 h-5 mr-2" /> Chat WhatsApp Admin
                </Button>
              </a>

              <Link href="/#contact">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-emerald-600/30 text-emerald-700 hover:bg-white/60 h-12 px-8 text-base rounded-xl bg-white/40 backdrop-blur-sm"
                >
                  <PhoneCall className="w-5 h-5 mr-2" /> Jadwalkan Telepon
                </Button>
              </Link>
            </div>

            <div className="relative z-10 flex items-center justify-center gap-2 text-sm text-emerald-700/70 bg-white/40 inline-block px-4 py-1.5 rounded-full mx-auto backdrop-blur-sm border border-white/50">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Admin Online: Senin - Jumat (08:00 - 16:00 WIB)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
