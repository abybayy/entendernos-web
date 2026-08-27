import { MercadoPagoIcon, MERCADO_PAGO_BLUE } from "@/components/entendernos/BrandIcons";

export const MERCADO_PAGO_URL = "https://mpago.la/2FXRMT5";

/**
 * Botón único de "Comprar mazo" (misma acción en toda la app). A propósito es
 * secundario: sin relleno plano, solo contorno e isotipo en el celeste oficial
 * de Mercado Pago, para no competir con el acento propio de cada franja.
 */
export function BuyDeckButton({
  className = "",
  label = "Comprar mazo",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={MERCADO_PAGO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full rounded-full py-4 px-5 font-semibold flex items-center justify-center gap-2 bg-transparent border-2 hover:opacity-80 transition-opacity ${className}`}
      style={{ borderColor: MERCADO_PAGO_BLUE, color: MERCADO_PAGO_BLUE }}
    >
      <MercadoPagoIcon color={MERCADO_PAGO_BLUE} />
      {label}
    </a>
  );
}
