import { useEffect, useState } from "react";
import { X } from "lucide-react";

// v12: el tutorial de 3 pasos se reemplazó por un único aviso corto sobre las
// pestañas. Al cambiar la clave, quien ya había visto el tutorial viejo vuelve
// a ver este aviso una vez.
const KEY = "entendernos:tutorial:done:v12";
const TUT_BLUE = "#133A59";
const TUT_BG = "#DDF1F6";
const FALLBACK_NAV_HEIGHT = 72;

// Mantiene el mismo nombre y las mismas props que el tutorial anterior para que
// Cartas.tsx y el botón "Tutorial" del menú sigan funcionando sin cambios.
export function Tutorial({ force = false, onOpenChange }: { force?: boolean; onClose?: () => void; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(FALLBACK_NAV_HEIGHT);

  const close = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  };

  // Mostrar la primera vez (o siempre que se fuerce desde el menú).
  useEffect(() => {
    if (force) {
      try { localStorage.removeItem(KEY); } catch {}
      setOpen(true);
      return;
    }
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {}
  }, [force]);

  // El botón "Tutorial" del menú vuelve a mostrar el aviso.
  useEffect(() => {
    const onStart = () => {
      try { localStorage.removeItem(KEY); } catch {}
      setOpen(true);
    };
    window.addEventListener("entendernos:tutorial:start", onStart);
    return () => window.removeEventListener("entendernos:tutorial:start", onStart);
  }, []);

  // El aviso no bloquea la pantalla, así que nunca pausa el temporizador de las cartas.
  useEffect(() => { onOpenChange?.(false); }, [onOpenChange]);

  // Apoyar el aviso justo encima de las pestañas, sea cual sea su alto.
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const nav = document.getElementById("tut-deck-nav");
      setNavHeight(nav ? Math.round(nav.getBoundingClientRect().height) : FALLBACK_NAV_HEIGHT);
    };
    measure();
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 400);
    return () => {
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [open]);

  // Si la persona toca una pestaña, ya entendió la regla: se cierra solo.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const nav = document.getElementById("tut-deck-nav");
      if (nav && e.target instanceof Node && nav.contains(e.target)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="note"
      onClick={close}
      className="cursor-pointer fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] rounded-2xl shadow-[0_10px_28px_-8px_rgba(19,58,89,0.45)] pl-5 pr-12 py-3.5"
      style={{ background: TUT_BG, color: TUT_BLUE, border: `2px solid ${TUT_BLUE}`, maxWidth: 400, bottom: navHeight + 14 }}
    >
      <p className="text-[15px] leading-snug text-balance font-bold">
        Se juega entre dos o más personas.
      </p>
      <p className="mt-0.5 text-[15px] leading-snug text-pretty">
        Elijan la franja según la persona más joven.
      </p>
      <button
        data-sfx="none"
        onClick={(e) => { e.stopPropagation(); close(); }}
        aria-label="Cerrar aviso"
        className="absolute right-1.5 top-1.5 h-10 w-10 rounded-full grid place-items-center hover:bg-black/5 active:scale-95 transition"
      >
        <X className="w-5 h-5" />
      </button>
      <span
        aria-hidden
        className="absolute left-1/2 -bottom-[8px] h-3.5 w-3.5 -translate-x-1/2 rotate-45"
        style={{ background: TUT_BG, borderRight: `2px solid ${TUT_BLUE}`, borderBottom: `2px solid ${TUT_BLUE}` }}
      />
    </div>
  );
}
