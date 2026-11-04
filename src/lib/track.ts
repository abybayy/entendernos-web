export type TrackEvent = "share_card" | "share_game" | "guide_download";

/**
 * Suma anónima de un evento (compartir, descargar guía). No envía ningún dato
 * de quien lo hizo. Si falla (sin conexión, etc.) no afecta la experiencia.
 */
export function track(ev: TrackEvent) {
  try {
    fetch("/api/evt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ev }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
