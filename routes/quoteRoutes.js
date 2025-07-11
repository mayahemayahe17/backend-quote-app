const express = require("express");
const {
  getQuote,
  addCompanyController,
  getAllRatesController,
  unmapCompanyRateController,
  mapCompanyRateController,
  createRateController,
  getRateHandler,
  deleteRateCategoryController,
  getAllCompaniesController,
  deleteCompanyController,
  modifyRateCategoryController,
  getCompaniesByRateIdController,
  checkCompanyFloorMappingController,
  checkRateExistsController,
} = require("../controllers/quoteController");
const loginController = require("../controllers/loginController");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

//获取报价rate,Homepage
router.get("/", getQuote);

// 获取所有公司rate, AdminAllRates
router.get("/allRates", authenticateToken, getAllRatesController);
// 获取某个 Rate 下的所有公司,AdminModifyRateCategory
router.get(
  "/rate/:rateId/companies",
  authenticateToken,
  getCompaniesByRateIdController
);
//获取一个rate category的单价，AdminModifyRateCateory
router.get("/rate/:id", authenticateToken, getRateHandler);
// 修改rate category的单价，AdminModifyRateCategory
router.put("/rate/:id", authenticateToken, modifyRateCategoryController);
// 检查公司是否已在某个 floorType 下被映射到其他 rate,AdminModifyRateCategory
router.get(
  "/checkMapping",
  authenticateToken,
  checkCompanyFloorMappingController
);

//添加新rate category, AdminAddCategory
router.post("/createRate", authenticateToken, createRateController);
// 检查 Rate 是否已经存在,AdminAddCategory
router.post("/checkRateExists", authenticateToken, checkRateExistsController);
//删除rate category，AdminDeleteCategory
router.delete("/rate/:id", authenticateToken, deleteRateCategoryController);
//在ratecateory下面：
//添加公司到rate category， AdminAddRateCategory
router.post("/mapRate", authenticateToken, mapCompanyRateController);
//删除公司under某个rate category，AdminDeleteRateCategory
router.delete("/unmapRate", authenticateToken, unmapCompanyRateController);

// 获取所有公司，AdminAllCompanies
router.get("/companies", authenticateToken, getAllCompaniesController);
// 添加公司, AdminAddCompanies
router.post("/add", authenticateToken, addCompanyController);
// 删除公司，AdminDeleteCompany
router.delete("/companies/:id", authenticateToken, deleteCompanyController);

// 登录路由
router.post("/login", loginController);
module.exports = router;
