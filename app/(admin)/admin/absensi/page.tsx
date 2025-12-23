"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Save,
  Loader2,
  Users,
  AlertCircle,
  ChevronDown,
  UserCheck,
} from "lucide-react";

// 👇 IMPORT WRAPPER & USER HOOK
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import { useUser } from "@/hooks/useUser"; // Pastikan path hook ini benar

// Tipe Data
type AbsensiSiswa = {
  siswa_id: number;
  nama: string;
  nis: string;
  kelas: string;
  status: "Hadir" | "Sakit" | "Izin" | "Alpha" | null;
  keterangan: string | null;
};

type Category = {
  id: number;
  name: string;
};

export default function AbsensiPage() {
  const router = useRouter();
  // Ambil data user yang sedang login
  const { user, loading: userLoading } = useUser();

  // AMBIL TAHUN DARI ENV
  const currentAcademicYear = process.env.NEXT_PUBLIC_ACADEMIC_YEAR;

  // States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [selectedClass, setSelectedClass] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataSiswa, setDataSiswa] = useState<AbsensiSiswa[]>([]);

  // 1. Fetch Daftar Kelas (Hanya untuk Dropdown Admin)
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Gagal ambil kategori:", err));
  }, []);

  // 2. Fetch Data Siswa (Otomatis jalan saat User / Tanggal / Kelas berubah)
  useEffect(() => {
    // Tunggu sampai user selesai dimuat
    if (userLoading || !user) return;

    // KONDISI FETCH:
    // A. Jika Admin/Staff: Harus pilih kelas dulu
    // B. Jika Guru: Langsung fetch (tanpa pilih kelas)
    if (
      user.role === "teacher" ||
      ((user.role === "admin" || user.role === "staff") && selectedClass)
    ) {
      fetchDataAbsensi();
    } else {
      // Jika Admin belum pilih kelas, kosongkan data
      setDataSiswa([]);
    }
  }, [tanggal, selectedClass, user, userLoading]);

  const fetchDataAbsensi = async () => {
    if (!currentAcademicYear) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("tanggal", tanggal);
      params.append("academic_year", currentAcademicYear);

      // LOGIC FILTER BERDASARKAN ROLE
      if (user?.role === "teacher") {
        // Jika Guru: Kirim ID Guru (Backend akan filter siswa milik guru ini)
        params.append("teacher_id", String(user.id));
      } else {
        // Jika Admin: Kirim Nama Kelas yang dipilih
        params.append("kelas", selectedClass);
      }

      // Pastikan path API ini sesuai dengan file route.ts Anda
      const res = await fetch(`/api/admin/absensi?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        const initializedData = json.data.map((item: any) => ({
          ...item,
          status: item.status_absensi || "Hadir",
          keterangan: item.keterangan || "",
        }));
        setDataSiswa(initializedData);
      } else {
        setDataSiswa([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Status Change
  const handleStatusChange = (
    index: number,
    newStatus: "Hadir" | "Sakit" | "Izin" | "Alpha"
  ) => {
    const newData = [...dataSiswa];
    newData[index].status = newStatus;
    if (newStatus === "Hadir") newData[index].keterangan = "";
    setDataSiswa(newData);
  };

  // 4. Handle Keterangan Change
  const handleKeteranganChange = (index: number, text: string) => {
    const newData = [...dataSiswa];
    newData[index].keterangan = text;
    setDataSiswa(newData);
  };

  // 5. Submit Data
  const handleSubmit = async () => {
    // Validasi khusus Admin
    if ((user?.role === "admin" || user?.role === "staff") && !selectedClass) {
      return alert("Pilih kelas terlebih dahulu!");
    }

    setSaving(true);
    try {
      const payload = {
        tanggal,
        academic_year: currentAcademicYear,
        data_absensi: dataSiswa.map((s) => ({
          siswa_id: s.siswa_id,
          status: s.status,
          keterangan: s.keterangan,
        })),
      };

      const res = await fetch("/api/admin/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Absensi berhasil disimpan!");
        router.refresh();
      } else {
        alert("❌ Gagal menyimpan data.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  // UI Helper: Status Button
  const StatusButton = ({ active, type, onClick, icon, label }: any) => {
    let style = "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100";
    if (active) {
      if (type === "Hadir")
        style =
          "bg-emerald-100 border-emerald-300 text-emerald-700 font-bold ring-1 ring-emerald-300";
      if (type === "Sakit")
        style =
          "bg-yellow-100 border-yellow-300 text-yellow-700 font-bold ring-1 ring-yellow-300";
      if (type === "Izin")
        style =
          "bg-blue-100 border-blue-300 text-blue-700 font-bold ring-1 ring-blue-300";
      if (type === "Alpha")
        style =
          "bg-red-100 border-red-300 text-red-700 font-bold ring-1 ring-red-300";
    }
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-xs transition-all ${style}`}
      >
        <span className="text-lg mb-0.5">{icon}</span>
        <span>{label}</span>
      </button>
    );
  };

  if (userLoading)
    return <div className="p-10 text-center">Memuat data pengguna...</div>;

  return (
    <AdminLayoutWrapper>
      <div>
        {/* === HEADER SECTION === */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Absensi Kelas</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              Tahun Ajaran:{" "}
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-sm font-bold">
                {currentAcademicYear}
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* 👇 LOGIC TAMPILAN DROPDOWN: Hanya tampil jika Admin / Staff */}
            {user?.role === "admin" || user?.role === "staff" ? (
              <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 min-w-[200px]">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <Users size={20} />
                </div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-transparent font-medium text-gray-700 outline-none w-full cursor-pointer appearance-none"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="text-gray-400 mr-2" />
              </div>
            ) : (
              // Tampilan untuk GURU (Hanya Badge, bukan Dropdown)
              <div className="bg-indigo-50 p-2 px-4 rounded-xl border border-indigo-100 text-indigo-700 font-bold flex items-center gap-2">
                <UserCheck size={20} />
                <span>Mode Guru</span>
              </div>
            )}

            {/* DATE PICKER */}
            <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <Calendar size={20} />
              </div>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="bg-transparent font-bold text-gray-700 outline-none cursor-pointer px-2"
              />
            </div>
          </div>
        </div>

        {/* === MAIN CARD CONTAINER === */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[500px]">
          {/* STATE: JIKA ADMIN BELUM PILIH KELAS */}
          {!selectedClass &&
          (user?.role === "admin" || user?.role === "staff") ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="bg-blue-50 p-4 rounded-full mb-3 text-blue-400">
                <Users size={32} />
              </div>
              <p>
                Silakan pilih <b>Kelas</b> terlebih dahulu di pojok kanan atas.
              </p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-3" />
              <p>Memuat data siswa...</p>
            </div>
          ) : dataSiswa.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="bg-gray-100 p-4 rounded-full mb-3">
                <AlertCircle size={32} />
              </div>
              <p>Tidak ada siswa ditemukan.</p>
              <p className="text-xs mt-1">
                Pastikan Tahun Ajaran {currentAcademicYear} sesuai.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* STATS RINGKAS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-center border border-emerald-100">
                  <span className="block text-2xl font-bold">
                    {dataSiswa.filter((s) => s.status === "Hadir").length}
                  </span>
                  <span className="text-xs font-medium">Hadir</span>
                </div>
                <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-center border border-yellow-100">
                  <span className="block text-2xl font-bold">
                    {dataSiswa.filter((s) => s.status === "Sakit").length}
                  </span>
                  <span className="text-xs font-medium">Sakit</span>
                </div>
                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-center border border-blue-100">
                  <span className="block text-2xl font-bold">
                    {dataSiswa.filter((s) => s.status === "Izin").length}
                  </span>
                  <span className="text-xs font-medium">Izin</span>
                </div>
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-center border border-red-100">
                  <span className="block text-2xl font-bold">
                    {dataSiswa.filter((s) => s.status === "Alpha").length}
                  </span>
                  <span className="text-xs font-medium">Alpha</span>
                </div>
              </div>

              {/* LIST SISWA */}
              <div className="grid grid-cols-1 gap-4">
                {dataSiswa.map((siswa, index) => (
                  <div
                    key={siswa.siswa_id}
                    className="group border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all hover:border-emerald-200 bg-white"
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      {/* INFO SISWA */}
                      <div className="flex items-center gap-4 min-w-[250px]">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center text-emerald-700 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {siswa.nama}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Users size={12} /> {siswa.kelas} • {siswa.nis}
                          </p>
                        </div>
                      </div>

                      {/* TOMBOL STATUS */}
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        <StatusButton
                          active={siswa.status === "Hadir"}
                          type="Hadir"
                          icon="😊"
                          label="Hadir"
                          onClick={() => handleStatusChange(index, "Hadir")}
                        />
                        <StatusButton
                          active={siswa.status === "Sakit"}
                          type="Sakit"
                          icon="🤒"
                          label="Sakit"
                          onClick={() => handleStatusChange(index, "Sakit")}
                        />
                        <StatusButton
                          active={siswa.status === "Izin"}
                          type="Izin"
                          icon="📩"
                          label="Izin"
                          onClick={() => handleStatusChange(index, "Izin")}
                        />
                        <StatusButton
                          active={siswa.status === "Alpha"}
                          type="Alpha"
                          icon="❌"
                          label="Alpha"
                          onClick={() => handleStatusChange(index, "Alpha")}
                        />
                      </div>

                      {/* INPUT KETERANGAN */}
                      <div className="md:w-1/3">
                        <input
                          type="text"
                          disabled={siswa.status === "Hadir"}
                          placeholder={
                            siswa.status === "Hadir"
                              ? "-"
                              : "Tulis keterangan..."
                          }
                          value={siswa.keterangan || ""}
                          onChange={(e) =>
                            handleKeteranganChange(index, e.target.value)
                          }
                          className={`w-full text-sm border rounded-lg px-3 py-2.5 outline-none transition-all
                            ${
                              siswa.status === "Hadir"
                                ? "bg-gray-50 border-transparent text-gray-400 cursor-not-allowed"
                                : "bg-white border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                            }
                          `}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FAB SAVE */}
        {dataSiswa.length > 0 && (
          <div
            className="
              fixed z-40
              /* Posisi Mobile: Tengah Bawah */
              bottom-6 left-1/2 -translate-x-1/2 w-max
              
              /* Posisi Desktop: Kiri Bawah (Di sebelah kanan Sidebar w-64) */
              md:bottom-8 md:left-72 md:translate-x-0
            "
          >
            <button
              onClick={handleSubmit}
              disabled={saving || loading}
              className="
                flex items-center gap-2 
                bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 
                text-white px-6 py-3 rounded-full 
                shadow-lg shadow-emerald-200 
                transition-all hover:scale-105 active:scale-95 
                disabled:opacity-70 disabled:cursor-not-allowed
              "
            >
              {saving ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span className="font-bold">Simpan Absensi</span>
            </button>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
