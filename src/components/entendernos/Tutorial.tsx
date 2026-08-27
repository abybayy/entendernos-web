import { useEffect, useLayoutEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { playTutorialNext } from "@/lib/sounds";

// Bumped a v8: sin flecha. Cuando el foco está abajo, la burbuja queda apoyada
// justo sobre su borde superior (pegada), igual que el paso 2 se apoya sobre
// el suyo — nunca flota suelta en el centro.
const KEY = "entendernos:tutorial:done:v8";

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

  // Si el foco cae en la mitad inferior de la pantalla, la burbuja se apoya justo
  // sobre su borde superior (pegada, sin flecha); si no, se ancla abajo como de costumbre.
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const dockAbove = !!padded && padded.top + padded.height / 2 > vh * 0.55;
  // "bottom" en vez de "top": así no hace falta medir el alto de la burbuja para
  // que su borde inferior quede justo GAP px por encima del borde del foco.
  const GAP = 10;
  const dockAboveBottomPx = dockAbove && padded ? Math.max(0, vh - padded.top + GAP) : undefined;

  if (!open) return null;

  const last = step === STEPS.length - 1;
  const close = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
    onClose?.();
  };

  const radius = s.shape === "pill" ? 9999 : 20;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-auto">
      {/* Dim layer, with cutout only when a real target is being spotlighted */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <mask id="entendernos-tut-mask">
            <rect width="100%" height="100%" fill="white" />
            {padded && <rect x={padded.left} y={padded.top} width={padded.width} height={padded.height} rx={radius} ry={radius} fill="black" />}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(19, 58, 89, 0.72)" mask="url(#entendernos-tut-mask)" />
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

      {/* Bubble — cuando el foco está en la mitad inferior (dockAbove), la burbuja se
          apoya pegada justo sobre su borde superior (mismo criterio que el paso 2,
          que ya queda pegado al foco); si no, queda anclada abajo como panel fijo. */}
      <div
        className={
          dockAbove
            ? "fixed left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] text-white px-5 py-5 rounded-3xl shadow-2xl"
            : "fixed left-1/2 bottom-0 -translate-x-1/2 w-full text-white px-5 pt-4 rounded-t-3xl shadow-2xl"
        }
        style={{
          background: TUT_BLUE,
          maxWidth: 420,
          bottom: dockAbove ? `${dockAboveBottomPx}px` : undefined,
          paddingBottom: dockAbove ? undefined : "max(1rem, env(safe-area-inset-bottom))",
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
