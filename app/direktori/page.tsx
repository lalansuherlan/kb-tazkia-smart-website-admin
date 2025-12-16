import { ClassDirectory } from "@/components/class-directory";
import { Footer } from "@/components/footer"; // Pastikan Anda punya komponen Footer, jika tidak bisa dihapus baris ini
import { Header } from "@/components/header";

export const metadata = {
  title: "Direktori Siswa & Guru - KB Tazkia Smart",
  description: "Mengenal keluarga besar, guru, dan siswa KB Tazkia Smart.",
};

export default function DirectoryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* Spacer agar konten tidak tertutup Header Fixed */}
      <div className="pt-24 pb-10 px-4">
        <div className="text-center space-y-4 mb-8">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold tracking-wide uppercase">
            Keluarga Besar Kami
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Direktori Siswa & Guru
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Wajah-wajah ceria generasi penerus bangsa dan para pendidik yang
            penuh dedikasi.
          </p>
        </div>

        {/* Panggil Komponen ClassDirectory yang sudah dibuat sebelumnya */}
        <ClassDirectory />
      </div>

      <Footer />
    </main>
  );
}
