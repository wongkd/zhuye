# zhuye.huangqidong.cn 上线与 GitHub + Cloudflare Worker 连接方案

目标域名：

```text
zhuye.huangqidong.cn
```

母域名：

```text
huangqidong.cn
```

---

## 当前状态

已在项目内准备好：

| 文件 | 作用 |
|---|---|
| `index.html` | 个人站页面 |
| `content.js` | 网站内容数据源 |
| `editor.html` | 可视化编辑器 |
| `server.js` | 本地保存服务 |
| `cloudflare-worker.js` | 线上保存 API，负责把内容同步到 GitHub |
| `wrangler.toml` | Cloudflare Worker 配置 |
| `start-editor.bat` | 本地一键启动编辑器 |

---

## 推荐架构

```text
zhuye.huangqidong.cn
  ↓
Cloudflare Pages / 静态站点
  ↓
读取 content.js 展示个人站

editor.html
  ↓ 点击“同步到 GitHub”
Cloudflare Worker: zhuye-portfolio-cms
  ↓ 安全调用 GitHub API
GitHub 仓库：wongkd/zhuye
  ↓ content.js 更新触发部署
Cloudflare Pages 自动发布
```

---

## 第 1 步：创建 GitHub 仓库

建议仓库名：

```text
wongkd/zhuye
```

仓库内容直接放这些文件：

```text
index.html
content.js
editor.html
CMS-UPGRADE-PLAN.md
DEPLOY-ZHUYE.md
```

可选文件：

```text
CUSTOMIZE-GUIDE.md
REACT-VERSION.md
```

不建议上传：

```text
content.backup.*.js
```

---

## 第 2 步：Cloudflare Pages 部署静态站

### Pages 设置

| 配置项 | 值 |
|---|---|
| Project name | `zhuye` |
| Production branch | `main` |
| Framework preset | None / Static HTML |
| Build command | 留空 |
| Build output directory | `/` |

### 绑定自定义域名

在 Cloudflare Pages 项目中添加 Custom domain：

```text
zhuye.huangqidong.cn
```

如果 `huangqidong.cn` 已接入 Cloudflare，Pages 会自动添加 CNAME。

---

## 第 3 步：部署 Cloudflare Worker 保存 API

### Worker 名称

```text
zhuye-portfolio-cms
```

### 配置文件

项目已生成：

```text
wrangler.toml
```

默认配置：

```toml
name = "zhuye-portfolio-cms"
main = "cloudflare-worker.js"
compatibility_date = "2026-06-12"

[vars]
GITHUB_OWNER = "wongkd"
GITHUB_REPO = "zhuye"
GITHUB_BRANCH = "main"
GITHUB_CONTENT_PATH = "content.js"
ALLOWED_ORIGIN = "https://zhuye.huangqidong.cn"
```

### 设置密钥

不要把密钥写进文件。用命令设置：

```bash
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put CMS_PASSWORD
```

说明：

| Secret | 说明 |
|---|---|
| `GITHUB_TOKEN` | GitHub Personal Access Token，至少有目标仓库 contents write 权限 |
| `CMS_PASSWORD` | 编辑器同步时输入的保存密码 |

### 部署 Worker

```bash
npx wrangler deploy
```

部署成功后会得到类似：

```text
https://zhuye-portfolio-cms.xxx.workers.dev
```

保存接口就是：

```text
https://zhuye-portfolio-cms.xxx.workers.dev/api/save-content
```

---

## 第 4 步：编辑器同步到 GitHub

打开线上编辑器：

```text
https://zhuye.huangqidong.cn/editor.html
```

点击：

```text
同步到 GitHub
```

第一次会提示输入：

1. Worker 保存接口地址
2. CMS 保存密码

之后浏览器会记住接口地址；密码只保存在当前会话。

---

## 第 5 步：上线检查

访问：

```text
https://zhuye.huangqidong.cn
```

检查：

- 首页是否正常加载
- `content.js` 是否是最新内容
- `editor.html` 是否能打开
- 点击“同步到 GitHub”是否生成新 commit
- Cloudflare Pages 是否自动重新部署

---

## 当前环境限制

当前机器状态：

- GitHub CLI 未登录
- Wrangler 未登录

所以我已经把代码和配置准备好，但不能直接替你完成线上登录、创建仓库和部署。

你需要先登录：

```bash
gh auth login
npx wrangler login
```

登录后，我可以继续帮你执行：

1. 创建 `wongkd/zhuye` GitHub 仓库
2. 推送当前个人站代码
3. 部署 Cloudflare Worker
4. 绑定 `zhuye.huangqidong.cn`
5. 测试线上同步保存

---

## 安全说明

不要把以下内容写进前端文件：

- GitHub Token
- Cloudflare Token
- CMS 保存密码

正确做法：

- GitHub Token 放在 Cloudflare Worker Secret
- CMS 保存密码放在 Cloudflare Worker Secret
- 前端只输入密码，不保存长期密钥
