# 开发指令记录（追加写入）

<!-- 姓名：王一鸣 | 学号：24002060518 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash -->

## 2026-11-23 13:58 | 大模型：DeepSeek-V4.1-Flash

**提示词全文：**

```text
基于vibe coding的全栈项目的开发基本流程
（零）安装node.js,24以上版本，尽量已安装cnpm。
（一）创建项目（文件夹），设立规则AGENTS.md
     修改给定提示词，也可自行设置提示词。
（二）初始化项目。
提示词参考：
请初始化本项目：
1、 git init + .gitignore（排除 node_modules、.env）+ 首次提交
2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖、
3、创建前端首页index.html，包括姓名王一鸣、学号24002060518、项目名称知乎制作和模仿、项目类别：模仿，所有完成的html页面的超链接。有canvas背景动画。主体是页面链接导航。页面美观。
4、创建readme.md，在根目录下，包括学号、姓名。
（三）运行和查看项目。
创建运行后台的bat文件，在根目录下。
（四）测试数据库链接（mysql数据库需要，sqllite不需要）。
创建database.html页面，输入用户名，密码，链接数据库，数据库使用mysql，成功和错误都有提示，默认用户名root，密码123456。
（五）完成科技新闻列表页面，新闻的数据存在数据库表里。网页显示后端接口链接和数据内容。
（六）完成图文列表，图片可以使用网络图片或创建图片，创建一个新的表，网页显示后端接口链接和数据内容。。
```

---

## 2026-11-23 14:05 | 大模型：DeepSeek-V4.1-Flash

**提示词全文：**

```text
按照要求一步一步帮我去实践 一些重要信息记得帮我去留存
（附图：《自定义 Skill · GitHub 上传与 Pages 发布》操作指南，共 5 步：
1 准备工作：watt 网络加速 → 登录 GitHub → 准备 git 公钥（没有则先创建）
2 设置公钥与私人令牌：GitHub 添加 SSH 公钥，再申请 Personal Access Token
3 创建仓库
4 Trae 创建 Skill 并 push
5 Pages 发布上线）
```

**实践环境记录：**
- GitHub 主站 https://github.com 访问超时（需网络加速），https://api.github.com 可正常访问
- 本机尚未安装 watt；~/.ssh 下暂无公私钥（仅 config、known_hosts）
- git 全局身份：wangyi / 1402473134@qq.com
- 项目当前无 git remote

---

## 2026-11-23 14:35 | 大模型：DeepSeek-V4.1-Flash

**实践结果（GitHub 上传与 Pages 发布）：**

| 项目 | 结果 |
| --- | --- |
| 网络加速 | 已通过镜像 gh-proxy.com 下载并安装 Watt Toolkit 3.2.0，GitHub 网页与 git SSH 均可访问 |
| SSH 密钥 | `C:\Users\123\.ssh\id_ed25519_3957378155`，注释 `3957378155@qq.com`，指纹 `SHA256:9guNYKJUAXExF2FzGINRjAn2kFKYaE7TvRdsjy0X3lo`（已加入 GitHub，标题 wangym-laptop） |
| GitHub 账号 | djq0515 |
| 仓库 | https://github.com/djq0515/wangym-skill （Public，主分支 main） |
| 自定义 Skill | `.trae/skills/wangym-zhihu-clone/SKILL.md` + `assets/wangym_database.sql` |
| Pages 发布 | main 分支 `/docs` 目录，站点 https://djq0515.github.io/wangym-skill/ |
| 提交记录 | db71da3 初始化规则 → d28c593 Skill 与落地页 → 6de9fe4 更新仓库地址 → 本次留存提交 |

**注意事项（排错留存）：**
- 生成密钥时 PowerShell 传入 `-N '""'` 会把口令设成两个引号字符，导致 SSH 报 `Permission denied (publickey)`；已用 `ssh-keygen -p -P '""' -N ''`（通过 .NET ArgumentList 传参）清除口令
- 推送时若 `github.com` 网页不可达，可先确认 Watt Toolkit 的 GitHub 加速已开启；SSH 认证可用 `ssh -T git@github.com` 自检
- 私钥、`.env`、`node_modules` 均未提交到仓库

---

## 2026-11-23 14:52 | 大模型：DeepSeek-V4.1-Flash

**提示词全文：**

```text
`https://wonderful-mousse-e19f9b.netlify.app/`完成这个里面的步骤
```

**执行结果（课件《自定义 Skill · GitHub 上传 与 Pages 发布》逐项核对）：**

| 课件步骤 | 状态 | 说明 |
| --- | --- | --- |
| 1 准备工作（watt 加速、登录 GitHub、准备公钥） | 已完成 | Watt Toolkit 3.2.0 已安装并加速；账号 djq0515；密钥 id_ed25519_3957378155 |
| 2 设置公钥与私人令牌 | 已完成 | SSH 公钥已添加（wangym-laptop）；PAT 已创建：Note `wangym-skill-pages`，Scope `repo`，有效期 30 天（令牌值仅显示一次，未记录、未写入任何文件） |
| 3-6 GitHub 网页操作（Settings → SSH keys → New repository） | 已完成 | 仓库 djq0515/wangym-skill（Public） |
| 4 创建 Skill 并 push | 已完成 | `.trae/skills/wangym-zhihu-clone/`，main 分支已推送 |
| 5 Pages 发布 | 已完成 | https://djq0515.github.io/wangym-skill/ （main /docs） |

> 课件中的示例仓库 `Chen-Yingyu/cheney.git` 为讲师占位地址，实际使用本人仓库 `djq0515/wangym-skill`。

---

## 2026-11-23 15:40 | 大模型：DeepSeek-V4.1-Flash

**提示词全文：**

```text
根据这个步骤帮我去做
（附件：LLM设计 - 2026.docx）
```

**文档要求与完成情况：**

| 文档步骤 | 状态 | 说明 |
| --- | --- | --- |
| 1 申请免费 API Key（硅基流动 / 七牛） | 已完成 | 硅基流动：实名认证、领取 16 元认证奖励券、创建密钥 `wangym-chat`（值仅写入 backend/.env） |
| 2 使用硅基流动 Key 创建 AI 聊天应用 | 已完成 | 新增 `POST /api/chat`、`frontend/chat.html`、`frontend/js/wangym_chat.js`，模型 `deepseek-ai/DeepSeek-V4-Flash`，前后端控制台均输出收发数据 |
| 3 使用七牛 Key 完成在线客服 | 待配置 Key | `frontend/service.html` 已就绪，provider=qiniu、模型 `qiniu/conatus-free`；缺少 QINIU_API_KEY 时返回提示 |

**排错记录（402）：**
- 现象：聊天接口返回 402 `account balance insufficient`
- 原因：账户现金余额为 -0.0027 元（欠费），硅基流动只校验现金余额，16 元券不会先抵扣
- 处理：充值页支持自定义金额，充 1 元后余额变为 0.0972 元，接口随即返回 code=0，AI 聊天页端到端通过
- 结论：代金券不能用于充值或清欠，必须先让现金余额不为负

---

## 2026-11-23 16:30 | 大模型：DeepSeek-V4.1-Flash

**提示词全文：**

```text
完成知识库文件上传功能，构建2个知识库文件，完成基于知识库的问答，支持doc和docx，ppt，完成知识库管理（RAG）：基于本地文件（如 PDF/TXT）上传、解析，构建专属自动客服或问答系统，包括知识库文件上传模块。在控制台输出发送给大模型的数据和接受自大模型的数据。
```

**完成内容：**

1. 新增 3 张表：`wangym_kb`（8 条）、`wangym_kb_file`（8 条）、`wangym_kb_chunk`（8 条）
2. 新增 7 个接口：`/api/kb/list`、`/api/kb/create`、`/api/kb/:id`、`/api/kb/:id/upload`、`/api/kb/:id/files`、`/api/kb/file/:fileId`、`/api/kb/ask`
3. 文件解析：txt/md/csv/json 直接读取；docx 解压取 `word/document.xml`；pptx 按页取 `a:t`；pdf 用 pdf-parse；旧版 doc/ppt 做二进制可读串尽力解析
4. RAG 流程：文本切片（约 450 字、80 字重叠）→ 中文二元组关键词打分 → 取前 3 条拼提示词 → 调用 `deepseek-ai/DeepSeek-V4-Flash`
5. 新增页面 `frontend/kb.html` + `frontend/js/wangym_kb.js`：知识库新建/删除、文件上传/删除、检索问答与引用来源展示
6. 构建 2 个知识库文件：`docs/kb/课程项目常见问题.txt`（2 个切片）、`docs/kb/智能客服使用手册.docx`（1 个切片），已通过上传接口入库
7. 后端控制台输出「发送给大模型的数据」与「从大模型接收到的数据」

**验证结果：**

- 上传 txt / docx 均返回 code=0，切片数分别为 2 和 1
- `POST /api/kb/ask`（kb=3）返回技术栈答案，命中「课程答疑.txt」匹配分 26
- `POST /api/kb/ask`（kb=1）返回发布提问步骤，命中「产品常见问题.txt」匹配分 16
- 浏览器实测 `kb.html`：回答卡片与引用资料来源正常渲染
- 服务端日志确认打印了完整的模型请求与响应 JSON

---
