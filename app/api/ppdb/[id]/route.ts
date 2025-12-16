import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const sql = `SELECT * FROM ppdb_categories WHERE id = ?`;
    const rows: any = await query(sql, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const program = rows[0];

    // Helper untuk parsing JSON dengan aman (karena di DB bentuknya string)
    const safeParse = (data: string, fallback: any) => {
      try {
        return data ? JSON.parse(data) : fallback;
      } catch (e) {
        return fallback;
      }
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
      benefits: safeParse(program.benefits, []), // Menggunakan kolom benefits yg sudah ada
    };

    return NextResponse.json(formattedProgram);
  } catch (error) {
    console.error("Fetch detail error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
