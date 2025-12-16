"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import {
  Loader2,
  Crown,
  Star,
  Heart,
  Cloud,
  Sun,
  Users,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Student {
  id: number;
  name: string;
  photo: string | null;
  gender: string;
}

interface ClassGroup {
  className: string;
  academicYear: string;
  teacherName: string;
  teacherPhoto: string | null;
  students: Student[];
}

// Definisi Palet Warna Pastel
const CLASS_THEMES = [
  {
    name: "Pink Candy",
    bg: "bg-pink-50",
    border: "border-pink-200",
    title: "text-pink-600",
    accent: "bg-pink-100",
  },
  {
    name: "Sky Blue",
    bg: "bg-sky-50",
    border: "border-sky-200",
    title: "text-sky-600",
    accent: "bg-sky-100",
  },
  {
    name: "Sunny Yellow",
    bg: "bg-amber-50",
    border: "border-amber-200",
    title: "text-amber-600",
    accent: "bg-amber-100",
  },
  {
    name: "Mint Fresh",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    title: "text-emerald-600",
    accent: "bg-emerald-100",
  },
  {
    name: "Lilac Dream",
    bg: "bg-violet-50",
    border: "border-violet-200",
    title: "text-violet-600",
    accent: "bg-violet-100",
  },
];

export default function ClassRoomPage() {
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/classes")
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setLoading(false);
      });
  }, []);

  const currentAcademicYear =
    classes.length > 0 ? classes[0].academicYear : "Sekarang";

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Background Doodles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <Cloud className="absolute top-20 left-10 text-sky-100 w-32 h-32" />
        <Sun className="absolute top-28 right-20 text-amber-100 w-24 h-24 animate-pulse" />
        <Cloud className="absolute bottom-40 right-10 text-pink-100 w-40 h-40" />
      </div>

      <div className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto">
        {/* === HEADER SECTION === */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-bold shadow-sm">
            <Star size={16} fill="currentColor" /> Belajar Ceria
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
            Ruang Kelas
          </h1>

          {!loading && (
            <div className="flex justify-center animate-in fade-in slide-in-from-bottom-2">
              <span className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-200 flex items-center gap-2">
                <Calendar size={14} />
                Tahun Ajaran {currentAcademicYear}
              </span>
            </div>
          )}

          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Tempat tumbuh kembang, bermain, dan belajar bersama teman-teman.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-400 w-12 h-12" />
          </div>
        ) : (
          <div className="space-y-20">
            {classes.map((cls, idx) => {
              const theme = CLASS_THEMES[idx % CLASS_THEMES.length];

              return (
                <div key={cls.className} className="relative">
                  {/* === HEADER KARTU KELAS === */}
                  <div
                    className={`absolute -top-10 left-4 sm:left-8 px-6 py-3 rounded-t-2xl font-bold text-white shadow-md z-10 flex items-center gap-3 bg-white border-t-2 border-x-2 ${theme.border}`}
                  >
                    <span className={`text-xl ${theme.title}`}>
                      {cls.className}
                    </span>
                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                      <Users size={14} />
                      <span>{cls.students.length} Siswa</span>
                    </div>
                  </div>

                  {/* Container Kelas */}
                  <div
                    className={`relative rounded-[2.5rem] border-4 ${theme.border} ${theme.bg} p-6 md:p-10 shadow-xl overflow-hidden mt-6`}
                  >
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(#888 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    ></div>

                    <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">
                      {/* === WALI KELAS === */}
                      {/* Tambahkan mt-8 di sini untuk memberi ruang ekstra di dalam container */}
                      <div className="w-full lg:w-64 flex flex-col items-center flex-shrink-0 bg-white/60 p-6 rounded-3xl border-2 border-white shadow-sm backdrop-blur-sm mt-8 lg:mt-0">
                        <div className="relative w-32 h-32 mb-4">
                          {/* --- LENCANA MAHKOTA (DIUPDATE) --- */}
                          {/* Posisi dinaikkan ke -top-9 agar ada jarak */}
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                            {/* Ikon Mahkota */}
                            <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 text-white p-2.5 rounded-full shadow-md border-2 border-white flex items-center justify-center relative z-20">
                              <Crown size={22} fill="currentColor" />
                            </div>
                            {/* Teks Label LEBIH LEBAR (px-5, min-w) & LEBIH BESAR (text-xs) */}
                            <span className="text-xs font-extrabold  tracking-widest text-yellow-800 bg-gradient-to-b from-yellow-50 to-yellow-100 px-5 py-1 rounded-full shadow-sm -mt-1 border-2 border-yellow-300 relative z-10 min-w-[150px] text-center">
                              Wali Kelas
                            </span>
                          </div>
                          {/* --------------------------- */}

                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-white relative z-10">
                            <ImageWithFallback
                              src={cls.teacherPhoto || ""}
                              fallbackSrc="/guru-avatar-default.png"
                              alt=""
                              className="object-cover"
                            />
                          </div>
                        </div>

                        <h3
                          className={`text-xl font-bold text-center ${theme.title} mt-3`}
                        >
                          {cls.teacherName}
                        </h3>
                      </div>

                      {/* === DAFTAR SISWA === */}
                      <div className="flex-1 w-full pt-2 lg:pt-0">
                        {cls.students.length === 0 ? (
                          <div className="text-center py-10 text-slate-400 italic bg-white/50 rounded-2xl border border-dashed border-slate-300">
                            Belum ada teman di kelas ini.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {cls.students.map((student) => (
                              <div
                                key={student.id}
                                className="group flex flex-col items-center"
                              >
                                {/* Foto Siswa */}
                                <div
                                  className={`relative w-full aspect-square rounded-2xl p-2 bg-white shadow-sm border ${theme.border} group-hover:-translate-y-1 group-hover:rotate-1 transition-all duration-300`}
                                >
                                  <div
                                    className={`w-full h-full rounded-xl overflow-hidden relative ${
                                      student.gender === "L"
                                        ? "bg-sky-50"
                                        : "bg-pink-50"
                                    }`}
                                  >
                                    <ImageWithFallback
                                      src={student.photo || ""}
                                      fallbackSrc={
                                        student.gender === "L"
                                          ? "/boy-avatar.png"
                                          : "/girl-avatar.png"
                                      }
                                      alt={student.name}
                                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                  </div>
                                  {/* Gender Icon */}
                                  <div className="absolute -top-2 -right-2 transform scale-0 group-hover:scale-100 transition-transform">
                                    {student.gender === "L" ? (
                                      <div className="bg-sky-400 text-white p-1 rounded-full shadow-sm">
                                        <Star size={10} fill="white" />
                                      </div>
                                    ) : (
                                      <div className="bg-pink-400 text-white p-1 rounded-full shadow-sm">
                                        <Heart size={10} fill="white" />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Nama Siswa (Style Pill) */}
                                <span className="text-slate-500 text-sm font-medium bg-white px-3 py-1 rounded-full mt-2 shadow-sm border border-slate-100 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                  {student.name.split(" ")[0]}
                                  {student.name.split(" ").length > 1 &&
                                  student.name.split(" ")[1].length < 5
                                    ? ` ${student.name.split(" ")[1]}`
                                    : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
