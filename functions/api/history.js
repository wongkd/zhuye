const WORKER_ENDPOINT = "https://zhuye-portfolio-cms.563838884.workers.dev/api/history";
const ALLOWED_ORIGIN = "https://zhuye.huangqidong.cn";

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
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

  if (request.method !== "GET") {
    return json({ ok: false, error: "Method Not Allowed" }, 405, request);
  }

  try {
    const requestUrl = new URL(request.url);
    const upstreamUrl = new URL(WORKER_ENDPOINT);
    upstreamUrl.search = requestUrl.search;

    const upstream = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        "Authorization": request.headers.get("Authorization") || ""
      }
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
      error: "代理 Worker 历史接口失败",
      detail: error.message
    }, 502, request);
  }
}
