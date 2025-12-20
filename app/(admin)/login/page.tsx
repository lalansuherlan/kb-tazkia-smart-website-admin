"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      // Simpan info user untuk UI client-side (opsional tapi bagus untuk 'Hello, User')
      localStorage.setItem("user", JSON.stringify(data.user));

      // PENTING: Refresh router agar Server Components sadar ada cookie baru
      router.refresh();

      // Redirect ke dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error(err);
    } finally {
      // Jangan set loading false jika sukses, agar user tidak melihat form lagi saat redirect
      // Pindahkan setLoading(false) hanya jika error
      if (error) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 text-6xl opacity-20 animate-pulse">
        🌻
      </div>
      <div className="absolute bottom-10 left-10 text-6xl opacity-20 animate-pulse">
        🦋
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-emerald-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎓</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              KB Tazkia Smart
            </h1>
            <p className="text-gray-600 text-sm">Admin Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kbtazkia.id"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              {loading ? "Sedang Login..." : "Masuk ke Dashboard"}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs text-gray-600 mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="text-xs text-gray-600">
              Email:{" "}
              <code className="bg-white px-2 py-1 rounded">
                admin@kbtazkia.id
              </code>
            </p>
            <p className="text-xs text-gray-600">
              Password:{" "}
              <code className="bg-white px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
          >
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
