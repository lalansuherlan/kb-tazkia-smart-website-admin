"use client";

import { useEffect, useState } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  MessageSquare,
  Heart,
} from "lucide-react";

interface Feedback {
  id: number;
  name: string;
  role: string;
  message: string;
  type: "testimonial" | "suggestion";
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function FeedbackPage() {
  const [data, setData] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"testimonial" | "suggestion">(
    "testimonial"
  );

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await fetch("/api/admin/feedback", { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchFeedback(); // Refresh
    } catch (e) {
      alert("Gagal update");
    }
  };

  const deleteFeedback = async (id: number) => {
    if (!confirm("Hapus data ini?")) return;
    try {
      await fetch(`/api/admin/feedback/${id}`, { method: "DELETE" });
      fetchFeedback();
    } catch (e) {
      alert("Gagal hapus");
    }
  };

  // Filter tampilan sesuai Tab yang dipilih
  const filteredData = data.filter((item) => item.type === filter);

  return (
    <AdminLayoutWrapper>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Suara Orang Tua
        </h1>
        <p className="text-gray-600 mb-8">Kelola testimoni dan kotak saran.</p>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setFilter("testimonial")}
            className={`pb-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-colors ${
              filter === "testimonial"
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-gray-400"
            }`}
          >
            <Heart size={18} /> Testimoni
          </button>
          <button
            onClick={() => setFilter("suggestion")}
            className={`pb-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-colors ${
              filter === "suggestion"
                ? "border-blue-500 text-blue-700"
                : "border-transparent text-gray-400"
            }`}
          >
            <MessageSquare size={18} /> Kotak Saran
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin inline text-emerald-500" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-300">
            Belum ada data masuk.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-6 shadow-sm relative ${
                  item.status === "pending"
                    ? "border-amber-300 ring-2 ring-amber-100"
                    : "border-gray-200"
                }`}
              >
                {/* Badge Status */}
                <div className="absolute top-4 right-4">
                  {item.status === "pending" && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                      Menunggu
                    </span>
                  )}
                  {item.status === "approved" && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                      Tayang
                    </span>
                  )}
                  {item.status === "rejected" && (
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                      Ditolak
                    </span>
                  )}
                </div>

                {/* Rating Bintang */}
                {item.type === "testimonial" && (
                  <div className="flex gap-1 mb-3 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < item.rating ? "currentColor" : "none"}
                        className={i < item.rating ? "" : "text-gray-300"}
                      />
                    ))}
                  </div>
                )}

                <p className="text-gray-700 italic mb-4 line-clamp-4">
                  "{item.message}"
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center font-bold text-gray-500">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  {/* Tombol Aksi */}
                  {item.status !== "approved" && (
                    <button
                      onClick={() => updateStatus(item.id, "approved")}
                      className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 flex items-center justify-center gap-1 text-xs font-bold"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}

                  {item.status === "pending" && (
                    <button
                      onClick={() => updateStatus(item.id, "rejected")}
                      className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-1 text-xs font-bold"
                    >
                      <XCircle size={14} /> Tolak
                    </button>
                  )}

                  <button
                    onClick={() => deleteFeedback(item.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Permanen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
