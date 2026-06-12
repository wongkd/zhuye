# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice

---

## [LRN-20260613-001] correction

**Logged**: 2026-06-13T04:17:45+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
zhuye 1.6 mobile should be magazine-style vertical cards, not horizontal swipe cards.

### Details
User clarified that the mobile site should keep the magazine aesthetic but behave like stacked card pages: each downward scroll reaches a new card/section. Horizontal swipe interactions are not preferred on mobile. The third section should become an animated vertical showcase rather than a right-swipe card gallery. The old About section should evolve into pricing methods: 整装、传统报价式半包、特色式半包（只收工程管理费，其他项目全部成本价）.

### Suggested Action
For mobile-only changes, keep styles under `@media (max-width:767px)`, avoid `grid-auto-flow:column`, `overflow-x:auto`, `scroll-snap-type:x`, and `grid-auto-columns`, and use GSAP/ScrollTrigger vertical reveal animations instead.

### Metadata
- Source: user_feedback
- Related Files: index.html, content.js
- Tags: mobile, magazine, vertical-cards, pricing

---

## [LRN-20260613-002] correction

**Logged**: 2026-06-13T01:29:18+08:00
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
zhuye 1.6 pricing section must replace Services, not About.

### Details
User corrected the 1.6 mobile information architecture: “关于表里如一” must remain complete on both mobile and desktop. The pricing models should replace the existing “服务能力” section and reuse that section's card style as the visual template.

### Suggested Action
When editing zhuye 1.6, keep About as the company introduction + process/stats block. Put pricing content under `#skills` / `skillsSection` / `skillGroups`, using `.skills-grid` and `.skill-card` responsive styles.

### Metadata
- Source: user_feedback
- Related Files: content.js, assets/site.js, assets/site.css
- Tags: zhuye, mobile, pricing, information-architecture

---
