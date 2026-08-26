export type DeckId = "adulto" | "adolescente" | "ninos";

export interface Deck {
  id: DeckId;
  name: string;
  subtitle: string;
  questions: string[];
}

export const DECKS: Deck[] = [
  {
    id: "adulto",
    name: "Adulto",
    subtitle: "Adultos",
    questions: [
      "¿Qué lugar te hace sentir en paz y por qué?",
      "¿Qué hábito o acontecimiento reciente te ha hecho sentir orgulloso/a?",
      "¿En qué momento de tu vida te sentiste más valiente?",
      "¿Qué sientes que necesitas escuchar de alguien hoy?",
    ],
  },
  {
    id: "adolescente",
    name: "Adolescente",
    subtitle: "Adolescentes",
    questions: [
      "¿Qué emoji, sticker o meme te representa hoy y por qué?",
      "¿Qué significa para ti sentirte incluido/a?",
      "¿Qué es lo que más te gusta y valoras de ti?",
      "Para ti, ¿qué es lo más difícil de pedir ayuda?",
    ],
  },
  {
    id: "ninos",
    name: "Niños",
    subtitle: "Niños",
    questions: [
      "¿Qué superpoder te gustaría tener?",
      "¿Quién es la persona con la que más te gusta pasar tiempo?",
      "¿Qué te gustaría que los adultos entendieran de los niños?",
      "¿Qué es algo que te gustaría contar pero todavía no has dicho?",
    ],
  },
];
