# Feature Requests

Capabilities requested by the user.

---

## [FEAT-20260613-001] compact_cms_image_editor_layout

**Logged**: 2026-06-13T07:02:36+08:00
**Priority**: medium
**Status**: resolved
**Area**: frontend

### Requested Capability
优化后台管理系统的图片编辑区域布局，减小图片预览在编辑界面中的占比，使整体排版更紧凑合理。

### User Context
用户通过截图指出 CMS 图片编辑卡片中 LOGO 预览过大，挤占后台编辑空间，希望所有图片编辑组件大小和位置更平衡，提高空间利用率和用户体验。

### Complexity Estimate
simple

### Suggested Implementation
将图片编辑组件从纵向大图布局调整为左侧紧凑预览、右侧 URL/操作/提示布局；限制不同图片类型的预览高度，并保留窄屏响应式回退。

### Metadata
- Frequency: first_time
- Related Features: visual editor, image upload, cropper

### Resolution
- **Resolved**: 2026-06-13T07:02:36+08:00
- **Commit/PR**: 8ec1ccb
- **Notes**: 已将 CMS 图片编辑组件改为紧凑双栏布局，并推送到 GitHub main。

---
