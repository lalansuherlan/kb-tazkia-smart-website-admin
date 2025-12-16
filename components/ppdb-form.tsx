"use client";

import type React from "react";

import { useState } from "react";
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
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface PPDBFormProps {
  programId: number;
  programName: string;
}

export function PPDBForm({ programId, programName }: PPDBFormProps) {
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

    try {
      const response = await fetch("/api/ppdb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          program_id: programId,
          program_name: programName,
          child_name: formData.childName,
          child_birth_date: formData.childBirthDate,
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

  return (
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
        {/* Program Info */}
        <div className="p-4 bg-white rounded-lg border border-emerald-200">
          <p className="text-sm text-slate-600">Program yang dipilih</p>
          <p className="text-lg font-bold text-emerald-900">{programName}</p>
        </div>

        {/* Child Information */}
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

        {/* Parent Information */}
        <div className="space-y-4">
          <h3 className="font-bold text-emerald-900">Data Orang Tua/Wali</h3>

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

        {/* Additional Info */}
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

        {/* Submit Button */}
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
  );
}
