import { Download, FileText, BookOpen } from "lucide-react";
import { AppShell } from "@/components/entendernos/AppShell";

const GUIA_PDF_URL = "/Guia-Entendernos.pdf";

export default function MaterialApoyo() {
  return (
    <AppShell title="Material de apoyo">
      <div className="px-5 pt-6 pb-12 space-y-6">
        <p className="text-foreground/80 leading-relaxed text-sm">
          Recursos para sacarle el máximo provecho al mazo, en casa, la escuela o el consultorio. Sirve para las tres franjas: Niñez, Adolescencia y Adultez.
        </p>

        <article className="rounded-3xl border border-[var(--carmesi)]/15 bg-card shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-14 h-14 rounded-2xl bg-[var(--carmesi)]/10 grid place-items-center text-[var(--carmesi)]">
                <BookOpen className="w-7 h-7" />
              </span>
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-[var(--carmesi)] bg-[var(--carmesi)]/10 px-2 py-0.5 rounded-full mb-2">Manual oficial</span>
                <h2 className="text-foreground font-bold leading-snug" style={{ fontFamily: "var(--font-display)" }}>Guía Oficial de Uso y Convivencia: Juego Entendernos</h2>
              </div>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed">
              El manual completo para moderar las charlas: pautas de uso responsable y tres variantes de juego <strong>(Modo Ronda, Modo Libre, Modo Reto)</strong> para adaptarlo a cada grupo.
            </p>

            <a
              href={GUIA_PDF_URL || undefined}
              download="Guia-Entendernos.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!GUIA_PDF_URL}
              className={`w-full rounded-2xl bg-[var(--carmesi)] text-white py-3 px-5 flex items-center justify-center gap-2 font-semibold shadow-md transition ${GUIA_PDF_URL ? "hover:brightness-110" : "opacity-60 pointer-events-none"}`}
            >
              <Download className="w-5 h-5" />
              Descargar Guía Completa (PDF)
            </a>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-3.5 h-3.5" />
              <span>PDF · Lectura recomendada antes de la primera sesión</span>
            </div>
          </div>
        </article>

        <div className="rounded-2xl bg-[var(--carmesi)]/8 border border-[var(--carmesi)]/10 p-4">
          <p className="text-xs text-foreground/75 leading-relaxed text-center">
            Podés leerla incluso antes de comprar el mazo, para conocer su enfoque.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
