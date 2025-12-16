"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AdminHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    router.push("/login");
  };

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  return (
    <header className="bg-white border-b-2 border-emerald-100 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="text-3xl">🎓</div>
          <div className="hidden sm:block">
            <p className="font-bold text-gray-900">KB Tazkia Smart</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </Link>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">{user.role || "Staff"}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold">
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
