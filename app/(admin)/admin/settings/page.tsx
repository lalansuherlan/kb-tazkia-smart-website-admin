"use client";

import { useState, useEffect } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import {
  Save,
  Loader2,
  Globe,
  Share2,
  School,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Pastikan punya komponen Switch atau ganti checkbox
import { useToast } from "@/hooks/use-toast"; // Sesuaikan dengan toast library Anda

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    school_name: "",
    email: "",
    phone: "",
    whatsapp_number: "",
    address: "",
    maps_link: "",
    instagram_url: "",
    facebook_url: "",
    tiktok_url: "",
    academic_year: "",
    ppdb_is_open: true,
    wa_message_template: "",
  });

  // 1. Fetch Data Saat Load
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) setFormData((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 2. Handle Change Input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: "Sukses",
          description: "Konfigurasi berhasil diperbarui!",
        });
      } else {
        throw new Error("Gagal update");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <AdminLayoutWrapper>
      <div className="max-w-4xl mx-auto pb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Konfigurasi Website
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: IDENTITAS & KONTAK */}
          <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <School className="text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-800">
                Identitas & Kontak
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Sekolah</label>
                <Input
                  name="school_name"
                  value={formData.school_name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Resmi</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nomor WhatsApp (Admin)
                </label>
                <Input
                  name="whatsapp_number"
                  placeholder="628..."
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-400">
                  Gunakan format 628xxx (tanpa + atau 0 di depan)
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Telepon Kantor (Opsional)
                </label>
                <Input
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Alamat Lengkap</label>
              <Textarea
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link Google Maps</label>
              <Input
                name="maps_link"
                value={formData.maps_link || ""}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* SECTION 2: SOSIAL MEDIA */}
          <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <Share2 className="text-blue-500" />
              <h2 className="text-lg font-bold text-gray-800">Sosial Media</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Instagram URL</label>
                <Input
                  name="instagram_url"
                  placeholder="https://instagram.com/..."
                  value={formData.instagram_url || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Facebook URL</label>
                <Input
                  name="facebook_url"
                  placeholder="https://facebook.com/..."
                  value={formData.facebook_url || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">TikTok URL</label>
                <Input
                  name="tiktok_url"
                  placeholder="https://tiktok.com/..."
                  value={formData.tiktok_url || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: PENGATURAN PPDB */}
          <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4 border-l-4 border-l-orange-400">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <MessageSquare className="text-orange-500" />
              <h2 className="text-lg font-bold text-gray-800">PPDB & Pesan</h2>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
              <div>
                <h3 className="font-medium text-gray-900">
                  Status Pendaftaran (PPDB)
                </h3>
                <p className="text-sm text-gray-500">
                  Jika dimatikan, tombol daftar akan
                  disembunyikan/dinonaktifkan.
                </p>
              </div>
              {/* Jika tidak punya komponen Switch, gunakan checkbox biasa */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ppdb_is_open}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ppdb_is_open: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tahun Ajaran Aktif
                </label>
                <Input
                  name="academic_year"
                  value={formData.academic_year}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Template Pesan WhatsApp (Default)
              </label>
              <Textarea
                name="wa_message_template"
                rows={3}
                value={formData.wa_message_template}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-400">
                Pesan ini akan muncul otomatis saat orang tua klik tombol Chat
                WA.
              </p>
            </div>
          </section>

          {/* TOMBOL SIMPAN (Sticky Bottom) */}
          <div className="sticky bottom-4 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2" /> Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayoutWrapper>
  );
}
