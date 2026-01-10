"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  MapPin,
  Mail,
  Phone,
  Youtube,
} from "lucide-react";

// Tipe data sesuai database
type SiteSettings = {
  school_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  youtube_url: string;
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // 1. Fetch Data dari Database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data footer:", error);
      }
    };
    fetchSettings();
  }, []);

  // 2. Tentukan Data Tampil (Gunakan Fallback jika DB belum loading)
  const schoolName = settings?.school_name || "KB Tazkia Smart";
  const email = settings?.email || "kbtazkiasmart@gmail.com";
  // Prioritaskan telepon kantor, jika kosong gunakan WA
  const phone =
    settings?.phone || settings?.whatsapp_number || "+62 812-3456-7890";
  const address =
    settings?.address ||
    "De Green Residence Blok C No. 17\nDesa Bojongloa, Kec. Rancaekek\nKabupaten Bandung, Jawa Barat";

  return (
    <footer className="w-full bg-gradient-to-b from-emerald-50 to-cyan-50 border-t-4 border-emerald-400 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Decorative elements (Background) */}
        <div className="absolute left-0 top-0 text-6xl opacity-10 select-none pointer-events-none">
          🌻
        </div>
        <div className="absolute right-0 top-0 text-6xl opacity-10 select-none pointer-events-none">
          🦋
        </div>

        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* --- KOLOM 1: IDENTITAS YAYASAN & SEKOLAH --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Logo Box */}
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                🏫
              </div>

              {/* Teks Yayasan & Sekolah */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-tight">
                  Yayasan Tyasana Sinergi
                </span>
                <h3 className="font-extrabold text-xl text-emerald-950 leading-none">
                  {schoolName}
                </h3>
              </div>
            </div>

            <p className="text-sm text-emerald-800/80 leading-relaxed">
              Menyediakan pendidikan berkualitas untuk generasi cerdas dan
              berkarakter melalui pembelajaran yang menyenangkan dan islami.
            </p>

            {/* Social Media Icons (Hanya muncul jika link diisi di Admin) */}
            <div className="flex gap-3 pt-2">
              {settings?.facebook_url && (
                <Link
                  href={settings.facebook_url}
                  target="_blank"
                  aria-label="Facebook"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                >
                  <Facebook size={16} />
                </Link>
              )}

              {settings?.instagram_url && (
                <Link
                  href={settings.instagram_url}
                  target="_blank"
                  aria-label="Instagram"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-500 hover:text-white transition-all duration-300"
                >
                  <Instagram size={16} />
                </Link>
              )}

              {settings?.tiktok_url && (
                <Link
                  href={settings.tiktok_url}
                  target="_blank"
                  aria-label="TikTok"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-black hover:bg-black hover:text-white transition-all duration-300"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 1 1-2.4-2.4c.27 0 .53.03.79.08V9.24a6.1 6.1 0 0 0-.79-.05A6.11 6.11 0 0 0 5 15.11V20a8.94 8.94 0 0 0 4.34 1.44c4.54 0 8.74-3.64 8.74-8.15v-5.62a7.12 7.12 0 0 0 4.1 1.26v-3.21a4.7 4.7 0 0 1-.55-.05z" />
                  </svg>
                </Link>
              )}

              {settings?.youtube_url && (
                <Link
                  href={settings.youtube_url}
                  target="_blank"
                  aria-label="Youtube"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  <Youtube size={16} />
                </Link>
              )}
            </div>
          </div>

          {/* --- KOLOM 2: MENU --- */}
          <div className="space-y-4">
            <h4 className="font-bold text-emerald-950 flex items-center gap-2 border-b border-emerald-200 pb-2 w-fit">
              📋 Menu Utama
            </h4>
            <ul className="space-y-2 text-sm text-emerald-800">
              <li>
                <Link
                  href="/#hero"
                  className="hover:text-emerald-600 hover:pl-1 transition-all inline-block"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="hover:text-emerald-600 hover:pl-1 transition-all inline-block"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="hover:text-emerald-600 hover:pl-1 transition-all inline-block"
                >
                  Program Unggulan
                </Link>
              </li>
              <li>
                <Link
                  href="/#gallery"
                  className="hover:text-emerald-600 hover:pl-1 transition-all inline-block"
                >
                  Galeri Kegiatan
                </Link>
              </li>
            </ul>
          </div>

          {/* --- KOLOM 3: INFORMASI --- */}
          <div className="space-y-4">
            <h4 className="font-bold text-emerald-950 flex items-center gap-2 border-b border-emerald-200 pb-2 w-fit">
              ℹ️ Informasi
            </h4>
            <ul className="space-y-2 text-sm text-emerald-800">
              <li>
                <Link
                  href="/#ppdb"
                  className="hover:text-emerald-600 hover:pl-1 transition-all inline-block font-medium"
                >
                  Pendaftaran PPDB
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="hover:text-emerald-600 hover:pl-1 transition-all inline-block"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-emerald-600 hover:pl-1 transition-all inline-block"
                >
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* --- KOLOM 4: KONTAK --- */}
          <div className="space-y-4">
            <h4 className="font-bold text-emerald-950 flex items-center gap-2 border-b border-emerald-200 pb-2 w-fit">
              📞 Hubungi Kami
            </h4>
            <div className="space-y-4 text-sm text-emerald-800">
              <div className="flex gap-3 items-start group">
                <div className="p-2 bg-white rounded-full shadow-sm text-cyan-500 group-hover:text-cyan-600 transition-colors">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="font-bold text-emerald-900">Telepon/WA</p>
                  <p className="text-xs opacity-80 mt-0.5 hover:text-emerald-600 transition-colors cursor-pointer">
                    {phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start group">
                <div className="p-2 bg-white rounded-full shadow-sm text-cyan-500 group-hover:text-cyan-600 transition-colors">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="font-bold text-emerald-900">Email</p>
                  <p className="text-xs opacity-80 mt-0.5">{email}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start group">
                <div className="p-2 bg-white rounded-full shadow-sm text-cyan-500 group-hover:text-cyan-600 transition-colors">
                  <MapPin size={14} />
                </div>
                <div className="text-xs leading-relaxed whitespace-pre-line">
                  <p className="font-bold text-emerald-900 mb-0.5">
                    Lokasi Sekolah
                  </p>
                  {address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-200/60 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-emerald-700/70">
          <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
            <p>
              &copy; {currentYear}{" "}
              <span className="font-bold text-emerald-800">{schoolName}</span>.
              <span className="hidden md:inline mx-2 text-emerald-300">|</span>
              <br className="md:hidden" />
              Dikelola oleh{" "}
              <span className="font-semibold">Yayasan Tyasana Sinergi</span>
            </p>
          </div>

          <div className="flex items-center gap-1 mt-4 md:mt-0 opacity-80">
            <span>NPSN:</span>
            <span className="font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">
              70057420
            </span>
          </div>
        </div>

        {/* Decorative footer elements (Bottom) */}
        <div className="absolute bottom-4 right-12 text-5xl opacity-10 select-none animate-bounce duration-[3000ms] pointer-events-none">
          🐰
        </div>
        <div className="absolute bottom-4 left-12 text-5xl opacity-10 select-none animate-pulse duration-[4000ms] pointer-events-none">
          🦆
        </div>
      </div>
    </footer>
  );
}
