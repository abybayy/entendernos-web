const KEY = "entendernos:favorites";

/** Favoritos persistidos en el dispositivo (sin backend, no se sincroniza entre dispositivos). */
export function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function saveFavorites(favs: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...favs]));
  } catch {}
}
