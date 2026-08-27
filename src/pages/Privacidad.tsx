import { Lock } from "lucide-react";
import { AppShell } from "@/components/entendernos/AppShell";

export default function Privacidad() {
  return (
    <AppShell title="Privacidad">
      <div className="px-6 pt-8 pb-12 space-y-4 text-foreground/85">
        <div className="flex justify-center"><Lock className="w-10 h-10 text-[var(--carmesi)]" /></div>
        <p>
          <strong>Entendernos no recopila datos personales</strong> sin tu consentimiento.
        </p>
        <p>
          Las preguntas que marcás como favoritas se guardan <strong>únicamente en la memoria local de tu propio dispositivo</strong> (el mismo lugar donde el navegador guarda tus contraseñas o configuraciones): no viajan a ningún servidor ni se comparten con nadie, ni siquiera con nosotros. Si borrás los datos del navegador o cambiás de dispositivo, esa lista se pierde.
        </p>
        <p><strong>No compartimos tu información con terceros.</strong></p>
      </div>
    </AppShell>
  );
}
