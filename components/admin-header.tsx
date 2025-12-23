"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react"; // Import Icon Menu

// Tambahkan Props untuk menerima fungsi klik
interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // await fetch("/api/auth/logout", { method: "POST" }); // Uncomment jika API sudah ada
    localStorage.removeItem("user");
    router.push("/login");
  };

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  return (
    <header className="bg-white border-b-2 border-emerald-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          {/* 👇 TOMBOL MENU (Hanya muncul di HP/md:hidden) */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 md:hidden"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="text-2xl md:text-3xl">🎓</div>
            {/* Teks Logo (Disembunyikan di HP yg sangat kecil jika perlu, tp default block oke) */}
            <div className="block">
              <p className="font-bold text-gray-900 text-sm md:text-base">
                KB Tazkia Smart
              </p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-2 md:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">{user.role || "Staff"}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm md:text-base">
              {(user.name || "A").charAt(0).toUpperCase()}
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
