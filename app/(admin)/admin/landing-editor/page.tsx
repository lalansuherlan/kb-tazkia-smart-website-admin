"use client";

import { useState, useEffect } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Loader2,
  Save,
  LayoutTemplate,
  Info,
  Image as ImageIcon,
} from "lucide-react";

export default function LandingEditorPage() {
  const [loading, setLoading] = useState(false);

  // 1. UPDATE STATE: Tambahkan image_url
  const [heroData, setHeroData] = useState({
    title: "",
    content: "",
    image_url: "",
  });

  const [aboutData, setAboutData] = useState({
    title: "",
    content: "",
    image_url: "",
  });

  // Fetch Data saat load
  useEffect(() => {
    fetch("/api/admin/page-content")
      .then((res) => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          // Cari data hero
          const hero = data.find(
            (d: any) => d.page_name === "home" && d.section_name === "hero"
          );
          if (hero) {
            // 2. UPDATE FETCH: Ambil image_url dari database
            setHeroData({
              title: hero.title,
              content: hero.content,
              image_url: hero.image_url || "",
            });
          }
          // Cari data about
          const about = data.find(
            (d: any) => d.page_name === "home" && d.section_name === "about"
          );
          if (about) {
            setAboutData({
              title: about.title,
              content: about.content,
              image_url: about.image_url || "",
            });
          }
        }
      })
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  // Generic Save Handler
  const handleSave = async (section: "hero" | "about", data: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_name: "home",
          section_name: section,
          ...data, // Ini akan otomatis mengirim image_url jika ada di dalam data
        }),
      });

      if (res.ok) {
        alert(
          `Bagian ${
            section === "hero" ? "Hero" : "Tentang Kami"
          } berhasil diperbarui!`
        );
      } else {
        alert("Gagal menyimpan");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayoutWrapper>
      <div className="max-w-4xl mx-auto pb-10">
        <div className="flex items-center gap-3 mb-8">
          <LayoutTemplate className="text-emerald-600" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Halaman Utama
            </h1>
            <p className="text-gray-500">
              Sesuaikan konten landing page website sekolah
            </p>
          </div>
        </div>

        {/* --- Card Edit Hero --- */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <span className="text-2xl">🏡</span>
            <h2 className="text-lg font-bold text-emerald-800">
              Bagian Hero (Atas)
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Utama (Headline)
              </label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) =>
                  setHeroData({ ...heroData, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
                placeholder="Contoh: Taman Cerdas..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi / Sub-judul
              </label>
              <textarea
                value={heroData.content}
                onChange={(e) =>
                  setHeroData({ ...heroData, content: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow resize-none"
                placeholder="Deskripsi singkat..."
              />
            </div>

            {/* 3. INPUT BARU: URL GAMBAR HERO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ImageIcon size={16} /> URL Gambar Hero
              </label>
              <ImageUpload
                label="Gambar Latar Hero"
                value={heroData.image_url}
                onChange={(url) => setHeroData({ ...heroData, image_url: url })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Gambar ini akan muncul di lingkaran tengah pada tampilan Hero.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSave("hero", heroData)}
                disabled={loading}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                Simpan Hero
              </button>
            </div>
          </div>
        </div>

        {/* --- Card Edit About --- */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Info className="text-blue-500" size={24} />
            <h2 className="text-lg font-bold text-emerald-800">
              Bagian Tentang Kami
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Bagian
              </label>
              <input
                type="text"
                value={aboutData.title}
                onChange={(e) =>
                  setAboutData({ ...aboutData, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
                placeholder="Contoh: Membangun Generasi Cerdas..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Lengkap
              </label>
              <textarea
                value={aboutData.content}
                onChange={(e) =>
                  setAboutData({ ...aboutData, content: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
                placeholder="Penjelasan tentang sekolah..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ImageIcon size={16} /> URL Gambar (Samping)
              </label>
              <ImageUpload
                label="Gambar Samping Tentang Kami"
                value={aboutData.image_url}
                onChange={(url) =>
                  setAboutData({ ...aboutData, image_url: url })
                }
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSave("about", aboutData)}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                Simpan Tentang Kami
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
