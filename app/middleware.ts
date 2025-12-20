import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Ambil token dari cookies
  // Sesuai dengan lib/auth.ts Anda: cookieStore.set("auth_token", ...)
  const token = request.cookies.get("auth_token")?.value;

  // 2. Ambil path yang sedang diakses
  const { pathname } = request.nextUrl;

  // ----------------------------------------------------------------
  // LOGIC 1: Proteksi Halaman Admin (Redirect jika belum login)
  // ----------------------------------------------------------------
  // Jika user mencoba masuk ke folder "/admin" TAPI tidak punya token
  if (pathname.startsWith("/admin") && !token) {
    const loginUrl = new URL("/", request.url);
    // Opsional: Tambahkan pesan error di URL
    loginUrl.searchParams.set("error", "Harap login terlebih dahulu");
    return NextResponse.redirect(loginUrl);
  }

  // ----------------------------------------------------------------
  // LOGIC 2: Redirect User Login (Jika sudah login)
  // ----------------------------------------------------------------
  // Jika user ada di halaman Login ("/") PADAHAL sudah punya token valid
  // Langsung lempar ke dashboard
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Lanjut jika tidak ada masalah
  return NextResponse.next();
}

// Konfigurasi path mana saja yang dicek middleware
export const config = {
  matcher: [
    /*
     * Match semua request path kecuali:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (file publik)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
