"use client";

import { useState, useEffect } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import { useUser } from "@/hooks/useUser";
import {
  Save,
  Loader2,
  Calendar,
  FileText,
  Printer,
  UserCheck,
} from "lucide-react";

// KONSTANTA OPSI (Disamakan dengan Anekdot agar Legend Konsisten)
const KRITERIA_OPTIONS = [
  {
    value: "SM",
    label: "SM (Sering Masuk)",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    value: "KM",
    label: "KM (Kurang Masuk)",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "BM", label: "BM (Belum Masuk)", color: "bg-red-100 text-red-700" },
  { value: "I", label: "I (Izin)", color: "bg-blue-100 text-blue-700" },
  { value: "S", label: "S (Sakit)", color: "bg-orange-100 text-orange-700" },
  { value: "A", label: "A (Alpha)", color: "bg-gray-200 text-gray-700" },
];

export default function PenilaianKolomPage() {
  const { user, loading: userLoading } = useUser();
  const currentAcademicYear = process.env.NEXT_PUBLIC_ACADEMIC_YEAR;

  // Filter
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  // Header Data (Manual Input)
  const [topikKegiatan, setTopikKegiatan] = useState("");
  const [indikator1, setIndikator1] = useState("");
  const [indikator2, setIndikator2] = useState("");
  const [indikator3, setIndikator3] = useState("");
  const [indikator4, setIndikator4] = useState("");

  // Table Data
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load Kategori
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // Fetch Data
  useEffect(() => {
    if (userLoading || !user) return;
    if (user.role === "teacher" || (user.role !== "teacher" && selectedClass)) {
      fetchData();
    } else {
      setStudents([]);
    }
  }, [selectedClass, tanggal, user, userLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        tanggal,
        academic_year: currentAcademicYear || "",
      });
      if (user?.role === "teacher")
        params.append("teacher_id", String(user.id));
      else params.append("kelas", selectedClass);

      const res = await fetch(
        `/api/admin/penilaian/kolom?${params.toString()}`
      );
      const json = await res.json();

      if (json.success) {
        if (json.header) {
          setTopikKegiatan(json.header.topik_kegiatan || "");
          setIndikator1(json.header.indikator_1 || "");
          setIndikator2(json.header.indikator_2 || "");
          setIndikator3(json.header.indikator_3 || "");
          setIndikator4(json.header.indikator_4 || "");
        } else {
          setTopikKegiatan("");
          setIndikator1("");
          setIndikator2("");
          setIndikator3("");
          setIndikator4("");
        }

        if (user?.role === "teacher" && json.detected_class) {
          setSelectedClass(json.detected_class);
        }
        setStudents(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (
    index: number,
    col: "nilai_1" | "nilai_2" | "nilai_3" | "nilai_4",
    val: string
  ) => {
    const newData = [...students];
    newData[index][col] = val;
    setStudents(newData);
  };

  const handleSubmit = async () => {
    if (!topikKegiatan) return alert("Mohon isi Kegiatan");
    setSaving(true);
    try {
      const payload = {
        tanggal,
        kelas: selectedClass,
        topik_kegiatan: topikKegiatan, // Hanya ini yg dikirim
        indikator_1: indikator1,
        indikator_2: indikator2,
        indikator_3: indikator3,
        indikator_4: indikator4,
        details: students,
      };
      const res = await fetch("/api/admin/penilaian/kolom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) alert("✅ Data Tersimpan!");
      else alert("Gagal Simpan");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (userLoading) return <div className="p-10 text-center">Memuat...</div>;

  return (
    <AdminLayoutWrapper>
      <div className="space-y-6 pb-20">
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Penilaian Kolom (Ceklis)
            </h1>
            <p className="text-gray-500">
              Penilaian matriks berdasarkan indikator harian.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {user?.role !== "teacher" ? (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="p-2 border rounded-lg bg-white"
              >
                <option value="">-- Pilih Kelas --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 text-indigo-700 font-bold flex items-center gap-2">
                <UserCheck size={20} />{" "}
                <span>Mode Guru {selectedClass && `(${selectedClass})`}</span>
              </div>
            )}
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="p-2 border rounded-lg bg-white font-bold text-gray-700"
            />
          </div>
        </div>

        {/* CONTENT */}
        {!loading && (selectedClass || user?.role === "teacher") && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. INPUT HEADER & INDIKATOR */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText size={18} className="text-emerald-600" /> Informasi &
                Indikator
              </h3>

              {/* HANYA INPUT KEGIATAN (Jumlah Kegiatan Dihapus) */}
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Kegiatan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Mengenal Huruf Vokal..."
                  value={topikKegiatan}
                  onChange={(e) => setTopikKegiatan(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-400 outline-none"
                />
              </div>

              <label className="text-xs font-bold text-blue-600 uppercase mb-2 block">
                Input Keterangan Indikator (Judul Kolom Tabel)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { val: indikator1, set: setIndikator1, label: "Kolom 1" },
                  { val: indikator2, set: setIndikator2, label: "Kolom 2" },
                  { val: indikator3, set: setIndikator3, label: "Kolom 3" },
                  { val: indikator4, set: setIndikator4, label: "Kolom 4" },
                ].map((item, i) => (
                  <div key={i}>
                    <textarea
                      rows={3}
                      placeholder={`Indikator ${item.label}...`}
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      className="w-full border border-blue-200 bg-blue-50/30 p-2 rounded text-sm focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. TABEL MATRIKS */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                    <tr>
                      <th className="px-4 py-3 w-[5%] text-center">No</th>
                      <th className="px-4 py-3 w-[20%]">Nama Siswa</th>
                      {[indikator1, indikator2, indikator3, indikator4].map(
                        (ind, i) => (
                          <th
                            key={i}
                            className="px-3 py-3 w-[18.75%] border-l bg-blue-50/50 font-normal italic text-justify align-top leading-snug"
                          >
                            {ind || `Indikator ${i + 1}`}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((siswa, idx) => (
                      <tr key={siswa.siswa_id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-center text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-800">
                          {siswa.nama}
                          {["S", "I", "A"].includes(siswa.status_absensi) && (
                            <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1 rounded border border-red-200">
                              {siswa.status_absensi}
                            </span>
                          )}
                        </td>
                        {["nilai_1", "nilai_2", "nilai_3", "nilai_4"].map(
                          (colKey, colIdx) => (
                            <td
                              key={colIdx}
                              className="px-2 py-2 text-center border-l border-dashed"
                            >
                              <select
                                value={siswa[colKey] || ""}
                                onChange={(e) =>
                                  handleScoreChange(
                                    idx,
                                    colKey as any,
                                    e.target.value
                                  )
                                }
                                className={`w-full text-center font-bold border rounded p-1 cursor-pointer outline-none
                                                        ${
                                                          siswa[colKey] === "SM"
                                                            ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                                                            : siswa[colKey] ===
                                                              "KM"
                                                            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                                            : siswa[colKey] ===
                                                              "BM"
                                                            ? "bg-red-100 text-red-700 border-red-300"
                                                            : [
                                                                "S",
                                                                "I",
                                                                "A",
                                                              ].includes(
                                                                siswa[colKey]
                                                              )
                                                            ? "bg-gray-100 text-gray-500"
                                                            : "bg-white border-gray-300"
                                                        }
                                                    `}
                              >
                                <option value="">-</option>
                                {KRITERIA_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.value}
                                  </option>
                                ))}
                              </select>
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. LEGEND / KETERANGAN (Format Grid Warna Konsisten) */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <h4 className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wider">
                Keterangan:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {KRITERIA_OPTIONS.map((item) => (
                  <div
                    key={item.value}
                    className={`text-xs px-2 py-1.5 rounded border ${item.color} border-opacity-50 flex items-center gap-2 shadow-sm`}
                  >
                    <span className="font-bold bg-white/50 px-1 rounded">
                      {item.value}
                    </span>
                    <span className="truncate">
                      {item.label.split("(")[1].replace(")", "")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TOMBOL AKSI */}
            <div className="mt-8 mb-20 flex flex-row justify-start items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-all font-bold"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                <span>Simpan Kolom</span>
              </button>

              <button
                onClick={() => {
                  if (!topikKegiatan) {
                    alert("Mohon Simpan Data Terlebih Dahulu");
                    return;
                  }
                  const params = new URLSearchParams({
                    tanggal,
                    kelas: selectedClass,
                    academic_year: currentAcademicYear || "",
                  });
                  window.open(
                    `/admin/penilaian/kolom/print?${params.toString()}`,
                    "_blank"
                  );
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:scale-105 transition-all font-bold"
              >
                <Printer size={20} />
                <span>Cetak PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
