"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

export function MessageForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Pastikan path API ini sesuai dengan backend Anda
      const res = await fetch("/api/contact", {
        // Atau /api/public/messages
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert("Gagal mengirim pesan.");
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
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold text-emerald-800">Pesan Terkirim!</h3>
        <p className="text-gray-600">
          Terima kasih telah menghubungi kami. Tim kami akan segera membalas
          pesan Anda.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline">
          Kirim Pesan Lain
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in slide-in-from-bottom-2"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-bold text-emerald-900 mb-2"
        >
          Nama Lengkap
        </label>
        <input
          required
          id="name"
          type="text"
          placeholder="Masukkan nama Anda"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-emerald-900 mb-2"
          >
            Email
          </label>
          <input
            required
            id="email"
            type="email"
            placeholder="email@contoh.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-bold text-emerald-900 mb-2"
          >
            No. WhatsApp
          </label>
          <input
            required
            id="phone"
            type="tel"
            placeholder="Contoh: 081234567890"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-bold text-emerald-900 mb-2"
        >
          Subjek
        </label>
        <input
          required
          id="subject"
          type="text"
          placeholder="Contoh: Info PPDB"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-bold text-emerald-900 mb-2"
        >
          Pesan
        </label>
        <textarea
          required
          id="message"
          rows={5}
          placeholder="Tulis pesan Anda di sini..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold rounded-lg py-6 shadow-md"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" /> Mengirim...
          </>
        ) : (
          "Kirim Pesan"
        )}
      </Button>
    </form>
  );
}
