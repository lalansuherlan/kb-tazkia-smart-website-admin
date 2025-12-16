"use client";

import { useState, useEffect } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import { Mail, Trash2, Search, User, Phone, MessageCircle } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) setMessages(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pesan ini?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    fetchMessages();
  };

  // Helper untuk membuka WhatsApp Web
  const handleReplyWA = (phone: string, name: string) => {
    // Bersihkan nomor (ganti 08.. jadi 628..)
    let cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.substring(1);
    }
    const url = `https://wa.me/${cleanPhone}?text=Halo Bapak/Ibu ${name}, kami dari KB Tazkia Smart menanggapi pesan Anda...`;
    window.open(url, "_blank");
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayoutWrapper>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Kotak Masuk (Inbox)
          </h1>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
            {messages.length} Pesan
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border mb-6 flex items-center gap-2 shadow-sm">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari pengirim atau subjek..."
            className="flex-1 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{msg.name}</h3>
                    <div className="flex flex-col text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={12} /> {msg.email}
                      </span>
                      {msg.phone && (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <Phone size={12} /> {msg.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded">
                  {new Date(msg.created_at).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>

              <div className="ml-0 md:ml-16">
                <h4 className="font-bold text-lg text-emerald-900 mb-2 border-b pb-2 border-gray-100">
                  {msg.subject}
                </h4>
                <p className="text-gray-700 text-sm whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
                  {msg.message}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-100">
                {/* Tombol Reply WA */}
                {msg.phone && (
                  <button
                    onClick={() => handleReplyWA(msg.phone, msg.name)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageCircle size={16} /> Balas via WA
                  </button>
                )}

                {/* Tombol Reply Email */}
                <a
                  href={`mailto:${msg.email}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Mail size={16} /> Balas Email
                </a>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <Mail size={48} className="mx-auto mb-2 opacity-20" />
              <p>Belum ada pesan masuk.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
