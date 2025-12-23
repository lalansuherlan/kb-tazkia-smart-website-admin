"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Pass function toggle ke Header agar tombol menu bisa diklik
       */}
      <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 relative">
        {/* Pass state isOpen dan function close ke Sidebar
         */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* OVERLAY GELAP (Hanya muncul di HP saat sidebar terbuka) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* KONTEN UTAMA */}
        <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
