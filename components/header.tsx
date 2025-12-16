"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react"; // Tambah ChevronDown
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Definisi Tipe Data Menu
type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // State khusus untuk mobile dropdown (Accordion style)
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<string | null>(
    null
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Konfigurasi Menu dengan Struktur Dropdown
  const navItems: NavItem[] = [
    { label: "Beranda", href: "/#hero" },
    { label: "Tentang", href: "/#about" },
    { label: "Program", href: "/#programs" },

    // 👇 ITEM INI PUNYA ANAK (DROPDOWN)
    {
      label: "Guru & Kelas",
      children: [
        { label: "Dewan Guru", href: "/guru" },
        { label: "Ruang Kelas", href: "/kelas" },
      ],
    },

    { label: "Galeri", href: "/#gallery" },
    { label: "PPDB", href: "/#ppdb" },
    { label: "Kontak", href: "/#contact" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <header
        className={cn(
          "w-full max-w-5xl transition-all duration-300 ease-in-out border rounded-full shadow-lg shadow-emerald-100/20",
          // Efek Kaca Utama
          "backdrop-blur-xl supports-[backdrop-filter]:bg-white/60",

          scrolled
            ? // SAAT SCROLL: Lebih solid tapi tetap blur, padding mengecil
              "py-2 px-5 bg-white/85 border-emerald-200/50"
            : // SAAT DI ATAS: Lebih transparan, padding lebih besar
              "py-3 px-6 bg-white/50 border-white/40"
        )}
      >
        <div className="flex items-center justify-between">
          {/* --- 1. LOGO --- */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-lg">🌱</span>
            </div>
            <span className="font-bold text-emerald-900 tracking-tight hidden sm:block">
              Tazkia<span className="text-emerald-600">Smart</span>
            </span>
          </Link>

          {/* --- 2. DESKTOP MENU (Updated with Dropdown) --- */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  // === TAMPILAN JIKA ADA DROPDOWN ===
                  <>
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-full transition-all group-hover:bg-emerald-50">
                      {item.label}
                      <ChevronDown
                        size={14}
                        className="group-hover:rotate-180 transition-transform duration-300"
                      />
                    </button>

                    {/* Kotak Dropdown (Muncul saat hover group) */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                      <div className="p-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors font-medium text-center"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  // === TAMPILAN MENU BIASA ===
                  <Link
                    href={item.href!}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-full transition-all"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* --- 3. CTA BUTTON (DAFTAR SEKARANG) --- */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/#ppdb">
              <Button
                size="sm"
                className="rounded-full bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 mr-1" /> Daftar Sekarang
              </Button>
            </Link>
          </div>

          {/* --- 4. MOBILE MENU TOGGLE --- */}
          <button
            className="md:hidden p-2 text-emerald-800 bg-white/50 rounded-full hover:bg-emerald-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* --- MOBILE DROPDOWN (Floating) --- */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 p-2 animate-in slide-in-from-top-2 duration-200">
            <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 shadow-2xl rounded-2xl p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    // === MOBILE: ITEM DENGAN SUBMENU ===
                    <div className="flex flex-col">
                      <button
                        onClick={() =>
                          setMobileSubMenuOpen(
                            mobileSubMenuOpen === item.label ? null : item.label
                          )
                        }
                        className="px-4 py-3 text-sm font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-between w-full"
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            mobileSubMenuOpen === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Submenu Mobile */}
                      {mobileSubMenuOpen === item.label && (
                        <div className="ml-4 pl-4 border-l-2 border-emerald-100 space-y-1 mb-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-slate-500 hover:text-emerald-700 font-medium"
                              onClick={() => setIsOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // === MOBILE: MENU BIASA ===
                    <Link
                      href={item.href!}
                      className="px-4 py-3 text-sm font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                      <span className="text-emerald-300">›</span>
                    </Link>
                  )}
                </div>
              ))}

              <div className="h-px bg-slate-100 my-1"></div>
              <Link href="/#ppdb" onClick={() => setIsOpen(false)}>
                <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 font-bold">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
