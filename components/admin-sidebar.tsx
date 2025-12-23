"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// 👇 DATA MENU (Sama seperti sebelumnya)
const menuStructure = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/messages", label: "Kotak Masuk", icon: "📬" },

  // GROUP 1
  {
    label: "Konten Website",
    icon: "🌐",
    submenu: [
      { href: "/admin/landing-editor", label: "Content Beranda" },
      { href: "/admin/content", label: "Program & Galeri" },
      { href: "/admin/feedback", label: "Feedback & Testimoni" },
    ],
  },

  // GROUP 2
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
      { href: "/admin/penilaian/kolom", label: "Ceklis / Kolom" }, // Disiapkan utk nanti
    ],
  },

  // GROUP 3
  {
    label: "Penerimaan (PPDB)",
    icon: "📝",
    submenu: [
      { href: "/admin/ppdb-programs", label: "Kategori Pendidikan" },
      { href: "/admin/ppdb", label: "Data Pendaftar" },
    ],
  },

  // GROUP 4
  { href: "/admin/users", label: "User Management", icon: "⚙️" },
];

export function AdminSidebar() {
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
    <aside className="w-64 bg-gradient-to-b from-emerald-50 to-cyan-50 border-r-2 border-emerald-200 min-h-screen p-4 sticky top-16 overflow-y-auto">
      <nav className="space-y-1">
        {menuStructure.map((item, index) => {
          // --- LOGIC 1: MENU TUNGGAL ---
          if (!item.submenu) {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
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

          // --- LOGIC 2: MENU DROPDOWN ---
          const isOpen = openMenus[item.label];
          const isParentActive = item.submenu.some(
            (sub) => sub.href === pathname
          );

          return (
            <div key={index} className="space-y-1">
              {/* Parent Button */}
              <button
                onClick={() => toggleMenu(item.label)}
                // 👇 PERUBAHAN DISINI: text-left dan items-center
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
                {/* Icon Panah tetap di kanan */}
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {/* Child Items */}
              {isOpen && (
                <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {item.submenu.map((sub, subIndex) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={subIndex}
                        href={sub.href}
                        // 👇 PERUBAHAN DISINI: pl-12 agar teks submenu SEJAJAR dengan teks parent
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
      </nav>
    </aside>
  );
}
