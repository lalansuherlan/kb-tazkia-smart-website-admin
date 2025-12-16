"use client";

import { useState, useEffect } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

export default function PPDBProgramsAdmin() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Initial Form State (Struktur data lengkap)
  const initialForm = {
    id: 0,
    name: "",
    age_range: "",
    emoji: "🎓",
    color_class: "from-blue-200 to-cyan-200",
    order_index: 0,
    short_desc: "",
    full_desc: "",
    admission: "Pendaftaran dibuka Januari - Juni",
    // Data JSON (Array/Object)
    objectives: [] as string[],
    facilities: [] as string[],
    requirements: [] as string[],
    benefits: [] as string[],
    curriculum: { title: "Kurikulum", items: [] as string[] },
    schedule: { regular: "", fullday: "", entrance: "", pickup: "" },
    costs: { registration: "", monthly: "", yearly: "", additional: "" },
  };

  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState("basic"); // basic, details, list

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const res = await fetch("/api/admin/ppdb-categories");
    if (res.ok) {
      const data = await res.json();
      // Parsing JSON string dari DB ke Object agar bisa diedit
      const parsedData = data.map((item: any) => ({
        ...item,
        objectives: safeJSON(item.objectives, []),
        facilities: safeJSON(item.facilities, []),
        requirements: safeJSON(item.requirements, []),
        benefits: safeJSON(item.benefits, []),
        curriculum: safeJSON(item.curriculum, { title: "", items: [] }),
        schedule: safeJSON(item.schedule, {}),
        costs: safeJSON(item.costs, {}),
      }));
      setPrograms(parsedData);
    }
    setLoading(false);
  };

  const safeJSON = (data: string, fallback: any) => {
    try {
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Simpan data program ini?")) return;

    const url = isEditing
      ? `/api/admin/ppdb-categories/${form.id}`
      : "/api/admin/ppdb-categories";
    const method = isEditing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setShowModal(false);
    fetchPrograms();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus program ini?")) return;
    await fetch(`/api/admin/ppdb-categories/${id}`, { method: "DELETE" });
    fetchPrograms();
  };

  // Helper untuk update array (Separated by enter/newline for simplicity in textarea)
  const handleArrayChange = (field: string, value: string) => {
    const array = value.split("\n").filter((line) => line.trim() !== "");
    setForm({ ...form, [field]: array });
  };

  // Helper untuk update object nested (costs, schedule)
  const handleNestedChange = (parent: string, key: string, value: string) => {
    setForm({ ...form, [parent]: { ...(form as any)[parent], [key]: value } });
  };

  const openModal = (program?: any) => {
    if (program) {
      setForm(program);
      setIsEditing(true);
    } else {
      setForm(initialForm);
      setIsEditing(false);
    }
    setActiveTab("basic");
    setShowModal(true);
  };

  return (
    <AdminLayoutWrapper>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Program Sekolah
          </h1>
          <button
            onClick={() => openModal()}
            className="bg-emerald-600 text-white px-4 py-2 rounded flex gap-2 items-center hover:bg-emerald-700"
          >
            <Plus size={18} /> Tambah Program
          </button>
        </div>

        {/* LIST PROGRAM */}
        <div className="grid grid-cols-1 gap-4">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{prog.emoji}</span>
                <div>
                  <h3 className="font-bold text-lg text-emerald-900">
                    {prog.name}
                  </h3>
                  <p className="text-sm text-gray-500">{prog.age_range}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(prog)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(prog.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL FORM */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-xl flex flex-col overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="font-bold text-lg">
                  {isEditing ? "Edit Program" : "Tambah Program"}
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* TABS HEADER */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`flex-1 p-3 text-sm font-medium ${
                    activeTab === "basic"
                      ? "border-b-2 border-emerald-500 text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  Info Dasar
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 p-3 text-sm font-medium ${
                    activeTab === "details"
                      ? "border-b-2 border-emerald-500 text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  Detail & Fasilitas
                </button>
                <button
                  onClick={() => setActiveTab("costs")}
                  className={`flex-1 p-3 text-sm font-medium ${
                    activeTab === "costs"
                      ? "border-b-2 border-emerald-500 text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  Biaya & Jadwal
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {/* TAB 1: BASIC INFO */}
                {activeTab === "basic" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nama Program
                        </label>
                        <input
                          type="text"
                          className="w-full border p-2 rounded"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Rentang Usia
                        </label>
                        <input
                          type="text"
                          className="w-full border p-2 rounded"
                          value={form.age_range}
                          onChange={(e) =>
                            setForm({ ...form, age_range: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Emoji Icon
                        </label>
                        <input
                          type="text"
                          className="w-full border p-2 rounded"
                          value={form.emoji}
                          onChange={(e) =>
                            setForm({ ...form, emoji: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Urutan
                        </label>
                        <input
                          type="number"
                          className="w-full border p-2 rounded"
                          value={form.order_index}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              order_index: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Deskripsi Singkat
                      </label>
                      <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={form.short_desc}
                        onChange={(e) =>
                          setForm({ ...form, short_desc: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Deskripsi Lengkap
                      </label>
                      <textarea
                        className="w-full border p-2 rounded h-24"
                        value={form.full_desc}
                        onChange={(e) =>
                          setForm({ ...form, full_desc: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: DETAILS (ARRAY LISTS) */}
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <p className="text-xs text-orange-500 mb-2">
                      *Pisahkan setiap poin dengan baris baru (Enter)
                    </p>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tujuan Pembelajaran (Objectives)
                      </label>
                      <textarea
                        className="w-full border p-2 rounded h-24"
                        value={form.objectives.join("\n")}
                        onChange={(e) =>
                          handleArrayChange("objectives", e.target.value)
                        }
                        placeholder="Contoh:&#10;Melatih motorik&#10;Mengenal huruf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Fasilitas
                      </label>
                      <textarea
                        className="w-full border p-2 rounded h-24"
                        value={form.facilities.join("\n")}
                        onChange={(e) =>
                          handleArrayChange("facilities", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Item Kurikulum
                      </label>
                      <textarea
                        className="w-full border p-2 rounded h-24"
                        value={form.curriculum.items.join("\n")}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            curriculum: {
                              ...form.curriculum,
                              items: e.target.value
                                .split("\n")
                                .filter((x) => x),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: COSTS & SCHEDULE */}
                {activeTab === "costs" && (
                  <div className="space-y-6">
                    {/* BIAYA */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-bold text-blue-800 mb-3">
                        Rincian Biaya
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Pendaftaran
                          </label>
                          <input
                            type="text"
                            className="w-full border p-2 rounded bg-white"
                            value={form.costs.registration}
                            onChange={(e) =>
                              handleNestedChange(
                                "costs",
                                "registration",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Bulanan
                          </label>
                          <input
                            type="text"
                            className="w-full border p-2 rounded bg-white"
                            value={form.costs.monthly}
                            onChange={(e) =>
                              handleNestedChange(
                                "costs",
                                "monthly",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Tahunan
                          </label>
                          <input
                            type="text"
                            className="w-full border p-2 rounded bg-white"
                            value={form.costs.yearly}
                            onChange={(e) =>
                              handleNestedChange(
                                "costs",
                                "yearly",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Catatan Tambahan
                          </label>
                          <input
                            type="text"
                            className="w-full border p-2 rounded bg-white"
                            value={form.costs.additional}
                            onChange={(e) =>
                              handleNestedChange(
                                "costs",
                                "additional",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* JADWAL */}
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h3 className="font-bold text-orange-800 mb-3">
                        Jadwal Sekolah
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Jam Masuk
                          </label>
                          <input
                            type="text"
                            className="w-full border p-2 rounded bg-white"
                            value={form.schedule.entrance}
                            onChange={(e) =>
                              handleNestedChange(
                                "schedule",
                                "entrance",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Jadwal Reguler
                          </label>
                          <input
                            type="text"
                            className="w-full border p-2 rounded bg-white"
                            value={form.schedule.regular}
                            onChange={(e) =>
                              handleNestedChange(
                                "schedule",
                                "regular",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Jadwal Full Day
                          </label>
                          <input
                            type="text"
                            className="w-full border p-2 rounded bg-white"
                            value={form.schedule.fullday}
                            onChange={(e) =>
                              handleNestedChange(
                                "schedule",
                                "fullday",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Simpan Program
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
