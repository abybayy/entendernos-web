import { useState } from "react";
import { Volume2, Timer, Globe, Shield, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { AppShell } from "@/components/entendernos/AppShell";
import { useSettings } from "@/components/entendernos/SettingsContext";
import { playSwitchOn } from "@/lib/sounds";

export default function Ajustes() {
  const { silent, setSilent, timer, setTimer } = useSettings();
  const [langNote, setLangNote] = useState(false);

  return (
    <AppShell title="Ajustes">
      <div className="px-5 pt-6 pb-12 space-y-7">
        <section>
          <h2 className="text-[var(--carmesi)] font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>Experiencia</h2>
          <div className="rounded-3xl bg-[var(--carmesi)]/8 p-2">
            <Row
              Icon={Volume2}
              label={<span>Sonido<span className="block text-xs text-muted-foreground mt-0.5">{silent ? "Efectos de audio desactivados" : "Efectos de audio activados"}</span></span>}
              right={<Switch checked={!silent} onCheckedChange={(v) => { setSilent(!v); if (v) setTimeout(() => playSwitchOn(), 0); }} aria-label="Sonido" />}
            />
            <Divider />
            <Row
              Icon={Timer}
              label={<span>Temporizador<br />de Cartas<span className="block text-xs text-muted-foreground mt-0.5">{timer > 0 ? `Auto-avance cada ${timer}s` : "Desactivado"}</span></span>}
              right={
                <div className="flex items-center gap-2 bg-card rounded-full px-2 py-1">
                  <button onClick={() => setTimer((t) => Math.max(0, t - 5))} className="p-1 text-foreground"><Minus className="w-4 h-4" /></button>
                  <span className="text-sm font-semibold w-10 text-center">{timer > 0 ? `${timer}s` : "Off"}</span>
                  <button onClick={() => setTimer((t) => Math.min(180, t + 5))} className="p-1 text-foreground"><Plus className="w-4 h-4" /></button>
                </div>
              }
            />
          </div>
        </section>

        <section>
          <h2 className="text-[var(--carmesi)] font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>General</h2>
          <div className="rounded-3xl bg-[var(--carmesi)]/8 p-2">
            <button type="button" onClick={() => { setLangNote(true); window.setTimeout(() => setLangNote(false), 4000); }} className="w-full text-left rounded-2xl hover:bg-[var(--carmesi)]/5 transition">
              <Row Icon={Globe} label="Idioma" right={<span className="text-sm text-muted-foreground flex items-center gap-1">Español ›</span>} />
            </button>
            {langNote && <p className="px-3 pb-2 text-xs text-muted-foreground">Actualmente la aplicación se encuentra disponible únicamente en español.</p>}
            <Divider />
            <Link to="/privacidad" className="block">
              <Row Icon={Shield} label="Privacidad y Seguridad" right={<span className="text-sm text-muted-foreground">›</span>} />
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Row({ Icon, label, right, iconClass = "text-[var(--azul-marino)]" }: { Icon: typeof Volume2; label: React.ReactNode; right: React.ReactNode; iconClass?: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <Icon className={`w-5 h-5 shrink-0 ${iconClass}`} />
      <div className="flex-1 text-sm text-foreground leading-tight">{label}</div>
      <div>{right}</div>
    </div>
  );
}
function Divider() { return <div className="h-px bg-[var(--carmesi)]/15 mx-3" />; }
