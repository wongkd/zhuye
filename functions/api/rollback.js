const WORKER_ENDPOINT = "https://zhuye-portfolio-cms.563838884.workers.dev/api/rollback";
const ALLOWED_ORIGIN = "https://zhuye.huangqidong.cn";

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(request)
    }
  });
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  if (request.method !== "POST") {
    return json({ ok: false, error: "Method Not Allowed" }, 405, request);
  }

  try {
    const upstream = await fetch(WORKER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": request.headers.get("Content-Type") || "application/json",
        "Authorization": request.headers.get("Authorization") || ""
      },
      body: await request.text()
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
        ...corsHeaders(request)
      }
    });
  } catch (error) {
    return json({
      ok: false,
      error: "代理 Worker 回退接口失败",
      detail: error.message
    }, 502, request);
  }
}
