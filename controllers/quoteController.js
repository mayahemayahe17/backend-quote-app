const {
  getQuoteByCompanyAndFloor,
  getRegularRate,
  addCompany,
  createCompanyRateMapping,
  createRate,
  unmapCompanyRate,
  unmapCompanyRateByCompanyId,
  getRateById,
  deleteRateCategory,
  unmapAllCompanyRate,
  getCompanyByName,
  getAllCompanies,
  getAllRates,
  deleteCompany,
  modifyRateCategory,
  getCompaniesByRateId,
  checkCompanyFloorMapped,
  checkRateExists,
} = require("../models/quoteModel"); // 合并所有引入的Model函数

// getQuote函数
const getQuote = async (req, res) => {
  const { name, floor } = req.query;

  // 检查是否提供了 name 和 floor 参数
  if (!name || !floor) {
    return res.status(400).json({ error: "Missing name or floor parameter" });
  }

  try {
    // 查询公司和楼层的报价
    const quote = await getQuoteByCompanyAndFloor(name, floor);

    // 如果没有找到报价，则返回 Regular rate
    if (!quote) {
      const regularRate = await getRegularRate(floor);
      if (!regularRate) {
        console.log("Error: Default Regular rate not found");
        return res
          .status(500)
          .json({ error: "Default Regular rate not found in the database" });
      }
      return res.json({
        match: false,
        rate: regularRate, // 返回默认 Regular rate
      });
    }

    // 如果找到了报价，返回公司报价
    return res.json({
      match: true,
      rate: quote,
    });
  } catch (err) {
    console.error("Database error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 添加公司
const addCompanyController = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing company name" });
  }

  try {
    // 检查是否已存在
    const existing = await getCompanyByName(name); // 你需要实现这个 model 方法
    if (existing) {
      return res.status(409).json({ error: "Company already exists" });
    }
    const company = await addCompany(name);
    return res.status(201).json({
      message: "Company added successfully",
      company,
    });
  } catch (err) {
    console.error("Error adding company:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 删除公司映射
const unmapCompanyRateController = async (req, res) => {
  const { companyId, floorType } = req.body;

  if (!companyId || !floorType) {
    return res.status(400).json({ error: "Missing companyId or floorType" });
  }

  try {
    const changes = await unmapCompanyRate(companyId, floorType);

    if (changes === 0) {
      return res.status(404).json({ error: "Mapping not found" });
    }

    return res.json({ message: "Mapping removed successfully" });
  } catch (err) {
    console.error("Error unmapping rate:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 建立楼层报价映射
const mapCompanyRateController = async (req, res) => {
  const { companyId, floorType, rateId } = req.body;

  if (!companyId || !floorType || !rateId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await createCompanyRateMapping(companyId, floorType, rateId);
    res.json({ message: "Mapping created successfully" });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      res.status(409).json({ error: "Mapping already exists" });
    } else {
      console.error("Database error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// 创建新 rate
const createRateController = async (req, res) => {
  const {
    name,
    floor_rate,
    rental_rate,
    gable_rate,
    ground_floor_rate,
    ground_floor_rental_rate,
    first_floor_rate,
    first_floor_rental_rate,
  } = req.body;

  try {
    const result = await createRate({
      name,
      floor_rate,
      rental_rate,
      gable_rate,
      ground_floor_rate,
      ground_floor_rental_rate,
      first_floor_rate,
      first_floor_rental_rate,
    });

    res.json({ message: "Rate created successfully", rateId: result.id });
  } catch (err) {
    console.error("Error creating rate:", err);
    res.status(500).json({ error: "Failed to create rate" });
  }
};

// 获取 rate
const getRateHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const rate = await getRateById(id);
    if (rate) {
      res.json(rate);
    } else {
      res.status(404).json({ error: "Rate not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err });
  }
};

// 删除 Rate Category
const deleteRateCategoryController = async (req, res) => {
  const { id } = req.params;

  try {
    // 删除与该 Rate 分类相关的所有映射
    const unmapResult = await unmapAllCompanyRate(id);

    // 删除 Rate 分类
    const deleteResult = await deleteRateCategory(id);

    if (deleteResult.changes > 0) {
      return res.json({ message: "Rate category deleted successfully" });
    } else {
      return res.status(404).json({ error: "Rate category not found" });
    }
  } catch (err) {
    console.error("Error deleting rate category:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 获取所有公司
const getAllCompaniesController = async (req, res) => {
  try {
    const companies = await getAllCompanies(); // 假设你有一个 `getAllCompanies` 模型方法来获取公司列表
    return res.json({ companies });
  } catch (err) {
    console.error("Error fetching companies:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 删除公司
const deleteCompanyController = async (req, res) => {
  const { id } = req.params; // 从请求路径中获取公司ID

  try {
    // 先删除该公司在 company_rates 表中的所有映射
    const unmapResult = await unmapCompanyRateByCompanyId(id); // 假设你有 unmapCompanyRateByCompanyId 方法来删除映射

    if (unmapResult === 0) {
      console.log(`No mappings found for company with id: ${id}`);
    }

    // 然后删除公司
    const result = await deleteCompany(id); // 删除公司

    if (result.changes > 0) {
      return res.json({
        message: "Company and its mappings deleted successfully",
      });
    } else {
      return res.status(404).json({ error: "Company not found" });
    }
  } catch (err) {
    console.error("Error deleting company and its mappings:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 获取所有报价类别
const getAllRatesController = async (req, res) => {
  try {
    const allRates = await getAllRates(); // 获取所有报价类别
    return res.json({ allRates });
  } catch (err) {
    console.error("Error fetching all rates:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 修改 rate，AdminModifyRateCategory
const modifyRateCategoryController = async (req, res) => {
  const { id } = req.params; // 获取要修改的 rate category 的 id
  const {
    name,
    floor_rate,
    rental_rate,
    gable_rate,
    ground_floor_rate,
    ground_floor_rental_rate,
    first_floor_rate,
    first_floor_rental_rate,
  } = req.body; // 从请求体中获取新的值

  try {
    // 调用修改 rate 的模型方法
    await modifyRateCategory({
      id,
      name,
      floor_rate,
      rental_rate,
      gable_rate,
      ground_floor_rate,
      ground_floor_rental_rate,
      first_floor_rate,
      first_floor_rental_rate,
    });

    // 修改后重新查询最新的 rate 数据
    const updatedRate = await getRateById(id);

    // 返回完整的最新 rate 对象
    res.json({
      message: "Rate updated successfully",
      rate: updatedRate,
    });
  } catch (err) {
    console.error("Error updating rate:", err);
    res.status(500).json({ error: "Failed to update rate" });
  }
};

// 获取某个 Rate 下的所有公司
const getCompaniesByRateIdController = async (req, res) => {
  const { rateId } = req.params;
  console.log("➡️ Get companies for rateId:", rateId); // 看看是否是数字

  try {
    const companies = await getCompaniesByRateId(rateId);
    if (companies.length > 0) {
      res.json({ companies });
    } else {
      res.status(404).json({ error: "No companies found for this rate" });
    }
  } catch (err) {
    console.error("Error fetching companies by rateId:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 检查公司是否已在某个 floorType 下被映射到其他 rate
const checkCompanyFloorMappingController = async (req, res) => {
  const { companyId, floorType, rateId } = req.query;

  try {
    const mapping = await checkCompanyFloorMapped(
      parseInt(companyId),
      floorType,
      parseInt(rateId)
    );

    if (mapping) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking mapping:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 查询是否已经存在相同名字的 Rate
const checkRateExistsController = async (req, res) => {
  const { name } = req.body; // 从请求体中获取 rate 名字

  try {
    // 在数据库中查找是否有相同的 name
    const existingRate = await checkRateExists(name);

    if (existingRate) {
      return res.status(200).json({ exists: true }); // 如果找到了，返回 exists: true
    } else {
      return res.status(200).json({ exists: false }); // 如果没有找到，返回 exists: false
    }
  } catch (error) {
    console.error("Error checking rate:", error);
    return res.status(500).json({ error: "Internal Server Error" }); // 发生错误时返回500
  }
};

module.exports = {
  unmapCompanyRateController,
  addCompanyController,
  getQuote,
  mapCompanyRateController,
  createRateController,
  getRateHandler,
  deleteRateCategoryController,
  getAllCompaniesController,
  deleteCompanyController,
  getAllRatesController,
  modifyRateCategoryController,
  getCompaniesByRateIdController,
  checkCompanyFloorMappingController,
  checkRateExistsController,
};
