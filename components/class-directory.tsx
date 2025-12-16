"use client";

import { useEffect, useState } from "react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { User, Users } from "lucide-react";

interface Student {
  id: number;
  name: string;
  photo: string | null;
  gender: string;
}

interface ClassGroup {
  className: string;
  teacherName: string;
  teacherPhoto: string | null;
  students: Student[];
}

export function ClassDirectory() {
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/public/classes");
        if (res.ok) {
          setClasses(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return null; // Atau tampilkan skeleton loading jika mau
  if (classes.length === 0) return null; // Jangan tampilkan section jika belum ada data

  return (
    <section id="classes" className="w-full py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Judul Section */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">
            Keluarga Besar KB Tazkia Smart
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Mengenal lebih dekat teman-teman kecil dan guru-guru penyayang yang
            menjadikan sekolah rumah kedua kami.
          </p>
        </div>

        {/* Grid Kelas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {classes.map((cls, idx) => (
            <div
              key={cls.className}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300 group"
            >
              {/* --- HEADER: INFO WALI KELAS --- */}
              <div
                className={`p-6 relative overflow-hidden ${
                  idx % 2 === 0
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-orange-400 to-amber-400"
                }`}
              >
                {/* Dekorasi Background */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Users size={120} className="text-white" />
                </div>

                <div className="relative z-10 flex items-center gap-6">
                  {/* Foto Guru */}
                  <div className="relative w-24 h-24 shrink-0">
                    <div className="w-24 h-24 rounded-full border-4 border-white/30 shadow-md overflow-hidden bg-white">
                      <ImageWithFallback
                        src={cls.teacherPhoto || ""}
                        fallbackSrc={
                          cls.teacherPhoto || "/guru-avatar-default.png"
                        } // Siapkan gambar ini di public/
                        alt={cls.teacherName}
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white text-emerald-600 rounded-full p-1.5 shadow-sm">
                      <User size={16} />
                    </div>
                  </div>

                  {/* Teks Guru */}
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">{cls.className}</h3>
                    <p className="text-white/90 text-sm font-medium uppercase tracking-wider mb-1">
                      Wali Kelas
                    </p>
                    <p className="text-lg font-semibold">{cls.teacherName}</p>
                  </div>
                </div>
              </div>

              {/* --- BODY: DAFTAR MURID --- */}
              <div className="p-6 bg-white">
                <p className="text-sm text-slate-500 font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {cls.students.length} Siswa Ceria
                </p>

                {cls.students.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                    {cls.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex flex-col items-center group/student"
                      >
                        <div className="relative w-14 h-14 mb-2 transition-transform transform group-hover/student:scale-110">
                          <div
                            className={`w-14 h-14 rounded-full border-2 overflow-hidden ${
                              student.gender === "L"
                                ? "border-blue-200 bg-blue-50"
                                : "border-pink-200 bg-pink-50"
                            }`}
                          >
                            <ImageWithFallback
                              src={student.photo || ""}
                              // Gunakan avatar kartun cowok/cewek jika foto kosong
                              fallbackSrc={
                                student.gender === "L"
                                  ? "/boy-avatar.png"
                                  : "/girl-avatar.png"
                              }
                              alt={student.name}
                              className="object-cover opacity-90 group-hover/student:opacity-100"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-center font-medium text-slate-600 leading-tight line-clamp-2 px-1">
                          {student.name.split(" ")[0]}{" "}
                          {/* Ambil nama depan saja biar rapi */}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Belum ada data siswa di kelas ini.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
