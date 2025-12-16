import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg border border-emerald-100">
          <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
        </div>
      </div>
      <p className="mt-4 text-emerald-800 font-medium animate-pulse">
        Memuat Halaman...
      </p>
    </div>
  );
}
