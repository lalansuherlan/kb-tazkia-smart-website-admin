"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Check,
  BookOpen,
  Users,
  Clock,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type React from "react";

// Definisi tipe data yang sesuai dengan API
interface ProgramDetail {
  id: number;
  name: string;
  age_range: string;
  emoji: string;
  color_class: string;
  short_desc: string;
  full_desc: string;
  objectives: string[];
  curriculum: { title: string; items: string[] };
  facilities: string[];
  schedule: {
    regular: string;
    fullday: string;
    entrance: string;
    pickup: string;
  };
  costs: {
    registration: string;
    monthly: string;
    yearly: string;
    additional: string;
  };
  requirements: string[];
  benefits: string[];
  admission: string;
}

export default function PPDBDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // --- STATE DATA PROGRAM (DINAMIS) ---
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loadingProgram, setLoadingProgram] = useState(true);

  // --- STATE FORM ---
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    childName: "",
    childBirthDate: "",
    childGender: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    notes: "",
  });

  // 1. FETCH DATA PROGRAM DARI API
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/ppdb/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        setProgram(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProgram(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, childGender: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!program) return;

    try {
      const response = await fetch("/api/ppdb/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          program_id: program.id,
          program_name: program.name, // Nama program dari database
          child_name: formData.childName,
          child_dob: formData.childBirthDate,
          child_gender: formData.childGender,
          parent_name: formData.parentName,
          parent_phone: formData.parentPhone,
          parent_email: formData.parentEmail,
          address: formData.address,
          notes: formData.notes,
          status: "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim pendaftaran");
      }

      setSuccessMessage(
        "Pendaftaran berhasil! Kami akan menghubungi Anda segera."
      );
      setFormData({
        childName: "",
        childBirthDate: "",
        childGender: "",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        address: "",
        notes: "",
      });

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // --- TAMPILAN LOADING ---
  if (loadingProgram) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
      </div>
    );
  }

  // --- TAMPILAN JIKA DATA TIDAK DITEMUKAN ---
  if (!program) {
    return (
      <div className="w-full min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Program tidak ditemukan
          </h1>
          <Link href="/#ppdb">
            <Button className="mt-4">Kembali ke PPDB</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50">
      <Header />

      <main className="min-h-screen py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back Button */}
          <Link
            href="/#ppdb"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke PPDB
          </Link>

          {/* Header */}
          <div
            className={`bg-gradient-to-r ${
              program.color_class || "from-emerald-50 to-cyan-50"
            } rounded-2xl p-8 border-2 border-emerald-200`}
          >
            <div className="flex items-start gap-6">
              <div className="text-6xl">{program.emoji}</div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-emerald-900 mb-2">
                  {program.name}
                </h1>
                <p className="text-xl text-cyan-700 font-semibold mb-4">
                  Usia {program.age_range}
                </p>
                <p className="text-lg text-slate-700">{program.full_desc}</p>
              </div>
            </div>
          </div>

          {/* Objectives */}
          {program.objectives && program.objectives.length > 0 && (
            <Card className="p-8 border-2 border-emerald-200">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                Tujuan Pembelajaran
              </h2>
              <ul className="space-y-3">
                {program.objectives.map((objective, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                    <span className="text-slate-700 font-medium">
                      {objective}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Curriculum */}
          {program.curriculum && (
            <Card className="p-8 border-2 border-cyan-200">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-cyan-600" />
                {program.curriculum.title || "Kurikulum"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.curriculum.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start p-4 bg-cyan-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-cyan-600 rounded-full flex-shrink-0 mt-2" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Facilities */}
          {program.facilities && program.facilities.length > 0 && (
            <Card className="p-8 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">
                Fasilitas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-4 bg-blue-50 rounded-lg"
                  >
                    <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{facility}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Schedule */}
          {program.schedule && (
            <Card className="p-8 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                Jadwal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-emerald-900">Kelas Reguler</h3>
                  <p className="text-slate-700">{program.schedule.regular}</p>
                  <p className="text-sm text-slate-600">
                    Masuk: {program.schedule.entrance} | Pulang:{" "}
                    {program.schedule.pickup?.split("/")[0]?.trim()}
                  </p>
                </div>
                {program.schedule.fullday && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-emerald-900">
                      Kelas Full Day (Opsional)
                    </h3>
                    <p className="text-slate-700">{program.schedule.fullday}</p>
                    <p className="text-sm text-slate-600">
                      Pulang: {program.schedule.pickup?.split("/")[1]?.trim()}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Costs */}
          {program.costs && (
            <Card className="p-8 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                Biaya Pendaftaran
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border-l-4 border-emerald-500">
                  <span className="font-semibold text-slate-700">
                    Biaya Pendaftaran
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    {program.costs.registration}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border-l-4 border-cyan-500">
                  <span className="font-semibold text-slate-700">
                    Biaya Bulanan
                  </span>
                  <span className="text-lg font-bold text-cyan-600">
                    {program.costs.monthly}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border-l-4 border-blue-500">
                  <span className="font-semibold text-slate-700">
                    Biaya Tahunan
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {program.costs.yearly}
                  </span>
                </div>
                <p className="text-sm text-slate-600 italic p-4 bg-yellow-50 rounded-lg">
                  *Catatan: {program.costs.additional}
                </p>
              </div>
            </Card>
          )}

          {/* Requirements */}
          {program.requirements && program.requirements.length > 0 && (
            <Card className="p-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-600" />
                Persyaratan Pendaftaran
              </h2>
              <ul className="space-y-3">
                {program.requirements.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex gap-3 p-4 bg-purple-50 rounded-lg"
                  >
                    <span className="font-bold text-purple-600 flex-shrink-0 w-6">
                      {index + 1}.
                    </span>
                    <span className="text-slate-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Benefits */}
          {program.benefits && program.benefits.length > 0 && (
            <Card className="p-8 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">
                Keuntungan Memilih Program Kami
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-4 bg-white rounded-lg"
                  >
                    <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 font-bold" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* PPDB registration form (ID ini penting untuk scroll) */}
          <div id="form-pendaftaran">
            <Card className="p-8 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">
                Form Pendaftaran
              </h2>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded-lg flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-900 font-semibold">Berhasil!</p>
                    <p className="text-green-800">{successMessage}</p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900 font-semibold">Error</p>
                    <p className="text-red-800">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <p className="text-sm text-slate-600">Program yang dipilih</p>
                  <p className="text-lg font-bold text-emerald-900">
                    {program.name}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-emerald-900">Data Anak</h3>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nama Lengkap Anak *
                    </label>
                    <Input
                      type="text"
                      name="childName"
                      value={formData.childName}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap anak"
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Tanggal Lahir *
                      </label>
                      <Input
                        type="date"
                        name="childBirthDate"
                        value={formData.childBirthDate}
                        onChange={handleChange}
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Jenis Kelamin *
                      </label>
                      <Select
                        value={formData.childGender}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                          <SelectItem value="Perempuan">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-emerald-900">
                    Data Orang Tua/Wali
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nama Orang Tua/Wali *
                    </label>
                    <Input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Masukkan nama orang tua atau wali"
                      required
                      className="border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        No. HP *
                      </label>
                      <Input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        placeholder="Contoh: 081234567890"
                        required
                        className="border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleChange}
                        placeholder="Contoh: nama@email.com"
                        required
                        className="border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Alamat Lengkap *
                    </label>
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Masukkan alamat lengkap"
                      required
                      className="border-slate-300 min-h-24"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Catatan Tambahan
                  </label>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Tuliskan informasi tambahan atau pertanyaan (opsional)"
                    className="border-slate-300 min-h-20"
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-200">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? "Mengirim..." : "Daftar Sekarang"}
                  </Button>
                </div>

                <p className="text-xs text-slate-600 text-center">
                  * Kolom yang bertanda wajib diisi
                </p>
              </form>
            </Card>
          </div>

          {/* Admission Info */}
          <Card className="p-8 bg-gradient-to-r from-emerald-600 to-cyan-600 border-0 text-white">
            <p className="text-lg font-semibold mb-4">Informasi Pendaftaran</p>
            <p className="text-xl font-bold mb-6">{program.admission}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#ppdb" className="flex-1">
                <Button className="w-full bg-white text-emerald-600 hover:bg-slate-100 font-bold">
                  Lihat Program Lain
                </Button>
              </Link>
              <Link href="/#contact" className="flex-1">
                <Button className="w-full bg-yellow-400 text-emerald-900 hover:bg-yellow-500 font-bold">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
