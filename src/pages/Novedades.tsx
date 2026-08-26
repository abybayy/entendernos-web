import { Instagram } from "lucide-react";
import { AppShell } from "@/components/entendernos/AppShell";
import newsLascano from "@/assets/news-lascano.jpg";
import newsChuy from "@/assets/news-chuy.jpg";
import newsRadio from "@/assets/news-radio.jpg";

const INSTA_URL = "https://instagram.com/psico.mateogarcia";

const ITEMS = [
  {
    tag: "TALLER",
    when: "Lascano",
    title: "Impacto en Lascano (Escuela 85)",
    image: newsLascano,
    body: "Hoy compartimos un taller sobre vínculos sanos con 6to año de la Escuela 85 de Lascano 📚\n\nFue un espacio muy lindo de intercambio con los alumnos, donde a través de la participación y el interés surgieron conversaciones muy importantes sobre bullying, respeto, cuidado y salud mental 💬\n\nMe llevo una sensación muy linda por la apertura, el interés y la predisposición de los alumnos. Sin dudas, son encuentros que también dejan huella en uno 💙\n\nGracias a la maestra por la invitación y por generar estos espacios tan necesarios dentro de la escuela.",
  },
  {
    tag: "SALUD MENTAL",
    when: "Chuy",
    title: "Salud Mental en Chuy (Liceos 1 y 2)",
    image: newsChuy,
    body: 'En una jornada enfocada en el bienestar emocional, el psicólogo Mateo García presentó el juego de cartas "Entendernos" en los liceos 1 y 2 de Chuy. Esta herramienta busca brindar apoyo en salud mental para niños, adolescentes y adultos, facilitando el abordaje de situaciones complejas en el ámbito educativo y familiar.',
  },
  {
    tag: "PRENSA",
    when: "Florida",
    title: "Entrevista en Radio (Mejor Dicho)",
    image: newsRadio,
    body: "¡Dimos a conocer Entendernos en Florida!\n\nMuchas gracias @pelufogorga por la cordial entrevista, transmitida por Libertador Streaming y Radio 92.3 FM Libertador.",
  },
];

export default function Novedades() {
  return (
    <AppShell title="Novedades">
      <div className="px-5 pt-5 pb-12 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground tracking-wider">RECIENTES</p>
          <a href={INSTA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--carmesi)] hover:underline">
            <Instagram className="w-4 h-4" /> @psico.mateogarcia
          </a>
        </div>

        {ITEMS.map((it) => (
          <article key={it.title} className="rounded-[24px] border border-[var(--carmesi)]/15 bg-card overflow-hidden">
            <img src={it.image} alt={it.title} className="w-full h-48 object-cover" loading="lazy" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--carmesi)]">
                  <span className="w-5 h-5 rounded-full grid place-items-center text-white bg-[var(--carmesi)]">
                    <Instagram className="w-3 h-3" />
                  </span>
                  {it.tag}
                </span>
                <span className="text-xs text-muted-foreground">{it.when}</span>
              </div>
              <h3 className="font-bold text-foreground leading-tight mb-2">{it.title}</h3>
              <p className="text-sm text-muted-foreground leading-snug whitespace-pre-line">{it.body}</p>
              <a href={INSTA_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--carmesi)] hover:underline">
                <Instagram className="w-4 h-4" /> Ver en Instagram · @psico.mateogarcia
              </a>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
