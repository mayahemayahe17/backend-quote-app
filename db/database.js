//import sqlite3,同时用到verbose是会有更详细的调试信息（optional使用）
const sqlite3 = require("sqlite3").verbose();

//建立了一个SQlite的数据库文件，如果error会有相对应的信息。没有error也是
const db = new sqlite3.Database("./quote.db", (err) => {
  if (err) {
    console.error("Failed to connect to the datatbase: ", err);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

module.exports = db; //导出数据库连接，其他文件可以用
