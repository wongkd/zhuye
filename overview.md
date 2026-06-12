# zhuye 1.7 主题切换与手机端稳定优化进度概览

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

## 最新微调：移动端内容出现节奏

- 用户确认连续上下滑已稳定，之前约 3 秒重排问题未复发。
- 本轮只做小幅动效节奏微调：移动端仍坚持 `IntersectionObserver + CSS transition`，不恢复移动端 GSAP ScrollTrigger。
- 将移动端 reveal 全局级联延迟从 `72ms / 420ms` 收敛为 `46ms / 260ms`。
- 新增同一 section 内的 `showSectionGroup()`：当板块中任一元素进入触发区，会把该板块剩余内容以更短 `38ms / 190ms` 的节奏集中展示，减少用户需要多次下滑才看完整个板块的问题。
- IntersectionObserver 触发区改为 `rootMargin: '18% 0px -8% 0px'`、`threshold: .06`，让内容更早、更自然进入视野。
- 移动端 reveal 位移从 `42px` 收敛到 `30px`，blur 从 `10px` 收敛到 `8px`，duration 从 `820ms` 收敛到 `720ms`，保留苹果官网式柔和过渡但避免信息出现过慢。

## 验证结果

- `assets/site.js` 语法检查通过。
- `git -C personal-portfolio diff --check` 通过。
- 已确认移动端仍会 kill ScrollTrigger，移动端 reveal 使用新的更早触发与板块成组显示策略。

## 本轮调整：报价预估两屏式拆分与动画参数

- 按用户最新要求调整移动端 reveal 参数：全局级联 `60ms / 350ms`，板块内集中出现 `40ms / 200ms`。
- 动画幅度恢复为 `translateY(42px)`、`blur(10px)`，时长保持 `720ms`，继续使用 Apple-like cubic easing。
- 保持移动端不使用 GSAP ScrollTrigger，仍为 `IntersectionObserver + CSS transition`，避免 3 秒重排问题复发。
- 将“报价预估”移动端拆成两段视口级内容：红框标题说明作为第一屏，蓝框报价表单作为第二屏。
- 移动端 `.contact-copy` 设置为 `min-height:100svh` 并垂直居中，`.quote-form` 设置为接近一屏高度；用户从说明页滑动一次即可进入表单页。

## 验证结果

- `assets/site.js` 语法检查通过。
- `git -C personal-portfolio diff --check` 通过。
- 已打开本地预览，重点检查手机端“报价预估”说明与表单是否分屏自然。

## 1.7 本轮调整：显式主题切换

- 将 `index.html` 的 `app-version` 更新为 `1.7`。
- 新增导航栏主题切换按钮：桌面端位于导航链接区，手机端位于“菜单”按钮左侧。
- 主题模式支持 `系统 → 浅色 → 深色` 循环切换，并保存到 `localStorage: blry-theme-mode`。
- `assets/theme-init.js` 已在首屏阶段读取保存的主题模式，避免浅深色切换闪烁。
- `assets/site.js` 保持系统主题监听：仅在“系统”模式下跟随系统浅深色变化。
- 主题按钮使用无文字图标 + 屏幕阅读器标签，保留 Apple-like 的轻量玻璃质感和触感反馈。

## 1.8 本轮调整：CMS 安全同步与版本记忆点

- 编辑器版本号更新为 `v1.8`。
- 新增“当前内容版本”面板：进入编辑器后读取 GitHub `content.js` 当前 SHA 与最近提交说明。
- 新增“本次修改说明”输入框：同步到 GitHub 时写入可读提交信息，Worker 自动规范为 `cms: ...`。
- 新增保存防覆盖机制：编辑器保存时携带打开时读取到的 `baseSha`，Worker 写入前重新读取 GitHub 当前 SHA；如果不一致返回 `409 STALE_CONTENT`，提示先刷新编辑器，避免覆盖已经确认的线上版本。
- 优化版本历史显示：优先展示 `cms:` 后面的内容标题，再显示短 SHA、时间和作者，增强回退时的记忆点。
- 保存成功提示增加“本地开发前请先 git pull”。

## 1.9 本轮调整：后台图片编辑区域紧凑化

- 优化 `editor.html` 所有图片编辑组件布局，图片预览从大幅纵向占位改为左侧紧凑预览 + 右侧编辑控件。
- 图片预览统一使用 `object-fit: contain`，避免 LOGO、竖图在后台被放大到占据整屏。
- 按图片类型限制预览高度：LOGO 更小、Hero 主图适中、案例图横向紧凑。
- 图片 URL、上传裁剪、复制地址、恢复原图和保护提示集中在右侧，减少滚动距离，提高后台空间利用率。
- 增加 1100px 与 900px 响应式规则，窄屏自动恢复上下布局。

## 后续建议

- 云端后台保存后，本地继续开发前先执行 `git pull origin main`，让后台内容成为本地最新基线。
- 后续若内容更新更频繁，可再升级为 `content-history.json` 结构化版本日志。
