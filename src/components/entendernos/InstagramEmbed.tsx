import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_ID = "instagram-embed-script";

function ensureEmbedScript(onReady: () => void) {
  if (window.instgrm) {
    onReady();
    return;
  }
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    existing.addEventListener("load", onReady, { once: true });
    return;
  }
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  script.addEventListener("load", onReady, { once: true });
  document.body.appendChild(script);
}

/** Embed oficial de Instagram (oEmbed): siempre muestra la publicación real y
 * actualizada (likes, comentarios) directo desde Instagram. No requiere API keys
 * ni backend, pero al cargar el embed el visitante hace una conexión directa a
 * Instagram/Meta (igual que en cualquier sitio con contenido social embebido). */
export function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    ensureEmbedScript(() => window.instgrm?.Embeds.process());
  }, [url]);

  return (
    <div className="flex justify-center overflow-hidden rounded-[24px] bg-card">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: "#FFF", border: 0, margin: 0, width: "100%", minWidth: 0 }}
      />
    </div>
  );
}
