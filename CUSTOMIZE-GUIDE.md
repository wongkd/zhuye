# 🎨 个人作品集网站 — 帮你打造独一无二的个人站

> 基于 PDF《codex搭建个人站》提取的完整方案

---

## 一、已为你生成的文件

| 文件 | 说明 |
|------|------|
| `index.html` | 单文件完整模板（开箱即用） |
| `CUSTOMIZE-GUIDE.md` | 本指南——如何改出独一无二的效果 |
| `REACT-VERSION.md` | React + Vite 工程化版本代码 |

---

## 二、10 个让网站"独一无二"的定制方向

### 1️⃣ 改配色 → 最快出效果

打开 `index.html`，找到 `:root {}` 块，改这三个变量：

```css
:root {
  --accent: #6366f1;        /* ← 主色调，改成你的颜色 */
  --accent-glow: rgba(...); /* ← 发光效果色 */
  --bg-primary: #0a0a0f;    /* ← 背景色（暗色系） */
}
```

**推荐配色方案：**

| 风格 | --accent | 感觉 |
|------|----------|------|
| 赛博朋克 | `#00ff88` | 科技、未来感 |
| 极简黑白 | `#ffffff` | 干净、专业 |
| 暖金奢华 | `#d4a574` | 高端、温暖（适合你的装修品牌） |
| 海洋科技 | `#00d4ff` | 清爽、可信赖 |
| 暗紫神秘 | `#c084fc` | 创意、艺术感 |

### 2️⃣ 换字体 → 气质立变

```html
<!-- 当前是 Inter + Space Grotesk -->
<link href="https://fonts.googleapis.com/css2?family=你的字体&display=swap" rel="stylesheet">
```

推荐搭配：
- **专业严肃**：`DM Sans` + `Playfair Display`
- **日系极简**：`Noto Sans JP` + `Zen Kaku Gothic New`
- **复古文艺**：`Cormorant Garamond` + `Jost`
- **科技极客**：`JetBrains Mono` + `Inter`

### 3️⃣ 改 WebGL 背景 → 视觉签名

在 `<script>` 中找到 WebGL 部分，可以改：

```javascript
// 粒子数量 → 更多或更少
const particlesCount = 500; // 改大 = 更密

// 颜色渐变
const gradientColors = {
  uColor1: new THREE.Color(0xff6600), // 改这里
  uColor2: new THREE.Color(0xff0066)  // 改这里
}
```

### 4️⃣ Hero 区放你的视频/3D 模型

把图片换成视频背景：
```html
<!-- 替换 <img> 为 -->
<video autoplay muted loop playsinline class="w-full h-full object-cover">
  <source src="your-video.mp4" type="video/mp4">
</video>
```

### 5️⃣ 卡片交互动效增强

推荐资源（来自 PDF）：
- **[reactbits.dev](https://reactbits.dev)** — 现成 React 动效组件
- **[21st.dev](https://21st.dev)** — 可直接复制的 UI 组件
- **[motionsites](https://motionsites.com)** — 动效灵感
- **[bentogrids](https://bentogrids.com)** — Bento 网格布局作品集

### 6️⃣ 替换占位内容

| 位置 | 当前内容 | 改成你的 |
|------|----------|----------|
| Hero 标题 | "创造数字体验" | 你的核心价值主张 |
| 个人照片 | Unsplash 占位图 | 你的真实照片 |
| 经历卡片 | 示例公司 | 你的真实阅历 |
| 项目案例 | Unsplash 图 + 示例 | 你的真实作品 |
| 技能标签 | 示例技能 | 你真正掌握的 |
| 联系方式 | hello@example.com | 你的真实联系方式 |

### 7️⃣ 加 Bento Grid 项目展示

```html
<div class="bento-grid">
  <div class="bento-item bento-large">主项目</div>
  <div class="bento-item">项目2</div>
  <div class="bento-item">项目3</div>
  <div class="bento-item bento-tall">项目4</div>
</div>
```

### 8️⃣ 添加页面转场动效

```javascript
// 使用 GSAP 做页面切换
gsap.fromTo('.page-enter', 
  { opacity: 0, y: 40 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
);
```

### 9️⃣ 性能优化

> PDF 特别强调的检查项：

- 图片用 **WebP** 格式，压缩到 200KB 以内
- 视频用 `<video>` 的 `preload="metadata"` + 首帧静态图
- WebGL 在页面不可见时暂停动画
- 图片加 `loading="lazy"` 懒加载
- 控制 GSAP ScrollTrigger 数量

### 🔟 部署上线

```bash
# 本模板是纯 HTML，直接部署：
# 方法1: GitHub Pages（免费）
# 方法2: Vercel（免费 + 自动 HTTPS）
# 方法3: CloudFlare Pages（免费 + 全球 CDN）

# 如果用 React 版：
cd personal-portfolio
npm create vite@latest . -- --template react
npm install
npm run build  # 输出到 dist/ 文件夹，部署即可
```

---

## 三、React + Vite 版本快速启动

```bash
# 1. 创建项目
npm create vite@latest my-portfolio -- --template react
cd my-portfolio

# 2. 安装依赖
npm install
npm install tailwindcss @tailwindcss/vite
npm install gsap three @react-three/fiber @react-three/drei
npm install react-router-dom

# 3. 参考 REACT-VERSION.md 复制组件代码
# 4. 启动开发
npm run dev
```

---

## 四、快速预览

打开 `index.html` 就能直接在浏览器看到效果。所有依赖通过 CDN 加载，无需安装任何东西。

```bash
# 在终端中打开文件夹
explorer C:\Users\wuerl\WorkBuddy\2026-06-12-05-21-07\personal-portfolio

# 或直接用浏览器打开
start index.html
```

---

## 五、终极独一无二清单

- [ ] 改了主色调（`--accent`）
- [ ] 换了字体搭配
- [ ] 改了 WebGL 粒子/渐变颜色
- [ ] Hero 区换了你的照片/视频
- [ ] 写了真实的个人介绍
- [ ] 替换了全部项目案例
- [ ] 技能标签对上了真实技能
- [ ] 联系方式是真实的
- [ ] 加了 Bento Grid 或自定义布局
- [ ] 至少一个独特动效（reactbits.dev 选一个）
- [ ] 图片都换成了你的，且压缩到合适大小
- [ ] 手机端检查一次响应式效果

> **完成以上至少 8/12 项，你的网站就是独一无二的。**

---

📅 生成日期：2026-06-12
⚙️ 技术栈：HTML5 + Tailwind CSS + GSAP + Three.js
