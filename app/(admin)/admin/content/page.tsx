"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import { ImageUpload } from "@/components/ui/image-upload";

// 1. Update Interface Program sesuai Database
interface Program {
  id: number;
  name: string;
  description: string;
  icon: string;
  bg_emoji: string; // Baru
  color_class: string; // Baru
  order_index: number;
}

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  order_index: number;
}

// 2. Daftar Pilihan Warna (Agar Admin tinggal pilih, tidak perlu ketik manual)
const COLOR_OPTIONS = [
  {
    label: "Biru - Cyan (Akademik)",
    value: "from-blue-400 to-cyan-400",
    preview: "bg-gradient-to-r from-blue-400 to-cyan-400",
  },
  {
    label: "Ungu - Pink (Seni)",
    value: "from-purple-400 to-pink-400",
    preview: "bg-gradient-to-r from-purple-400 to-pink-400",
  },
  {
    label: "Oren - Kuning (Motorik)",
    value: "from-orange-400 to-yellow-400",
    preview: "bg-gradient-to-r from-orange-400 to-yellow-400",
  },
  {
    label: "Merah - Pink (Sosial)",
    value: "from-red-300 to-pink-300",
    preview: "bg-gradient-to-r from-red-300 to-pink-300",
  },
  {
    label: "Hijau - Emerald (Alam)",
    value: "from-green-400 to-emerald-400",
    preview: "bg-gradient-to-r from-green-400 to-emerald-400",
  },
];

export default function ContentPage() {
  const [tab, setTab] = useState<"programs" | "gallery">("programs");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryImage | null>(
    null
  );

  // 3. Update State Form Program dengan default value baru
  const [programForm, setProgramForm] = useState({
    name: "",
    description: "",
    icon: "",
    bg_emoji: "✨",
    color_class: "from-blue-400 to-cyan-400",
  });

  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [progRes, galRes] = await Promise.all([
        fetch("/api/admin/programs"),
        fetch("/api/admin/gallery"),
      ]);

      if (progRes.ok) setPrograms(await progRes.json());
      if (galRes.ok) setGallery(await galRes.json());
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgram = async () => {
    try {
      const method = editingProgram ? "PUT" : "POST";
      const url = editingProgram
        ? `/api/admin/programs/${editingProgram.id}`
        : "/api/admin/programs";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programForm),
      });

      if (response.ok) {
        fetchContent();
        setShowProgramModal(false);
        // Reset form
        setProgramForm({
          name: "",
          description: "",
          icon: "",
          bg_emoji: "✨",
          color_class: "from-blue-400 to-cyan-400",
        });
        setEditingProgram(null);
      }
    } catch (error) {
      console.error("Error saving program:", error);
    }
  };

  const saveGallery = async () => {
    try {
      const method = editingGallery ? "PUT" : "POST";
      const url = editingGallery
        ? `/api/admin/gallery/${editingGallery.id}`
        : "/api/admin/gallery";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galleryForm),
      });

      if (response.ok) {
        fetchContent();
        setShowGalleryModal(false);
        setGalleryForm({
          title: "",
          description: "",
          image_url: "",
          category: "",
        });
        setEditingGallery(null);
      }
    } catch (error) {
      console.error("Error saving gallery:", error);
    }
  };

  const deleteProgram = async (id: number) => {
    if (confirm("Yakin ingin menghapus program ini?")) {
      try {
        await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
        fetchContent();
      } catch (error) {
        console.error("Error deleting program:", error);
      }
    }
  };

  const deleteGallery = async (id: number) => {
    if (confirm("Yakin ingin menghapus gambar ini?")) {
      try {
        await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
        fetchContent();
      } catch (error) {
        console.error("Error deleting gallery:", error);
      }
    }
  };

  // 4. Update Open Modal untuk mengisi form saat Edit
  const openProgramModal = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      setProgramForm({
        name: program.name,
        description: program.description,
        icon: program.icon,
        bg_emoji: program.bg_emoji || "✨",
        color_class: program.color_class || "from-blue-400 to-cyan-400",
      });
    } else {
      // Reset jika Add Baru
      setProgramForm({
        name: "",
        description: "",
        icon: "",
        bg_emoji: "✨",
        color_class: "from-blue-400 to-cyan-400",
      });
    }
    setShowProgramModal(true);
  };

  const openGalleryModal = (img?: GalleryImage) => {
    if (img) {
      setEditingGallery(img);
      setGalleryForm({
        title: img.title,
        description: img.description,
        image_url: img.image_url,
        category: img.category,
      });
    }
    setShowGalleryModal(true);
  };

  return (
    <AdminLayoutWrapper>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Content Management
        </h1>
        <p className="text-gray-600 mb-8">Kelola program dan galeri sekolah</p>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
          <button
            onClick={() => setTab("programs")}
            className={`px-6 py-3 font-semibold transition-colors ${
              tab === "programs"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Program
          </button>
          <button
            onClick={() => setTab("gallery")}
            className={`px-6 py-3 font-semibold transition-colors ${
              tab === "gallery"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Galeri
          </button>
        </div>

        {/* Programs Tab */}
        {tab === "programs" && (
          <div>
            <button
              onClick={() => openProgramModal()}
              className="mb-6 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold transition-colors"
            >
              + Tambah Program
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative"
                >
                  {/* Preview Warna Card di List Admin */}
                  <div
                    className={`h-2 w-full bg-gradient-to-r ${
                      program.color_class || "from-gray-200 to-gray-300"
                    }`}
                  ></div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-5xl">{program.icon}</div>
                      <div
                        className="text-2xl opacity-50 bg-gray-100 p-1 rounded"
                        title="Background Emoji"
                      >
                        {program.bg_emoji}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {program.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {program.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openProgramModal(program)}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProgram(program.id)}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Tab (Tidak berubah) */}
        {tab === "gallery" && (
          <div>
            <button
              onClick={() => {
                setEditingGallery(null);
                setGalleryForm({
                  title: "",
                  description: "",
                  image_url: "",
                  category: "",
                });
                openGalleryModal();
              }}
              className="mb-6 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold transition-colors"
            >
              + Tambah Gambar
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={img.image_url || "/placeholder.svg"}
                      alt={img.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/600x400?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {img.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {img.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openGalleryModal(img)}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteGallery(img.id)}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Program Modal (Diupdate Formnya) */}
        {showProgramModal && (
          <Modal onClose={() => setShowProgramModal(false)}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingProgram ? "Edit Program" : "Tambah Program"}
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Program
                </label>
                <input
                  type="text"
                  value={programForm.name}
                  onChange={(e) =>
                    setProgramForm({ ...programForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                  placeholder="Contoh: Program Akademik"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={programForm.description}
                  onChange={(e) =>
                    setProgramForm({
                      ...programForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                  placeholder="Penjelasan singkat program..."
                />
              </div>

              {/* Grid untuk Icon dan BG Emoji */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon Utama
                  </label>
                  <input
                    type="text"
                    value={programForm.icon}
                    onChange={(e) =>
                      setProgramForm({ ...programForm, icon: e.target.value })
                    }
                    maxLength={2}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-2xl text-center"
                    placeholder="📚"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Emoji Utama
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Emoji
                  </label>
                  <input
                    type="text"
                    value={programForm.bg_emoji}
                    onChange={(e) =>
                      setProgramForm({
                        ...programForm,
                        bg_emoji: e.target.value,
                      })
                    }
                    maxLength={2}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-2xl text-center"
                    placeholder="🦆"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Emoji Hiasan
                  </p>
                </div>
              </div>

              {/* Pilihan Warna */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warna Kartu
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <label
                      key={color.value}
                      className={`flex items-center gap-3 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                        programForm.color_class === color.value
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="color_class"
                        value={color.value}
                        checked={programForm.color_class === color.value}
                        onChange={(e) =>
                          setProgramForm({
                            ...programForm,
                            color_class: e.target.value,
                          })
                        }
                        className="hidden"
                      />
                      {/* Preview Warna */}
                      <div
                        className={`w-8 h-8 rounded-full shadow-sm ${color.preview}`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {color.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveProgram}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium transition-colors"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowProgramModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 font-medium transition-colors"
              >
                Batal
              </button>
            </div>
          </Modal>
        )}

        {/* Gallery Modal (Tetap sama) */}
        {showGalleryModal && (
          <Modal onClose={() => setShowGalleryModal(false)}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingGallery ? "Edit Gambar" : "Tambah Gambar"}
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul
                </label>
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={galleryForm.description}
                  onChange={(e) =>
                    setGalleryForm({
                      ...galleryForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Gambar
                </label>
                <ImageUpload
                  label="Upload Foto"
                  value={galleryForm.image_url}
                  onChange={(url) =>
                    setGalleryForm({ ...galleryForm, image_url: url })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <input
                  type="text"
                  value={galleryForm.category}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, category: e.target.value })
                  }
                  placeholder="Contoh: kegiatan, pembelajaran, acara"
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveGallery}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium transition-colors"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 font-medium transition-colors"
              >
                Batal
              </button>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
