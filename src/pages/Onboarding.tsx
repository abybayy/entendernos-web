import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Brain, Smartphone, Smile, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/entendernos/AppShell";
import logoUrl from "@/assets/logo-entendernos.png";
import { playClickPremium } from "@/lib/sounds";
import { BuyDeckButton } from "@/components/entendernos/BuyDeckButton";

const INSTAGRAM_URL = "https://www.instagram.com/psico.mateogarcia";

export default function Onboarding() {
  // Home identity: color sólido (azul profundo), sin degradé. Los acentos van en
  // contornos/marcos y en los íconos y botones, no en el fondo.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--deck-bg", "#133A59");
    root.style.setProperty("--deck-header-fg", "#ffffff");
    return () => {
      root.style.removeProperty("--deck-bg");
      root.style.removeProperty("--deck-header-fg");
    };
  }, []);

  // Cada bloque lleva un color de la marca solo en el ícono y su fondo suave.
  const features = [
    { Icon: Users, title: "Conexión Real", body: "Preguntas que importan.", color: "#FF3399" },
    { Icon: Brain, title: "Salud Emocional", body: "Para hablar de lo que sentimos.", color: "#FF9E8F" },
    { Icon: Smartphone, title: "Sin Pantallas", body: "Miradas a los ojos, no al celular.", color: "#9CDEEA" },
    { Icon: Smile, title: "Para Todas las Edades", body: "Niñez, adolescencia y adultez.", color: "#69C0BE" },
  ];

  return (
    <AppShell title="">
      <div className="flex flex-col items-center px-6 pb-6" style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir Instagram @psico.mateogarcia"
          className="rounded-full overflow-hidden bg-white border-2 border-white/70 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)] block hover:scale-[1.03] active:scale-95 transition"
          style={{ width: 80, height: 80, aspectRatio: "1 / 1" }}
        >
          <img src={logoUrl} alt="Entendernos" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
        </a>
        <h1 className="mt-3 text-white text-3xl text-center text-balance" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Jugá a Entendernos</h1>
        <p className="mt-2 text-center text-white/85 max-w-xs leading-snug">
          Esta es una muestra digital del mazo de cartas diseñado para conversar en&nbsp;persona.
        </p>

        <ul className="mt-4 w-full max-w-sm grid grid-cols-2 gap-2.5">
          {features.map(({ Icon, title, body, color }, i) => (
            <li
              key={title}
              className="feature-card flex flex-col items-start text-left rounded-3xl p-3.5 bg-white/[0.07] border border-white/15"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="grid place-items-center w-10 h-10 rounded-2xl mb-2.5" style={{ background: `${color}26`, color }}>
                <Icon className="w-5 h-5" aria-hidden />
              </span>
              <p className="text-white text-base leading-tight" style={{ fontWeight: 700 }}>{title}</p>
              <p className="mt-1 text-sm text-white/75 leading-snug">{body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 w-full max-w-sm flex flex-col gap-3">
          <Link
            to="/cartas"
            onClick={() => playClickPremium()}
            className="btn-start rounded-full py-4 flex items-center justify-center gap-2 text-lg font-bold shadow-lg active:scale-[0.99] transition hover:brightness-105"
            style={{ background: "#69C0BE", color: "#025756" }}
          >
            Comenzar
            <ArrowRight className="btn-start-arrow w-5 h-5" aria-hidden />
          </Link>
          <style>{`
            @keyframes featureIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
            .feature-card { animation: featureIn 480ms ease-out both; }
            @keyframes startPulse { 0% { box-shadow: 0 0 0 0 rgba(105,192,190,0.55); } 70% { box-shadow: 0 0 0 14px rgba(105,192,190,0); } 100% { box-shadow: 0 0 0 0 rgba(105,192,190,0); } }
            @keyframes startNudge { 0%, 55%, 100% { transform: translateX(0); } 25% { transform: translateX(5px); } }
            .btn-start { animation: startPulse 2.4s ease-out infinite; }
            .btn-start-arrow { animation: startNudge 2.4s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) { .btn-start, .btn-start-arrow, .feature-card { animation: none; } }
          `}</style>
          <BuyDeckButton />
        </div>
      </div>
    </AppShell>
  );
}
