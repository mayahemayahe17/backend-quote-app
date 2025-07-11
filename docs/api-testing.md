# API 测试文档

本文档旨在列出并测试你所提供的所有 API 路由。你可以使用 Postman 或其他类似工具来测试这些 API。

## 1. 获取报价 (`/`)

- **方法**: `GET`
- **请求 URL**: `http://localhost:3000/quote/?name=SomeCompany&floor=1F`
- **请求参数**:
  - `name`: 公司名称
  - `floor`: 楼层类型（例如 `1F`、`2F` ）
- **成功响应**:
  ```json
  {
    "match": false,
    "rate": {
      "id": 1,
      "name": "Regular",
      "floor_rate": 14.85,
      "rental_rate": 0.9,
      "gable_rate": 30,
      "ground_floor_rate": 14.85,
      "ground_floor_rental_rate": 0.9,
      "first_floor_rate": 16.6,
      "first_floor_rental_rate": 0.9
    }
  }
  ```

## 2. 添加公司 (/quote/add)

- **方法**: `POST`
- **请求 URL**: `http://localhost:3000/quote/add`
- **请求体**:

```json
{ "name": "NewCompany" }
```

- **成功相应**:

```json
{
  "message": "Company added successfully",
  "company": {
    "id": 4,
    "name": "NewCompany"
  }
}
```

## 3.获取一个 rate category 的单价 (/rate/:id)

- **方法**: `GET`
- **请求 URL**: `http://localhost:3000/quote/rate/1`
- **请求体**:
  None
- **成功相应**:

```json
{
  "id": 1,
  "name": "Regular",
  "floor_rate": 14.85,
  "rental_rate": 0.9,
  "gable_rate": 30,
  "ground_floor_rate": 14.85,
  "ground_floor_rental_rate": 0.9,
  "first_floor_rate": 16.6,
  "first_floor_rental_rate": 0.9
}
```

## 4.添加新 rate category (/createRate)

- **方法**: `POST`
- **请求 URL**: `http://localhost:3000/quote/createRate`
- **请求体**:

```json
{
  "name": "Premium",
  "floor_rate": 18.0,
  "rental_rate": 1.0,
  "gable_rate": 35.0,
  "ground_floor_rate": 18.0,
  "ground_floor_rental_rate": 1.0,
  "first_floor_rate": 20.0,
  "first_floor_rental_rate": 1.1
}
```

- **成功相应**:

```json
{
  "message": "Rate created successfully",
  "rateId": 3
}
```

## 5.删除 Rate 分类 (/rate/:id)

- **方法**: `DELETE`
- **请求 URL**: `http://localhost:3000/quote/rate/3`
- **请求体**:
  None
- **成功相应**:

```json
{
  "message": "Rate category deleted successfully"
}
```

## 6.添加公司到 Rate 分类 (/mapRate)

- **方法**: `POST`
- **请求 URL**: `http://localhost:3000/quote/mapRate`
- **请求体**:

```json
{
  "companyId": 5,
  "floorType": "1F",
  "rateId": 1
}
```

- **成功相应**:

```json
{
  "message": "Mapping created successfully"
}
```

## 7.删除公司在 Rate 分类 (/unmapRate)

- **方法**: `DELETE`
- **请求 URL**: `http://localhost:3000/quote/unmapRate`
- **请求体**:

```json
{
  "companyId": 5,
  "floorType": "1F",
  "rateId": 1
}
```

- **成功相应**:

```json
{
  "message": "Mapping removed successfully"
}
```

## 8.获取所有公司 (/companies)

- **方法**: `GET`
- **请求 URL**: `http://localhost:3000/quote/companies`
- **请求体**:
  None
- **成功相应**:

```json
{
  "companies": [
    {
      "id": 2,
      "name": "NewCompany",
      "created_at": "2025-06-25 03:42:10"
    },
    {
      "id": 3,
      "name": "Acme Corp",
      "created_at": "2025-06-25 04:30:30"
    },
    {
      "id": 4,
      "name": "NewCompany",
      "created_at": "2025-07-03 01:09:24"
    },
    {
      "id": 5,
      "name": "NewCompany",
      "created_at": "2025-07-03 01:49:24"
    },
    {
      "id": 6,
      "name": "Kevler Home",
      "created_at": "2025-07-03 01:55:05"
    }
  ]
}
```

## 9.获取所有 rates (/allRates)

- **方法**: `GET`
- **请求 URL**: `http://localhost:3000/quote/allRates`
- **请求体**:
  None
- **成功相应**:

```json
{
  "allRates": [
    {
      "id": 1,
      "name": "Regular",
      "floor_rate": 14.85,
      "rental_rate": 0.9,
      "gable_rate": 30,
      "ground_floor_rate": 14.85,
      "ground_floor_rental_rate": 0.9,
      "first_floor_rate": 16.6,
      "first_floor_rental_rate": 0.9
    },
    {
      "id": 2,
      "name": "HighRate",
      "floor_rate": 20,
      "rental_rate": 1.2,
      "gable_rate": 35,
      "ground_floor_rate": 21,
      "ground_floor_rental_rate": 1.2,
      "first_floor_rate": 22,
      "first_floor_rental_rate": 1.2
    }
  ]
}
```

/companies/:id

## 10.删除一个公司(/companies/:id)

- **方法**: `GET`
- **请求 URL**: `http://localhost:3000/quote/companies/1`
- **请求体**:
  None
- **成功相应**:

```json
{
  "message": "Company and its mappings deleted successfully"
}
```

## 11.修改一个 rate category(/rate/:id)

- **方法**: `PUT`
- **请求 URL**: `http://localhost:3000/quote/rate/4`
- **请求体**:

```json
{
  "name": "Updated Rate",
  "floor_rate": 100,
  "rental_rate": 100,
  "gable_rate": 200,
  "ground_floor_rate": 300,
  "ground_floor_rental_rate": 350,
  "first_floor_rate": 400,
  "first_floor_rental_rate": 450
}
```

- **成功相应**:

```json
{
  "message": "Rate updated successfully",
  "rateId": "4"
}
```
