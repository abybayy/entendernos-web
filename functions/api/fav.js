// Cloudflare Pages Function: cuenta, de forma anónima, cuántas veces se marcó
// cada pregunta como favorita. No guarda IP, ni identificador de visitante,
// ni fecha: solo un número por pregunta (deck:indice) en Workers KV.

const VALID_KEY = /^(adulto|adolescente|ninos):\d{1,3}$/;

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.FAVORITES_KV) {
    return new Response("not configured", { status: 501 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const qKey = body && typeof body.qKey === "string" ? body.qKey : null;
  if (!qKey || !VALID_KEY.test(qKey)) {
    return new Response("bad request", { status: 400 });
  }

  const storeKey = `fav:${qKey}`;
  const current = parseInt((await env.FAVORITES_KV.get(storeKey)) || "0", 10);
  await env.FAVORITES_KV.put(storeKey, String(current + 1));

  return new Response("ok", { status: 200 });
}
