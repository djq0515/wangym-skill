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
