# Codex 上下文入口

这个项目是 `zhuye.huangqidong.cn` 的静态官网。为了让 GPT 5.3 Codex 在 128K 上下文内稳定工作，后续优先读取本文件和下列核心文件，不要一次性读取 `archive/`。

## 当前核心文件

| 文件 | 用途 | 何时读取 |
|---|---|---|
| `index.html` | 官网首页轻量入口，加载 CDN、字体、`content.js` 与拆分后的静态资源 | 改页面入口、外部资源引用、基础容器 |
| `assets/site.css` | 官网主样式，包含桌面端、移动端、暗色主题、卡片和表单样式 | 改首页布局、响应式、视觉、动画初始态 |
| `assets/site.js` | 官网主交互脚本，负责渲染内容、导航、登录入口、表单、GSAP/Three.js 初始化 | 改页面结构、动画、导航行为、表单逻辑 |
| `assets/theme-init.js` | 早期主题初始化，避免加载时明暗主题闪烁 | 改主题探测或首屏主题策略 |
| `content.js` | 网站文案和图片配置，`window.SITE_CONTENT` | 改文案、图片 URL、LOGO 字段、案例内容、计价方式 |
| `editor.html` | 内容编辑器、密码门禁、图片上传裁剪压缩、GitHub 同步按钮 | 改编辑器、表单、上传、裁剪、同步体验 |
| `cloudflare-worker.js` | 线上 CMS 保存接口，负责鉴权并写入 GitHub | 改同步 GitHub、鉴权、CORS、Worker 响应 |
| `server.js` | 本地预览和本地保存服务 | 改本地编辑流程或 API |
| `wrangler.toml` | Cloudflare Worker 配置 | 改 Worker 名称、兼容日期等配置 |
| `CNAME` | GitHub Pages 自定义域名 | 域名变更时读取 |
| `assets/logo.png` | 公司 LOGO 图形icon（透明背景，无文字，1144x617px） | 更换 LOGO 或 favicon 时读取 |
| `assets/` | 网站静态资源目录 | 上传新资源时写入 |

## 不要默认读取

- `archive/backups/`：历史备份文件，只在需要回滚或对比旧版时读取。
- `archive/docs/`：早期方案文档，只在需要查旧部署说明或旧 React 方案时读取。
- `.wrangler/`：本地缓存，已被 `.gitignore` 忽略。

## 当前版本状态

- 线上版本：`v1.5` 已发布并继续小步修复，当前推进 `v1.6` 手机端优化。
- 最新提交：以仓库 `main` 为准；1.6 本地改动完成验证后再提交。
- 1.5 已包含：Apple 风格桌面滚动揭示动画、编辑入口密码认证、编辑器图片上传裁剪压缩、顶部按钮精简、公司 LOGO、编辑器同步状态、草稿保护、版本历史/回退、Cloudflare Worker 自动部署。
- 最新结构优化：`index.html` 已拆分为轻量入口，样式在 `assets/site.css`，主脚本在 `assets/site.js`，主题初始化在 `assets/theme-init.js`，降低单文件上下文压力。
- 1.6 移动端方向：杂志风 + 竖向卡片式上下滑体验，不做手机端横向滑动；“关于表里如一”在手机端和电脑端都完整保留；原“服务能力”板块替换为“计价方式”，沿用原服务能力卡片模板。

## 编辑原则

1. 优先修改现有核心文件，不要复制生成整份备份进入根目录。
2. 如需备份，放入 `archive/backups/`，不要留在根目录。
3. 后续给 Codex 的提示应指定具体文件和目标，避免“读整个项目”。
4. `v0.9` 是 Git 回退标签，不要把版本号做成 URL 参数。
5. 正常访问地址保持 `https://zhuye.huangqidong.cn/`。
