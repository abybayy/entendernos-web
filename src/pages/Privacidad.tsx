import { Lock } from "lucide-react";
import { AppShell } from "@/components/entendernos/AppShell";

export default function Privacidad() {
  return (
    <AppShell title="Privacidad">
      <div className="px-6 pt-8 pb-12 space-y-4 text-foreground/85">
        <div className="flex justify-center"><Lock className="w-10 h-10 text-[var(--carmesi)]" /></div>
        <p>
          <strong>Entendernos no recopila datos personales</strong> sin tu consentimiento. Las preguntas y favoritos se guardan <strong>localmente en tu dispositivo</strong>.
        </p>
        <p><strong>No compartimos tu información con terceros.</strong></p>
      </div>
    </AppShell>
  );
}
