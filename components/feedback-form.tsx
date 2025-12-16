"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Star } from "lucide-react";

export function FeedbackForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "Wali Murid",
    message: "",
    type: "testimonial",
    rating: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/public/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({
          name: "",
          role: "Wali Murid",
          message: "",
          type: "testimonial",
          rating: 5,
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert("Gagal mengirim masukan.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-10 animate-in fade-in">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold text-blue-800">Terima Kasih!</h3>
        <p className="text-gray-600">
          Masukan Anda sangat berarti bagi perkembangan sekolah kami.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline">
          Kirim Lagi
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in slide-in-from-bottom-2"
    >
      {/* Pilihan Tipe */}
      <div className="flex p-1 bg-white border-2 border-cyan-100 rounded-lg">
        <button
          type="button"
          onClick={() => setForm({ ...form, type: "testimonial" })}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
            form.type === "testimonial"
              ? "bg-emerald-100 text-emerald-700"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Testimoni
        </button>
        <button
          type="button"
          onClick={() => setForm({ ...form, type: "suggestion" })}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
            form.type === "suggestion"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Saran / Masukan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-emerald-900 mb-2">
            Nama Lengkap
          </label>
          <input
            required
            type="text"
            placeholder="Nama Anda"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-emerald-900 mb-2">
            Sebagai
          </label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option>Ayah</option>
            <option>Ibu</option>
            <option>Wali Murid</option>
            <option>Alumni</option>
            <option>Lainnya</option>
          </select>
        </div>
      </div>

      {form.type === "testimonial" && (
        <div>
          <label className="block text-sm font-bold text-emerald-900 mb-2 text-center">
            Berikan Rating
          </label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={32}
                  fill={star <= form.rating ? "#FACC15" : "none"}
                  className={
                    star <= form.rating ? "text-yellow-400" : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-emerald-900 mb-2">
          {form.type === "testimonial" ? "Pengalaman Anda" : "Saran / Masukan"}
        </label>
        <textarea
          required
          rows={5}
          placeholder={
            form.type === "testimonial"
              ? "Ceritakan pengalaman menarik Anda..."
              : "Tuliskan saran Anda untuk sekolah..."
          }
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg py-6 shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" /> Mengirim...
          </>
        ) : (
          "Kirim Masukan"
        )}
      </Button>
    </form>
  );
}
