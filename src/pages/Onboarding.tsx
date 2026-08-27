import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Brain, Smartphone, Smile } from "lucide-react";
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

  const features = [
    { Icon: Users, title: "Conexión Real", body: "Preguntas que importan." },
    { Icon: Brain, title: "Salud Emocional", body: "Preguntas que invitan a conectar." },
    { Icon: Smartphone, title: "Sin Pantallas", body: "Miradas a los ojos, no al celular." },
    { Icon: Smile, title: "Para Todas las Edades", body: "Niñez, adolescencia y adultez." },
  ];

  return (
    <AppShell title="">
      <div className="flex flex-col items-center px-6 pt-4 pb-6">
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
        <h1 className="mt-3 text-white text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Entendernos</h1>
        <p className="mt-2 text-center text-white/85 max-w-xs leading-snug">
          Esta es una muestra digital. Nuestro objetivo es promover el encuentro físico y humano a través de un mazo de cartas.
        </p>

        <ul className="mt-4 w-full max-w-sm grid grid-cols-2 gap-3 px-2">
          {features.map(({ Icon, title, body }) => (
            <li key={title} className="flex flex-col items-center text-center gap-1 bg-white/10 rounded-2xl p-2.5 border-0 shadow-none">
              <Icon className="w-6 h-6 text-white" />
              <p className="text-white leading-tight text-sm" style={{ fontWeight: 600 }}>{title}</p>
              <p className="text-xs text-white/75 leading-snug">{body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-5 w-full max-w-sm flex flex-col gap-3">
          <Link
            to="/cartas"
            onClick={() => playClickPremium()}
            className="rounded-full py-4 text-center font-semibold shadow-lg active:scale-[0.99] transition-opacity hover:opacity-90"
            style={{ background: "#69C0BE", color: "#025756" }}
          >
            Empezar prueba
          </Link>
          <BuyDeckButton />
        </div>
      </div>
    </AppShell>
  );
}
