export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    // CORS preflight
    if (request.method === "OPTIONS") {
      return corsResponse(null, 204, env, origin);
    }

    // API routes
    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "zhuye-portfolio-cms", repo: `${env.GITHUB_OWNER}/${env.GITHUB_REPO}` }, 200, env, origin);
    }

    if (url.pathname === "/api/save-content" && request.method === "POST") {
      return handleSave(request, env, origin);
    }

    if (url.pathname === "/api/content-meta" && request.method === "GET") {
      return handleContentMeta(request, env, origin);
    }

    if (url.pathname === "/api/history" && request.method === "GET") {
      return handleHistory(request, env, origin, url);
    }

    if (url.pathname === "/api/rollback" && request.method === "POST") {
      return handleRollback(request, env, origin);
    }

    // --- Website proxy: serve directly from GitHub raw files ---
    // Avoid GitHub Pages custom-domain redirects and mobile/proxy caches that can keep stale HTML.
    const SOURCE = "https://raw.githubusercontent.com/wongkd/zhuye/main";
    let targetPath = url.pathname;
    if (targetPath === "/" || targetPath === "") targetPath = "/index.html";

    const targetUrl = new URL(SOURCE + targetPath);
    for (const [key, value] of url.searchParams) targetUrl.searchParams.set(key, value);

    try {
      const upstream = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: filterHeaders(request.headers, request.method),
        cf: { cacheTtl: 0, cacheEverything: false }
      });

      const body = await upstream.arrayBuffer();
      const responseHeaders = new Headers(upstream.headers);
      
      // Fix content types for common static files
      if (targetPath.endsWith(".js")) responseHeaders.set("Content-Type", "application/javascript; charset=utf-8");
      if (targetPath.endsWith(".html")) responseHeaders.set("Content-Type", "text/html; charset=utf-8");
      if (targetPath === "/" || (!targetPath.includes(".") && !responseHeaders.get("Content-Type"))) {
        responseHeaders.set("Content-Type", "text/html; charset=utf-8");
      }
      
      responseHeaders.set("X-Powered-By", "Cloudflare Worker Proxy");
      responseHeaders.set("X-BLRY-Version", "0.9");
      responseHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      responseHeaders.set("Pragma", "no-cache");
      responseHeaders.set("Expires", "0");
      
      // CORS for editor
      responseHeaders.set("Access-Control-Allow-Origin", "*");

      return new Response(body, {
        status: upstream.status,
        headers: responseHeaders
      });
    } catch (e) {
      return new Response(`Site temporarily unavailable. ${e.message}`, {
        status: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
};

function isAuthorized(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const expected = `Bearer ${env.CMS_PASSWORD}`;
  return Boolean(env.CMS_PASSWORD && authHeader === expected);
}

function githubConfig(env) {
  return {
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_REPO,
    branch: env.GITHUB_BRANCH || "main",
    filePath: env.GITHUB_CONTENT_PATH || "content.js",
    token: env.GITHUB_TOKEN
  };
}

function missingGithubConfig(config) {
  return !config.owner || !config.repo || !config.token;
}

async function handleSave(request, env, origin) {
  if (!isAuthorized(request, env)) {
    return json({ ok: false, error: "Unauthorized" }, 401, env, origin);
  }

  let body;
  try { body = await request.json(); } catch (error) {
    return json({ ok: false, error: "JSON 格式错误" }, 400, env, origin);
  }

  const content = body.content || body;
  const validation = validateContent(content);
  if (!validation.ok) return json(validation, 400, env, origin);

  const { owner, repo, branch, filePath, token } = githubConfig(env);

  if (missingGithubConfig({ owner, repo, token })) {
    return json({ ok: false, error: "Worker 环境变量未配置完整" }, 500, env, origin);
  }

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponentPath(filePath)}`;
  const getResp = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, {
    headers: githubHeaders(token)
  });

  let sha;
  let currentMeta = null;
  if (getResp.status === 200) {
    const current = await getResp.json();
    sha = current.sha;
    currentMeta = current;
  } else if (getResp.status !== 404) {
    const text = await getResp.text();
    return json({ ok: false, error: "读取 GitHub 文件失败", detail: text }, getResp.status, env, origin);
  }

  const baseSha = String(body.baseSha || "").trim();
  const force = Boolean(body.force);
  if (baseSha && sha && baseSha !== sha && !force) {
    return json({
      ok: false,
      code: "STALE_CONTENT",
      error: "GitHub 上的 content.js 已有新版本。请先刷新编辑器后再同步，避免覆盖最新内容。",
      baseSha,
      currentSha: sha,
      path: filePath,
      branch
    }, 409, env, origin);
  }

  const js = "window.SITE_CONTENT = " + JSON.stringify(content, null, 2) + ";\n";
  const message = normalizeCommitMessage(body.message || body.summary || "更新可视化编辑器内容");
  const updateResp = await fetch(apiBase, {
    method: "PUT",
    headers: githubHeaders(token),
    body: JSON.stringify({
      message,
      content: base64Encode(js),
      branch,
      sha
    })
  });

  const result = await updateResp.json().catch(() => ({}));
  if (!updateResp.ok) {
    return json({ ok: false, error: "写入 GitHub 失败", detail: result }, updateResp.status, env, origin);
  }

  return json({
    ok: true,
    message: "已同步到 GitHub，GitHub Pages 自动部署中",
    commit: result.commit?.html_url,
    commitSha: result.commit?.sha,
    previousSha: currentMeta?.sha || null,
    path: filePath,
    branch
  }, 200, env, origin);
}

async function handleContentMeta(request, env, origin) {
  if (!isAuthorized(request, env)) {
    return json({ ok: false, error: "Unauthorized" }, 401, env, origin);
  }

  const { owner, repo, branch, filePath, token } = githubConfig(env);
  if (missingGithubConfig({ owner, repo, token })) {
    return json({ ok: false, error: "Worker 环境变量未配置完整" }, 500, env, origin);
  }

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponentPath(filePath)}`;
  const fileResp = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers: githubHeaders(token) });
  const file = await fileResp.json().catch(() => ({}));
  if (!fileResp.ok || !file.sha) {
    return json({ ok: false, error: "读取 GitHub content.js 状态失败", detail: file }, fileResp.status, env, origin);
  }

  let commit = null;
  const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&path=${encodeURIComponentPath(filePath)}&per_page=1`;
  const commitResp = await fetch(commitsUrl, { headers: githubHeaders(token) });
  const commits = await commitResp.json().catch(() => []);
  if (commitResp.ok && Array.isArray(commits) && commits[0]) {
    commit = {
      sha: commits[0].sha,
      shortSha: commits[0].sha.slice(0, 7),
      message: commits[0].commit?.message || "无提交说明",
      author: commits[0].commit?.author?.name || commits[0].author?.login || "unknown",
      date: commits[0].commit?.author?.date || commits[0].commit?.committer?.date,
      url: commits[0].html_url
    };
  }

  return json({
    ok: true,
    path: filePath,
    branch,
    sha: file.sha,
    size: file.size,
    commit
  }, 200, env, origin);
}

async function handleHistory(request, env, origin, url) {
  if (!isAuthorized(request, env)) {
    return json({ ok: false, error: "Unauthorized" }, 401, env, origin);
  }

  const { owner, repo, branch, filePath, token } = githubConfig(env);
  if (missingGithubConfig({ owner, repo, token })) {
    return json({ ok: false, error: "Worker 环境变量未配置完整" }, 500, env, origin);
  }

  const perPage = Math.max(1, Math.min(20, Number(url.searchParams.get("limit") || 10)));
  const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&path=${encodeURIComponentPath(filePath)}&per_page=${perPage}`;
  const resp = await fetch(commitsUrl, { headers: githubHeaders(token) });
  const result = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    return json({ ok: false, error: "读取 GitHub 版本历史失败", detail: result }, resp.status, env, origin);
  }

  return json({
    ok: true,
    path: filePath,
    branch,
    versions: result.map(commit => ({
      sha: commit.sha,
      shortSha: commit.sha.slice(0, 7),
      message: commit.commit?.message || "无提交说明",
      author: commit.commit?.author?.name || commit.author?.login || "unknown",
      date: commit.commit?.author?.date || commit.commit?.committer?.date,
      url: commit.html_url
    }))
  }, 200, env, origin);
}

async function handleRollback(request, env, origin) {
  if (!isAuthorized(request, env)) {
    return json({ ok: false, error: "Unauthorized" }, 401, env, origin);
  }

  let body;
  try { body = await request.json(); } catch (error) {
    return json({ ok: false, error: "JSON 格式错误" }, 400, env, origin);
  }

  const targetSha = String(body.sha || "").trim();
  if (!/^[0-9a-f]{7,40}$/i.test(targetSha)) {
    return json({ ok: false, error: "缺少有效的回退版本 SHA" }, 400, env, origin);
  }

  const { owner, repo, branch, filePath, token } = githubConfig(env);
  if (missingGithubConfig({ owner, repo, token })) {
    return json({ ok: false, error: "Worker 环境变量未配置完整" }, 500, env, origin);
  }

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponentPath(filePath)}`;
  const targetResp = await fetch(`${apiBase}?ref=${encodeURIComponent(targetSha)}`, { headers: githubHeaders(token) });
  const targetFile = await targetResp.json().catch(() => ({}));
  if (!targetResp.ok || !targetFile.content) {
    return json({ ok: false, error: "读取目标版本 content.js 失败", detail: targetFile }, targetResp.status, env, origin);
  }

  const currentResp = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers: githubHeaders(token) });
  const currentFile = await currentResp.json().catch(() => ({}));
  if (!currentResp.ok || !currentFile.sha) {
    return json({ ok: false, error: "读取当前 content.js 失败", detail: currentFile }, currentResp.status, env, origin);
  }

  const message = body.message || `Rollback content.js to ${targetSha.slice(0, 7)} ${new Date().toISOString()}`;
  const updateResp = await fetch(apiBase, {
    method: "PUT",
    headers: githubHeaders(token),
    body: JSON.stringify({
      message,
      content: String(targetFile.content).replace(/\n/g, ""),
      branch,
      sha: currentFile.sha
    })
  });
  const result = await updateResp.json().catch(() => ({}));
  if (!updateResp.ok) {
    return json({ ok: false, error: "回退写入 GitHub 失败", detail: result }, updateResp.status, env, origin);
  }

  return json({
    ok: true,
    message: `已回退 content.js 到 ${targetSha.slice(0, 7)}，GitHub Pages 自动部署中`,
    rollbackTo: targetSha,
    commit: result.commit?.html_url,
    path: filePath,
    branch
  }, 200, env, origin);
}

function filterHeaders(headers, method) {
  const keep = ["accept", "accept-encoding", "user-agent"];
  const result = new Headers();
  for (const [k, v] of headers) {
    const lk = k.toLowerCase();
    if (lk.startsWith("cf-") || lk.startsWith("x-forwarded") || lk === "host") continue;
    if (keep.includes(lk)) result.set(k, v);
  }
  if (method === "GET" || method === "HEAD") {
    result.set("Accept-Encoding", "gzip");
  }
  return result;
}

function validateContent(data) {
  if (!data || typeof data !== "object") return { ok: false, error: "内容必须是对象" };
  const required = ["site", "nav", "hero", "about", "projectsSection", "projects", "skillsSection", "skillGroups", "contact"];
  for (const key of required) {
    if (!(key in data)) return { ok: false, error: `缺少字段：${key}` };
  }
  return { ok: true };
}

function normalizeCommitMessage(raw) {
  const text = String(raw || "").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  const summary = text || "更新可视化编辑器内容";
  if (/^(cms|content|feat|fix|docs|chore|refactor|style|perf|rollback)(\(.+\))?:\s/i.test(summary)) {
    return summary.slice(0, 140);
  }
  return `cms: ${summary.slice(0, 120)}`;
}

function githubHeaders(token) {
  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "zhuye-portfolio-cms-worker"
  };
}

function json(data, status = 200, env, origin = "") {
  return corsResponse(JSON.stringify(data), status, env, "application/json; charset=utf-8", origin);
}

function corsResponse(body, status = 200, env, contentType = "text/plain; charset=utf-8", requestOrigin = "") {
  const allowedOrigins = [env?.ALLOWED_ORIGIN, env?.ALLOWED_ORIGIN_DEV].filter(Boolean);
  let origin = env?.ALLOWED_ORIGIN || "https://zhuye.huangqidong.cn";
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    origin = requestOrigin;
  }
  return new Response(body, {
    status,
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization"
    }
  });
}

function encodeURIComponentPath(filePath) {
  return filePath.split("/").map(encodeURIComponent).join("/");
}

function base64Encode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
