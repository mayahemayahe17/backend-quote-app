require("dotenv").config();
// 1. 导入基本配置 express 框架，cors 跨域
const express = require("express");
const cors = require("cors");

// 2. 导入数据库
const createTables = require("./db/initDB"); // 引入数据库初始化
const quoteRoutes = require("./routes/quoteRoutes"); // 引入正确的路径

// 1. 构建实例，使用 middleware cors 和 express 的 json 解析 body
const app = express();

// 配置 CORS，允许来自指定前端端口的请求
app.use(
  cors({
    origin: "https://scaffolding-quote-app.vercel.app", // 允许来自前端的请求（前端运行在3001端口）
    methods: ["GET", "POST", "PUT", "DELETE"], // 允许的方法
  })
);

app.use(express.json()); // 解析 json 数据

// 2. 初始化数据库表
createTables();

// 使用 /quote 路由
app.use("/", quoteRoutes);

const PORT = process.env.PORT || 3000; // 如果没有环境变量 PORT，则回退到 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
