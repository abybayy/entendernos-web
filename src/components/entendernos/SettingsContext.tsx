import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type SettingsValue = {
  silent: boolean;
  setSilent: (v: boolean) => void;
  timer: number;
  setTimer: (v: number | ((p: number) => number)) => void;
};

const SettingsCtx = createContext<SettingsValue | null>(null);

const KEY_SILENT = "entendernos:silent";
const KEY_TIMER = "entendernos:timer";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [silent, setSilentState] = useState<boolean>(false);
  const [timer, setTimerState] = useState<number>(0);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY_SILENT);
      const t = localStorage.getItem(KEY_TIMER);
      if (s !== null) setSilentState(s === "1");
      if (t !== null) {
        const n = Number(t);
        if (!Number.isNaN(n)) setTimerState(n);
      }
    } catch {}
  }, []);

  const setSilent = (v: boolean) => {
    setSilentState(v);
    try { localStorage.setItem(KEY_SILENT, v ? "1" : "0"); } catch {}
  };
  const setTimer: SettingsValue["setTimer"] = (v) => {
    setTimerState((prev) => {
      const next = typeof v === "function" ? (v as (p: number) => number)(prev) : v;
      try { localStorage.setItem(KEY_TIMER, String(next)); } catch {}
      return next;
    });
  };

  return (
    <SettingsCtx.Provider value={{ silent, setSilent, timer, setTimer }}>
      {children}
    </SettingsCtx.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsCtx);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}
