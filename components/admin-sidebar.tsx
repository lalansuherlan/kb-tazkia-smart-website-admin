"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/messages", label: "Kotak Masuk", icon: "📬" },
  { href: "/admin/landing-editor", label: "Content Beranda", icon: "🏠" },
  { href: "/admin/content", label: "Program & Galeri", icon: "📄" },
  { href: "/admin/ppdb-programs", label: "Kategori Pendidikan", icon: "🎒" },
  { href: "/admin/ppdb", label: "PPDB Management", icon: "📝" },
  { href: "/admin/students", label: "Data Siswa", icon: "🎓" },
  { href: "/admin/feedback", label: "Feedback & Testimoni", icon: "💬" },
  { href: "/admin/users", label: "User Management", icon: "👥" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-50 to-cyan-50 border-r-2 border-emerald-200 min-h-screen p-4 sticky top-16">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-emerald-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
