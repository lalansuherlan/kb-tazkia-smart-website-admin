"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  ExternalLink,
} from "lucide-react";
import { MessageForm } from "@/components/message-form";
import { FeedbackForm } from "@/components/feedback-form";

type SiteSettings = {
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  maps_link: string;
};

export function Contact() {
  const [activeTab, setActiveTab] = useState<"message" | "feedback">("message");
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // 1. Fetch Data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Gagal mengambil kontak:", error);
      }
    };
    fetchSettings();
  }, []);

  // 2. Data Fallback
  const phoneDisplay =
    settings?.phone || settings?.whatsapp_number || "loading...";
  const emailDisplay = settings?.email || "loading...";
  const addressDisplay = settings?.address || "Alamat sekolah sedang dimuat...";

  // Ambil Link dari Database
  const rawMapLink = settings?.maps_link || "";

  // 3. LOGIKA PINTAR MAPS
  // Cek apakah ini link embed (ada kata 'embed' atau 'output=embed')
  const isEmbedLink =
    rawMapLink.includes("embed") || rawMapLink.includes("<iframe");

  // Bersihkan link untuk Tombol (Hapus 'output=embed' agar bisa dibuka di tab baru tanpa error)
  const directMapLink = rawMapLink
    .replace("&output=embed", "")
    .replace("output=embed", "")
    .replace("?output=embed", "");

  const handlePhoneClick = () => {
    if (settings?.whatsapp_number) {
      window.open(`https://wa.me/${settings.whatsapp_number}`, "_blank");
    } else if (settings?.phone) {
      window.location.href = `tel:${settings.phone}`;
    }
  };

  return (
    <section
      id="contact"
      className="w-full py-20 md:py-32 bg-gradient-to-b from-transparent to-cyan-50/30"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* --- BAGIAN KIRI --- */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
                Hubungi Kami
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Kami Siap Menjawab Pertanyaan Anda
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                Punya pertanyaan tentang pendaftaran? Atau ingin memberikan
                saran dan testimoni? Kami siap mendengar dari Anda.
              </p>
            </div>

            <div className="space-y-4">
              {/* Telepon */}
              <div
                onClick={handlePhoneClick}
                className="flex gap-4 items-start p-4 bg-gradient-to-r from-cyan-100/50 to-emerald-100/50 rounded-xl border border-cyan-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors">
                    Telepon / WhatsApp
                  </p>
                  <p className="text-slate-700 font-medium">{phoneDisplay}</p>
                </div>
              </div>

              {/* Email */}
              <a
                href={`mailto:${emailDisplay}`}
                className="flex gap-4 items-start p-4 bg-gradient-to-r from-cyan-100/50 to-blue-100/50 rounded-xl border border-cyan-200 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-bold text-emerald-900 group-hover:text-blue-700 transition-colors">
                    Email
                  </p>
                  <p className="text-slate-700 font-medium">{emailDisplay}</p>
                </div>
              </a>

              {/* Alamat & Maps */}
              <div className="flex gap-4 items-start p-4 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 rounded-xl border border-cyan-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                  <MapPin size={24} />
                </div>
                <div className="w-full">
                  <p className="font-bold text-emerald-900">Alamat</p>
                  <p className="text-slate-700 mb-3 whitespace-pre-line leading-relaxed">
                    {addressDisplay}
                  </p>

                  {/* --- MAP AREA --- */}
                  <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-white shadow-sm relative bg-gray-200 group">
                    {isEmbedLink ? (
                      // JIKA LINK EMBED: Tampilkan Iframe Peta
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={rawMapLink}
                        title="Lokasi Sekolah"
                        className="absolute inset-0 w-full h-full"
                      ></iframe>
                    ) : (
                      // JIKA BUKAN LINK EMBED: Tampilkan Placeholder
                      <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500">
                        <MapPin size={32} className="opacity-50" />
                        <span className="ml-2 text-xs">
                          Peta tidak tersedia
                        </span>
                      </div>
                    )}

                    {/* Tombol Overlay Buka Maps (Link sudah dibersihkan) */}
                    <a
                      href={directMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 z-10"
                    >
                      <button className="bg-white/90 hover:bg-white text-emerald-800 text-xs font-bold px-3 py-2 rounded-full shadow-lg flex items-center gap-1 transition-all border border-emerald-100">
                        <ExternalLink size={12} /> Buka Google Maps
                      </button>
                    </a>
                  </div>
                  {/* ---------------- */}
                </div>
              </div>
            </div>
          </div>

          {/* --- BAGIAN KANAN (FORM) --- */}
          <Card className="p-8 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/50 border-2 border-emerald-200 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex p-1 bg-white/60 backdrop-blur-sm border border-cyan-100 rounded-xl mb-8 relative z-10">
              <button
                onClick={() => setActiveTab("message")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === "message"
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md"
                    : "text-gray-500 hover:bg-white/50"
                }`}
              >
                <MessageSquare size={18} /> Kirim Pesan
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === "feedback"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "text-gray-500 hover:bg-white/50"
                }`}
              >
                <Star size={18} /> Beri Testimoni
              </button>
            </div>

            <div className="relative z-10">
              {activeTab === "message" ? <MessageForm /> : <FeedbackForm />}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
