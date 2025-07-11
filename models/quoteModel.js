const db = require("../db/database");

// 查询报价rate
const getQuoteByCompanyAndFloor = (name, floor) => {
  const sql = `
    SELECT r.*
    FROM companies c
    JOIN company_rates cr ON c.id = cr.company_id
    JOIN rates r ON cr.rate_id = r.id
    WHERE LOWER(REPLACE(c.name, ' ', '')) = LOWER(REPLACE(?, ' ', '')) AND cr.floor_type = ?
  `;

  return new Promise((resolve, reject) => {
    db.get(sql, [name, floor], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// 查询具体某个rate。根据 rate 的 ID 获取对应的 rate
const getRateById = (rateId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM rates WHERE id = ?`;
    db.get(query, [rateId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row); // row 是一条记录
      }
    });
  });
};

// 查询对应楼层的默认报价（Regular）
const getRegularRate = (floor) => {
  const rateName = floor === "1F" ? "Regular-1F" : "Regular-2F";
  const sql = `SELECT * FROM rates WHERE name = ?`;

  return new Promise((resolve, reject) => {
    db.get(sql, [rateName], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

//添加公司
const addCompany = (name) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO companies (name) VALUES (?)`;
    db.run(query, [name], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, name });
      }
    });
  });
};

const unmapCompanyRate = (companyId, floorType) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM company_rates WHERE company_id = ? AND floor_type = ?`;
    db.run(sql, [companyId, floorType], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes); // 返回删除了几行
      }
    });
  });
};

// 插入 company_id、floor_type、rate_id 映射
const createCompanyRateMapping = (companyId, floorType, rateId) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO company_rates (company_id, floor_type, rate_id)
      VALUES (?, ?, ?)
    `;
    db.run(query, [companyId, floorType, rateId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
};

// 创建新rate
const createRate = (rateData) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO rates (
        name,
        floor_rate,
        rental_rate,
        gable_rate,
        ground_floor_rate,
        ground_floor_rental_rate,
        first_floor_rate,
        first_floor_rental_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      rateData.name,
      rateData.floor_rate,
      rateData.rental_rate,
      rateData.gable_rate,
      rateData.ground_floor_rate,
      rateData.ground_floor_rental_rate,
      rateData.first_floor_rate,
      rateData.first_floor_rental_rate,
    ];

    db.run(sql, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
};

// 删除 Rate Category
const deleteRateCategory = (rateId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM rates WHERE id = ?`;
    db.run(sql, [rateId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this); // 返回删除的结果
      }
    });
  });
};

// 删除与 Rate Category 相关的所有公司映射
const unmapAllCompanyRate = (rateId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM company_rates WHERE rate_id = ?`;
    db.run(sql, [rateId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this); // 返回删除的行数
      }
    });
  });
};

// 删除 Rate Category 和相关的映射
const deleteRateCategoryWithMappings = async (rateId) => {
  try {
    // 1. 删除所有与 Rate Category 相关的公司映射
    const unmapResult = await unmapAllCompanyRate(rateId);

    // 2. 删除 Rate Category 本身
    const deleteResult = await deleteRateCategory(rateId);

    if (deleteResult.changes > 0) {
      return {
        success: true,
        message: "Rate category and its mappings deleted successfully",
      };
    } else {
      return { success: false, message: "Rate category not found" };
    }
  } catch (err) {
    console.error("Error deleting rate category with mappings:", err);
    throw new Error("Internal server error");
  }
};
// 获取所有公司
const getAllCompanies = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM companies`;
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows); // 返回所有公司
      }
    });
  });
};

// 删除公司
const deleteCompany = (companyId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM companies WHERE id = ?`;
    db.run(sql, [companyId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes }); // 返回删除的行数
      }
    });
  });
};

// 检查公司是否已存在
const getCompanyByName = (name) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM companies WHERE name = ?`, [name], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row); // 如果找到了，返回对象，否则返回 undefined/null
      }
    });
  });
};
// 查询所有报价
const getAllRates = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM rates`;
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows); // 返回所有报价
      }
    });
  });
};

// 删除与公司相关的所有映射
const unmapCompanyRateByCompanyId = (companyId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM company_rates WHERE company_id = ?`;
    db.run(sql, [companyId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes); // 返回删除的行数
      }
    });
  });
};

// 在 model 中定义 modifyRateCategory
const modifyRateCategory = async ({
  id,
  name,
  floor_rate,
  rental_rate,
  gable_rate,
  ground_floor_rate,
  ground_floor_rental_rate,
  first_floor_rate,
  first_floor_rental_rate,
}) => {
  const query = `
    UPDATE rates
    SET
      name = ?,
      floor_rate = ?,
      rental_rate = ?,
      gable_rate = ?,
      ground_floor_rate = ?,
      ground_floor_rental_rate = ?,
      first_floor_rate = ?,
      first_floor_rental_rate = ?
    WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(
      query,
      [
        name,
        floor_rate,
        rental_rate,
        gable_rate,
        ground_floor_rate,
        ground_floor_rental_rate,
        first_floor_rate,
        first_floor_rental_rate,
        id,
      ],
      function (err) {
        if (err) {
          return reject(err); // 发生错误时拒绝 Promise
        }
        resolve({ id }); // 成功时返回更新的 rate id
      }
    );
  });
};

// 查询某个 rate 下所有已映射的公司
const getCompaniesByRateId = (rateId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT c.*
      FROM companies c
      JOIN company_rates cr ON c.id = cr.company_id
      WHERE cr.rate_id = ?
    `;
    db.all(sql, [rateId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows); // 返回所有与该 rateId 关联的公司
      }
    });
  });
};

// 检查公司是否已在某个 floorType 下被映射到其他 rate
const checkCompanyFloorMapped = (companyId, floorType, currentRateId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT rate_id FROM company_rates
      WHERE company_id = ? AND floor_type = ? AND rate_id != ?
    `;
    db.get(sql, [companyId, floorType, currentRateId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row); // 如果存在说明已被映射
      }
    });
  });
};

// 查询 Rate 名字是否已存在
const checkRateExists = (name) => {
  const sql = `SELECT * FROM rates WHERE name = ?`;

  return new Promise((resolve, reject) => {
    db.get(sql, [name], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row); // 如果找到同名 Rate，返回该行数据
      }
    });
  });
};

module.exports = {
  addCompany,
  getQuoteByCompanyAndFloor,
  getRegularRate,
  createCompanyRateMapping,
  createRate,
  unmapCompanyRate,
  getRateById,
  deleteRateCategory,
  deleteRateCategoryWithMappings,
  getAllCompanies,
  deleteCompany,
  unmapAllCompanyRate,
  getCompanyByName,
  getAllRates,
  unmapCompanyRateByCompanyId,
  modifyRateCategory,
  getCompaniesByRateId,
  checkCompanyFloorMapped,
  checkRateExists,
};
