"use client";

import { ExternalLink } from "lucide-react";

// Tipe data props yang diterima dari Hero Parent
interface HeroAgendaProps {
  id: number;
  title: string;
  content: string;
  dateDay: string | number;
  dateMonth: string;
}

export function HeroAgendaCard({
  id,
  title,
  content,
  dateDay,
  dateMonth,
}: HeroAgendaProps) {
  // Fungsi Saat Diklik
  const handleClick = () => {
    // Kirim sinyal "OPEN_AGENDA_MODAL" beserta ID agenda
    const event = new CustomEvent("OPEN_AGENDA_MODAL", { detail: id });
    window.dispatchEvent(event);
  };

  return (
    <div
      onClick={handleClick}
      className="inline-flex items-center gap-4 bg-orange-50/80 border border-orange-100 p-3 pr-4 rounded-xl hover:shadow-md hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer w-full max-w-md group"
    >
      {/* Tanggal Kotak */}
      <div className="bg-white text-orange-600 font-bold px-3 py-2 rounded-lg shadow-sm text-center min-w-[60px] group-hover:scale-105 transition-transform flex-shrink-0">
        <span className="block text-xs uppercase text-slate-400">
          {dateMonth}
        </span>
        <span className="block text-xl">{dateDay}</span>
      </div>

      {/* Teks Agenda */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide mb-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
          Agenda Terdekat
        </p>
        <h4 className="font-bold text-slate-800 text-sm line-clamp-1 mb-0.5 group-hover:text-orange-700 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-slate-500 line-clamp-1">{content}</p>
      </div>

      {/* Ikon */}
      <div className="text-orange-300 group-hover:text-orange-500 transition-colors">
        <ExternalLink size={16} />
      </div>
    </div>
  );
}
