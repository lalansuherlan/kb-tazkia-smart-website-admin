"use client";

import { useEffect, useState } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import { ImageUpload } from "@/components/ui/image-upload"; // Import ImageUpload
import {
  Loader2,
  Search,
  User,
  Mail,
  Briefcase,
  Shield,
  Edit,
  Trash2,
  Save,
  Key,
} from "lucide-react";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: "admin" | "teacher" | "staff";
  created_at: string;
  photo_url: string | null; // Tambah field ini
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Update state form dengan photo_url
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "staff",
    password: "",
    photo_url: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Tambahkan no-store agar data fresh
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Mencegah reload form default

    try {
      const method = editingUser ? "PATCH" : "POST"; // Gunakan PATCH untuk update
      const url = editingUser
        ? `/api/admin/users/${editingUser.id}`
        : "/api/admin/users";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refresh data dengan no-store
        const refresh = await fetch("/api/admin/users", { cache: "no-store" });
        if (refresh.ok) setUsers(await refresh.json());

        setShowModal(false);
        resetForm();
        alert("Data user berhasil disimpan!");
      } else {
        const err = await response.json();
        alert("Gagal menyimpan: " + (err.error || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Terjadi kesalahan sistem");
    }
  };

  const deleteUser = async (id: number) => {
    if (confirm("Yakin ingin menghapus user ini?")) {
      try {
        await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      role: "staff",
      password: "",
      photo_url: "",
    });
    setEditingUser(null);
  };

  const openUserModal = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        name: user.name,
        role: user.role as any,
        password: "", // Password dikosongkan saat edit
        photo_url: user.photo_url || "", // Load foto lama
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      teacher: "bg-blue-100 text-blue-800 border-blue-200",
      staff: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Admin",
      teacher: "Guru",
      staff: "Staff",
    };
    return labels[role] || role;
  };

  return (
    <AdminLayoutWrapper>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Manajemen Pengguna
            </h1>
            <p className="text-gray-600">Kelola akun Admin, Guru, dan Staff</p>
          </div>
          <button
            onClick={() => openUserModal()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors shadow-sm flex items-center gap-2"
          >
            <User size={20} /> + Tambah User
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm flex items-center gap-4">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2
                className="animate-spin text-emerald-500 mx-auto mb-2"
                size={32}
              />
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 italic">
              Tidak ada user ditemukan
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Profil
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Role
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Bergabung Sejak
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {/* Foto Profil di Tabel */}
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-gray-300">
                            {user.photo_url ? (
                              <img
                                src={user.photo_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail size={12} /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openUserModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
                {editingUser ? "Edit User" : "Tambah User Baru"}
              </h2>

              <form onSubmit={saveUser} className="space-y-4">
                {/* --- UPLOAD FOTO --- */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Foto Profil
                  </label>
                  <ImageUpload
                    value={formData.photo_url}
                    onChange={(url) =>
                      setFormData({ ...formData, photo_url: url })
                    }
                    label="Upload Foto"
                  />
                </div>
                {/* ------------------- */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="Nama Lengkap"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="email@sekolah.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role / Jabatan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["staff", "teacher", "admin"].map((roleOpt) => (
                      <label
                        key={roleOpt}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border cursor-pointer transition-all ${
                          formData.role === roleOpt
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={roleOpt}
                          checked={formData.role === roleOpt}
                          onChange={() =>
                            setFormData({ ...formData, role: roleOpt as any })
                          }
                          className="hidden"
                        />
                        {roleOpt === "admin" && (
                          <Shield size={20} className="mb-1" />
                        )}
                        {roleOpt === "teacher" && (
                          <Briefcase size={20} className="mb-1" />
                        )}
                        {roleOpt === "staff" && (
                          <User size={20} className="mb-1" />
                        )}
                        <span className="text-xs capitalize">
                          {getRoleLabel(roleOpt)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password{" "}
                    {editingUser && (
                      <span className="text-xs text-gray-400 font-normal">
                        (Kosongkan jika tidak diubah)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder={
                        editingUser ? "******" : "Minimal 6 karakter"
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
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
