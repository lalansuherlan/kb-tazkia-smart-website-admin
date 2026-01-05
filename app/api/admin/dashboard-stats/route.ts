import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // 1. Cek Login
    const token = await getAuthCookie();
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Eksekusi Query secara Paralel
    const [ppdbStats, studentStats, messageStats, activities] =
      await Promise.all([
        // Query A: Hitung Statistik PPDB
        // Casting ::int berguna agar driver pg berusaha membacanya sbg angka (opsional, tapi good practice)
        query(`
          SELECT 
            COUNT(*)::int as total,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)::int as pending,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END)::int as approved
          FROM ppdb_applications
        `),

        // Query B: Hitung Siswa Aktif
        query(
          "SELECT COUNT(*)::int as total FROM students WHERE status = 'active'"
        ),

        // Query C: Hitung Pesan Masuk
        query("SELECT COUNT(*)::int as total FROM messages"),

        // Query D: Ambil Aktivitas Terbaru (Gabungan PPDB & Pesan)
        // Hapus tanda kurung () di sekitar SELECT agar ORDER BY global terbaca dengan benar di Postgres
        query(`
          SELECT child_name as title, 'mendaftar siswa baru' as action, 'ppdb' as type, created_at 
          FROM ppdb_applications
          UNION ALL
          SELECT name as title, 'mengirim pesan' as action, 'message' as type, created_at 
          FROM messages
          ORDER BY created_at DESC 
          LIMIT 5
        `),
      ]);

    // Casting hasil query
    const ppdbData = (ppdbStats as any[])[0];
    const studentData = (studentStats as any[])[0];
    const messageData = (messageStats as any[])[0];
    const activityData = activities as any[];

    // 3. Return JSON
    // Catatan: Postgres 'COUNT' mengembalikan string, jadi Number() wajib ada.
    return NextResponse.json({
      ppdb: {
        total: Number(ppdbData?.total || 0),
        pending: Number(ppdbData?.pending || 0),
        approved: Number(ppdbData?.approved || 0),
      },
      students: Number(studentData?.total || 0),
      messages: Number(messageData?.total || 0),
      recentActivities: activityData,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
