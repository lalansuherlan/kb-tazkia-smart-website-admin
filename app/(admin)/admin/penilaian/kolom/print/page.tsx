"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Printer } from "lucide-react";

export default function PrintKolomPage() {
  const searchParams = useSearchParams();
  const tanggal = searchParams.get("tanggal");
  const kelas = searchParams.get("kelas");
  const academicYear = searchParams.get("academic_year");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Format Tanggal Indonesia
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
        `/api/admin/penilaian/kolom?${params.toString()}`
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
    return (
      <div className="text-center p-10">
        Data tidak ditemukan. Harap simpan data terlebih dahulu.
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen p-8 print:p-0 print:bg-white">
      {/* TOMBOL PRINT (Hilang saat diprint) */}
      <div className="max-w-[297mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <h1 className="font-bold text-gray-700">Pratinjau Cetak (Ceklis)</h1>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md font-bold"
        >
          <Printer size={18} /> Cetak Dokumen
        </button>
      </div>

      {/* KERTAS A4 LANDSCAPE */}
      <div className="bg-white w-[297mm] min-h-[210mm] mx-auto p-[10mm] shadow-lg print:shadow-none print:w-full print:max-w-none">
        {/* 1. KOP SURAT */}
        <div className="text-center border-b-2 border-black pb-2 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">
            KB TAZKIA SMART
          </h2>
          <p className="text-sm text-gray-600">Tahun Ajaran: {academicYear}</p>
        </div>

        {/* 2. HEADER DATA */}
        <div className="mb-4">
          <h3 className="text-center font-bold uppercase mb-4 underline">
            Lembar Penilaian Ceklis / Kolom
          </h3>

          <table className="w-full text-sm mb-4">
            <tbody>
              <tr>
                <td className="w-[15%] font-bold">Hari / Tanggal</td>
                <td className="w-[1%]">:</td>
                <td className="w-[34%]">{formatTanggalIndo(tanggal || "")}</td>

                {/* Update: Label Kelompok */}
                <td className="w-[15%] font-bold">Kelompok</td>
                <td className="w-[1%]">:</td>
                <td>{kelas}</td>
              </tr>
              <tr>
                {/* Update: Label Kegiatan (Tanpa Jumlah Kegiatan) */}
                <td className="font-bold">Kegiatan</td>
                <td>:</td>
                <td colSpan={4}>{data.header?.topik_kegiatan || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. TABEL UTAMA */}
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            {/* Header Level 1 */}
            <tr className="bg-gray-100 print:bg-gray-50 text-center">
              {/* Perkecil kolom No & Nama agar Indikator lebih luas */}
              <th
                className="border border-black px-2 py-2 w-[4%] align-middle"
                rowSpan={2}
              >
                No
              </th>
              <th
                className="border border-black px-2 py-2 w-[20%] align-middle"
                rowSpan={2}
              >
                Nama Anak
              </th>
              <th className="border border-black px-1 py-1 w-[76%]" colSpan={4}>
                Indikator Penilaian
              </th>
            </tr>

            {/* Header Level 2: Deskripsi Indikator (Lebar Dimaksimalkan) */}
            <tr className="bg-white text-xs">
              {/* Total lebar indikator = 76% 
                    Dibagi 4 kolom = 19% per kolom 
                    Align Text = Justify (Rata Kanan-Kiri)
                */}
              <th className="border border-black px-3 py-2 w-[19%] font-normal italic align-top text-justify leading-snug">
                {data.header?.indikator_1 || "Indikator 1"}
              </th>
              <th className="border border-black px-3 py-2 w-[19%] font-normal italic align-top text-justify leading-snug">
                {data.header?.indikator_2 || "Indikator 2"}
              </th>
              <th className="border border-black px-3 py-2 w-[19%] font-normal italic align-top text-justify leading-snug">
                {data.header?.indikator_3 || "Indikator 3"}
              </th>
              <th className="border border-black px-3 py-2 w-[19%] font-normal italic align-top text-justify leading-snug">
                {data.header?.indikator_4 || "Indikator 4"}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((item: any, index: number) => {
              const isAbsen = ["S", "I", "A"].includes(item.status_absensi);
              return (
                <tr
                  key={index}
                  className={isAbsen ? "bg-gray-50 print:bg-white" : ""}
                >
                  <td className="border border-black px-2 py-1 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-black px-2 py-1 font-semibold">
                    {item.nama}
                    {isAbsen && (
                      <span className="ml-1 text-[10px] italic">
                        ({item.status_absensi})
                      </span>
                    )}
                  </td>
                  <td className="border border-black px-2 py-1 text-center font-medium">
                    {item.nilai_1 || "-"}
                  </td>
                  <td className="border border-black px-2 py-1 text-center font-medium">
                    {item.nilai_2 || "-"}
                  </td>
                  <td className="border border-black px-2 py-1 text-center font-medium">
                    {item.nilai_3 || "-"}
                  </td>
                  <td className="border border-black px-2 py-1 text-center font-medium">
                    {item.nilai_4 || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 4. LEGENDA & TTD */}
        <div className="mt-4 flex flex-col md:flex-row justify-between items-start gap-8 print:flex-row">
          {/* Legenda Kriteria (SAMA SEPERTI ANEKDOT) */}
          <div className="text-xs border border-black p-2 w-full md:w-1/2">
            <p className="font-bold underline mb-1">Keterangan Kriteria:</p>
            <div className="grid grid-cols-2 gap-x-4">
              <span>SM : Sering Masuk</span>
              <span>I : Izin</span>
              <span>KM : Kurang Masuk</span>
              <span>S : Sakit</span>
              <span>BM : Belum Masuk</span>
              <span>A : Alpha</span>
            </div>
          </div>

          {/* Tanda Tangan */}
          <div className="flex gap-10 text-center w-full md:w-1/2 justify-end">
            <div className="flex flex-col justify-between h-24">
              <p>
                Mengetahui,
                <br />
                Kepala Sekolah
              </p>
              <p className="font-bold underline mt-auto">
                ( .......................... )
              </p>
            </div>
            <div className="flex flex-col justify-between h-24">
              <p>
                Bandung, {formatTanggalIndo(tanggal || "")}
                <br />
                Guru Kelas
              </p>
              <p className="font-bold underline mt-auto">
                ( .......................... )
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS KHUSUS PRINT: LANDSCAPE */}
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
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
