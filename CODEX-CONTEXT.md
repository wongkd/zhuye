# Codex 上下文入口

这个项目是 `zhuye.huangqidong.cn` 的静态官网。为了让 GPT 5.3 Codex 在 128K 上下文内稳定工作，后续优先读取本文件和下列核心文件，不要一次性读取 `archive/`。

## 当前核心文件

| 文件 | 用途 | 何时读取 |
|---|---|---|
| `index.html` | 官网首页、样式、桌面/移动端动画、编辑入口认证 | 改首页布局、动画、视觉、导航、LOGO 显示 |
| `content.js` | 网站文案和图片配置，`window.SITE_CONTENT` | 改文案、图片 URL、LOGO 字段、案例内容 |
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

- 线上稳定版：`v0.9`。
- 本地开发版：`1.0-desktop-beta`，尚未推线上。
- 1.0 已包含：桌面固定分段滚动动画、编辑入口密码认证、编辑器图片上传裁剪压缩、顶部按钮精简、公司 LOGO 上传入口。

## 编辑原则

1. 优先修改现有核心文件，不要复制生成整份备份进入根目录。
2. 如需备份，放入 `archive/backups/`，不要留在根目录。
3. 后续给 Codex 的提示应指定具体文件和目标，避免“读整个项目”。
4. `v0.9` 是 Git 回退标签，不要把版本号做成 URL 参数。
5. 正常访问地址保持 `https://zhuye.huangqidong.cn/`。
