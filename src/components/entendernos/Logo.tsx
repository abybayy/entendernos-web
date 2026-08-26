export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg viewBox="0 0 300 80" className="w-full max-w-[260px]" aria-label="Entendernos">
        <defs>
          <path id="arc" d="M 20 70 Q 150 -10 280 70" fill="none" />
        </defs>
        <text
          fill="var(--carmesi)"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.18em" }}
          fontSize="26"
        >
          <textPath href="#arc" startOffset="50%" textAnchor="middle">
            ENTENDERNOS
          </textPath>
        </text>
      </svg>
      <Isotipo className="-mt-2" />
    </div>
  );
}

export function Isotipo({ className = "", size = 64 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="white" stroke="var(--azul-marino)" strokeWidth="2" />
      <path d="M30 78 C25 70 22 60 24 48 C26 30 40 18 56 20 C72 22 80 36 80 50 L80 78 Z" fill="var(--azul-marino)" />
      <path d="M40 42 C40 34 48 30 54 33 C60 28 70 32 70 42 C72 46 70 52 64 54 C62 60 52 60 48 56 C42 56 38 50 40 42 Z" fill="var(--rosa-cerebro)" />
      <path d="M55 44 C53 41 49 41 49 45 C49 49 55 52 55 52 C55 52 61 49 61 45 C61 41 57 41 55 44 Z" fill="var(--cyan-pastel)" />
    </svg>
  );
}

export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 16" className={`h-4 ${className}`} fill="none" stroke="var(--carmesi)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M2 8 Q 8 2, 14 8 T 26 8" />
      <path d="M30 8 Q 36 2, 42 8 T 54 8" />
      <path d="M58 8 Q 64 2, 70 8 T 78 8" opacity="0.7" />
    </svg>
  );
}
