"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Loader2, Sparkles, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Teacher {
  id: number;
  name: string;
  role: string;
  photo_url: string | null;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/teachers")
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data);
        setLoading(false);
      });
  }, []);

  const leaders = teachers.filter((t) => t.role === "admin");
  const educators = teachers.filter((t) => t.role === "teacher");

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 pointer-events-none"></div>

      <div className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <span className="inline-block py-1 px-3 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold tracking-wide uppercase">
            Struktur Organisasi
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
            Dewan Guru
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500 w-10 h-10" />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* === LEVEL 1: KEPALA SEKOLAH === */}
            <div className="flex justify-center relative z-10 w-full mb-10">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="flex flex-col items-center relative"
                >
                  {/* Kartu Kepsek */}
                  <div className="bg-white p-3 rounded-xl shadow-xl shadow-amber-100/50 border-2 border-amber-200/50 w-64 relative group transition-transform hover:-translate-y-2 z-20">
                    <div className="aspect-[3/4] w-full rounded-lg overflow-hidden relative bg-slate-100 border border-slate-200">
                      <ImageWithFallback
                        src={leader.photo_url || ""}
                        fallbackSrc="/guru-avatar-default.png"
                        alt={leader.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-amber-400 to-yellow-500 text-white p-2 rounded-lg shadow-md rotate-12 group-hover:rotate-0 transition-all">
                      <Sparkles size={22} fill="white" />
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-bold text-slate-800">
                      {leader.name}
                    </h3>
                    <p className="text-amber-700 font-bold bg-amber-50 px-4 py-1 rounded-lg text-sm mt-1 border border-amber-100 tracking-wider uppercase inline-block">
                      Kepala Sekolah
                    </p>
                  </div>

                  {/* GARIS VERTIKAL TURUN DARI KEPSEK (Penghubung ke Guru) */}
                  {/* Hanya muncul jika ada guru dibawahnya */}
                  {educators.length > 0 && (
                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-0.5 h-14 bg-slate-300"></div>
                  )}
                </div>
              ))}
            </div>

            {/* === LEVEL 2: GURU KELAS === */}
            <div className="flex flex-wrap justify-center w-full px-4">
              {educators.map((teacher, index) => {
                // Logika Garis Konektor
                const isFirst = index === 0;
                const isLast = index === educators.length - 1;
                const isOnlyOne = educators.length === 1;

                return (
                  <div
                    key={teacher.id}
                    className="flex flex-col items-center relative px-4 pb-8"
                  >
                    {/* === BAGIAN PENTING: LOGIKA GARIS KONEKTOR === */}
                    <div className="absolute top-0 left-0 w-full h-8 hidden sm:block">
                      {/* 1. Garis Vertikal Naik (Menyambung ke kartu) */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-300"></div>

                      {/* 2. Garis Horizontal (Menyambung antar guru) */}
                      {!isOnlyOne && (
                        <>
                          {/* Jika Pertama: Garis dari Tengah ke Kanan (50% width) */}
                          {isFirst && (
                            <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-slate-300"></div>
                          )}

                          {/* Jika Terakhir: Garis dari Kiri ke Tengah (50% width) */}
                          {isLast && (
                            <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-slate-300"></div>
                          )}

                          {/* Jika Tengah: Garis Penuh (100% width) */}
                          {!isFirst && !isLast && (
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-slate-300"></div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Spacer agar kartu turun sedikit (memberi ruang untuk garis) */}
                    <div className="h-8 w-full hidden sm:block"></div>

                    {/* Kartu Guru */}
                    <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 w-[240px] flex flex-col items-center text-center group relative overflow-hidden z-10">
                      <div className="absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity text-emerald-200">
                        <Award size={24} />
                      </div>

                      <div className="w-full aspect-[3/4] rounded-lg mb-4 overflow-hidden border-2 border-slate-50 bg-slate-100 relative shadow-inner">
                        <ImageWithFallback
                          src={teacher.photo_url || ""}
                          fallbackSrc="/guru-avatar-default.png"
                          alt={teacher.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <h3
                        className="text-lg font-bold text-slate-800 line-clamp-1 w-full leading-tight"
                        title={teacher.name}
                      >
                        {teacher.name}
                      </h3>
                      <p className="text-emerald-700/70 text-sm font-medium uppercase tracking-wider mt-1">
                        Guru Kelas
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
