/** Spinner de carga de Entendernos (péndulo de Newton). Los estilos viven en
 * styles.css (.loader). Color por defecto: azul marino de la paleta; sobre
 * fondos oscuros pasá color="#fff". */
export function Spinner({ color, className = "" }: { color?: string; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={`loader ${className}`}
      style={color ? ({ ["--spinner-color" as string]: color } as React.CSSProperties) : undefined}
    />
  );
}
