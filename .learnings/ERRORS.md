# Errors

Command failures and integration errors.

---

## [ERR-20260613-001] cms_editor_auth_flow_bypass

**Logged**: 2026-06-13T07:11:04+08:00
**Priority**: critical
**Status**: resolved
**Area**: frontend

### Summary
编辑器密码页与草稿恢复 confirm 弹窗叠加，用户反馈点击“确认”或“取消”都会绕过密码认证进入后台管理界面。

### Error
```text
打开 editor.html 后出现“检测到上次编辑草稿，要继续使用吗？”弹窗，同时底部仍显示二次密码界面；不论点击确认还是取消，都会进入后台编辑界面。
```

### Context
- 用户已在网页首页登录入口输入过账号密码，编辑器内二次密码页属于重复门禁。
- 旧逻辑包含 `authScreen`、`unlock()`、`portfolio-cms-entry-ok`，同时 `initEditor()` 会触发草稿恢复 `confirm()`。
- 该流程存在认证状态与草稿弹窗交叉导致的误进入后台风险。

### Suggested Fix
删除编辑器独立二次密码界面与相关前端门禁逻辑，编辑器直接加载；保留 GitHub 同步、读取历史、回退等高风险 API 操作的密码校验。

### Metadata
- Reproducible: yes
- Related Files: editor.html
- See Also: FEAT-20260613-001

### Resolution
- **Resolved**: 2026-06-13T07:11:04+08:00
- **Commit/PR**: this commit
- **Notes**: 已删除 editor.html 二次密码页面和前端门禁逻辑，保留同步/历史/回退 API 密码校验。

---
