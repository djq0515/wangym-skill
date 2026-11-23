---
name: wangym-zhihu-clone
description: Scaffold a native HTML CSS JS plus Express and MySQL demo site with a tech news list, image gallery, and database connection test page. Use when the user asks to build or reproduce the Zhihu clone full-stack demo, or a native-frontend Express prototype. Do not use for React or Vue projects.
---

# 知乎制作和模仿（全栈示例）

复现「原生前端 + Express + MySQL」的全栈演示站：首页导航、数据库连接测试、科技新闻列表、图文列表。

## 约束

- 前端只用原生 HTML/CSS/JavaScript，禁止第三方库、框架、CDN 链接
- 后端 Node.js + Express，RESTful + MVC，所有接口以 `/api/` 为前缀，端口 8201
- `express.static` 托管 `frontend/`，CORS 全开放
- CSS 类名、JS 变量名、JS 函数名、数据库表名与字段一律以 `wangym_` 开头
- 数据库凭据只写入 `backend/.env`（DB_USER、DB_PASSWORD、DB_HOST、DB_NAME），并加入 `.gitignore`
- 统一响应 `{ "code": 0, "msg": "...", "data": {} }`，code=0 成功，非 0 失败
- 前端把接口数据与错误分别用 console.log / console.error 输出

## 目录

```text
frontend/  index.html database.html news.html gallery.html css/ js/ fonts/ images/
backend/   app.js .env config/ models/ controllers/ routes/
```

## 步骤

1. 建库建表：执行 `assets/wangym_database.sql`（科技新闻 `wangym_news`、图文 `wangym_gallery`，各 8 条测试数据）
2. 后端：`config/wangym_db.js` 建连接池；models 负责 SQL；controllers 返回统一 JSON；routes 挂载 `/api/news`、`/api/gallery`、`/api/database/test`
3. 前端：首页用 canvas 粒子连线动画做背景并放导航卡片；新闻页与图文页请求接口后渲染，并在页面顶部展示接口地址；数据库测试页提交用户名、密码、库名后显示成功或失败
4. 启动：`node backend/app.js` 或根目录 bat 脚本，访问 `http://localhost:8201/index.html`
5. 验证：`/api/news` 与 `/api/gallery` 均返回 code=0；`/api/database/test` 用正确账号返回 MySQL 版本，错误账号返回 code=1

## 验收

- 四个页面 HTTP 200，首页含姓名、学号、项目名称与类别，并链接所有已完成页面
- 新闻与图文数据来自数据库表，非硬编码
- 数据库错误提示清晰，且错误信息同时出现在浏览器控制台
