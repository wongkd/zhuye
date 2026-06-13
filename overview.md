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

## 1.9 本轮调整：后台入口与图片编辑体验修复

- 删除 `editor.html` 独立二次密码门禁，避免草稿恢复确认弹窗与密码页叠加导致认证流程异常。
- 编辑器现在直接进入后台界面；GitHub 同步、读取版本历史、回退版本等高风险操作仍保留接口密码校验。
- 清理 `authScreen`、`authBtn`、`authPassword`、`portfolio-cms-entry-ok` 等前端门禁逻辑，避免点击确认/取消后错误进入后台的流程缺陷。
- 移除进入编辑器时自动弹出的“检测到上次编辑草稿”确认框；现在默认加载线上内容，若需要旧草稿可在左侧“草稿备份”里手动点击“恢复草稿”。

## 1.9 本轮调整：后台图片编辑区域紧凑化

- 优化 `editor.html` 所有图片编辑组件布局，图片预览从大幅纵向占位改为左侧紧凑预览 + 右侧编辑控件。
- 图片预览统一使用 `object-fit: contain`，避免 LOGO、竖图在后台被放大到占据整屏。
- 按图片类型限制预览高度：LOGO 更小、Hero 主图适中、案例图横向紧凑。
- 图片 URL、上传裁剪、复制地址、恢复原图和保护提示集中在右侧，减少滚动距离，提高后台空间利用率。
- 增加 1100px 与 900px 响应式规则，窄屏自动恢复上下布局。

## 2.0 本轮调整：转化路径与二维码联系增强

- 将 Hero 主 CTA 从“查看服务案例”调整为“一键计算报价”，外链跳转到 `https://jisuanqi.huangqidong.cn`。
- 将 Hero 副 CTA 调整为“查看服务案例”，回到站内 `#projects` 案例区。
- 新增 `contact.channels` 内容结构，统一维护微信、抖音、小红书二维码渠道数据。
- 已接入微信与抖音二维码本地素材：`assets/images/contact/wechat-qr.png`、`assets/images/contact/douyin-qr.png`。
- 小红书先保留占位结构，前台显示“后台上传”占位卡片，后台已提供上传入口。
- 导航栏“联系我们”在桌面端新增 hover/focus 下拉二维码面板，展示三类联系渠道。
- 联系区新增扫码联系卡片组，与原联系链接、表单共同构成更明确的转化路径。
- “特色式半包”卡片增强为推荐方案：增加暖金描边、推荐角标、引导说明和轻量浮动/脉冲动效。
- 后台编辑器新增“二维码渠道”标签页，可维护渠道名称、角标、说明、链接、Alt 和二维码图片。

## 2.1 本轮调整：二维码纯净资产与书签扇形视觉

- 将微信、抖音原始平台截图二维码重构为纯净二维码资产：`assets/images/contact/wechat-qr-clean.png`、`assets/images/contact/douyin-qr-clean.png`，减少平台截图、文字和多余边框对官网视觉的干扰。
- `content.js` 已将微信、抖音二维码路径切换到 clean 资产；小红书继续保留占位结构和后台上传入口。
- 联系区二维码展示从普通三列卡片升级为三张“书签 / 叶片”样式，采用等权扇形展开，不再突出主辅层级。
- 新增 `renderChannelBookmark()` 联系区专用渲染，导航栏 hover/focus 下拉仍保留 compact 二维码卡片，避免影响原导航体验。
- 新增 `qrFanOpen` 扇形展开动画：二维码模块进入视口后逐张展开，并支持 hover 轻微抬升与收敛旋转。
- 手机端二维码扇形自动降级为纵向紧凑书签卡片，保证扫码面积、阅读顺序和不横向溢出。
- 深色模式补充书签卡片、二维码底板和文字颜色适配，并尊重 `prefers-reduced-motion` 动效降级。

## 2.2 本轮调整：联系区二维码书签微调

- 根据用户最新上传文件重新覆盖微信、抖音纯净二维码资产：`assets/images/contact/wechat-qr-clean.png`、`assets/images/contact/douyin-qr-clean.png`，保持官网引用路径不变，后台内容无需重新配置。
- 联系区书签卡片移除长描述，仅保留序号、渠道角标与渠道名称，降低文字密度，让视觉重点回到扫码动作本身。
- 桌面端二维码扇形区域从 392px 收敛到 326px，并同步缩小书签宽度、内边距、二维码底板和阴影范围，减少底部下探。
- 三张书签展开位移重新校准：左右两张减少向下偏移，中间书签略微上提，使二维码组底部更接近右侧表单下沿以内。
- 手机端继续使用纵向紧凑书签布局，同时隐藏冗余描述，避免小屏信息拥挤。

## 2.3 本轮调整：书签美感恢复 + 左往右扇形动画 + 一次一屏滚动

- 恢复书签/叶片视觉效果：增加卡片内边距、恢复大号序号、提升图片区渐变层次与阴影，重新具备书签质感。
- 二维码图片区保持 `cover` 填充 + 89% 画布占比，同时保留 8px 边距作为扫码安全区。
- 动画改为从左往右扇形展开：初始态从左侧移入（`-60px, 20px, rotate(-20deg)`），终局三张卡片在 `x=0/140/280, y=-20/-58/-20, rot=-12°→-2°→+10°` 展开，`0.8s cubic-bezier(.16,1,.3,1)` 保证高帧率。
- 联系区书签继续上移，底部与右侧表单对齐更自然。
- **桌面端新增强制一屏一板块滚动**：使用 JS 拦截 wheel 事件 + GSAP `scrollTo` 实现精准分屏跳转（节流 900ms），同时支持键盘 ↑↓/PageUp/PageDown，移动端自动关闭保持正常自由滚动。
- **经验教训**：CSS `scroll-snap-type: y mandatory` 在复杂多板块页面会导致滚轮卡死，已废弃改用 JS 方案。

## 后续建议

- 云端后台保存后，本地继续开发前先执行 `git pull origin main` 或 `git pull --rebase origin main`，让后台内容成为本地最新基线。
- 后续若内容更新更频繁，可再升级为 `content-history.json` 结构化版本日志。
