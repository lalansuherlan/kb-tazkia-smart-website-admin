"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(false);

  // Ambil nomor & pesan dari .env (sama seperti di PPDB)
  // Pastikan variabel ini ada di .env.local Anda
  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890";
  const rawMessage = "Halo Admin, saya ingin bertanya seputar KB Tazkia Smart.";
  const message = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  // Efek muncul setelah scroll sedikit (opsional, agar tidak menutupi konten awal)
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-500 transform hover:scale-110 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      aria-label="Chat WhatsApp Admin"
    >
      {/* Container Tombol */}
      <div className="relative group">
        {/* Tooltip (Muncul saat hover) */}
        <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block w-max">
          <div className="bg-slate-800 text-white text-xs font-medium py-2 px-3 rounded-lg shadow-lg">
            Hubungi Admin Sekolah 👋
            {/* Panah kecil tooltip */}
            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>

        {/* Lingkaran Hijau WhatsApp */}
        <div className="flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg shadow-green-500/40 hover:bg-green-600 hover:shadow-green-600/50 transition-colors border-2 border-white">
          <MessageCircle className="w-8 h-8 text-white" fill="white" />
        </div>

        {/* Efek Ping (Agar menarik perhatian) */}
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </div>
    </a>
  );
}
