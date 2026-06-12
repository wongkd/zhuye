export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return corsResponse(null, 204, env);
    }

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "zhuye-portfolio-cms", repo: `${env.GITHUB_OWNER}/${env.GITHUB_REPO}` }, 200, env);
    }

    if (url.pathname !== "/api/save-content" || request.method !== "POST") {
      return json({ ok: false, error: "Not Found" }, 404, env);
    }

    const authHeader = request.headers.get("Authorization") || "";
    const expected = `Bearer ${env.CMS_PASSWORD}`;
    if (!env.CMS_PASSWORD || authHeader !== expected) {
      return json({ ok: false, error: "Unauthorized" }, 401, env);
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return json({ ok: false, error: "JSON 格式错误" }, 400, env);
    }

    const content = body.content || body;
    const validation = validateContent(content);
    if (!validation.ok) {
      return json(validation, 400, env);
    }

    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const branch = env.GITHUB_BRANCH || "main";
    const filePath = env.GITHUB_CONTENT_PATH || "content.js";
    const token = env.GITHUB_TOKEN;

    if (!owner || !repo || !token) {
      return json({ ok: false, error: "Worker 环境变量未配置完整" }, 500, env);
    }

    const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponentPath(filePath)}`;
    const getResp = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, {
      headers: githubHeaders(token)
    });

    let sha;
    if (getResp.status === 200) {
      const current = await getResp.json();
      sha = current.sha;
    } else if (getResp.status !== 404) {
      const text = await getResp.text();
      return json({ ok: false, error: "读取 GitHub 文件失败", detail: text }, getResp.status, env);
    }

    const js = "window.SITE_CONTENT = " + JSON.stringify(content, null, 2) + ";\n";
    const message = body.message || `Update portfolio content ${new Date().toISOString()}`;
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
      return json({ ok: false, error: "写入 GitHub 失败", detail: result }, updateResp.status, env);
    }

    return json({
      ok: true,
      message: "已同步到 GitHub，等待 Pages 自动部署",
      commit: result.commit?.html_url,
      path: filePath,
      branch
    }, 200, env);
  }
};

function validateContent(data) {
  if (!data || typeof data !== "object") return { ok: false, error: "内容必须是对象" };
  const required = ["site", "nav", "hero", "about", "projectsSection", "projects", "skillsSection", "skillGroups", "contact"];
  for (const key of required) {
    if (!(key in data)) return { ok: false, error: `缺少字段：${key}` };
  }
  return { ok: true };
}

function githubHeaders(token) {
  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "zhuye-portfolio-cms-worker"
  };
}

function json(data, status = 200, env) {
  return corsResponse(JSON.stringify(data), status, env, "application/json; charset=utf-8");
}

function corsResponse(body, status = 200, env, contentType = "text/plain; charset=utf-8") {
  const origin = env?.ALLOWED_ORIGIN || "https://zhuye.huangqidong.cn";
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
