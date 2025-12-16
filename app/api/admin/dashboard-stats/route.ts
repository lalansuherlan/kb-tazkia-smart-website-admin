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

    // 2. Eksekusi Query secara Paralel (Lebih Cepat)
    // Kita menggunakan Promise.all agar semua query jalan bersamaan, tidak antri satu-satu
    const [ppdbStats, studentStats, messageStats, activities] =
      await Promise.all([
        // Query A: Hitung Statistik PPDB (Sekaligus Total, Pending, Approved dalam 1 query)
        query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved
        FROM ppdb_applications
      `),

        // Query B: Hitung Siswa Aktif
        query("SELECT COUNT(*) as total FROM students WHERE status = 'active'"),

        // Query C: Hitung Pesan Masuk
        query("SELECT COUNT(*) as total FROM messages"),

        // Query D: Ambil Aktivitas Terbaru (Gabungan PPDB & Pesan)
        query(`
        (SELECT child_name as title, 'mendaftar siswa baru' as action, 'ppdb' as type, created_at FROM ppdb_applications)
        UNION ALL
        (SELECT name as title, 'mengirim pesan' as action, 'message' as type, created_at FROM messages)
        ORDER BY created_at DESC 
        LIMIT 5
      `),
      ]);

    // Casting hasil query (karena return type query adalah generic)
    const ppdbData = (ppdbStats as any[])[0];
    const studentData = (studentStats as any[])[0];
    const messageData = (messageStats as any[])[0];
    const activityData = activities as any[];

    // 3. Return JSON sesuai format yang diminta Frontend Dashboard Baru
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
