import mysql from "mysql2/promise";

// Menambahkan properti mysqlPool ke global object agar TypeScript tidak error
declare global {
  var mysqlPool: mysql.Pool | undefined;
}

let pool: mysql.Pool;

// Konfigurasi Database
const dbConfig = {
  host: process.env.DB_HOST, // Hapus default localhost agar tidak error di prod
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 3306, // Penting: TiDB pakai port 4000
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  // --- TAMBAHAN WAJIB UNTUK TIDB CLOUD ---
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
  // ---------------------------------------
};

// Logika Singleton (Tetap dipertahankan untuk performa):
if (process.env.NODE_ENV === "production") {
  pool = mysql.createPool(dbConfig);
} else {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool(dbConfig);
  }
  pool = global.mysqlPool;
}

export async function query(sql: string, values?: any[]) {
  try {
    const [results] = await pool.execute(sql, values);
    return results;
  } catch (error) {
    console.error("Database Query Error:", error);
    // Kita return array kosong agar saat build error tidak langsung crash fatal
    return [];
  }
}
