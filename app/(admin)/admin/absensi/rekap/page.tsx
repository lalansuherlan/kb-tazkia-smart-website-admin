"use client";

import { useState } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import { Calendar, Search, Printer, FileText } from "lucide-react";

type RekapSiswa = {
  id: number;
  nama: string;
  nis: string;
  kelas: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
  total_hari: number;
};

export default function RekapAbsensiPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<RekapSiswa[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchRekap = async () => {
    if (!startDate || !endDate) {
      alert("Harap pilih tanggal awal dan akhir!");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `/api/admin/absensi/rekap?startDate=${startDate}&endDate=${endDate}`
      );
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data rekap");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayoutWrapper>
      <div className="min-h-screen pb-10">
        {/* === HEADER (Tidak ikut ter-print saat mode cetak) === */}
        <div className="mb-6 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800">
            Rekapitulasi Absensi
          </h1>
          <p className="text-gray-500 mt-1">
            Laporan kehadiran siswa per periode (Mingguan/Bulanan/Semester).
          </p>
        </div>

        {/* === FILTER SECTION (Tidak ikut ter-print) === */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchRekap}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  "Memuat..."
                ) : (
                  <>
                    <Search size={18} /> Tampilkan
                  </>
                )}
              </button>
              {data.length > 0 && (
                <button
                  onClick={handlePrint}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 py-2.5 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all border border-blue-200"
                >
                  <Printer size={18} /> Cetak
                </button>
              )}
            </div>
          </div>
        </div>

        {/* === HASIL LAPORAN === */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
          {/* Header Laporan (Khusus Print) */}
          <div className="hidden print:block text-center mb-6 pt-4">
            <h2 className="text-2xl font-bold text-black">
              LAPORAN REKAPITULASI ABSENSI
            </h2>
            <p className="text-gray-600">KB Tazkia Smart</p>
            <p className="text-sm text-gray-500 mt-1">
              Periode: {startDate} s/d {endDate}
            </p>
          </div>

          {!hasSearched ? (
            <div className="text-center py-20 text-gray-400 print:hidden">
              <Calendar size={48} className="mx-auto mb-3 opacity-20" />
              <p>Silakan pilih periode tanggal untuk melihat rekap.</p>
            </div>
          ) : loading ? (
            <div className="text-center py-20 text-gray-500 print:hidden">
              <p>Sedang menghitung data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>Tidak ada data absensi pada periode ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-emerald-50 text-emerald-800 text-xs uppercase font-bold print:bg-gray-100 print:text-black">
                    <th className="p-4 text-center border-b border-emerald-100 print:border-gray-300 w-12">
                      No
                    </th>
                    <th className="p-4 text-left border-b border-emerald-100 print:border-gray-300">
                      Siswa
                    </th>
                    <th className="p-4 text-left border-b border-emerald-100 print:border-gray-300">
                      Kelas
                    </th>
                    <th className="p-4 text-center border-b border-emerald-100 print:border-gray-300 w-20">
                      Hadir
                    </th>
                    <th className="p-4 text-center border-b border-emerald-100 print:border-gray-300 w-20 bg-yellow-50/50">
                      Sakit
                    </th>
                    <th className="p-4 text-center border-b border-emerald-100 print:border-gray-300 w-20 bg-blue-50/50">
                      Izin
                    </th>
                    <th className="p-4 text-center border-b border-emerald-100 print:border-gray-300 w-20 bg-red-50/50">
                      Alpha
                    </th>
                    <th className="p-4 text-center border-b border-emerald-100 print:border-gray-300 w-24">
                      % Kehadiran
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 print:divide-gray-300">
                  {data.map((row, i) => {
                    // Hitung Persentase Kehadiran
                    // Rumus: (Hadir / (Hadir + Sakit + Izin + Alpha)) * 100
                    const totalPertemuan =
                      row.hadir + row.sakit + row.izin + row.alpha;
                    const persentase =
                      totalPertemuan > 0
                        ? Math.round((row.hadir / totalPertemuan) * 100)
                        : 0;

                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 print:hover:bg-transparent"
                      >
                        <td className="p-3 text-center text-gray-500 border-r border-gray-100 print:border-gray-300">
                          {i + 1}
                        </td>
                        <td className="p-3 border-r border-gray-100 print:border-gray-300">
                          <p className="font-bold text-gray-800">{row.nama}</p>
                          <p className="text-xs text-gray-400">{row.nis}</p>
                        </td>
                        <td className="p-3 border-r border-gray-100 print:border-gray-300 text-sm">
                          {row.kelas}
                        </td>

                        <td className="p-3 text-center font-bold text-emerald-600 border-r border-gray-100 print:border-gray-300">
                          {row.hadir}
                        </td>
                        <td className="p-3 text-center font-medium text-yellow-600 bg-yellow-50/30 border-r border-gray-100 print:border-gray-300">
                          {row.sakit}
                        </td>
                        <td className="p-3 text-center font-medium text-blue-600 bg-blue-50/30 border-r border-gray-100 print:border-gray-300">
                          {row.izin}
                        </td>
                        <td className="p-3 text-center font-bold text-red-600 bg-red-50/30 border-r border-gray-100 print:border-gray-300">
                          {row.alpha}
                        </td>

                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              persentase >= 90
                                ? "bg-green-100 text-green-700"
                                : persentase >= 75
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            } print:bg-transparent print:text-black print:border print:border-black`}
                          >
                            {persentase}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Tanda Tangan (Khusus Print) */}
          <div className="hidden print:flex justify-end mt-20 pr-10">
            <div className="text-center">
              <p className="mb-20">
                Mengetahui,
                <br />
                Kepala Sekolah
              </p>
              <p className="font-bold underline">
                ( ..................................... )
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
