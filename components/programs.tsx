import { query } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { RowDataPacket } from "mysql2";

// 1. Definisi Tipe Data (Sesuai kolom database baru)
interface ProgramItem extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  icon: string; // Ini mapping ke 'emoji' di script lama
  bg_emoji: string; // Ini mapping ke 'animal' di script lama
  color_class: string; // Ini mapping ke 'color' di script lama
  order_index: number;
}

// 2. Fungsi ambil data dari Server
async function getPrograms() {
  try {
    const sql = `SELECT * FROM programs ORDER BY order_index ASC`;
    const rows = (await query(sql)) as ProgramItem[];
    return JSON.parse(JSON.stringify(rows));
  } catch (error) {
    console.error("Gagal mengambil data program:", error);
    return [];
  }
}

export async function Programs() {
  // 3. Panggil data dari database
  const dbPrograms = await getPrograms();

  // 4. Fallback (Data cadangan jika database kosong/error)
  const fallbackPrograms = [
    {
      name: "Program Akademik",
      description: "Pembelajaran interaktif...",
      icon: "📚",
      color_class: "from-blue-400 to-cyan-400",
      bg_emoji: "🦆",
    },
    {
      name: "Seni & Kreativitas",
      description: "Kelas melukis...",
      icon: "🎨",
      color_class: "from-purple-400 to-pink-400",
      bg_emoji: "🦋",
    },
    {
      name: "Motorik & Olahraga",
      description: "Aktivitas fisik...",
      icon: "⚽",
      color_class: "from-orange-400 to-yellow-400",
      bg_emoji: "🐰",
    },
    {
      name: "Sosial & Emosional",
      description: "Membangun karakter...",
      icon: "❤️",
      color_class: "from-red-300 to-pink-300",
      bg_emoji: "🦁",
    },
  ];

  // Gunakan data DB jika ada, jika tidak gunakan fallback
  const programs = dbPrograms.length > 0 ? dbPrograms : fallbackPrograms;

  return (
    <section
      id="programs"
      className="w-full py-20 md:py-32 bg-gradient-to-b from-green-50 to-blue-50 relative overflow-hidden"
    >
      <div className="absolute top-20 left-10 text-7xl opacity-10">🌻</div>
      <div className="absolute bottom-20 right-20 text-8xl opacity-10">🌻</div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              <span className="text-2xl">🎯</span> Program Unggulan
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
              Pendidikan Berkualitas untuk Tumbuh Optimal
            </h2>
            <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
              Program pembelajaran dirancang khusus untuk mengembangkan semua
              aspek kemampuan anak dengan metode yang menyenangkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program: any, index: number) => (
              <Card
                key={program.id || index}
                className="group p-6 hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300 overflow-hidden relative"
              >
                {/* Background Gradient dari Database */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    program.color_class || "from-green-100 to-emerald-100"
                  } opacity-5 group-hover:opacity-10 transition-opacity`}
                ></div>

                {/* Background Emoji (Animal) dari Database */}
                <div className="absolute top-2 right-2 text-3xl opacity-30 group-hover:opacity-50 transition-opacity transform group-hover:scale-110">
                  {program.bg_emoji}
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Main Icon dari Database */}
                  <div className="text-5xl">{program.icon}</div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-emerald-800">
                      {program.name}
                    </h3>
                    <p className="text-sm text-emerald-700">
                      {program.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
