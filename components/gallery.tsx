import { query } from "@/lib/db";
import { GalleryClient } from "@/components/gallery-client";

// ✅ Hapus 'extends RowDataPacket'. Cukup interface biasa.
interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  emoji: string;
}

// Fetch Data (Server Side)
async function getGalleryData() {
  try {
    // Query ini AMAN untuk PostgreSQL (Standard SQL)
    const sql = `SELECT * FROM gallery_images ORDER BY order_index ASC, id DESC LIMIT 6`;

    // Casting hasil query ke array interface kita
    const rows = (await query(sql)) as GalleryItem[];

    // Serialisasi JSON penting untuk mengubah objek Date (Postgres) menjadi String
    // agar bisa dikirim ke Client Component tanpa error "Non-serializable data"
    return JSON.parse(JSON.stringify(rows));
  } catch (error) {
    console.error("Gagal mengambil data galeri:", error);
    return [];
  }
}

export async function Gallery() {
  const dbImages = await getGalleryData();

  // Data default hanya jika database kosong
  const images = dbImages.length > 0 ? dbImages : [];

  return (
    <section
      id="gallery"
      className="w-full py-20 md:py-32 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header (Tetap dirender di server untuk SEO) */}
          <div className="text-center space-y-4">
            <div className="inline-block">
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                <span className="text-3xl">📸</span> Galeri Kegiatan
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Momen Berharga Anak-Anak Kami
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Lihat kegembiraan anak-anak belajar dan bermain di taman kami yang
              penuh warna
            </p>
          </div>

          {/* Bagian Interaktif (Grid + Lightbox) diserahkan ke Client Component */}
          {images.length > 0 ? (
            <GalleryClient images={images} />
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">
                Belum ada foto yang dipublikasikan.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
