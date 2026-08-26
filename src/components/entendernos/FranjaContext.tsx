import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Franja = "ninez" | "adolescencia" | "adultez";

type FranjaValue = {
  franja: Franja;
  setFranja: (f: Franja) => void;
};

const FranjaCtx = createContext<FranjaValue | null>(null);

const KEY = "entendernos:last-franja";
const DEFAULT: Franja = "adultez";

export function FranjaProvider({ children }: { children: ReactNode }) {
  const [franja, setFranjaState] = useState<Franja>(DEFAULT);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as Franja | null;
      if (stored === "ninez" || stored === "adolescencia" || stored === "adultez") {
        setFranjaState(stored);
      }
    } catch {}
  }, []);

  const setFranja = (f: Franja) => {
    setFranjaState(f);
    try { localStorage.setItem(KEY, f); } catch {}
  };

  return (
    <FranjaCtx.Provider value={{ franja, setFranja }}>
      {children}
    </FranjaCtx.Provider>
  );
}

export function useFranja() {
  const ctx = useContext(FranjaCtx);
  if (!ctx) throw new Error("useFranja must be used inside <FranjaProvider>");
  return ctx;
}
