# 知乎制作和模仿

- 学号：24002060518
- 姓名：王一鸣
- 项目类别：模仿（Vibe Coding 全栈项目）

## 项目简介

本项目模仿知乎的页面风格与交互方式，完成了一个基于原生前端 + Node.js/Express + MySQL 的全栈示例项目，包含首页导航、数据库连接测试、科技新闻列表、图文列表、AI 聊天和在线客服六个页面。

## 技术栈

- 前端：原生 HTML / CSS / JavaScript（无任何第三方库、框架、CDN）
- 后端：Node.js + Express（RESTful + MVC，端口 8201，开放跨域，托管前端静态资源）
- 数据库：MySQL 8.0

## 目录结构

```
.
├── AGENTS.md                  # 项目开发规则
├── README.md                  # 项目说明
├── 运行后台.bat               # 一键启动后端服务
├── wangym_prompt.md           # 开发指令记录
├── frontend/                  # 前端
│   ├── index.html             # 首页（canvas 粒子背景动画 + 导航）
│   ├── database.html          # 数据库连接测试
│   ├── news.html              # 科技新闻列表
│   ├── gallery.html           # 图文列表
│   ├── chat.html              # AI 聊天（硅基流动）
│   ├── service.html           # 在线客服（七牛）
│   ├── css/                   # 样式
│   ├── js/                    # 脚本
│   ├── fonts/                 # 图标字体（预留）
│   └── images/                # 本地图片（预留）
└── backend/                   # 后端
    ├── app.js                 # 服务入口
    ├── .env                   # 数据库凭据（不提交 git）
    ├── config/                # 数据库连接池
    ├── models/                # 数据模型
    ├── controllers/           # 控制器
    ├── routes/                # 路由
    ├── wangym_interface.md    # 接口记录
    └── wangym_database.md     # 数据库重建 SQL 记录
```

## 启动方式

1. 确认 MySQL 服务已启动（默认端口 3306）。
2. 双击根目录下的 `运行后台.bat`，或在 `backend` 目录执行：

```bash
node app.js
```

3. 浏览器访问：http://localhost:8201/index.html

> 数据库凭据保存在 `backend/.env` 中，变量为 `DB_USER`、`DB_PASSWORD`、`DB_HOST`、`DB_NAME`。
> AI 密钥同样写在 `backend/.env`：`SILICONFLOW_API_KEY`（AI 聊天）、`QINIU_API_KEY`（在线客服）。

## 页面入口

- 首页：http://localhost:8201/index.html
- 数据库连接测试：http://localhost:8201/database.html
- 科技新闻列表：http://localhost:8201/news.html
- 图文列表：http://localhost:8201/gallery.html
- AI 聊天：http://localhost:8201/chat.html
- 在线客服：http://localhost:8201/service.html

## 接口列表

| 接口路径 | 方法 | 说明 |
| --- | --- | --- |
| /api/news | GET | 获取科技新闻列表 |
| /api/gallery | GET | 获取图文列表 |
| /api/database/test | POST | 使用输入的账号密码测试数据库连接 |
| /api/chat | POST | AI 聊天 / 在线客服，按 provider 转发到大模型 |

统一响应格式：`{ "code": 0, "msg": "提示信息", "data": {...} }`，`code=0` 表示成功。

## 在线访问与发布

- GitHub 仓库：https://github.com/djq0515/wangym-skill
- GitHub Pages（在线页面）：https://djq0515.github.io/wangym-skill/
- Pages 发布方式：`main` 分支的 `/docs` 目录（[docs/index.html](docs/index.html) 为自包含落地页，不依赖后端）
- 自定义 Skill 目录：`.trae/skills/wangym-zhihu-clone/`（含 `SKILL.md` 与 `assets/wangym_database.sql`）

> 本地开发仍通过 `http://localhost:8201` 访问完整功能；Pages 只发布静态落地页。

