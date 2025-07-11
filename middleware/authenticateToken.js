// 中间件验证token是否有效
const jwt = require("jsonwebtoken");

// 验证 JWT Token 的中间件
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // 从 Authorization header 获取 token

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // 验证 token
  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded; // 将解码后的用户信息存入请求对象
    next(); // 继续处理请求
  });
};

module.exports = authenticateToken;
