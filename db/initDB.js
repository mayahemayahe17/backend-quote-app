const db = require("./database"); // 引入数据库连接

// 创建数据库表
const createTables = () => {
  db.serialize(() => {
    // 创建管理员表
    db.run(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password_hash TEXT NOT NULL
      )
    `);

    // 创建公司表
    db.run(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建价格表
    db.run(`
      CREATE TABLE IF NOT EXISTS rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,

        -- 单层建筑（1F）价格项
        floor_rate REAL,
        rental_rate REAL,
        gable_rate REAL,

        -- 双层建筑（2F）价格项
        ground_floor_rate REAL,
        ground_floor_rental_rate REAL,
        first_floor_rate REAL,
        first_floor_rental_rate REAL
      )
    `);

    // 创建公司楼层价格映射表
    db.run(`
      CREATE TABLE IF NOT EXISTS company_rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        floor_type TEXT NOT NULL CHECK (floor_type IN ('1F', '2F')),
        rate_id INTEGER NOT NULL,
        FOREIGN KEY (company_id) REFERENCES companies(id),
        FOREIGN KEY (rate_id) REFERENCES rates(id),
        UNIQUE (company_id, floor_type)
      )
    `);
  });

  console.log("Database tables created or verified!");
};

module.exports = createTables;
