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
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="#7BC4E8" />
      <circle cx="100" cy="100" r="84" fill="white" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="var(--azul-marino)" strokeWidth="3" />
      <path
        d="M 95,38 C 118,40 132,55 136,72 C 140,84 141,96 139,105 C 148,108 150,118 145,124 C 141,129 135,130 130,128 C 133,135 130,142 122,146 C 118,148 112,148 106,146 L 106,142 L 98,142 L 98,148 L 60,148 C 46,148 40,130 40,108 C 40,80 55,55 78,44 C 84,41 90,39 95,38 Z"
        fill="#7BC4E8" stroke="var(--azul-marino)" strokeWidth="3.2" strokeLinejoin="round"
      />
      <path
        d="M 78,68 C 72,60 60,60 57,68 C 48,68 44,78 48,85 C 42,90 43,100 50,104 C 48,111 53,118 61,118 C 60,126 70,132 78,127 C 84,133 95,132 99,125 C 106,130 116,125 116,117 C 123,116 126,108 122,102 C 128,97 126,88 119,85 C 121,77 114,69 105,71 C 104,63 93,60 87,66 C 84,63 80,64 78,68 Z M 58,118 C 56,124 54,130 50,134 C 54,131 60,127 61,120 Z"
        fill="var(--rosa-cerebro)" stroke="var(--azul-marino)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
      />
      <path d="M 66,76 C 70,80 70,86 65,89" fill="none" stroke="var(--azul-marino)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 90,68 C 88,74 92,79 98,78" fill="none" stroke="var(--azul-marino)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 108,80 C 112,84 111,90 106,92" fill="none" stroke="var(--azul-marino)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 56,96 C 60,98 60,103 56,105" fill="none" stroke="var(--azul-marino)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 112,100 C 116,102 116,107 112,109" fill="none" stroke="var(--azul-marino)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M 89,92 C 89,86 82,83 78,88 C 74,93 76,99 89,110 C 102,99 104,93 100,88 C 96,83 89,86 89,92 Z"
        fill="var(--cyan-pastel)" stroke="var(--azul-marino)" strokeWidth="3" strokeLinejoin="round"
      />
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
