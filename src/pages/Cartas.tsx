import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, ArrowRight, ArrowLeft, Share2, Users, Sparkles, Smile, Pause, Play } from "lucide-react";
import { WhatsAppIcon } from "@/components/entendernos/BrandIcons";
import { toast, Toaster } from "sonner";
import { DECKS, type DeckId } from "@/data/cards";
import { AppShell } from "@/components/entendernos/AppShell";
import { Tutorial } from "@/components/entendernos/Tutorial";
import { BuyDeckButton } from "@/components/entendernos/BuyDeckButton";
import { useSettings } from "@/components/entendernos/SettingsContext";
import { loadFavorites, saveFavorites } from "@/lib/favorites";
import { useFranja } from "@/components/entendernos/FranjaContext";
import { playWhoosh, playSuccessChord, playChime } from "@/lib/sounds";
import logoUrl from "@/assets/logo-entendernos.png";

const DECK_FRANJA: Record<DeckId, "ninez" | "adolescencia" | "adultez"> = {
  adulto: "adultez",
  adolescente: "adolescencia",
  ninos: "ninez",
};

const DECK_STYLES: Record<DeckId, { accentVar: string; fg: string; tabIcon: typeof Users; baseHex: string }> = {
  adulto: { accentVar: "var(--f-base)", fg: "#ffffff", tabIcon: Users, baseHex: "#133A59" },
  adolescente: { accentVar: "var(--f-base)", fg: "#00302F", tabIcon: Sparkles, baseHex: "#69C0BE" },
  ninos: { accentVar: "var(--f-base)", fg: "#ffffff", tabIcon: Smile, baseHex: "#FF3399" },
};

/** Título de una sola línea por franja (evita "Juego de prueba: ..." en doble línea). */
const DECK_TITLE: Record<DeckId, string> = {
  adulto: "Cartas para la Adultez",
  adolescente: "Cartas para Adolescentes",
  ninos: "Cartas para la Niñez",
};

/** Nombre de la franja para precargar en el mensaje de WhatsApp. */
const DECK_AGE_LABEL: Record<DeckId, string> = {
  adulto: "Adultez",
  adolescente: "Adolescencia",
  ninos: "Niñez",
};

/** Etiqueta del botón del modal final — lleva a la franja siguiente, nombrándola. */
const DECK_NEXT_LABEL: Record<DeckId, string> = {
  adulto: "Ver cartas Adolescencia",
  adolescente: "Ver cartas Niñez",
  ninos: "Ver cartas Adultez",
};

const buildWhatsAppUrl = (ageLabel: string) =>
  "https://wa.me/59898917770?text=" +
  encodeURIComponent(
    `¡Hola! Me gustaría saber más detalles sobre el juego de cartas *Entendernos*:\n\n1. Costo por transferencia\n2. Costo de envío dentro de Montevideo\n3. Tiempo estimado de entrega\n\nMe gustaría llevar el mazo para la edad de: ${ageLabel}`
  );
const SHARE_TEXT = "¡Hola! Te comparto la muestra digital de Entendernos 🃏✨. Es una app con preguntas diseñadas para hablar de lo que no se habla. No es para jugar online, ¡es para abrirla, dejar el celular sobre la mesa y charlar frente a frente!";

export default function Cartas() {
  const [searchParams] = useSearchParams();
  const tutorialParam = searchParams.get("tutorial") === "1";
  const { timer } = useSettings();
  const { setFranja } = useFranja();
  const [activeDeck, setActiveDeck] = useState<DeckId>("adulto");
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites());
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);

  const deck = useMemo(() => DECKS.find((d) => d.id === activeDeck)!, [activeDeck]);
  const total = deck.questions.length;
  const currentIdx = ((index % total) + total) % total;
  const question = deck.questions[currentIdx];
  const currentNum = currentIdx + 1;
  const progressPct = total > 1 ? (currentIdx / (total - 1)) * 100 : 0;
  const qKey = `${deck.id}:${currentIdx}`;
  const isFav = favorites.has(qKey);

  const next = () => {
    if (currentNum >= total) {
      playSuccessChord();
      setCompletionOpen(true);
      return;
    }
    playWhoosh();
    setFading(true);
    setTimeout(() => { setIndex((i) => i + 1); setFading(false); }, 220);
  };
  const prev = () => { playWhoosh(0.12); setFading(true); setTimeout(() => { setIndex((i) => i - 1); setFading(false); }, 220); };
  const switchDeck = (id: DeckId) => { if (id === activeDeck) return; playChime(); setFading(true); setTimeout(() => { setActiveDeck(id); setIndex(0); setFranja(DECK_FRANJA[id]); setFading(false); }, 220); };

  useEffect(() => { setFranja(DECK_FRANJA[activeDeck]); }, [activeDeck, setFranja]);

  const DECK_ORDER: DeckId[] = ["adulto", "adolescente", "ninos"];
  const nextDeckId = DECK_ORDER[(DECK_ORDER.indexOf(activeDeck) + 1) % DECK_ORDER.length];
  const nextStyles = DECK_STYLES[nextDeckId];

  const continueOtherLevel = () => {
    setCompletionOpen(false);
    switchDeck(nextDeckId);
  };
  const toggleFav = () =>
    setFavorites((p) => {
      const n = new Set(p);
      const wasFav = n.has(qKey);
      wasFav ? n.delete(qKey) : n.add(qKey);
      saveFavorites(n);
      if (!wasFav) {
        toast.success("¡Gracias! Nos re sirve para saber qué preguntas les llegan más 💛");
        // Suma anónima (sin identificar a quién la marcó) para saber qué preguntas
        // conectan más. Si falla (sin conexión, etc.) no afecta la experiencia.
        fetch("/api/fav", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qKey }),
        }).catch(() => {});
      }
      return n;
    });

  useEffect(() => {
    document.documentElement.style.setProperty("--deck-accent", "var(--f-base)");
    document.documentElement.style.setProperty("--deck-header-fg", "var(--f-ink)");
    document.documentElement.style.setProperty("--deck-bg", "var(--f-bg)");
    document.documentElement.style.setProperty("--deck-fg", "var(--f-ink)");
    return () => {
      document.documentElement.style.removeProperty("--deck-accent");
      document.documentElement.style.removeProperty("--deck-header-fg");
      document.documentElement.style.removeProperty("--deck-bg");
      document.documentElement.style.removeProperty("--deck-fg");
    };
  }, [activeDeck]);

  useEffect(() => { setElapsed(0); }, [currentIdx, activeDeck, timer]);

  useEffect(() => {
    if (!timer || timer <= 0) return;
    if (paused || tutorialOpen) return;
    const id = window.setInterval(() => {
      setElapsed((e) => {
        const ne = e + 0.1;
        if (ne >= timer) {
          window.setTimeout(() => next(), 0);
          return 0;
        }
        return ne;
      });
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, currentIdx, activeDeck, paused, tutorialOpen]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "https://entendernos.com";
    const text = `${question}\n\n- Entendernos · Mazo ${deck.name}`;
    try {
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
      if (typeof nav.share === "function") await nav.share({ title: "Entendernos", text, url });
      else if (nav.clipboard) { await nav.clipboard.writeText(`${text}\n${url}`); toast.success("Pregunta copiada"); }
    } catch (err) { if ((err as DOMException)?.name !== "AbortError") toast.error("No se pudo compartir"); }
  };

  const handleShareProject = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "https://entendernos.com";
    const text = SHARE_TEXT;
    try {
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
      if (typeof nav.share === "function") await nav.share({ title: "Entendernos", text, url });
      else if (nav.clipboard) { await nav.clipboard.writeText(`${text}\n${url}`); toast.success("Enlace copiado"); }
    } catch (err) { if ((err as DOMException)?.name !== "AbortError") toast.error("No se pudo compartir"); }
  };

  const gesture = useRef({ x: 0, y: 0, active: false });
  const onPointerDown = (e: React.PointerEvent) => { gesture.current = { x: e.clientX, y: e.clientY, active: true }; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!gesture.current.active) return;
    const dx = e.clientX - gesture.current.x; const dy = e.clientY - gesture.current.y;
    gesture.current.active = false;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next() : prev());
  };

  const styles = DECK_STYLES[activeDeck];
  const deckTitle = DECK_TITLE[activeDeck];
  const franja = DECK_FRANJA[activeDeck];
  const whatsappUrl = buildWhatsAppUrl(DECK_AGE_LABEL[activeDeck]);

  return (
    <AppShell title={deckTitle} franja={franja}>
      <div className="px-5 pt-4">
        <div className="flex justify-center -mb-10 relative z-10">
          <Link to="/mazo-fisico" aria-label="Ir al mazo físico" className="rounded-full overflow-hidden bg-white shadow-[0_4px_14px_-4px_rgba(16,42,67,0.25)] border-2 border-[var(--carmesi)] block hover:scale-[1.03] active:scale-95 transition" style={{ width: 90, height: 90 }}>
            <img src={logoUrl} alt="Entendernos" style={{ width: "100%", height: "100%", objectFit: "contain", aspectRatio: "1 / 1", display: "block" }} />
          </Link>
        </div>

        <div
          id="tut-card"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (gesture.current.active = false)}
          className="w-full max-w-[360px] mx-auto bg-card border-2 rounded-[28px] shadow-[0_8px_24px_-12px_rgba(16,42,67,0.2)] pt-12 px-5 pb-5 min-h-[480px] flex flex-col touch-pan-y select-none"
          style={{ borderColor: "var(--f-base)" }}
        >
          <div className={`flex items-start justify-between gap-2 transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Pregunta {currentNum} de {total}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} aria-label="Compartir" className="p-1.5 rounded-full hover:bg-muted">
                <Share2 className="w-5 h-5 text-muted-foreground" />
              </button>
              <button onClick={toggleFav} aria-label="Favorito" className="p-1.5 rounded-full hover:bg-muted">
                <Heart className={`w-5 h-5 ${isFav ? "text-[var(--carmesi)] fill-[var(--carmesi)]" : "text-muted-foreground"}`} />
              </button>
              <span className="text-xs font-semibold ml-1" style={{ color: "var(--f-ink)" }}>{currentNum}/{total}</span>
            </div>
          </div>

          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%`, background: "var(--f-base)" }} />
          </div>

          {timer > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-[var(--azul-marino)]/10 overflow-hidden" aria-label="Temporizador">
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, (elapsed / timer) * 100)}%`, background: DECK_STYLES[activeDeck].accentVar, transition: "width 100ms linear" }} />
              </div>
              <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Reanudar temporizador" : "Pausar temporizador"} className="shrink-0 h-7 w-7 rounded-full grid place-items-center border border-[var(--carmesi)]/30 text-[var(--azul-marino)] hover:bg-muted">
                {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          <div className="flex-1 flex items-center justify-center px-2 py-6">
            <p className={`text-center transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`} style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(1.75rem, 6vw, 2.25rem)", lineHeight: 1.25, color: "var(--f-ink)" }}>
              {question}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button data-sfx="none" onClick={prev} aria-label="Anterior" className="shrink-0 h-12 w-12 rounded-full border-2 flex items-center justify-center hover:bg-muted active:scale-95 transition" style={{ color: "var(--f-ink)", borderColor: "var(--f-base)" }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button data-sfx="none" id="tut-next" onClick={next} className="flex-1 rounded-full py-3.5 px-5 font-semibold flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-[0.99] transition-opacity whitespace-nowrap" style={{ background: styles.accentVar, color: styles.fg }}>
              Siguiente carta <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h2 className="mt-8 mb-3 font-bold flex items-center justify-center gap-2 text-center" style={{ fontFamily: "var(--font-display)", color: "var(--deck-fg, var(--foreground))" }}>
          <Sparkles className="w-5 h-5" style={{ color: "var(--deck-fg, var(--carmesi))" }} /> ¿Te gustaría adquirir el mazo completo?
        </h2>

        <div className="flex flex-col gap-3">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full rounded-full bg-[#25D366] text-[#0b3d24] py-3.5 px-5 font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-[#1EBE5B] transition-colors">
            <WhatsAppIcon />
            Atención personalizada
          </a>
          <BuyDeckButton />
        </div>
        <p className="mt-2 text-xs text-center" style={{ color: "var(--deck-fg, var(--muted-foreground))", opacity: 0.75 }}>
          Tu compra por Mercado Pago es válida para las 3 franjas: indicás el mazo que querés al coordinar el envío o retiro.
        </p>

        <button onClick={handleShareProject} className="mt-5 w-full bg-card border rounded-full py-3 font-medium text-sm hover:bg-muted transition-colors flex items-center justify-center gap-2" style={{ color: "var(--azul-marino)", borderColor: "color-mix(in oklab, var(--azul-marino) 25%, transparent)" }}>
          Compartir este proyecto <Share2 className="w-4 h-4" />
        </button>

        <div className="mt-6 flex justify-center gap-6 text-sm" style={{ color: "var(--deck-fg, var(--muted-foreground))" }}>
          <Link to="/creditos" className="hover:underline opacity-90 hover:opacity-100" style={{ color: "inherit" }}>Créditos</Link>
          <Link to="/privacidad" className="hover:underline opacity-90 hover:opacity-100" style={{ color: "inherit" }}>Privacidad</Link>
        </div>
        <p className="mt-2 text-xs text-center" style={{ color: "var(--deck-fg, var(--muted-foreground))", opacity: 0.85 }}>© {new Date().getFullYear()} Entendernos · Diseñado para la conexión humana</p>

        <div className="h-24" />
      </div>

      <nav id="tut-deck-nav" className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-40">
        <div className="max-w-md mx-auto grid grid-cols-3">
          {DECKS.map((d) => {
            const Icon = DECK_STYLES[d.id].tabIcon;
            const active = d.id === activeDeck;
            return (
              <button key={d.id} onClick={() => switchDeck(d.id)} className="flex flex-col items-center gap-1 py-3 text-xs relative" style={active ? { color: DECK_STYLES[d.id].accentVar } : undefined}>
                {active && <span className="absolute top-0 h-0.5 w-10 rounded-full" style={{ background: DECK_STYLES[d.id].accentVar }} />}
                <Icon className="w-5 h-5" />
                <span className="font-medium">{d.subtitle}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <Toaster position="bottom-center" richColors />
      <Tutorial force={tutorialParam} onOpenChange={setTutorialOpen} />

      {completionOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCompletionOpen(false)} aria-hidden />
          <div className="relative w-full max-w-sm bg-card rounded-[28px] border-2 border-[var(--carmesi)] p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="mx-auto w-14 h-14 rounded-full grid place-items-center mb-3" style={{ background: styles.baseHex }}>
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-center text-xl mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: styles.baseHex }}>Qué lindo encuentro</h3>
            <p className="text-center text-foreground/80 leading-snug mb-5">Esta fue solo una experiencia de prueba de todo lo que te espera en el mazo real.</p>
            <div className="flex flex-col gap-2">
              <button onClick={continueOtherLevel} className="w-full rounded-full py-3 font-semibold shadow-md hover:opacity-90 transition-opacity" style={{ background: nextStyles.baseHex, color: nextStyles.fg }}>
                {DECK_NEXT_LABEL[activeDeck]}
              </button>
              <BuyDeckButton />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
