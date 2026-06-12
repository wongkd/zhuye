# zhuye 1.6 手机端与结构重构进度概览

## 已完成

- 将首页入口 `index.html` 拆分为轻量结构，降低单文件上下文压力。
- 新增 `assets/site.css` 承载主样式。
- 新增 `assets/site.js` 承载页面渲染、导航、登录入口、联系表单、GSAP/Three.js 初始化。
- 新增 `assets/theme-init.js` 负责首屏主题初始化。
- 恢复“关于表里如一” section：手机端和电脑端都完整保留标题、说明、流程卡片和统计数据。
- 将原“服务能力”板块替换为“计价方式”板块，并继续沿用原 `.skills-grid` / `.skill-card` 卡片模板。
- 计价方式包含：整装、传统报价式半包、特色式半包。
- 特色式半包明确突出：只收工程管理费，其他项目全部成本价。
- 更新 `CODEX-CONTEXT.md`，记录新的核心文件结构和 1.6 维护约束。

## 关键决策

- 计价方式不再放进 About 区，避免破坏“关于表里如一”的完整信息结构。
- 手机端继续坚持竖向上下滑卡片体验，不引入横向滑动。
- 新增价格/收费标准字段，但视觉仍继承服务能力卡片体系，保证两端一致。

## 验证结果

- `assets/site.js` 语法检查通过。
- `assets/theme-init.js` 语法检查通过。
- `content.js` 计价方式结构检查通过。
- `git diff --check` 通过。
- 已检查无旧的 `mobile-pricing-card` / `pricing-step` / `mobile-only-copy` / `desktop-only-copy` 遗留。
- 已检查手机端样式无 `overflow-x:auto`、`scroll-snap-type:x`、`grid-auto-flow:column`、`grid-auto-columns`。

## 后续建议

- 打开本地预览重点看 375px / 390px 手机端：About 是否完整、计价卡片是否清晰、是否无横向溢出。
- 视觉确认后再提交 Git。
