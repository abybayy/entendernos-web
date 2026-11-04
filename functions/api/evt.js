// Cloudflare Pages Function: cuenta, de forma anónima, cuántas veces se
// compartió una pregunta, se compartió el juego o se descargó la guía.
// No guarda IP, ni identificador de visitante, ni fecha: solo un número por
// tipo de evento en Workers KV (mismo almacén que los favoritos).

const VALID_EVENTS = new Set(["share_card", "share_game", "guide_download"]);

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

  const ev = body && typeof body.ev === "string" ? body.ev : null;
  if (!ev || !VALID_EVENTS.has(ev)) {
    return new Response("bad request", { status: 400 });
  }

  const storeKey = `evt:${ev}`;
  const current = parseInt((await env.FAVORITES_KV.get(storeKey)) || "0", 10);
  await env.FAVORITES_KV.put(storeKey, String(current + 1));

  return new Response("ok", { status: 200 });
}
