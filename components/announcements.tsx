"use client";

import { useEffect, useState } from "react";
import { CalendarDays, BellRing, ArrowRight, X, Clock } from "lucide-react";

interface AnnouncementItem {
  id: number;
  title: string;
  // ✅ Update tipe data agar fleksibel
  type: "event" | "Event" | "announcement" | "Announcement" | string;
  content: string;
  event_date: string | null;
}

export function Announcements() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<AnnouncementItem | null>(
    null
  );

  // 1. Fetch Data
  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // 2. EVENT LISTENER (Global Bus)
  useEffect(() => {
    const handleOpenAgenda = (event: CustomEvent) => {
      const agendaId = event.detail;
      const target = items.find((i) => i.id === agendaId);
      if (target) {
        setSelectedItem(target);
      }
    };

    window.addEventListener("OPEN_AGENDA_MODAL" as any, handleOpenAgenda);
    return () => {
      window.removeEventListener("OPEN_AGENDA_MODAL" as any, handleOpenAgenda);
    };
  }, [items]);

  // Tutup dengan ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      id="announcements"
      className="w-full py-16 bg-slate-50 border-y border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white p-2.5 rounded-xl shadow-sm text-emerald-600 border border-emerald-100">
            <BellRing size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Papan Informasi
            </h2>
            <p className="text-slate-500 text-sm">
              Update terbaru seputar kegiatan sekolah
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            // ✅ PERBAIKAN LOGIKA PENGECEKAN (Aman dari huruf besar/kecil)
            const isEvent = item.type.toLowerCase() === "event";

            const cardStyle = isEvent
              ? "bg-blue-50/50 border-blue-100 hover:border-blue-300 hover:shadow-blue-100"
              : "bg-amber-50/50 border-amber-100 hover:border-amber-300 hover:shadow-amber-100";
            const iconStyle = isEvent
              ? "bg-blue-100 text-blue-600"
              : "bg-amber-100 text-amber-600";

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`group cursor-pointer flex flex-col border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden ${cardStyle}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase ${iconStyle}`}
                  >
                    {isEvent ? (
                      <CalendarDays size={14} />
                    ) : (
                      <BellRing size={14} />
                    )}
                    {isEvent ? "Agenda" : "Info"}
                  </div>
                  {isEvent && item.event_date && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white/80 px-2 py-1 rounded-md shadow-sm">
                      <Clock size={12} />
                      {new Date(item.event_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/50 flex justify-between items-center text-xs font-semibold text-slate-400 group-hover:text-emerald-600 transition-colors">
                  <span>Baca selengkapnya</span>
                  <ArrowRight
                    size={16}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MODAL POPUP --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative max-h-[90vh] flex flex-col">
            {/* Header Modal - Gunakan toLowerCase() untuk styling */}
            <div
              className={`px-6 py-4 flex justify-between items-center border-b flex-shrink-0 ${
                selectedItem.type.toLowerCase() === "event"
                  ? "bg-blue-50 border-blue-100"
                  : "bg-amber-50 border-amber-100"
              }`}
            >
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  selectedItem.type.toLowerCase() === "event"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {selectedItem.type.toLowerCase() === "event" ? (
                  <CalendarDays size={14} />
                ) : (
                  <BellRing size={14} />
                )}
                {selectedItem.type.toLowerCase() === "event"
                  ? "Agenda Kegiatan"
                  : "Pengumuman Sekolah"}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto">
              <h3 className="text-2xl font-bold text-slate-800 mb-4 leading-tight">
                {selectedItem.title}
              </h3>
              {selectedItem.type.toLowerCase() === "event" &&
                selectedItem.event_date && (
                  <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600 border border-blue-100 text-center min-w-[60px]">
                      <span className="block text-xs font-bold uppercase">
                        {new Date(selectedItem.event_date).toLocaleDateString(
                          "id-ID",
                          { month: "short" }
                        )}
                      </span>
                      <span className="block text-2xl font-bold">
                        {new Date(selectedItem.event_date).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        Waktu Pelaksanaan
                      </p>
                      <p className="text-slate-700 font-medium">
                        {new Date(selectedItem.event_date).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {selectedItem.content}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
