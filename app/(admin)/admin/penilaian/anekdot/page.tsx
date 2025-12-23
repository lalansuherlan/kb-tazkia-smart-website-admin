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
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// Opsi Tempat & Kriteria
const TEMPAT_OPTIONS = ["Ruang Kelas", "Halaman Sekolah", "Teras"];
const KRITERIA_OPTIONS = [
  { value: "BM", label: "BM (Belum Muncul)", color: "bg-red-100 text-red-700" },
  {
    value: "KM",
    label: "KM (Kadang Muncul)",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "SM",
    label: "SM (Sering Muncul)",
    color: "bg-emerald-100 text-emerald-700",
  },
  { value: "K", label: "K (Konsisten)", color: "bg-blue-100 text-blue-700" }, // Baru

  // Status Absensi (Tetap Ada)
  {
    value: "I",
    label: "I (Izin)",
    color: "bg-gray-100 text-gray-700 border-gray-300",
  },
  {
    value: "S",
    label: "S (Sakit)",
    color: "bg-gray-100 text-gray-700 border-gray-300",
  },
  {
    value: "A",
    label: "A (Alpha)",
    color: "bg-gray-100 text-gray-700 border-gray-300",
  },
];

export default function AnekdotPage() {
  const { user, loading: userLoading } = useUser();
  const currentAcademicYear = process.env.NEXT_PUBLIC_ACADEMIC_YEAR;

  // Filter State
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedClass, setSelectedClass] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  // Header Form State
  const [mingguKe, setMingguKe] = useState("");
  const [jumlahKegiatan, setJumlahKegiatan] = useState("");
  const [usia, setUsia] = useState("");
  const [kegiatan, setKegiatan] = useState("");

  // Data State
  const [allStudents, setAllStudents] = useState<any[]>([]); // Semua siswa di kelas
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // LOGIC BARU: SELEKSI SISWA
  const [step, setStep] = useState(1); // 1 = Pilih Siswa, 2 = Isi Form
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  // Data Siswa yang sedang diedit (Hanya yang dipilih)
  const [formStudents, setFormStudents] = useState<any[]>([]);

  // 1. Load Kategori Kelas
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // 2. Fetch Data (Reset step ke 1 setiap ganti kelas/tanggal)
  useEffect(() => {
    if (userLoading || !user) return;
    if (!currentAcademicYear) return;

    if (user.role === "teacher" || (user.role !== "teacher" && selectedClass)) {
      fetchData();
    } else {
      setAllStudents([]);
    }
  }, [selectedClass, tanggal, user, userLoading]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        tanggal,
        academic_year: currentAcademicYear || "",
      });

      if (user?.role === "teacher") {
        params.append("teacher_id", String(user.id));
      } else {
        params.append("kelas", selectedClass);
      }

      const res = await fetch(
        `/api/admin/penilaian/anekdot?${params.toString()}`
      );
      const json = await res.json();

      if (json.success) {
        // 1. Set Header Info
        if (json.header) {
          setMingguKe(json.header.minggu_ke || "");
          setJumlahKegiatan(json.header.jumlah_kegiatan || "");
          setUsia(json.header.usia || "");
          setKegiatan(json.header.kegiatan || "");
        } else {
          setMingguKe("");
          setJumlahKegiatan("");
          setUsia("");
          setKegiatan("");
        }

        if (user?.role === "teacher" && json.detected_class) {
          setSelectedClass(json.detected_class);
        }

        // 2. DETEKSI HISTORY (Logika Pintar)
        // Cari siswa yang sudah punya data penilaian (kriteria atau peristiwa tidak null)
        const studentsWithData = json.data.filter(
          (s: any) => s.kriteria || (s.peristiwa && s.peristiwa !== "")
        );

        if (studentsWithData.length > 0) {
          // === KONDISI A: DATA SUDAH ADA ===
          // 1. Ambil ID siswa yang sudah dinilai
          const ids = studentsWithData.map((s: any) => s.siswa_id);
          setSelectedStudentIds(ids);

          // 2. Mapping data untuk langsung ditampilkan di Form
          const mappedForForm = studentsWithData.map((s: any) => ({
            siswa_id: s.siswa_id,
            nama: s.nama,
            tempat: s.tempat || "Ruang Kelas",
            peristiwa: s.peristiwa || "",
            kriteria: s.kriteria || "",
          }));

          setFormStudents(mappedForForm);
          setStep(2); // <--- LANGSUNG LOMPAT KE STEP 2 (Form)
        } else {
          // === KONDISI B: DATA BELUM ADA (BARU) ===
          setSelectedStudentIds([]); // Reset pilihan
          setFormStudents([]);
          setStep(1); // <--- TAMPILKAN GRID PILIH SISWA
        }

        // Simpan data mentah semua siswa (untuk keperluan grid selection jika user mau tambah siswa)
        setAllStudents(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC SELEKSI SISWA ---
  const toggleSelection = (siswaId: number) => {
    if (selectedStudentIds.includes(siswaId)) {
      // Uncheck
      setSelectedStudentIds((prev) => prev.filter((id) => id !== siswaId));
    } else {
      // Check (Limit Max 3)
      if (selectedStudentIds.length >= 3) {
        alert("Maksimal memilih 3 siswa untuk penilaian Anekdot.");
        return;
      }
      setSelectedStudentIds((prev) => [...prev, siswaId]);
    }
  };

  const handleStartAssessment = () => {
    // Logic Merge:
    // Kita loop berdasarkan ID yang DIPILIH (Selected).
    // Jika ID tersebut sudah ada di form sebelumnya (formStudents), kita pakai data lama (agar tulisan tidak hilang).
    // Jika ID tersebut baru dicentang, kita ambil data default/baru.

    const mappedForForm = selectedStudentIds.map((selectedId) => {
      // Cek apakah siswa ini sudah ada di form yang sedang diedit?
      const existingFormData = formStudents.find(
        (fs) => fs.siswa_id === selectedId
      );

      if (existingFormData) {
        // KASUS 1: Siswa Lama (Dipertahankan) -> Pakai data yang sudah diketik
        return existingFormData;
      } else {
        // KASUS 2: Siswa Baru (Baru dicentang) -> Ambil data default dari allStudents
        const rawStudent = allStudents.find((s) => s.siswa_id === selectedId);

        let defaultKriteria = "";
        let defaultPeristiwa = "";

        // Cek Default Absensi
        if (rawStudent) {
          if (rawStudent.kriteria) {
            // Kalau di DB sudah ada (sebelumnya tersimpan)
            defaultKriteria = rawStudent.kriteria;
            defaultPeristiwa = rawStudent.peristiwa;
          } else if (rawStudent.status_absensi === "Sakit") {
            defaultKriteria = "S";
            defaultPeristiwa = "Tidak Masuk (Sakit)";
          } else if (rawStudent.status_absensi === "Izin") {
            defaultKriteria = "I";
            defaultPeristiwa = "Tidak Masuk (Izin)";
          } else if (rawStudent.status_absensi === "Alpa") {
            defaultKriteria = "A";
            defaultPeristiwa = "Tanpa Keterangan";
          }
        }

        return {
          siswa_id: rawStudent?.siswa_id,
          nama: rawStudent?.nama,
          tempat: rawStudent?.tempat || "Ruang Kelas",
          peristiwa: defaultPeristiwa,
          kriteria: defaultKriteria,
        };
      }
    });

    setFormStudents(mappedForForm);
    setStep(2); // Pindah ke halaman Form
  };

  // --- LOGIC FORM ---
  const handleStudentChange = (index: number, field: string, value: string) => {
    const newData = [...formStudents];
    newData[index][field] = value;
    setFormStudents(newData);
  };

  const handleSubmit = async () => {
    // Validasi dasar
    if (!mingguKe || !kegiatan)
      return alert("Mohon isi Minggu Ke dan Kegiatan!");

    setSaving(true);

    // 👇 PASTIKAN 'usia' DAN 'jumlahKegiatan' ADA DI SINI
    const payload = {
      tanggal,
      kelas: selectedClass,
      minggu_ke: mingguKe,
      jumlah_kegiatan: jumlahKegiatan, // Pastikan ini ada
      usia: usia, // Pastikan ini ada (JANGAN LUPA)
      kegiatan: kegiatan,
      details: formStudents, // Kirim siswa yang sedang diedit
    };

    try {
      const res = await fetch("/api/admin/penilaian/anekdot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json(); // Baca respon json untuk cek error

      if (res.ok) {
        alert("✅ Data Anekdot Berhasil Disimpan!");
        // Refresh data agar status terupdate
        fetchData();
      } else {
        console.error(json);
        alert("Gagal menyimpan: " + (json.error || "Unknown Error"));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  if (userLoading) return <div className="p-10 text-center">Memuat...</div>;

  return (
    <AdminLayoutWrapper>
      <div className="space-y-6 pb-20">
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Catatan Anekdot
            </h1>
            <p className="text-gray-500">
              Pilih maksimal 3 siswa untuk dinilai hari ini.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {user?.role === "admin" || user?.role === "staff" ? (
              <div className="bg-white p-2 rounded-lg shadow-sm border flex items-center">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-transparent font-medium text-gray-700 outline-none px-2 cursor-pointer min-w-[150px]"
                >
                  <option value="">-- Pilih Kelompok --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-indigo-50 p-2 px-4 rounded-xl border border-indigo-100 text-indigo-700 font-bold flex items-center gap-2">
                <UserCheck size={20} />
                <span>Mode Guru {selectedClass && `(${selectedClass})`}</span>
              </div>
            )}

            <div className="bg-white p-2 rounded-lg shadow-sm border flex items-center gap-2">
              <Calendar size={18} className="text-emerald-600 ml-1" />
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="bg-transparent font-bold text-gray-700 outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto text-emerald-500" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !selectedClass && user?.role !== "teacher" && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
            <FileText size={40} className="mx-auto mb-2 opacity-50" />
            Silakan pilih Kelompok dan Tanggal.
          </div>
        )}

        {/* === STEP 1: PEMILIHAN SISWA === */}
        {!loading &&
          (selectedClass || user?.role === "teacher") &&
          step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Info Bar */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6 flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-800">
                  <Users size={20} />
                  <span className="font-bold">Pilih Siswa (Maksimal 3)</span>
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-sm font-bold shadow-sm border">
                  Terpilih:{" "}
                  <span
                    className={
                      selectedStudentIds.length > 3
                        ? "text-red-500"
                        : "text-emerald-600"
                    }
                  >
                    {selectedStudentIds.length}
                  </span>{" "}
                  / 3
                </div>
              </div>

              {/* Grid Siswa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allStudents.map((siswa) => {
                  const isSelected = selectedStudentIds.includes(
                    siswa.siswa_id
                  );
                  const hasData = !!siswa.kriteria; // Cek apakah sudah dinilai sebelumnya

                  return (
                    <div
                      key={siswa.siswa_id}
                      onClick={() => toggleSelection(siswa.siswa_id)}
                      className={`
                                    relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md
                                    ${
                                      isSelected
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-gray-100 bg-white hover:border-emerald-200"
                                    }
                                `}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar Initials */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                        ${
                                          isSelected
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gray-100 text-gray-500"
                                        }
                                    `}
                        >
                          {siswa.nama.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm line-clamp-1">
                            {siswa.nama}
                          </h4>
                          <p className="text-xs text-gray-500">
                            NIS: {siswa.nis || "-"}
                          </p>

                          {/* Status Indicator */}
                          <div className="mt-2 flex gap-1">
                            {hasData && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                Sudah Dinilai
                              </span>
                            )}
                            {siswa.status_absensi && (
                              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                Absen: {siswa.status_absensi}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Check Icon */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-emerald-600">
                          <CheckCircle2
                            size={20}
                            fill="currentColor"
                            className="text-white"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="fixed bottom-8 left-8 md:left-72 z-40">
                <button
                  onClick={handleStartAssessment}
                  disabled={selectedStudentIds.length === 0}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Mulai Penilaian</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

        {/* === STEP 2: FORM PENILAIAN === */}
        {!loading && step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            {/* Header Informasi */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText size={18} className="text-emerald-600" /> Informasi
                  Kegiatan
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 hover:text-emerald-600 underline flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Ganti Siswa
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Kolom 1: Minggu Ke */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Minggu Ke-
                  </label>
                  <input
                    type="number"
                    value={mingguKe}
                    onChange={(e) => setMingguKe(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                  />
                </div>

                {/* Kolom 2: Jumlah Kegiatan */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Jumlah Kegiatan
                  </label>
                  <input
                    type="text"
                    placeholder="2 Kegiatan"
                    value={jumlahKegiatan}
                    onChange={(e) => setJumlahKegiatan(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                  />
                </div>

                {/* Kolom 3: Usia (BARU) */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Usia Anak
                  </label>
                  <input
                    type="text"
                    placeholder="4-5 Tahun"
                    value={usia}
                    onChange={(e) => setUsia(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                  />
                </div>

                {/* Kolom 4: Nama Kegiatan */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Topik / Tema
                  </label>
                  <input
                    type="text"
                    value={kegiatan}
                    onChange={(e) => setKegiatan(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Tabel Form */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-emerald-50 text-emerald-900 uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3 w-10">No</th>
                      <th className="px-4 py-3 min-w-[200px]">Nama Anak</th>
                      <th className="px-4 py-3 w-[150px]">Tempat</th>
                      <th className="px-4 py-3">Peristiwa / Indikator</th>
                      <th className="px-4 py-3 w-[120px]">Nilai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formStudents.map((siswa, idx) => (
                      <tr key={siswa.siswa_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-center text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {siswa.nama}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={siswa.tempat}
                            onChange={(e) =>
                              handleStudentChange(idx, "tempat", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white"
                          >
                            {TEMPAT_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            rows={2}
                            placeholder="Tulis peristiwa..."
                            value={siswa.peristiwa}
                            onChange={(e) =>
                              handleStudentChange(
                                idx,
                                "peristiwa",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none resize-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={siswa.kriteria || ""}
                            onChange={(e) =>
                              handleStudentChange(
                                idx,
                                "kriteria",
                                e.target.value
                              )
                            }
                            className="w-full font-bold border rounded px-2 py-2 outline-none cursor-pointer"
                          >
                            <option value="">- Pilih -</option>
                            <optgroup label="Perkembangan">
                              <option value="BM">BM</option>
                              <option value="KM">KM</option>
                              <option value="SM">SM</option>
                              <option value="K">K (Konsisten)</option>
                            </optgroup>
                            <optgroup label="Absensi">
                              <option value="S">S</option>
                              <option value="I">I</option>
                              <option value="A">A</option>
                            </optgroup>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend (Keterangan) UPDATE */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <h4 className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wider">
                Legenda Kriteria Penilaian:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
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

            {/* BUTTONS (Tetap) */}
            <div className="mt-8 mb-20 flex flex-row justify-start items-center gap-4">
              {/* ... (Tombol Simpan & Cetak sama seperti sebelumnya) ... */}
              {/* Pastikan tombol Simpan memanggil handleSubmit yang sudah menyertakan 'usia' di payload */}
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
                <span>Simpan Anekdot</span>
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    tanggal,
                    kelas: selectedClass,
                    academic_year: currentAcademicYear || "",
                  });
                  window.open(
                    `/admin/penilaian/anekdot/print?${params.toString()}`,
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
