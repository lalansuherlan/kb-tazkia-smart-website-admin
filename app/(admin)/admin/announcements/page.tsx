"use client";

import { useState, useEffect } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import {
  Loader2,
  Plus,
  Calendar,
  Megaphone,
  Trash2,
  Pencil,
  X,
} from "lucide-react";

export default function AnnouncementsAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const initialForm = {
    id: 0,
    title: "",
    type: "announcement",
    content: "",
    event_date: "",
    is_active: true,
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("/api/admin/announcements");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing
      ? `/api/admin/announcements/${form.id}`
      : "/api/admin/announcements";
    const method = isEditing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setShowModal(false);
    fetchItems();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus item ini?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const openModal = (item?: any) => {
    if (item) {
      setForm({
        ...item,
        event_date: item.event_date
          ? new Date(item.event_date).toISOString().split("T")[0]
          : "",
        is_active: Boolean(item.is_active),
      });
      setIsEditing(true);
    } else {
      setForm(initialForm);
      setIsEditing(false);
    }
    setShowModal(true);
  };

  return (
    <AdminLayoutWrapper>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Pengumuman & Agenda
          </h1>
          <button
            onClick={() => openModal()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex gap-2 hover:bg-emerald-700"
          >
            <Plus size={20} /> Tambah Baru
          </button>
        </div>

        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
            >
              <div className="flex gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    item.type === "event"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {item.type === "event" ? (
                    <Calendar size={24} />
                  ) : (
                    <Megaphone size={24} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-800">
                      {item.title}
                    </h3>
                    {!item.is_active && (
                      <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded">
                        Non-aktif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {item.content}
                  </p>
                  {item.type === "event" && item.event_date && (
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      📅{" "}
                      {new Date(item.event_date).toLocaleDateString("id-ID", {
                        dateStyle: "full",
                      })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 self-end md:self-center">
                <button
                  onClick={() => openModal(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isEditing ? "Edit Info" : "Tambah Info"}
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Judul
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border rounded p-2"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tipe
                    </label>
                    <select
                      className="w-full border rounded p-2"
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                    >
                      <option value="announcement">Pengumuman 📢</option>
                      <option value="event">Agenda/Event 📅</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      className="w-full border rounded p-2"
                      value={form.is_active ? "1" : "0"}
                      onChange={(e) =>
                        setForm({ ...form, is_active: e.target.value === "1" })
                      }
                    >
                      <option value="1">Aktif</option>
                      <option value="0">Sembunyikan</option>
                    </select>
                  </div>
                </div>

                {form.type === "event" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tanggal Acara
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full border rounded p-2"
                      value={form.event_date}
                      onChange={(e) =>
                        setForm({ ...form, event_date: e.target.value })
                      }
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Isi Konten
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full border rounded p-2"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 font-medium"
                >
                  Simpan
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
