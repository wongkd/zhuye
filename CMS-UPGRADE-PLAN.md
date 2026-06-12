# 个人站内容管理升级方案

当前已经实现：**本地一键保存 content.js**。

---

## 方案 1：本地自动写入文件（已完成）

### 适合场景

- 本地制作个人站
- 频繁修改文案
- 不想每次手动导出替换文件
- 部署前先在电脑上调好内容

### 使用方式

1. 双击：

```text
personal-portfolio/start-editor.bat
```

2. 浏览器打开：

```text
http://127.0.0.1:5177/editor.html
```

3. 修改内容后点击：

```text
保存到本地文件
```

4. 自动写入：

```text
personal-portfolio/content.js
```

同时会自动生成备份：

```text
content.backup.时间戳.js
```

### 优点

- 不需要账号
- 不需要数据库
- 不依赖网络
- 最稳、最快

### 缺点

- 只能在本机保存
- 线上网站不会自动更新，需要重新部署

---

## 方案 2：同步到 GitHub

### 适合场景

- 网站部署在 GitHub Pages / Vercel / Cloudflare Pages / EdgeOne Pages
- 希望点击保存后自动提交到 GitHub
- GitHub 仓库变动后自动触发部署

### 基本流程

```text
editor.html
  ↓
GitHub API
  ↓
更新 content.js
  ↓
自动 commit
  ↓
Pages 自动部署
```

### 需要准备

- GitHub 仓库
- GitHub Personal Access Token
- 仓库名，例如：`wongkd/portfolio`
- 文件路径，例如：`personal-portfolio/content.js` 或 `content.js`
- 部署平台自动构建设置

### 优点

- 点击保存后可自动上线
- 有 Git 历史记录
- 可回滚

### 缺点

- 需要处理 Token 安全
- 纯前端直接放 Token 不安全
- 更推荐使用 Cloudflare Worker / GitHub Action 中转保存

### 推荐安全架构

```text
editor.html
  ↓
Cloudflare Worker 鉴权
  ↓
GitHub API
  ↓
更新 content.js
```

Token 只放在 Worker 环境变量里，不暴露给浏览器。

---

## 方案 3：腾讯文档当后台 CMS

### 适合场景

- 想像改表格一样改网站内容
- 手机也能修改内容
- 不想每次打开代码或本地编辑器
- 多人协作维护内容

### 推荐表格结构

#### Sheet 1：基础信息

| key | value |
|---|---|
| site.title | 个人作品集 | Portfolio |
| hero.titleHighlight | 创造 |
| hero.titleMain | 数字体验 |
| contact.email | hello@example.com |

#### Sheet 2：项目作品

| title | category | year | description | image | link |
|---|---|---|---|---|---|
| 未来科技品牌视觉系统 | 品牌设计 | 2024 | xxx | image-url | # |

#### Sheet 3：经历

| role | company | period | description |
|---|---|---|---|
| 高级视觉设计师 | 某公司 | 2022 - 至今 | xxx |

### 同步方式

推荐用一个脚本或接口做同步：

```text
腾讯文档表格
  ↓
同步脚本 / API
  ↓
生成 content.js
  ↓
网站读取 content.js
```

### 优点

- 最直观
- 手机可改
- 适合内容协作

### 缺点

- 接入比本地保存复杂
- 需要处理权限、缓存和同步时机
- 表格结构一旦乱改，前端可能解析失败

---

## 推荐路线

### 当前阶段

用已完成的：

```text
本地自动写入文件
```

先把内容打磨好。

### 部署阶段

如果你要上线到 GitHub / Cloudflare Pages / EdgeOne Pages，再升级：

```text
GitHub 同步方案
```

### 后期多人维护

如果希望非技术人员也能改内容，再升级：

```text
腾讯文档 CMS
```

---

## 当前已完成文件

| 文件 | 作用 |
|---|---|
| `server.js` | 本地保存服务 |
| `start-editor.bat` | 一键启动编辑器服务 |
| `editor.html` | 可视化编辑器，已支持保存到本地文件 |
| `content.js` | 网站内容数据源 |
| `index.html` | 网站页面 |

---

## 下一步可继续做

如果要继续升级，我建议二选一：

1. **接 GitHub 自动部署**：适合个人站真正上线
2. **接腾讯文档 CMS**：适合手机/多人维护内容
