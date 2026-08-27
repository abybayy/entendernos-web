import { useState } from "react";
import { X } from "lucide-react";
import { MercadoPagoIcon, MERCADO_PAGO_BLUE } from "@/components/entendernos/BrandIcons";
import { playMenuSwish } from "@/lib/sounds";

type DeckOption = {
  id: "adultez" | "adolescencia" | "ninez";
  label: string;
  href: string;
  base: string;
  ink: string;
};

/** Orden fijo: Adultez, Adolescencia, Niñez. */
const DECK_OPTIONS: DeckOption[] = [
  { id: "adultez", label: "Adultez", href: "https://mpago.la/2FXRMT5", base: "#133A59", ink: "#EFF4F8" },
  { id: "adolescencia", label: "Adolescencia", href: "https://mpago.la/18KMFZR", base: "#69C0BE", ink: "#025756" },
  { id: "ninez", label: "Niñez", href: "https://mpago.la/1gw6th8", base: "#FF3399", ink: "#FFF2F7" },
];

/**
 * Botón único de "Comprar mazo" (misma acción en toda la app). A propósito es
 * secundario: sin relleno plano, solo contorno e isotipo en el celeste oficial
 * de Mercado Pago, para no competir con el acento propio de cada franja.
 *
 * Al tocarlo despliega un selector con las 3 franjas, cada una con su propio
 * link de Mercado Pago (cada opción es un <a href> estático — nada de un
 * handler compartido leyendo una variable de loop, que fue la causa del bug
 * donde las 3 opciones caían en el mismo link).
 */
export function BuyDeckButton({
  className = "",
  label = "Comprar mazo",
}: {
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        data-sfx="none"
        onClick={() => { playMenuSwish(); setOpen(true); }}
        className={`w-full rounded-full py-4 px-5 font-semibold flex items-center justify-center gap-2 bg-transparent border-2 hover:opacity-80 transition-opacity ${className}`}
        style={{ borderColor: MERCADO_PAGO_BLUE, color: MERCADO_PAGO_BLUE }}
      >
        <MercadoPagoIcon color={MERCADO_PAGO_BLUE} />
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-black/50" onClick={() => { playMenuSwish(); setOpen(false); }} aria-hidden />
          <div className="relative w-full max-w-sm bg-card rounded-[28px] border-2 p-6 shadow-2xl animate-in fade-in zoom-in-95" style={{ borderColor: MERCADO_PAGO_BLUE }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--azul-marino)" }}>
                <MercadoPagoIcon className="w-6 h-6" color={MERCADO_PAGO_BLUE} />
                ¿Qué mazo querés comprar?
              </h3>
              <button data-sfx="none" onClick={() => { playMenuSwish(); setOpen(false); }} aria-label="Cerrar" className="p-1 -mr-1 shrink-0">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <p className="-mt-2 mb-4 text-sm text-center text-muted-foreground">$590 cada mazo</p>
            <div className="flex flex-col gap-2.5">
              {DECK_OPTIONS.map((deck) => (
                <a
                  key={deck.id}
                  href={deck.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full py-3.5 px-5 font-semibold text-center shadow-sm hover:opacity-90 active:scale-[0.99] transition"
                  style={{ background: deck.base, color: deck.ink }}
                >
                  {deck.label}
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Te lleva a Mercado Pago en una pestaña nueva.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
