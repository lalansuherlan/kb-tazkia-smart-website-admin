"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";

// DATA MENU (Tetap sama)
const menuStructure = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/messages", label: "Kotak Masuk", icon: "📬" },
  {
    label: "Konten Website",
    icon: "🌐",
    submenu: [
      { href: "/admin/landing-editor", label: "Content Beranda" },
      { href: "/admin/content", label: "Program & Galeri" },
      { href: "/admin/announcements", label: "Info & Agenda" },
      { href: "/admin/feedback", label: "Feedback & Testimoni" },
    ],
  },
  {
    label: "Akademik & Siswa",
    icon: "🎓",
    submenu: [
      { href: "/admin/students", label: "Data Siswa" },
      { href: "/admin/absensi", label: "Input Absensi" },
      { href: "/admin/absensi/rekap", label: "Rekap Absensi" },
    ],
  },
  {
    label: "Penilaian",
    icon: "⭐",
    submenu: [
      { href: "/admin/penilaian/anekdot", label: "Catatan Anekdot" },
      { href: "/admin/penilaian/kolom", label: "Ceklis / Kolom" },
    ],
  },
  {
    label: "Penerimaan (PPDB)",
    icon: "📝",
    submenu: [
      { href: "/admin/ppdb-programs", label: "Kategori Pendidikan" },
      { href: "/admin/ppdb", label: "Data Pendaftar" },
    ],
  },
  { href: "/admin/users", label: "User Management", icon: "⚙️" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newOpenState = { ...openMenus };
    menuStructure.forEach((item) => {
      if (item.submenu) {
        const isChildActive = item.submenu.some((sub) => sub.href === pathname);
        if (isChildActive) newOpenState[item.label] = true;
      }
    });
    setOpenMenus(newOpenState);
  }, [pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-50 to-cyan-50 border-r-2 border-emerald-200 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block md:h-[calc(100vh-80px)] md:sticky md:top-20
          overflow-y-auto h-full shadow-2xl md:shadow-none
          custom-scrollbar  /* 👈 Class tambahan untuk scrollbar */
        `}
      >
        {/* Tombol Close Mobile */}
        <div className="flex justify-end p-4 md:hidden">
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-emerald-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {menuStructure.map((item, index) => {
            if (!item.submenu) {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={onClose}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md font-bold"
                      : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                >
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            }

            const isMenuOpen = openMenus[item.label];
            const isParentActive = item.submenu.some(
              (sub) => sub.href === pathname
            );

            return (
              <div key={index} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-left ${
                    isParentActive
                      ? "bg-emerald-100 text-emerald-800 font-semibold"
                      : "text-gray-700 hover:bg-emerald-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isMenuOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {isMenuOpen && (
                  <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.submenu.map((sub, subIndex) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={subIndex}
                          href={sub.href}
                          onClick={onClose}
                          className={`block w-full text-left pl-12 pr-4 py-2 rounded-md text-sm transition-all ${
                            isSubActive
                              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm font-medium"
                              : "text-gray-600 hover:bg-white hover:text-emerald-600"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="h-20 md:hidden"></div>
        </nav>
      </aside>

      {/* 👇 STYLE CSS UNTUK SCROLLBAR HALUS & SESUAI TEMA */}
      <style jsx global>{`
        /* Lebar Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px; /* Sangat tipis dan elegan */
        }

        /* Track (Latar Belakang Scrollbar) */
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; /* Transparan agar menyatu dengan background sidebar */
        }

        /* Thumb (Batang Scrollbar) */
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(
            16,
            185,
            129,
            0.2
          ); /* Emerald transparan (halus) */
          border-radius: 10px; /* Melengkung penuh */
        }

        /* Saat di-Hover */
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(
            16,
            185,
            129,
            0.6
          ); /* Emerald lebih jelas saat disentuh */
        }
      `}</style>
    </>
  );
}
