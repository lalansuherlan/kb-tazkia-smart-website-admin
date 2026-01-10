"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image"; // 👈 Import Image dari Next.js
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Data Menu ---
type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/#hero" },
  { label: "Tentang", href: "/#about" },
  { label: "Program", href: "/#programs" },
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

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<string | null>(
    null
  );

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <header
        ref={menuRef}
        className={cn(
          "w-full max-w-5xl transition-all duration-300 ease-in-out border rounded-full shadow-lg shadow-emerald-100/20",
          "backdrop-blur-xl supports-[backdrop-filter]:bg-white/60",
          scrolled
            ? "py-2 px-5 bg-white/85 border-emerald-200/50"
            : "py-3 px-6 bg-white/50 border-white/40"
        )}
      >
        <div className="flex items-center justify-between">
          {/* --- 1. LOGO AREA (UPDATED) --- */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Container Gambar Logo */}
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo-tazkia.jpeg" // Pastikan file ini ada di folder /public
                alt="Logo KB Tazkia Smart"
                fill
                sizes="40px"
                className="object-contain" // Agar logo proporsional (tidak gepeng)
                priority // Loading prioritas karena ini header
              />
            </div>

            {/* Teks Logo */}
            <div className="flex flex-col justify-center leading-none">
              <span className="font-bold text-emerald-900 tracking-tight text-lg hidden sm:block">
                Tazkia<span className="text-emerald-600">Smart</span>
              </span>
              {/* Opsional: Slogan kecil di bawah logo jika diinginkan */}
              {/* <span className="text-[10px] text-slate-500 font-medium hidden sm:block">Pendidikan Anak Usia Dini</span> */}
            </div>
          </Link>

          {/* --- 2. DESKTOP MENU --- */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <>
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-full transition-all group-hover:bg-emerald-50 cursor-default">
                      {item.label}
                      <ChevronDown
                        size={14}
                        className="group-hover:rotate-180 transition-transform duration-300"
                      />
                    </button>

                    {/* Dropdown Bridge & Content */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 w-48">
                      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-xl overflow-hidden p-1">
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
                  <Link
                    href={item.href || "#"}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-full transition-all"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* --- 3. CTA BUTTON --- */}
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
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* --- MOBILE DROPDOWN --- */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 p-2 animate-in slide-in-from-top-2 duration-200">
            <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 shadow-2xl rounded-2xl p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.children ? (
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
                          className={`transition-transform duration-300 ${
                            mobileSubMenuOpen === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300 ease-in-out",
                          mobileSubMenuOpen === item.label
                            ? "max-h-40 opacity-100 mt-1"
                            : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="ml-4 pl-4 border-l-2 border-emerald-100 space-y-1 mb-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-slate-500 hover:text-emerald-700 font-medium hover:bg-emerald-50/50 rounded-lg"
                              onClick={() => setIsOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href || "#"}
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
                <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 font-bold h-12">
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
