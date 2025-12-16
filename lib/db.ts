import mysql from "mysql2/promise";

// Menambahkan properti mysqlPool ke global object agar TypeScript tidak error
declare global {
  var mysqlPool: mysql.Pool | undefined;
}

let pool: mysql.Pool;

// Konfigurasi Database
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "kb_tazkia_smart",
  waitForConnections: true,
  connectionLimit: 5, // Batasi koneksi (5-10 cukup untuk local)
  queueLimit: 0,
};

// Logika Singleton:
// Jika di mode development, simpan pool di variabel global.
// Jika di production, buat pool biasa.
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
    throw error;
  }
}
