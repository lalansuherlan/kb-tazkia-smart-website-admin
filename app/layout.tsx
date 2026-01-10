import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kober Tazkia Smart",
  description:
    "Menjadi KOBER unggulan dalam membentuk anaka yang smart, mandiri, kreatif, dan berakhlak mulia.",
  generator: "v0.app",
  // --- BAGIAN INI YANG DIUBAH ---
  icons: {
    icon: "/logo-tazkia.jpeg", // Mengarah ke file di folder public
    apple: "/logo-tazkia.jpeg", // Ikon untuk iPhone/iPad (add to home screen)
  },
  // -----------------------------
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        {children}
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  );
}
