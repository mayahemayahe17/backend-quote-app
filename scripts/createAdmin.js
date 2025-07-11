// scripts/createAdmin.js
const bcrypt = require("bcrypt");
const db = require("../db/database");

const createAdmin = async () => {
  const username = "admin";
  const password = "admin8910";

  const hash = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO admins (username, password_hash) VALUES (?, ?)`,
    [username, hash],
    function (err) {
      if (err) {
        console.error("❌ 插入失败:", err.message);
      } else {
        console.log("✅ 管理员账号已创建");
      }
      db.close();
    }
  );
};

createAdmin();
