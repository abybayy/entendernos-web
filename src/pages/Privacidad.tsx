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
          La <strong>lista de tus preguntas favoritas</strong> (para que puedas volver a verlas) se guarda <strong>únicamente en la memoria local de tu propio dispositivo</strong>, el mismo lugar donde el navegador guarda tus contraseñas o configuraciones: no viaja a ningún servidor ni se comparte con nadie. Si borrás los datos del navegador o cambiás de dispositivo, esa lista se pierde.
        </p>
        <p>
          Por separado, cada vez que se marca una pregunta como favorita sumamos <strong>+1 a un contador anónimo de esa pregunta</strong>, sin ningún dato que identifique quién la marcó (ni nombre, ni ubicación, ni dispositivo): así podemos ver qué preguntas conectan más para mejorar el mazo, sin saber nunca quién marcó qué.
        </p>
        <p>
          Para saber cuánta gente visita la app usamos <strong>Cloudflare Web Analytics</strong>, una herramienta que <strong>no usa cookies y no identifica a cada visitante</strong>: solo cuenta estadísticas generales y anónimas, como cuántas visitas hay o desde qué página se llega.
        </p>
        <p>
          En Novedades mostramos publicaciones reales embebidas directo desde Instagram: al ver esa sección, Instagram (Meta) puede registrar la visita, igual que en cualquier sitio con contenido social embebido. No pedimos ni guardamos tu email en ningún lado de la app.
        </p>
        <p><strong>No compartimos tu información con terceros.</strong></p>
      </div>
    </AppShell>
  );
}
