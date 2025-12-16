const bcryptjs = require("bcryptjs");

async function generateHash() {
  const password = "admin123";
  const hash = await bcryptjs.hash(password, 10);
  console.log("\n=== PASSWORD HASH GENERATOR ===\n");
  console.log("Password: admin123");
  console.log("Hash: " + hash);
  console.log("\n=== SQL QUERY ===\n");
  console.log(`DELETE FROM admin_users WHERE email = 'admin@kbtazkia.id';\n`);
  console.log(
    `INSERT INTO admin_users (email, password_hash, name, role) VALUES ('admin@kbtazkia.id', '${hash}', 'Admin KB Tazkia', 'admin');\n`
  );
}

generateHash();
