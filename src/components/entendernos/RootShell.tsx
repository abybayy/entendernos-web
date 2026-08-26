import { useEffect, type ReactNode } from "react";
import { playTick } from "@/lib/sounds";

/** Universal click feedback: tiny tick on every interactive element click. */
export function RootShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const el = t.closest(
        'button, a, [role="button"], [role="link"], input[type="button"], input[type="submit"]'
      ) as HTMLElement | null;
      if (!el) return;
      if (el.getAttribute("data-sfx") === "none") return;
      if (el.closest('[data-sfx="none"]')) return;
      playTick();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <>{children}</>;
}
