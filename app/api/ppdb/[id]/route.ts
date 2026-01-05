import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // --- PERBAIKAN 1: Placeholder SQL ($1) ---
    const sql = `SELECT * FROM ppdb_categories WHERE id = $1`;
    const rows: any = await query(sql, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const program = rows[0];

    // --- PERBAIKAN 2: Smart JSON Parser ---
    // Postgres driver seringkali otomatis mem-parse JSONB menjadi Object.
    // Kita harus cek tipe datanya dulu agar tidak "Double Parse".
    const safeParse = (data: any, fallback: any) => {
      // Jika sudah berupa object (karena driver Postgres otomatis parse), kembalikan langsung
      if (typeof data === "object" && data !== null) {
        return data;
      }
      // Jika masih string, baru kita parse
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (e) {
          return fallback;
        }
      }
      return fallback;
    };

    // Format data agar sesuai struktur komponen React
    const formattedProgram = {
      ...program,
      objectives: safeParse(program.objectives, []),
      curriculum: safeParse(program.curriculum, { title: "", items: [] }),
      facilities: safeParse(program.facilities, []),
      schedule: safeParse(program.schedule, {}),
      costs: safeParse(program.costs, {}),
      requirements: safeParse(program.requirements, []),
      benefits: safeParse(program.benefits, []),
    };

    return NextResponse.json(formattedProgram);
  } catch (error) {
    console.error("Fetch detail error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
