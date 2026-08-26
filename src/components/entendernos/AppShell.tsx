import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Settings, BookOpen, Info, Lock, Layers, Sparkles, Bell, Home, FileText } from "lucide-react";
import { playMenuSwish, playBack, playTick } from "@/lib/sounds";
import { useFranja, type Franja } from "@/components/entendernos/FranjaContext";

const NAV = [
  { to: "/cartas", label: "Muestra Digital", icon: Sparkles },
  { to: "/mazo-fisico", label: "Mazo Físico", icon: Layers },
  { to: "/material-apoyo", label: "Material de apoyo", icon: FileText },
];

const SECONDARY = [
  { to: "/novedades", label: "Novedades", icon: Bell },
  { to: "/creditos", label: "Créditos", icon: Info },
  { to: "/privacidad", label: "Privacidad", icon: Lock },
  { to: "/ajustes", label: "Ajustes", icon: Settings },
];

export function AppShell({ title = "Menú", children, franja }: { title?: string; children: ReactNode; franja?: Franja }) {
  const globalFranja = useFranja().franja;
  const activeFranja = franja ?? globalFranja;
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === "/";

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-franja", activeFranja);
    return () => root.removeAttribute("data-franja");
  }, [activeFranja]);

  return (
    <div data-franja={activeFranja} className="min-h-screen flex flex-col transition-colors duration-500" style={{ background: "var(--deck-bg, var(--background))" }}>
      <header className="border-b border-[var(--carmesi)]/10">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-5 pt-5 pb-3">
          {isHome ? (
            <span aria-hidden className="p-1 w-8 h-8" />
          ) : (
            <Link to="/" aria-label="Inicio" className="p-1 hover:opacity-80 transition" style={{ color: "var(--deck-header-fg, var(--carmesi))" }}>
              <Home className="w-6 h-6" />
            </Link>
          )}
          {title ? (
            <h1
              className="text-[var(--carmesi)] tracking-wide whitespace-nowrap"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--deck-header-fg, var(--carmesi))", fontSize: "clamp(1rem, 4.6vw, 1.25rem)" }}
            >
              {title}
            </h1>
          ) : (
            <span aria-hidden className="h-6" />
          )}
          {isHome ? (
            <span aria-hidden className="p-1 w-8 h-8" />
          ) : (
            <button data-sfx="none" onClick={() => { playMenuSwish(); setOpen(true); }} className="p-1 transition" style={{ color: "var(--deck-header-fg, var(--carmesi))" }} aria-label="Menú">
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto">{children}</main>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => { playMenuSwish(); setOpen(false); }} aria-hidden />
          <aside className="relative bg-background w-[85%] max-w-sm h-full shadow-xl flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--carmesi)]/15">
              <h2 className="text-[var(--carmesi)] text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Menú</h2>
              <button data-sfx="none" onClick={() => { playBack(); setOpen(false); }} aria-label="Cerrar" className="p-1">
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>
            <nav className="px-4 py-4 flex flex-col gap-1">
              {NAV.map((n) => {
                const Icon = n.icon;
                const active = pathname === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => { playTick(); setOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${active ? "border-2 border-[var(--carmesi)] text-[var(--carmesi)] font-semibold bg-[var(--carmesi)]/5" : "hover:bg-muted text-foreground"}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{n.label}</span>
                  </Link>
                );
              })}
              <div className="my-3 h-px bg-[var(--carmesi)]/15" />
              <button
                onClick={() => {
                  playTick();
                  setOpen(false);
                  navigate("/cartas?tutorial=1");
                  setTimeout(() => window.dispatchEvent(new Event("entendernos:tutorial:start")), 50);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition text-foreground hover:bg-muted text-left"
              >
                <BookOpen className="w-5 h-5" />
                <span>Tutorial</span>
              </button>
              {SECONDARY.map((n) => {
                const Icon = n.icon;
                const active = pathname === n.to;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => { playTick(); setOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${active ? "text-[var(--carmesi)] font-semibold" : "text-foreground hover:bg-muted"}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{n.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pb-8 text-center">
              <p className="text-foreground" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Entendernos</p>
              <p className="text-xs text-muted-foreground">Versión 1.0.0</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
