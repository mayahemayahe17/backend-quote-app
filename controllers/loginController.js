const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db/database"); // 引入数据库连接

// 登录接口
const loginController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    // 查询管理员用户
    db.get(
      `SELECT * FROM admins WHERE username = ?`,
      [username],
      async (err, user) => {
        if (err || !user) {
          return res.status(404).json({ error: "Admin not found" });
        }

        // 使用 bcrypt 对比密码
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // 生成 JWT Token
        const token = jwt.sign(
          { id: user.id, username: user.username },
          "your-secret-key",
          { expiresIn: "1h" }
        );

        return res.json({ message: "Login successful", token });
      }
    );
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = loginController;
