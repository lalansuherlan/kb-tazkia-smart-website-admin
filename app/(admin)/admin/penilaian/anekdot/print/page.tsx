"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Printer } from "lucide-react";

export default function PrintAnekdotPage() {
  const searchParams = useSearchParams();
  const tanggal = searchParams.get("tanggal");
  const kelas = searchParams.get("kelas");
  const academicYear = searchParams.get("academic_year");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Format Tanggal Indonesia (Contoh: Senin, 15 September 2025)
  const formatTanggalIndo = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (tanggal && kelas && academicYear) {
      fetchData();
    }
  }, [tanggal, kelas, academicYear]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        tanggal: tanggal || "",
        kelas: kelas || "",
        academic_year: academicYear || "",
      });
      const res = await fetch(
        `/api/admin/penilaian/anekdot?${params.toString()}`
      );
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-gray-400 w-10 h-10" />
      </div>
    );
  }

  if (!data)
    return <div className="text-center p-10">Data tidak ditemukan.</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-8 print:p-0 print:bg-white">
      {/* TOMBOL PRINT (Akan hilang saat di-print) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <h1 className="font-bold text-gray-700">Pratinjau Cetak</h1>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md"
        >
          <Printer size={18} /> Cetak Dokumen
        </button>
      </div>

      {/* LEMBAR KERTAS A4 */}
      <div className="bg-white max-w-[297mm] mx-auto p-[10mm] shadow-lg print:shadow-none print:w-full print:max-w-none">
        {/* 1. KOP SURAT (Opsional - Agar terlihat resmi) */}
        <div className="text-center border-b-2 border-black pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">
            KB TAZKIA SMART
          </h2>
          <p className="text-sm text-gray-600">Tahun Ajaran: {academicYear}</p>
        </div>

        {/* 2. HEADER DATA (Mirip dengan Referensi Gambar Anda) */}
        <div className="border border-black mb-4">
          <div className="grid grid-cols-2">
            <div className="border-r border-b border-black p-2">
              <span className="font-bold">Hari/Tanggal:</span>{" "}
              {formatTanggalIndo(tanggal || "")}
              {data.header?.jumlah_kegiatan && (
                <span className="ml-2">({data.header.jumlah_kegiatan})</span>
              )}
            </div>
            <div className="border-b border-black p-2">
              <span className="font-bold">Minggu ke:</span>{" "}
              {data.header?.minggu_ke || "-"}
            </div>

            {/* UPDATE: KELAS & USIA */}
            <div className="border-r border-black p-2">
              <div>
                <span className="font-bold">Kelompok:</span> {kelas}
              </div>
              {/* Tampilkan Usia di bawah kelas */}
              <div className="text-sm mt-1">
                <span className="font-bold">Usia:</span>{" "}
                {data.header?.usia || "-"}
              </div>
            </div>

            <div className="p-2">
              <span className="font-bold">Kegiatan:</span>{" "}
              {data.header?.kegiatan || "-"}
            </div>
          </div>
          <div className="bg-gray-200 border-t border-black p-1 text-center font-bold uppercase text-sm print:bg-gray-100">
            Lembar Penilaian Catatan Anekdot
          </div>
        </div>

        {/* 3. TABEL UTAMA */}
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100 print:bg-gray-50">
              <th className="border border-black px-2 py-2 w-[5%] text-center">
                No
              </th>
              <th className="border border-black px-2 py-2 w-[20%] text-left">
                Nama Anak
              </th>
              <th className="border border-black px-2 py-2 w-[15%] text-left">
                Tempat
              </th>
              <th className="border border-black px-2 py-2 w-[45%] text-left">
                Peristiwa / Indikator
              </th>
              <th className="border border-black px-2 py-2 w-[15%] text-center">
                Kriteria Penilaian
              </th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((item: any, index: number) => {
              // Styling khusus jika Absen (Sakit/Izin/Alpha)
              const isAbsen = ["S", "I", "A"].includes(item.kriteria);
              return (
                <tr
                  key={index}
                  className={isAbsen ? "bg-gray-50 print:bg-white" : ""}
                >
                  <td className="border border-black px-2 py-3 text-center align-top">
                    {index + 1}
                  </td>
                  <td className="border border-black px-2 py-3 font-semibold align-top">
                    {item.nama}
                    <div className="text-[10px] text-gray-500 font-normal">
                      {item.nis || ""}
                    </div>
                  </td>
                  <td className="border border-black px-2 py-3 align-top">
                    {item.tempat || "-"}
                  </td>
                  <td className="border border-black px-2 py-3 align-top text-justify">
                    {/* Jika kosong tampilkan garis putus-putus agar bisa ditulis tangan manual jika perlu */}
                    {item.peristiwa ? (
                      item.peristiwa
                    ) : (
                      <span className="text-gray-300 italic">
                        ................................................................
                      </span>
                    )}
                  </td>
                  <td className="border border-black px-2 py-3 text-center font-bold align-top text-base">
                    {item.kriteria || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 4. LEGENDA & TANDA TANGAN */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-start gap-8 print:flex-row">
          {/* Legenda Kriteria */}
          <div className="text-xs border border-black p-2 w-full md:w-1/2">
            <p className="font-bold underline mb-1">Keterangan Kriteria:</p>
            <div className="grid grid-cols-2 gap-x-4">
              <span>BM : Belum Muncul</span>
              <span>KM : Kadang Muncul</span>
              <span>SM : Sering Muncul</span>
              <span>K : Konsisten</span>
              <span className="border-t border-dashed col-span-2 my-1"></span>
              <span>S/I/A : Sakit / Izin / Alpha</span>
            </div>
          </div>

          {/* Tanda Tangan */}
          <div className="flex gap-8 w-full md:w-1/2 justify-end text-center text-sm">
            <div className="flex flex-col justify-between h-32">
              <p>
                Mengetahui,
                <br />
                Kepala Sekolah
              </p>
              <p className="font-bold underline mt-auto">
                ( .............................. )
              </p>
            </div>
            <div className="flex flex-col justify-between h-32">
              <p>
                Bandung, {formatTanggalIndo(tanggal || "")}
                <br />
                Guru Kelas
              </p>
              {/* Mengambil nama user yg login jika memungkinkan, atau dikosongkan */}
              <p className="font-bold underline mt-auto">
                ( .............................. )
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS KHUSUS PRINT (Agar kertas Landscape otomatis) */}
      <style jsx global>{`
        @media print {
          @page {
            size: landscape; /* Mengatur kertas otomatis Landscape */
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
