const RECIPIENT = "563838884@qq.com";
const ENDPOINT = "https://dm.aliyuncs.com/";

function corsHeaders(req) {
  return {
    "Access-Control-Allow-Origin": req.headers.get("Origin") || "https://zhuye.huangqidong.cn",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status, req) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(req) }
  });
}

function pct(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

async function sign(secret, str) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret + "&"),
    { name: "HMAC", hash: "SHA-1" }, false, ["sign"]
  );
  const buf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(str));
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== "POST") return json({ ok: false, error: "Method Not Allowed" }, 405, request);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: "Invalid JSON" }, 400, request); }

  const { name, email, type, message } = body;
  if (!name || !email || !type || !message) return json({ ok: false, error: "字段不完整" }, 400, request);

  const { ALI_ACCESS_KEY_ID: keyId, ALI_ACCESS_KEY_SECRET: keySecret, ALI_FROM_EMAIL: from } = env;
  if (!keyId || !keySecret || !from) return json({ ok: false, error: "服务器配置缺失" }, 500, request);

  const time = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const html = `<p><b>称呼：</b>${name}</p><p><b>联系方式：</b>${email}</p><p><b>需求类型：</b>${type}</p><p><b>需求描述：</b><br>${message.replace(/\n/g, "<br>")}</p><p><b>提交时间：</b>${time}</p>`;

  const params = {
    Action: "SingleSendMail",
    AccountName: from,
    ToAddress: RECIPIENT,
    FromAlias: "表里如一装修",
    Subject: `【新询盘】${name} 提交了装修预算需求`,
    HtmlBody: html,
    ReplyToAddress: "false",
    Format: "JSON",
    Version: "2015-11-23",
    AccessKeyId: keyId,
    SignatureMethod: "HMAC-SHA1",
    SignatureNonce: Math.random().toString(36).slice(2),
    SignatureVersion: "1.0",
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  };

  const sorted = Object.keys(params).sort().map(k => `${pct(k)}=${pct(params[k])}`).join("&");
  const sig = await sign(keySecret, `GET&${pct("/")}&${pct(sorted)}`);
  const url = `${ENDPOINT}?${sorted}&Signature=${pct(sig)}`;

  const resp = await fetch(url);
  const result = await resp.json();
  if (result.Code && result.Code !== "OK") return json({ ok: false, error: result.Message }, 502, request);
  return json({ ok: true }, 200, request);
}
