import { WaveDivider } from "@/components/entendernos/Logo";
import { AppShell } from "@/components/entendernos/AppShell";
import logoUrl from "@/assets/logo-entendernos.png";

export default function Creditos() {
  const items: { role: string; name: string; href?: string }[] = [
    { role: "Lic. en Psicología · Especialista en Psicogerontología", name: "Mateo García Moreno", href: "https://www.instagram.com/psico.mateogarcia" },
    { role: "Lic. en Diseño de Comunicación Visual · Diplomada en Diseño de Experiencia de Usuario", name: "Victoria Abigail Huayhuaca", href: "https://www.behance.net/vhuayhuaca" },
    { role: "Desarrollo en colaboración con", name: "Claude" },
  ];
  return (
    <AppShell title="Créditos">
      <div className="px-6 pt-8 pb-12 flex flex-col items-center text-center">
        <div className="rounded-full overflow-hidden bg-white border-2 border-[var(--carmesi)]" style={{ width: 88, height: 88, aspectRatio: "1 / 1" }}>
          <img src={logoUrl} alt="Entendernos" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
        </div>
        <h2 className="mt-4 text-[var(--carmesi)] text-3xl" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Entendernos</h2>
        <WaveDivider className="mt-3" />

        <div className="mt-8 w-full space-y-4">
          {items.map((it) => {
            const cls = "block w-full text-center rounded-2xl border border-[var(--carmesi)]/15 bg-card p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-[var(--carmesi)]/5 hover:opacity-95";
            const inner = (
              <>
                <p className="text-xs uppercase tracking-wider text-muted-foreground text-center">{it.role}</p>
                <p className="mt-1 font-semibold text-foreground text-center">{it.name}</p>
              </>
            );
            return it.href ? (
              <a key={it.role} href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
            ) : (
              <div key={it.role} className={cls}>{inner}</div>
            );
          })}
        </div>

        <p className="mt-10 text-xs text-muted-foreground">© {new Date().getFullYear()} Entendernos</p>
      </div>
    </AppShell>
  );
}
