import { useState } from "react";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/entendernos/AppShell";
import { DECKS, type DeckId } from "@/data/cards";
import { loadFavorites, saveFavorites } from "@/lib/favorites";

const DECK_COLOR: Record<DeckId, string> = {
  adulto: "#133A59",
  adolescente: "#69C0BE",
  ninos: "#FF3399",
};

const DECK_LABEL: Record<DeckId, string> = {
  adulto: "Adultez",
  adolescente: "Adolescencia",
  ninos: "Niñez",
};

export default function Favoritos() {
  const [favs, setFavs] = useState<Set<string>>(() => loadFavorites());

  const remove = (qKey: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      next.delete(qKey);
      saveFavorites(next);
      return next;
    });
  };

  const groups = DECKS.map((deck) => ({
    deck,
    items: deck.questions
      .map((q, i) => ({ qKey: `${deck.id}:${i}`, q }))
      .filter(({ qKey }) => favs.has(qKey)),
  })).filter((g) => g.items.length > 0);

  return (
    <AppShell title="Favoritos">
      <div className="px-6 pt-6 pb-12">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-3 pt-12">
            <Heart className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-muted-foreground leading-snug max-w-xs">
              Todavía no marcaste ninguna pregunta como favorita. Tocá el corazón sobre una carta para guardarla acá.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map(({ deck, items }) => (
              <div key={deck.id}>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: DECK_COLOR[deck.id] }}>
                  {DECK_LABEL[deck.id]}
                </h2>
                <div className="space-y-2">
                  {items.map(({ qKey, q }) => (
                    <div
                      key={qKey}
                      className="flex items-start gap-3 bg-card border rounded-2xl p-3.5"
                      style={{ borderColor: `color-mix(in oklab, ${DECK_COLOR[deck.id]} 25%, transparent)` }}
                    >
                      <p className="flex-1 text-sm text-foreground/90 leading-snug">{q}</p>
                      <button onClick={() => remove(qKey)} aria-label="Quitar de favoritos" className="shrink-0 p-1 hover:opacity-70 transition-opacity">
                        <Heart className="w-5 h-5" fill={DECK_COLOR[deck.id]} style={{ color: DECK_COLOR[deck.id] }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
