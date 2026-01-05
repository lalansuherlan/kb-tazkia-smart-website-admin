import { Pool } from "pg";

// Menambahkan properti pgPool ke global object agar TypeScript tidak error
declare global {
  var pgPool: Pool | undefined;
}

let pool: Pool;

// Ambil URL koneksi dari .env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL belum didefinisikan di file .env");
}

// Konfigurasi Database
const dbConfig = {
  connectionString: connectionString,
  // Wajib untuk Supabase (Production & Pooler)
  ssl: {
    rejectUnauthorized: false,
  },
  // Setting tambahan agar koneksi tidak menggantung
  max: 10,
  connectionTimeoutMillis: 10000, // 10 detik timeout
  idleTimeoutMillis: 30000,
};

// Logika Singleton
if (process.env.NODE_ENV === "production") {
  pool = new Pool(dbConfig);
} else {
  if (!global.pgPool) {
    global.pgPool = new Pool(dbConfig);
  }
  pool = global.pgPool;
}

export async function query(sql: string, values?: any[]) {
  try {
    const res = await pool.query(sql, values);
    return res.rows;
  } catch (error) {
    console.error("Database Query Error:", error);
    // console.error("SQL yg error:", sql); // Uncomment utk debug jika perlu
    return [];
  }
}

export async function querySingle(sql: string, values?: any[]) {
  const rows = await query(sql, values);
  return rows[0];
}
