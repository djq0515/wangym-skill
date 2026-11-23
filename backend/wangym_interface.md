# 接口记录（追加写入）

<!-- 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash -->

统一响应格式：`{ "code": 0, "msg": "提示信息", "data": {...} }`，`code=0` 表示成功，非 0 表示失败。

服务地址：`http://localhost:8201`，所有接口以 `/api/` 为前缀，所有跨域请求均放行。

---

## 2026-11-23 13:58 | GET /api/news

- **接口路径**：`/api/news`
- **HTTP 方法**：GET
- **请求参数**：无（示例：`GET http://localhost:8201/api/news`）
- **响应格式**：

```json
{
  "code": 0,
  "msg": "获取科技新闻列表成功",
  "data": [
    {
      "wangym_id": 1,
      "wangym_title": "国产大模型集体升级：千亿参数开源版本密集发布",
      "wangym_source": "新华社",
      "wangym_summary": "本周多家国内厂商陆续开源千亿参数大模型……",
      "wangym_content": "本周国内大模型领域迎来密集发布潮……",
      "wangym_url": "https://www.news.cn/tech/",
      "wangym_views": 12840,
      "wangym_publish_time": "2026-11-21T01:30:00.000Z"
    }
  ]
}
```

- **修改时间**：2026-11-23 13:58

---

## 2026-11-23 13:58 | GET /api/gallery

- **接口路径**：`/api/gallery`
- **HTTP 方法**：GET
- **请求参数**：无（示例：`GET http://localhost:8201/api/gallery`）
- **响应格式**：

```json
{
  "code": 0,
  "msg": "获取图文列表成功",
  "data": [
    {
      "wangym_id": 1,
      "wangym_title": "未来城市天际线",
      "wangym_description": "玻璃幕墙与霓虹灯光交织，勾勒出科技感十足的城市轮廓。",
      "wangym_image_url": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=...&image_size=landscape_4_3",
      "wangym_author": "林晓",
      "wangym_likes": 328,
      "wangym_create_time": "2026-11-20T12:15:00.000Z"
    }
  ]
}
```

- **修改时间**：2026-11-23 13:58

---

## 2026-11-23 13:58 | POST /api/database/test

- **接口路径**：`/api/database/test`
- **HTTP 方法**：POST
- **请求参数**（JSON Body，示例）：

```json
{
  "username": "root",
  "password": "123456",
  "database": "wangym_zhihu"
}
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| username | string | 是 | 数据库用户名 |
| password | string | 否 | 数据库密码 |
| database | string | 是 | 要连接的数据库名 |

- **响应格式（成功）**：

```json
{
  "code": 0,
  "msg": "数据库连接成功",
  "data": {
    "wangym_version": "8.0.30",
    "wangym_database": "wangym_zhihu",
    "wangym_user": "root@localhost"
  }
}
```

- **响应格式（失败）**：

```json
{
  "code": 1,
  "msg": "数据库连接失败：Access denied for user 'root'@'localhost' (using password: YES)",
  "data": null
}
```

- **修改时间**：2026-11-23 13:58
