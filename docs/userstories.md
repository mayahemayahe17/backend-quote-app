## 用户故事文档 (User Stories)

---

### 🧑‍💼 User Story 1: 登录功能

* 【身份】 管理员
* 【需求】 能够通过用户名和密码登陆系统 (`POST /login`)
* 【目的】 使用可访问后台受保护功能，执行管理操作

---

### 🗒️ User Story 2: 管理所有报价种类

* 【身份】 管理员
* 【需求】 查看所有报价种类 (`GET /allRates`)
* 【需求】 添加新报价种类 (`POST /createRate`)
* 【需求】 删除某一报价种类 (`DELETE /rate/:id`)

---

### 🗒️ User Story 3: 管理单一报价种类

* 【身份】 管理员
* 【需求】 查看指定报价种类的详情：包括价格和关联公司 (`GET /rate/:id`)
* 【需求】 添加公司关联到报价种类 (`POST /mapRate`)
* 【需求】 删除报价种类下的公司关联 (`POST /unmapRate`)
* 【需求】 修改报价种类价格 (`PUT /rate/:id`)

---

### 🏢 User Story 4: 管理公司

* 【身份】 管理员
* 【需求】 查看所有公司 (`GET /companies`)
* 【需求】 添加公司 (`POST /add`)
* 【需求】 删除公司 (`DELETE /companies/:id`)

---

### 🔄 User Story 5: 映射公司和报价

* 【身份】 管理员或普通用户
* 【需求】 将公司、楼层类型和报价种类进行映射 (`POST /mapRate`)
* 【目的】 确保各公司在不同楼层下采用正确的报价

---

### 说明

* 所有接口都是受证权(JWT)保护的，需要首先登录，并使用 Header 中提供 Bearer Token
* 建议使用 RESTful 接口命名格式

  * 如: `GET /rates` `POST /rates` `PUT /rates/:id` `DELETE /rates/:id`

---
