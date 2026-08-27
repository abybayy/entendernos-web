import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { playTutorialNext } from "@/lib/sounds";

// Bumped to v7: una flecha conecta la burbuja con la zona enfocada cuando están
// lejos entre sí, para que el ojo encuentre rápido a dónde mirar.
const KEY = "entendernos:tutorial:done:v7";

/** Punto donde el segmento centro-A → centro-B cruza el borde del rect A. */
function edgePoint(rect: { top: number; left: number; width: number; height: number }, towardX: number, towardY: number) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = towardX - cx;
  const dy = towardY - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const halfW = rect.width / 2;
  const halfH = rect.height / 2;
  const scaleX = dx !== 0 ? halfW / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? halfH / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

type Step = {
  targetId: string | null;
  body: string;
  shape?: "rect" | "pill";
};

const STEPS: Step[] = [
  { targetId: "tut-deck-nav", body: "Elegí el rango de edad que prefieras", shape: "rect" },
  { targetId: "tut-card", body: "Leé la pregunta y escuchá con el corazón", shape: "rect" },
  { targetId: "tut-next", body: "Pasá a la siguiente carta cuando estén listos. ¡Lo más importante es el encuentro real!", shape: "rect" },
];

const PAD = 8;
const TUT_BLUE = "#133A59";

export function Tutorial({ force = false, onClose, onOpenChange }: { force?: boolean; onClose?: () => void; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [bubbleRect, setBubbleRect] = useState<DOMRect | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (force) {
      try { localStorage.removeItem(KEY); } catch {}
      setOpen(true);
      setStep(0);
      return;
    }
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {}
  }, [force]);

  useEffect(() => {
    const onStart = () => {
      try { localStorage.removeItem(KEY); } catch {}
      setStep(0);
      setOpen(true);
    };
    window.addEventListener("entendernos:tutorial:start", onStart);
    return () => window.removeEventListener("entendernos:tutorial:start", onStart);
  }, []);

  useEffect(() => { onOpenChange?.(open); }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const s = STEPS[step];

  // Measure target only for steps that spotlight a real element (no scrolling needed —
  // the bubble is docked at the bottom regardless of target position).
  useLayoutEffect(() => {
    if (!open || !s.targetId) { setRect(null); return; }
    let raf = 0;
    const measure = () => {
      const el = document.getElementById(s.targetId!);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    measure();
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    const t1 = window.setTimeout(measure, 120);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      cancelAnimationFrame(raf);
      clearTimeout(t1);
    };
  }, [open, step, s.targetId]);

  const padded = rect ? { top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 } : null;

  // Si el foco cae en la mitad inferior de la pantalla, la burbuja se ancla arriba
  // (así nunca lo tapa); si no, se ancla abajo como de costumbre.
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const dockTop = !!rect && rect.top + rect.height / 2 > vh * 0.55;

  // Mide la burbuja después de que se ubica (arriba/centro/abajo) para poder
  // dibujar la flecha que la conecta con la zona enfocada.
  useLayoutEffect(() => {
    if (!open) { setBubbleRect(null); return; }
    let raf = 0;
    const measure = () => setBubbleRect(bubbleRef.current ? bubbleRef.current.getBoundingClientRect() : null);
    raf = requestAnimationFrame(measure);
    const t1 = window.setTimeout(measure, 130);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); };
  }, [open, step, dockTop]);

  if (!open) return null;

  const last = step === STEPS.length - 1;
  const close = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
    onClose?.();
  };

  const radius = s.shape === "pill" ? 9999 : 20;

  // Flecha burbuja → foco, solo si están lo bastante lejos como para que ayude.
  let arrow: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (padded && bubbleRect) {
    const targetCx = padded.left + padded.width / 2;
    const targetCy = padded.top + padded.height / 2;
    const bubbleCx = bubbleRect.left + bubbleRect.width / 2;
    const bubbleCy = bubbleRect.top + bubbleRect.height / 2;
    const dist = Math.hypot(targetCx - bubbleCx, targetCy - bubbleCy);
    if (dist > 90) {
      const p1 = edgePoint(bubbleRect, targetCx, targetCy);
      const p2 = edgePoint(padded, bubbleCx, bubbleCy);
      arrow = { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    }
  }

  return (
    <div className="fixed inset-0 z-[60] pointer-events-auto">
      {/* Dim layer, with cutout only when a real target is being spotlighted */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <mask id="entendernos-tut-mask">
            <rect width="100%" height="100%" fill="white" />
            {padded && <rect x={padded.left} y={padded.top} width={padded.width} height={padded.height} rx={radius} ry={radius} fill="black" />}
          </mask>
          <marker id="entendernos-tut-arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="rgba(19, 58, 89, 0.72)" mask="url(#entendernos-tut-mask)" />
        {arrow && (
          <line
            x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2}
            stroke="white" strokeWidth={3} strokeLinecap="round" strokeDasharray="1 10"
            markerEnd="url(#entendernos-tut-arrowhead)" opacity={0.9}
          />
        )}
      </svg>

      {padded && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: padded.top,
            left: padded.left,
            width: padded.width,
            height: padded.height,
            borderRadius: radius,
            boxShadow: `0 0 0 2px ${TUT_BLUE}, 0 0 0 6px color-mix(in oklab, ${TUT_BLUE} 35%, transparent), 0 0 40px 4px color-mix(in oklab, ${TUT_BLUE} 45%, transparent)`,
            animation: "tutPulse 1.6s ease-in-out infinite",
          }}
        />
      )}

      {/* Bubble — cuando el foco está en la mitad inferior (dockTop), la burbuja flota
          centrada en la pantalla (evita el salto brusco de la mirada entre pasos);
          si no, queda anclada abajo como panel fijo. */}
      <div
        ref={bubbleRef}
        className={
          dockTop
            ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2.5rem)] text-white px-5 py-5 rounded-3xl shadow-2xl"
            : "fixed left-1/2 bottom-0 -translate-x-1/2 w-full text-white px-5 pt-4 rounded-t-3xl shadow-2xl"
        }
        style={{
          background: TUT_BLUE,
          maxWidth: 420,
          paddingBottom: dockTop ? undefined : "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-full bg-white grid place-items-center text-sm font-bold shrink-0" style={{ color: TUT_BLUE }}>{step + 1}</span>
          <span className="text-sm font-bold tracking-wider opacity-90">Paso {step + 1} de {STEPS.length}</span>
        </div>

        <p className="text-base leading-snug mb-3">{s.body}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5 shrink-0">
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                data-sfx="none"
                onClick={() => { playTutorialNext(); setStep((n) => Math.max(0, n - 1)); }}
                className="rounded-full px-4 py-2 font-semibold text-sm flex items-center gap-1.5 border border-white/60 text-white hover:bg-white/10 active:scale-95 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
            )}
            <button
              data-sfx="none"
              onClick={() => { playTutorialNext(); if (last) close(); else setStep((n) => n + 1); }}
              className="bg-white rounded-full px-5 py-2 font-semibold text-sm flex items-center gap-1.5 hover:bg-white/90 active:scale-95 transition-colors"
              style={{ color: TUT_BLUE }}
            >
              {last ? "Empezar" : "Siguiente"}
              {!last && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Fix: "Saltar tutorial" — solo texto, sin fondo ni contorno (baja jerarquía). */}
        <button data-sfx="none" onClick={close} className="mt-3 mb-1 mx-auto block text-sm font-medium text-white/70 hover:text-white underline-offset-2 hover:underline transition-colors">
          Saltar tutorial
        </button>
      </div>

      <style>{`@keyframes tutPulse { 0%,100% { opacity: 1 } 50% { opacity: 0.6 } }`}</style>
    </div>
  );
}
