"use client";

import { useEffect, useState } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import {
  Loader2,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Save,
} from "lucide-react";

// Interface
interface PPDBApplication {
  id: number;
  child_name: string;
  child_birth_date: string;
  child_gender: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  program_name: string;
  address: string;
  notes: string;
  status: "pending" | "approved" | "rejected" | "waiting_list" | "enrolled"; // Tambah 'enrolled'
  created_at: string;
}

export default function PPDBPage() {
  const [applications, setApplications] = useState<PPDBApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // State Modal Detail
  const [selectedApp, setSelectedApp] = useState<PPDBApplication | null>(null);
  const [showModal, setShowModal] = useState(false);

  // State Modal Enroll (Proses Siswa)
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    nis: "",
    class_name: "",
    academic_year: process.env.NEXT_PUBLIC_ACADEMIC_YEAR || "2026/2027", // Default tahun ajaran
  });

  // Fetch Data
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/admin/ppdb");
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching PPDB data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Status PPDB
  const updateApplicationStatus = async (id: number, newStatus: string) => {
    if (!confirm(`Ubah status menjadi ${newStatus}?`)) return;

    try {
      const response = await fetch(`/api/admin/ppdb/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: newStatus as any } : app
          )
        );
        // Jika sedang buka detail, update juga state detailnya
        if (selectedApp?.id === id) {
          setSelectedApp((prev) =>
            prev ? { ...prev, status: newStatus as any } : null
          );
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Handle Proses Menjadi Siswa
  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    setEnrollLoading(true);

    try {
      const res = await fetch("/api/admin/students/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ppdb_id: selectedApp.id,
          ...enrollForm,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Berhasil! Data telah dipindahkan ke Data Siswa.");
        setShowEnrollModal(false);
        setShowModal(false);
        // Update status lokal ke 'enrolled' (atau refresh data)
        fetchApplications();
      } else {
        alert(data.error || "Gagal memproses data.");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setEnrollLoading(false);
    }
  };

  // Buka Modal Enroll dan set default value
  const openEnrollModal = () => {
    if (!selectedApp) return;
    // Auto-fill kelas berdasarkan program jika memungkinkan
    setEnrollForm({
      nis: "", // NIS kosong biar admin isi manual
      class_name: `${selectedApp.program_name} - A`, // Contoh default
      academic_year: process.env.NEXT_PUBLIC_ACADEMIC_YEAR || "2026/2027",
    });
    setShowEnrollModal(true);
  };

  // Filter Logic
  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch =
      app.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.parent_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "waiting_list":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "enrolled":
        return "bg-purple-100 text-purple-800 border-purple-200"; // Warna untuk yang sudah jadi siswa
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <AdminLayoutWrapper>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              PPDB Management
            </h1>
            <p className="text-gray-600">Verifikasi data siswa baru</p>
          </div>
          <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold">
            Total: {applications.length} Siswa
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama anak atau orang tua..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="approved">Diterima (Belum Enroll)</option>
            <option value="enrolled">Sudah Jadi Siswa</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin text-emerald-500" />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Belum ada data pendaftar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Nama Anak</th>
                    <th className="px-6 py-4">Program</th>
                    <th className="px-6 py-4">Orang Tua / HP</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {app.child_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Lahir:{" "}
                          {new Date(app.child_birth_date).toLocaleDateString(
                            "id-ID"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">
                          {app.program_name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{app.parent_name}</div>
                        <div className="text-xs text-emerald-600 font-mono">
                          {app.parent_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status === "waiting_list"
                            ? "Waitlist"
                            : app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- MODAL DETAIL --- */}
        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Detail Pendaftar
                </h2>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(
                    selectedApp.status
                  )}`}
                >
                  {selectedApp.status}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto">
                {/* ... (Konten detail sama seperti sebelumnya) ... */}
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h3 className="font-bold text-emerald-800 mb-2 border-b border-emerald-200 pb-1">
                      Data Anak
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-500">Nama:</span>{" "}
                      <span className="font-medium text-right">
                        {selectedApp.child_name}
                      </span>
                      <span className="text-gray-500">Lahir:</span>{" "}
                      <span className="font-medium text-right">
                        {new Date(
                          selectedApp.child_birth_date
                        ).toLocaleDateString("id-ID")}
                      </span>
                      <span className="text-gray-500">Gender:</span>{" "}
                      <span className="font-medium text-right">
                        {selectedApp.child_gender}
                      </span>
                      <span className="text-gray-500">Program:</span>{" "}
                      <span className="font-medium text-right">
                        {selectedApp.program_name}
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-bold text-blue-800 mb-2 border-b border-blue-200 pb-1">
                      Data Orang Tua
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-500">Nama:</span>{" "}
                      <span className="font-medium text-right">
                        {selectedApp.parent_name}
                      </span>
                      <span className="text-gray-500">HP:</span>{" "}
                      <span className="font-medium text-right">
                        {selectedApp.parent_phone}
                      </span>
                      <span className="text-gray-500">Email:</span>{" "}
                      <span className="font-medium text-right truncate">
                        {selectedApp.parent_email}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200 text-sm">
                      <span className="text-gray-500 block">Alamat:</span>{" "}
                      <span className="font-medium">{selectedApp.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer (Actions) */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
                {/* 1. Jika sudah ENROLLED, tampilkan info */}
                {selectedApp.status === "enrolled" ? (
                  <div className="p-3 bg-purple-100 text-purple-800 rounded text-center text-sm font-bold border border-purple-200">
                    ✅ Siswa ini sudah aktif di database.
                  </div>
                ) : // 2. Jika APPROVED, tampilkan tombol ENROLL
                selectedApp.status === "approved" ? (
                  <button
                    onClick={openEnrollModal}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    <GraduationCap size={18} /> Proses Menjadi Siswa Aktif
                  </button>
                ) : (
                  // 3. Jika PENDING, tampilkan pilihan Approval
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() =>
                        updateApplicationStatus(selectedApp.id, "approved")
                      }
                      className="py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={16} /> Terima
                    </button>
                    <button
                      onClick={() =>
                        updateApplicationStatus(selectedApp.id, "waiting_list")
                      }
                      className="py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <Clock size={16} /> Waitlist
                    </button>
                    <button
                      onClick={() =>
                        updateApplicationStatus(selectedApp.id, "rejected")
                      }
                      className="py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <XCircle size={16} /> Tolak
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 font-medium text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL FORM ENROLL (Proses Siswa) --- */}
        {showEnrollModal && selectedApp && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in zoom-in-95">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6 border-t-4 border-purple-500">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Proses Siswa Baru
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Lengkapi data akademik untuk{" "}
                <strong>{selectedApp.child_name}</strong>.
              </p>

              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Induk Siswa (NIS)
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.nis}
                    onChange={(e) =>
                      setEnrollForm({ ...enrollForm, nis: e.target.value })
                    }
                    placeholder="Contoh: 2025001"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kelas / Rombel
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.class_name}
                    onChange={(e) =>
                      setEnrollForm({
                        ...enrollForm,
                        class_name: e.target.value,
                      })
                    }
                    placeholder="Contoh: TK A - Matahari"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollForm.academic_year}
                    onChange={(e) =>
                      setEnrollForm({
                        ...enrollForm,
                        academic_year: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEnrollModal(false)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={enrollLoading}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex justify-center items-center gap-2"
                  >
                    {enrollLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    Simpan Data Siswa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
