import { Download, FileText, BookOpen } from "lucide-react";
import { AppShell } from "@/components/entendernos/AppShell";
import { track } from "@/lib/track";

const GUIA_PDF_URL = "/Guia-Entendernos.pdf";

const MODOS = ["Modo Ronda", "Modo Libre", "Modo Reto"];

export default function MaterialApoyo() {
  return (
    <AppShell title="Material de apoyo">
      <div className="px-5 pt-6 pb-12 space-y-6">
        <article className="rounded-3xl border border-[var(--carmesi)]/15 bg-card shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <span className="shrink-0 w-14 h-14 rounded-2xl bg-[var(--carmesi)]/10 grid place-items-center text-[var(--carmesi)]">
                <BookOpen className="w-7 h-7" />
              </span>
              <h2 className="flex-1 min-w-0 text-foreground text-lg font-bold leading-snug" style={{ fontFamily: "var(--font-display)" }}>Guía de uso y convivencia</h2>
            </div>

            <p className="text-base text-foreground/80 leading-relaxed text-pretty">
              Pautas para moderar las charlas y usar el mazo con responsabilidad, más tres modos de juego para adaptarlo a cada grupo. Sirve para todas las franjas: Niñez, Adolescencia y Adultez.
            </p>

            <ul className="flex flex-wrap gap-2" aria-label="Modos de juego">
              {MODOS.map((m) => (
                <li key={m} className="rounded-full border border-[var(--carmesi)]/30 bg-[var(--carmesi)]/5 px-3.5 py-1.5 text-sm font-medium text-foreground">
                  {m}
                </li>
              ))}
            </ul>

            <a
              href={GUIA_PDF_URL || undefined}
              download="Guia-Entendernos.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!GUIA_PDF_URL}
              onClick={() => track("guide_download")}
              className={`w-full rounded-2xl bg-[var(--carmesi)] text-white py-3 px-5 flex items-center justify-center gap-2 font-semibold shadow-md transition ${GUIA_PDF_URL ? "hover:brightness-110" : "opacity-60 pointer-events-none"}`}
            >
              <Download className="w-5 h-5" />
              Descargar guía
            </a>

            <div className="flex items-center justify-center gap-2 text-sm text-foreground/75">
              <FileText className="w-4 h-4 shrink-0" />
              <span className="text-balance">PDF. Podés leerla antes de comprar el mazo.</span>
            </div>
          </div>
        </article>
      </div>
    </AppShell>
  );
}
