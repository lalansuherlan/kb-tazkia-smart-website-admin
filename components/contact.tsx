"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone, MessageSquare, Star } from "lucide-react";
import { MessageForm } from "@/components/message-form";
import { FeedbackForm } from "@/components/feedback-form";

export function Contact() {
  const [activeTab, setActiveTab] = useState<"message" | "feedback">("message");

  return (
    <section
      id="contact"
      className="w-full py-20 md:py-32 bg-gradient-to-b from-transparent to-cyan-50/30"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* --- BAGIAN KIRI (INFO KONTAK) --- */}
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
              {/* Card Telepon */}
              <div className="flex gap-4 items-start p-4 bg-gradient-to-r from-cyan-100/50 to-emerald-100/50 rounded-xl border border-cyan-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-bold text-emerald-900">
                    Telepon / WhatsApp
                  </p>
                  <p className="text-slate-700">(022) XXXX-XXXX</p>
                </div>
              </div>

              {/* Card Email */}
              <div className="flex gap-4 items-start p-4 bg-gradient-to-r from-cyan-100/50 to-blue-100/50 rounded-xl border border-cyan-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-bold text-emerald-900">Email</p>
                  <p className="text-slate-700">info@kbtazkia.id</p>
                </div>
              </div>

              {/* Card Alamat (DENGAN MAP KOORDINAT) */}
              <div className="flex gap-4 items-start p-4 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 rounded-xl border border-cyan-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                  <MapPin size={24} />
                </div>
                <div className="w-full">
                  <p className="font-bold text-emerald-900">Alamat</p>
                  <p className="text-slate-700 mb-3">
                    De Green Residence Blok C No. 17,
                    <br />
                    Rancaekek, Kabupaten Bandung
                  </p>

                  {/* --- MAP MINI (KOORDINAT TERBARU) --- */}
                  <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-white shadow-sm relative bg-gray-200 group">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      /* Menggunakan koordinat Anda */
                      src="https://maps.google.com/maps?q=-6.963939695768387,107.76962238433808&hl=id&z=16&output=embed"
                      className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                      title="Lokasi Sekolah"
                      aria-label="Peta Lokasi Sekolah"
                    ></iframe>

                    {/* Overlay teks kecil agar user tahu bisa diklik/dilihat */}
                    <div className="absolute bottom-0 right-0 bg-white/80 px-2 py-0.5 text-[10px] text-gray-600 rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Lihat di Google Maps
                    </div>
                  </div>
                  {/* ------------------------------------ */}
                </div>
              </div>
            </div>
          </div>

          {/* --- BAGIAN KANAN (FORM TAB) --- */}
          <Card className="p-8 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/50 border-2 border-emerald-200 shadow-lg relative overflow-hidden">
            {/* Dekorasi Background Halus */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>

            {/* Tab Navigation */}
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

            {/* Isi Form Berdasarkan Tab */}
            <div className="relative z-10">
              {activeTab === "message" ? <MessageForm /> : <FeedbackForm />}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
