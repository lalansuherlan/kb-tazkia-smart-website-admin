import bcryptjs from "bcryptjs";

const password = "admin123";
const saltRounds = 10;
(async () => {
  try {
    const hash = await bcryptjs.hash(password, saltRounds);
    console.log('Password Hash untuk "admin123":');
    console.log(hash);
    console.log("\nGunakan hash ini di database untuk INSERT admin_users");
  } catch (error) {
    console.error("Error generating hash:", error);
  }
})();
