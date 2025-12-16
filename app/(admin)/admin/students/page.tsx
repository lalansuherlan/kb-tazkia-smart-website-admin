"use client";

import { useState, useEffect } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import { ImageUpload } from "@/components/ui/image-upload"; // Pastikan path ini benar
import {
  Loader2,
  Search,
  GraduationCap,
  Edit,
  Trash2,
  Filter,
  Save,
  User,
} from "lucide-react";

interface Student {
  id: number;
  nis: string;
  full_name: string;
  gender: string;
  class_name: string;
  program_name: string;
  parent_name: string;
  parent_phone: string;
  academic_year: string;
  teacher_id: number | null;
  teacher_name: string | null;
  status: "active" | "graduated" | "moved" | "dropped_out";
  photo_url: string | null; // Pastikan ada kolom ini
}

interface Teacher {
  id: number;
  name: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("active");

  // State Modal Edit
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [editForm, setEditForm] = useState({
    full_name: "",
    nis: "",
    class_name: "",
    academic_year: "",
    teacher_id: "",
    status: "",
    photo_url: "", // Field baru untuk Foto URL
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TAMBAHKAN { cache: "no-store" } AGAR DATA SELALU FRESH
      const [resStudents, resTeachers] = await Promise.all([
        fetch("/api/admin/students", { cache: "no-store" }),
        fetch("/api/admin/teachers/list", { cache: "no-store" }),
      ]);

      if (resStudents.ok) setStudents(await resStudents.json());
      if (resTeachers.ok) setTeachers(await resTeachers.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setEditForm({
      full_name: student.full_name,
      nis: student.nis,
      class_name: student.class_name,
      academic_year:
        student.academic_year || process.env.NEXT_PUBLIC_ACADEMIC_YEAR || "",
      teacher_id: student.teacher_id ? student.teacher_id.toString() : "",
      status: student.status,
      photo_url: student.photo_url || "", // Load URL foto dari DB
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    // 1. CEK DULU DI CONSOLE BROWSER: APAKAH URL FOTO SUDAH MASUK?
    console.log("=== MENGIRIM DATA UPDATE ===");
    console.log("ID Siswa:", editingStudent.id);
    console.log("Data Form:", editForm); // <--- Cek di Inspect Element -> Console

    try {
      const res = await fetch(`/api/admin/students/${editingStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        alert("Data siswa berhasil diperbarui!");
        setShowModal(false);

        // 2. REFRESH DATA DENGAN { cache: "no-store" }
        console.log("=== REFRESHING DATA ===");
        const refresh = await fetch("/api/admin/students", {
          cache: "no-store",
        });

        if (refresh.ok) {
          const newData = await refresh.json();
          setStudents(newData);
          console.log("Data Baru Terambil:", newData.length, "Siswa");
        }
      } else {
        // Jika Server menolak
        const errorData = await res.json();
        alert("Gagal update: " + JSON.stringify(errorData));
        console.error("Server Error:", errorData);
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
      console.error(error);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" ? true : s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-bold border border-emerald-200">
            Aktif
          </span>
        );
      case "graduated":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold border border-blue-200">
            Lulus
          </span>
        );
      case "moved":
        return (
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold border border-orange-200">
            Pindah
          </span>
        );
      case "dropped_out":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold border border-red-200">
            Keluar/DO
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <AdminLayoutWrapper>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Siswa</h1>
            <p className="text-gray-600">Manajemen siswa aktif dan alumni</p>
          </div>
          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-blue-100">
            <GraduationCap size={20} /> Total Data: {students.length}
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 shadow-sm">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari Nama atau NIS..."
              className="flex-1 outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none bg-white font-medium text-gray-700"
            >
              <option value="active">🟢 Siswa Aktif</option>
              <option value="graduated">🎓 Lulus / Alumni</option>
              <option value="moved">🚚 Pindah Sekolah</option>
              <option value="dropped_out">❌ Keluar</option>
              <option value="all">📂 Tampilkan Semua</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b font-medium text-gray-600">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">NIS</th>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">Kelas & Wali</th>
                  <th className="px-6 py-4">Wali Murid</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <Loader2 className="animate-spin inline text-emerald-500" />
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-gray-400 italic"
                    >
                      Data tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {getStatusBadge(student.status)}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-500">
                        {student.nis}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Tampilkan Thumbnail Foto di Tabel (Optional) */}
                          {student.photo_url ? (
                            <img
                              src={student.photo_url}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                              No
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-800">
                              {student.full_name}
                            </div>
                            <div className="text-xs text-gray-400 font-normal">
                              {student.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium inline-block mb-1">
                          {student.class_name}
                        </div>
                        {student.teacher_name && (
                          <div className="text-xs text-blue-600 flex items-center gap-1">
                            <User size={12} /> {student.teacher_name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>{student.parent_name}</div>
                        <div className="text-xs text-emerald-600">
                          {student.parent_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                Update Data Siswa
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                {/* --- BAGIAN UPLOAD FOTO (Komponen Baru) --- */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Foto Siswa
                  </label>
                  <ImageUpload
                    label="Upload Foto"
                    value={editForm.photo_url}
                    onChange={(url) =>
                      setEditForm({ ...editForm, photo_url: url })
                    }
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    *Disarankan rasio foto 1:1 (Kotak) atau 3:4
                  </p>
                </div>
                {/* ------------------------------------------- */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    value={editForm.full_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, full_name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIS
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2 bg-gray-50"
                      value={editForm.nis}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nis: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tahun Ajaran
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2"
                      value={editForm.academic_year}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          academic_year: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kelas
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2"
                      value={editForm.class_name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, class_name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-emerald-800 mb-1">
                      Wali Kelas
                    </label>
                    <select
                      className="w-full border border-emerald-300 rounded-lg p-2 bg-emerald-50"
                      value={editForm.teacher_id}
                      onChange={(e) =>
                        setEditForm({ ...editForm, teacher_id: e.target.value })
                      }
                    >
                      <option value="">-- Pilih --</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <label className="block text-sm font-bold text-yellow-800 mb-2">
                    Status Siswa
                  </label>
                  <select
                    className="w-full border border-yellow-300 rounded-lg p-2 outline-none"
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                  >
                    <option value="active">🟢 Masih Aktif</option>
                    <option value="graduated">🎓 Lulus (Alumni)</option>
                    <option value="moved">🚚 Pindah Sekolah</option>
                    <option value="dropped_out">❌ Keluar (DO)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Simpan
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
