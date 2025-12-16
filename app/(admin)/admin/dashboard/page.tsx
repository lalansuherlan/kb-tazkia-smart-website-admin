"use client";

import { useEffect, useState } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import {
  Users,
  UserPlus,
  MessageSquare,
  GraduationCap,
  ArrowRight,
  Clock,
  Activity,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  ppdb: { total: number; pending: number; approved: number };
  students: number;
  messages: number;
  recentActivities: {
    title: string;
    action: string;
    type: string;
    created_at: string;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard-stats")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <AdminLayoutWrapper>
      <div>
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Selamat datang kembali, Admin! Berikut ringkasan aktivitas sekolah
            hari ini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Siswa Aktif"
            value={data?.students || 0}
            icon={<GraduationCap size={24} />}
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            loading={loading}
          />
          <StatCard
            title="Pendaftar Baru"
            value={data?.ppdb.pending || 0}
            label="Menunggu Verifikasi"
            icon={<UserPlus size={24} />}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            loading={loading}
          />
          <StatCard
            title="Total Pendaftar"
            value={data?.ppdb.total || 0}
            icon={<FileText size={24} />}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            loading={loading}
          />
          <StatCard
            title="Pesan Masuk"
            value={data?.messages || 0}
            icon={<MessageSquare size={24} />}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions (Kiri - Lebar 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-emerald-600" /> Aksi Cepat
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ActionBtn
                  href="/admin/ppdb"
                  icon="📝"
                  label="Verifikasi PPDB"
                  desc="Cek pendaftar baru"
                  color="bg-blue-50 text-blue-700 hover:bg-blue-100"
                />
                <ActionBtn
                  href="/admin/students"
                  icon="🎓"
                  label="Data Siswa"
                  desc="Lihat database siswa"
                  color="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                />
                <ActionBtn
                  href="/admin/messages"
                  icon="📬"
                  label="Cek Pesan"
                  desc="Balas pertanyaan ortu"
                  color="bg-orange-50 text-orange-700 hover:bg-orange-100"
                />
                <ActionBtn
                  href="/admin/ppdb-programs"
                  icon="🎒"
                  label="Edit Program"
                  desc="Ubah biaya & kurikulum"
                  color="bg-purple-50 text-purple-700 hover:bg-purple-100"
                />
                <ActionBtn
                  href="/admin/content"
                  icon="🖼️"
                  label="Update Galeri"
                  desc="Upload foto kegiatan"
                  color="bg-pink-50 text-pink-700 hover:bg-pink-100"
                />
                <ActionBtn
                  href="/admin/landing-editor"
                  icon="🏠"
                  label="Edit Beranda"
                  desc="Ubah teks depan"
                  color="bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                />
              </div>
            </div>

            {/* Banner Info */}
            <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">
                  Musim PPDB Telah Dibuka!
                </h3>
                <p className="text-emerald-50 text-sm mb-4 max-w-lg">
                  Pastikan data biaya dan jadwal program sudah diperbarui agar
                  orang tua mendapatkan informasi yang tepat.
                </p>
                <Link
                  href="/admin/ppdb-programs"
                  className="inline-block bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-50 transition-colors"
                >
                  Cek Data Program &rarr;
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 text-9xl transform translate-y-4 translate-x-4">
                🏫
              </div>
            </div>
          </div>

          {/* Recent Activity (Kanan - Lebar 1/3) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-emerald-600" /> Aktivitas Terbaru
            </h2>

            <div className="flex-1 space-y-6">
              {loading ? (
                <p className="text-gray-400 text-sm italic">
                  Memuat aktivitas...
                </p>
              ) : data?.recentActivities.length === 0 ? (
                <p className="text-gray-400 text-sm italic">
                  Belum ada aktivitas.
                </p>
              ) : (
                data?.recentActivities.map((act, i) => (
                  <div
                    key={i}
                    className="flex gap-3 relative pl-4 border-l-2 border-gray-100 last:border-0 pb-4"
                  >
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${
                        act.type === "ppdb" ? "bg-blue-400" : "bg-orange-400"
                      }`}
                    ></div>

                    <div>
                      <p className="text-sm text-gray-800">
                        <span className="font-bold">{act.title}</span>{" "}
                        {act.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(act.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <Link
                href="/admin/ppdb"
                className="text-sm text-emerald-600 font-medium hover:underline"
              >
                Lihat Semua Aktivitas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}

// Komponen Kecil untuk Card
function StatCard({ title, value, label, icon, color, loading }: any) {
  return (
    <div
      className={`rounded-xl p-5 text-white shadow-lg shadow-gray-200 ${color} relative overflow-hidden`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
        </div>
        <h3 className="text-3xl font-bold mb-1">{loading ? "..." : value}</h3>
        {label && (
          <p className="text-xs text-white/70 bg-black/10 inline-block px-2 py-0.5 rounded">
            {label}
          </p>
        )}
      </div>
      {/* Dekorasi Background */}
      <div className="absolute -right-4 -bottom-4 opacity-20 text-6xl transform rotate-12">
        {icon}
      </div>
    </div>
  );
}

function ActionBtn({ href, icon, label, desc, color }: any) {
  return (
    <Link
      href={href}
      className={`block p-4 rounded-xl transition-all hover:scale-[1.02] ${color}`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-bold text-sm mb-0.5">{label}</h4>
      <p className="text-xs opacity-70">{desc}</p>
    </Link>
  );
}
