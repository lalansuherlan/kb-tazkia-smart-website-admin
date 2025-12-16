import Link from "next/link"
import { Facebook, Instagram, MapPin, Mail, Phone } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-gradient-to-b from-emerald-50 to-cyan-50 border-t-4 border-emerald-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <div className="absolute left-0 top-0 text-6xl opacity-20 select-none">🌻</div>
        <div className="absolute right-0 top-0 text-6xl opacity-20 select-none">🦋</div>

        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                🏫
              </div>
              <h3 className="font-bold text-emerald-900">KB Tazkia Smart</h3>
            </div>
            <p className="text-sm text-emerald-800">
              Menyediakan pendidikan berkualitas untuk generasi cerdas dan berkarakter melalui pembelajaran yang
              menyenangkan.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                aria-label="Facebook"
                className="text-emerald-600 hover:text-emerald-700 hover:scale-110 transition"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="text-pink-500 hover:text-pink-600 hover:scale-110 transition"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                aria-label="TikTok"
                className="text-emerald-600 hover:text-emerald-700 hover:scale-110 transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 1 1-2.4-2.4c.27 0 .53.03.79.08V9.24a6.1 6.1 0 0 0-.79-.05A6.11 6.11 0 0 0 5 15.11V20a8.94 8.94 0 0 0 4.34 1.44c4.54 0 8.74-3.64 8.74-8.15v-5.62a7.12 7.12 0 0 0 4.1 1.26v-3.21a4.7 4.7 0 0 1-.55-.05z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-emerald-900 flex items-center gap-2">
              <span>📋 Menu</span>
            </h4>
            <ul className="space-y-2 text-sm text-emerald-800">
              <li>
                <Link href="#hero" className="hover:text-emerald-600 hover:translate-x-1 transition inline-block">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-emerald-600 hover:translate-x-1 transition inline-block">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#programs" className="hover:text-emerald-600 hover:translate-x-1 transition inline-block">
                  Program
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="hover:text-emerald-600 hover:translate-x-1 transition inline-block">
                  Galeri
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-emerald-900 flex items-center gap-2">
              <span>ℹ️ Informasi</span>
            </h4>
            <ul className="space-y-2 text-sm text-emerald-800">
              <li>
                <Link href="#ppdb" className="hover:text-emerald-600 hover:translate-x-1 transition inline-block">
                  Pendaftaran PPDB
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-emerald-600 hover:translate-x-1 transition inline-block">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-600 hover:translate-x-1 transition inline-block">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-600 hover:translate-x-1 transition inline-block">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact - Updated with real KB Tazkia information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-emerald-900 flex items-center gap-2">
              <span>📞 Kontak</span>
            </h4>
            <div className="space-y-3 text-sm text-emerald-800">
              <div className="flex gap-2 items-start">
                <Phone size={16} className="flex-shrink-0 mt-1 text-cyan-500" />
                <div>
                  <p className="font-medium">-</p>
                  <p className="text-xs opacity-80">Hubungi untuk info lebih lanjut</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <Mail size={16} className="flex-shrink-0 mt-1 text-cyan-500" />
                <p>kbtazkiasmart@gmail.com</p>
              </div>
              <div className="flex gap-2 items-start">
                <MapPin size={16} className="flex-shrink-0 mt-1 text-cyan-500" />
                <div className="text-xs leading-relaxed">
                  <p className="font-medium">De Green Residence Blok C No. 17</p>
                  <p>Desa Bojongloa, Kec. Rancaekek</p>
                  <p>Kabupaten Bandung, Jawa Barat</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-200 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <span>🌱</span>
            <p>&copy; {currentYear} KB Tazkia Smart. Semua hak dilindungi. NPSN: 70057420</p>
            <span>🌿</span>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-emerald-600 transition">
              Privasi
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition">
              Cookies
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition">
              Kontak
            </Link>
          </div>
        </div>

        {/* Decorative footer elements */}
        <div className="absolute bottom-0 right-12 text-5xl opacity-15 select-none">🐰</div>
        <div className="absolute bottom-0 left-12 text-5xl opacity-15 select-none">🦆</div>
      </div>
    </footer>
  )
}
