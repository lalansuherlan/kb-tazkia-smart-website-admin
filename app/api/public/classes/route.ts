import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Definisi tipe data hasil query
interface StudentRow {
  student_id: number;
  student_name: string;
  student_photo: string | null;
  gender: string;
  class_name: string;
  academic_year: string;
  teacher_name: string | null;
  teacher_photo: string | null;
  teacher_id: number | null;
}

export async function GET() {
  try {
    // Query Standard SQL (Aman untuk Postgres & MySQL)
    const sql = `
      SELECT 
        s.id as student_id,
        s.full_name as student_name,
        s.photo_url as student_photo,
        s.gender,
        s.class_name,
        s.academic_year, 
        t.name as teacher_name,
        t.photo_url as teacher_photo,
        t.id as teacher_id
      FROM students s
      LEFT JOIN admin_users t ON s.teacher_id = t.id
      WHERE s.status = 'active'
      ORDER BY s.class_name ASC, t.name ASC, s.full_name ASC
    `;

    // Eksekusi query
    const rows = (await query(sql)) as StudentRow[];

    // Proses Grouping Data (Logic JS tetap sama)
    const groups: Record<string, any> = {};

    rows.forEach((row) => {
      // Buat unique key kombinasi Kelas + Guru
      const uniqueKey = `${row.class_name}_${row.teacher_id || "no-teacher"}`;

      if (!groups[uniqueKey]) {
        groups[uniqueKey] = {
          className: row.class_name,
          academicYear: row.academic_year,
          teacherName: row.teacher_name || "Belum Ada Wali Kelas",
          teacherPhoto: row.teacher_photo,
          students: [],
        };
      }

      groups[uniqueKey].students.push({
        id: row.student_id,
        name: row.student_name,
        photo: row.student_photo,
        gender: row.gender,
      });
    });

    const result = Object.values(groups);

    // Return JSON dengan header no-cache
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
