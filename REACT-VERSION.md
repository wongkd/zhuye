# React + Vite 个人作品集 — 组件化代码

## 项目结构

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── Skills.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── animations/
│   ├── WebGLBackground.jsx
│   ├── ScrollReveal.jsx
│   └── CountUp.jsx
└── hooks/
    └── useScrollReveal.js
```

---

## 安装步骤

```bash
npm create vite@latest my-portfolio -- --template react
cd my-portfolio
npm install
npm install tailwindcss @tailwindcss/vite gsap three @react-three/fiber @react-three/drei react-router-dom
```

---

## `src/index.css`

```css
@import "tailwindcss";

:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: #1a1a25;
  --text-primary: #ffffff;
  --text-secondary: #a0a0b0;
  --accent: #6366f1;
  --accent-glow: rgba(99, 102, 241, 0.3);
}

@theme {
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow-x: hidden;
}

.glass-card {
  background: rgba(26, 26, 37, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #a0a0b0 50%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 16px 32px;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.4);
}

.skill-tag {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.reveal {
  opacity: 0;
  transform: translateY(30px);
}
```

---

## `src/components/Navbar.jsx`

```jsx
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1700px] mx-auto px-8 py-6 flex items-center justify-between">
        <a href="#" className="font-display text-2xl font-bold tracking-tight">
          PORTFOLIO<span className="text-indigo-500">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">关于</a>
          <a href="#projects" className="text-sm text-gray-400 hover:text-white transition-colors">作品</a>
          <a href="#skills" className="text-sm text-gray-400 hover:text-white transition-colors">能力</a>
          <a href="#contact" className="btn-primary text-sm py-3 px-6">联系我</a>
        </div>
      </div>
    </nav>
  );
}
```

---

## `src/animations/WebGLBackground.jsx`

```jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WebGLBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Particles
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
    const particlesGeom = new THREE.BufferGeometry();
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.2, color: 0x6366f1, transparent: true,
      opacity: 0.6, blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particles);

    // Gradient plane
    const planeGeom = new THREE.PlaneGeometry(100, 100, 32, 32);
    const planeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(0x6366f1) },
        uColor2: { value: new THREE.Color(0x8b5cf6) },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(pos.x * 0.1 + uTime) * 2.0;
          pos.z += cos(pos.y * 0.1 + uTime) * 2.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1, uColor2;
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          float mixVal = sin(vUv.x * 3.14159 + uTime * 0.5) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, mixVal);
          float alpha = 0.15 * (1.0 - length(vUv - 0.5) * 1.5);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeom, planeMat);
    plane.position.z = -20;
    scene.add(plane);

    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      planeMat.uniforms.uTime.value = performance.now() * 0.001;
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-[-1] opacity-60" />
  );
}
```

---

## `src/hooks/useScrollReveal.js`

```jsx
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(selector = '.reveal') {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    els.forEach((el, i) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.05,
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [selector]);
}
```

---

## `src/App.jsx`

```jsx
import Navbar from './components/Navbar';
import WebGLBackground from './animations/WebGLBackground';
import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  useScrollReveal();

  return (
    <>
      <WebGLBackground />
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="max-w-[1700px] mx-auto px-8 py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-indigo-400 text-sm font-medium tracking-widest uppercase reveal">
              Visual Designer / AI Designer
            </span>
            <h1 className="font-display text-7xl lg:text-8xl font-bold leading-[0.95] reveal">
              <span className="gradient-text">创造</span><br />
              <span>数字体验</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg reveal">
              专注于视觉设计与人工智能的融合，为品牌打造独特且富有情感的数字产品体验。
            </p>
            <div className="flex gap-4 reveal">
              <a href="#projects" className="btn-primary">查看作品</a>
              <a href="#contact" className="btn-outline">联系我</a>
            </div>
          </div>
          <div className="reveal">
            <div className="glass-card aspect-square overflow-hidden">
              <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* About, Projects, Skills, Contact sections... */}
      {/* 参考 index.html 中的对应部分，提取为独立组件 */}

    </>
  );
}
```

---

## 部署

```bash
npm run build
# 将 dist/ 文件夹部署到：
# - GitHub Pages
# - Vercel: vercel --prod
# - CloudFlare Pages
# - EdgeOne Pages (腾讯云)
```

---

> 💡 完整 HTML 版本在 `index.html` 中，React 版本建议在熟悉 React 后迁移，HTML 版开箱即用。
