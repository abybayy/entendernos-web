import { AppShell } from "@/components/entendernos/AppShell";
import { WhatsAppIcon } from "@/components/entendernos/BrandIcons";
import { BuyDeckButton } from "@/components/entendernos/BuyDeckButton";
import mazosImg from "@/assets/mazos-fisicos.webp";

const WHATSAPP_TEXT = "¡Hola! Me gustaría saber más detalles sobre el juego de cartas *Entendernos*:\n\n1. Costo por transferencia\n2. Costo de envío dentro de Montevideo\n3. Tiempo estimado de entrega\n\nMe gustaría llevar el mazo para la edad de: ";
const WHATSAPP_URL = "https://wa.me/59898917770?text=" + encodeURIComponent(WHATSAPP_TEXT);

export default function MazoFisico() {
  return (
    <AppShell title="Mazo Físico">
      <div className="px-6 pt-8 pb-12 space-y-5">
        <div className="rounded-3xl overflow-hidden border border-[var(--carmesi)]/15 bg-card shadow-sm">
          <img src={mazosImg} alt="Mazos físicos Entendernos" loading="lazy" decoding="async" className="w-full h-auto block" />
        </div>
        <p className="text-foreground/85 leading-relaxed">
          <strong>Entendernos</strong> es un juego de <strong>45 cartas de preguntas disparadoras</strong>, creado para fomentar la <strong>conexión</strong>, la <strong>empatía</strong> y el <strong>autoconocimiento</strong>, promover la <strong>salud mental</strong> y fortalecer la <strong>inteligencia emocional</strong> mediante momentos de diálogo y escucha activa. Tiene <strong>3 versiones</strong> para distintas franjas etarias: <em>niñez</em>, <em>adolescencia</em> y <em>adultez</em>.
        </p>
        <p className="text-xs text-muted-foreground -mt-2">
          Tu compra por Mercado Pago es válida para las 3 franjas: indicás el mazo que querés al coordinar el envío o retiro.
        </p>
        <BuyDeckButton />
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-full rounded-full bg-[#25D366] text-[#0b3d24] py-4 px-5 font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-[#1EBE5B] transition-colors">
          <WhatsAppIcon />
          Atención personalizada
        </a>
      </div>
    </AppShell>
  );
}
