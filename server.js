const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 5177);
const CONTENT_FILE = path.join(ROOT, 'content.js');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.mp4': 'video/mp4'
};

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function safeJsonParse(raw) {
  try {
    return [JSON.parse(raw), null];
  } catch (error) {
    return [null, error];
  }
}

function sanitizeContent(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('保存失败：内容必须是对象');
  }
  const required = ['site', 'nav', 'hero', 'about', 'projectsSection', 'projects', 'skillsSection', 'skillGroups', 'contact'];
  for (const key of required) {
    if (!(key in data)) throw new Error(`保存失败：缺少字段 ${key}`);
  }
  return data;
}

function writeContentFile(data) {
  const clean = sanitizeContent(data);
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(ROOT, `content.backup.${stamp}.js`);
  if (fs.existsSync(CONTENT_FILE)) {
    fs.copyFileSync(CONTENT_FILE, backupFile);
  }
  const js = 'window.SITE_CONTENT = ' + JSON.stringify(clean, null, 2) + ';\n';
  fs.writeFileSync(CONTENT_FILE, js, 'utf8');
  return { backup: path.basename(backupFile), bytes: Buffer.byteLength(js, 'utf8') };
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (req.method === 'OPTIONS') {
    return send(res, 204, '');
  }

  if (req.method === 'GET' && parsed.pathname === '/api/health') {
    return send(res, 200, JSON.stringify({ ok: true, mode: 'local-save', contentFile: CONTENT_FILE }));
  }

  if (req.method === 'POST' && parsed.pathname === '/api/save-content') {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 2 * 1024 * 1024) {
        req.destroy();
      }
    });
    req.on('end', () => {
      const [body, parseError] = safeJsonParse(raw);
      if (parseError) {
        return send(res, 400, JSON.stringify({ ok: false, error: 'JSON 格式错误：' + parseError.message }));
      }
      try {
        const result = writeContentFile(body.content || body);
        return send(res, 200, JSON.stringify({ ok: true, message: 'content.js 已保存', ...result }));
      } catch (error) {
        return send(res, 400, JSON.stringify({ ok: false, error: error.message }));
      }
    });
    return;
  }

  if (req.method !== 'GET') {
    return send(res, 405, JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
  }

  let pathname = decodeURIComponent(parsed.pathname || '/');
  if (pathname === '/') pathname = '/index.html';
  const target = path.normalize(path.join(ROOT, pathname));
  if (!target.startsWith(ROOT)) {
    return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
  }
  fs.readFile(target, (error, content) => {
    if (error) {
      return send(res, 404, 'Not Found', 'text/plain; charset=utf-8');
    }
    const type = mimeTypes[path.extname(target).toLowerCase()] || 'application/octet-stream';
    send(res, 200, content, type);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Portfolio local CMS running at http://127.0.0.1:${PORT}`);
  console.log(`Editor: http://127.0.0.1:${PORT}/editor.html`);
});
