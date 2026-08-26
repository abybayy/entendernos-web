import { MercadoPagoIcon, MercadoPagoBadge, MERCADO_PAGO_BLUE } from "@/components/entendernos/BrandIcons";

export const MERCADO_PAGO_URL = "https://mpago.la/2FXRMT5";

/**
 * Botón único de "Comprar mazo" (misma acción en toda la app).
 * variant="solid": relleno celeste oficial de Mercado Pago + isotipo negativo.
 * variant="outline": secundario, solo contorno celeste + isotipo sobre badge celeste.
 */
export function BuyDeckButton({
  variant = "solid",
  className = "",
  label = "Comprar mazo",
}: {
  variant?: "solid" | "outline";
  className?: string;
  label?: string;
}) {
  const base = "w-full rounded-full py-4 px-5 font-semibold flex items-center justify-center gap-2 transition-colors";
  if (variant === "outline") {
    return (
      <a href={MERCADO_PAGO_URL} target="_blank" rel="noopener noreferrer" className={`${base} bg-transparent border-2 hover:bg-white/10 ${className}`} style={{ borderColor: MERCADO_PAGO_BLUE, color: MERCADO_PAGO_BLUE }}>
        <MercadoPagoBadge />
        {label}
      </a>
    );
  }
  return (
    <a href={MERCADO_PAGO_URL} target="_blank" rel="noopener noreferrer" className={`${base} text-white shadow-sm hover:opacity-90 ${className}`} style={{ background: MERCADO_PAGO_BLUE }}>
      <MercadoPagoIcon />
      {label}
    </a>
  );
}
