import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-emerald-50 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-20 left-10 text-8xl opacity-10 animate-bounce">
        🎈
      </div>
      <div className="absolute bottom-20 right-10 text-8xl opacity-10 animate-pulse">
        🧸
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl border-2 border-emerald-100 max-w-lg relative z-10">
        <div className="text-8xl mb-4">🙈</div>

        <h1 className="text-4xl font-bold text-emerald-800 mb-2">
          Ups, Halaman Hilang!
        </h1>
        <p className="text-xl font-bold text-orange-500 mb-6">404 Not Found</p>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Sepertinya halaman yang Bunda/Ayah cari sedang bermain petak umpet
          atau memang belum dibuat. Yuk, kembali ke halaman utama saja!
        </p>

        <Link href="/">
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2 shadow-lg shadow-emerald-200 hover:shadow-xl transition-all"
          >
            <Home size={20} />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
