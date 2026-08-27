/** Embed oficial de Instagram, vía el endpoint directo .../embed/captioned/ de
 * Instagram (el mismo que usa su script oficial embed.js por detrás). Se eligió
 * este método -en vez del widget con blockquote + embed.js- porque con varias
 * publicaciones juntas en una misma página (sobre todo mezclando reels y fotos),
 * el script de Instagram a veces perdía el cálculo de alto de una de ellas y
 * quedaba invisible (0px), por una carrera entre los distintos embeds al
 * procesarse todos a la vez. Cada iframe acá es 100% independiente: no hay
 * script compartido ni coordinación entre publicaciones, así que no hay carrera
 * posible. Sigue siendo contenido real y en vivo servido directo por Instagram.
 */
function toEmbedSrc(url: string): string {
  const match = url.match(/instagram\.com\/(?:[^/]+\/)?(p|reel)\/([^/?]+)/i);
  if (!match) return url;
  const [, type, code] = match;
  return `https://www.instagram.com/${type}/${code}/embed/captioned/`;
}

export function InstagramEmbed({ url }: { url: string }) {
  return (
    <div className="flex justify-center overflow-hidden rounded-[24px] bg-card">
      <iframe
        src={toEmbedSrc(url)}
        className="w-full border-0 block"
        style={{ height: 880, maxWidth: 400 }}
        loading="lazy"
        title="Publicación de Instagram"
      />
    </div>
  );
}
