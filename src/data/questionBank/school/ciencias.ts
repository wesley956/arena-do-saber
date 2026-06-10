import { Question } from "../../../types/game";

export const SCHOOL_CIENCIAS_QUESTIONS: Question[] = [
  {
    id: "school-cien-001",
    world: "school",
    categoryId: "school-ciencias",
    subject: "Ciências",
    topic: "Biologia",
    difficulty: "easy",
    statement: "Qual é o principal gás liberado pelas plantas durante a fotossíntese?",
    alternatives: [
      { id: "a", text: "Dióxido de carbono (CO₂)" },
      { id: "b", text: "Nitrogênio (N₂)" },
      { id: "c", text: "Oxigênio (O₂)" },
      { id: "d", text: "Hidrogênio (H₂)" },
    ],
    correctAlternativeId: "c",
    explanation:
      "Durante a fotossíntese, as plantas absorvem CO₂ e água, usando a energia solar para produzir glicose e liberar oxigênio como subproduto.",
    tags: ["fotossíntese", "plantas", "biologia"],
  },
  {
    id: "school-cien-002",
    world: "school",
    categoryId: "school-ciencias",
    subject: "Ciências",
    topic: "Física",
    difficulty: "medium",
    statement:
      "Um objeto em repouso tende a permanecer em repouso, e um objeto em movimento tende a permanecer em movimento. Isso descreve qual lei de Newton?",
    alternatives: [
      { id: "a", text: "Segunda Lei de Newton" },
      { id: "b", text: "Terceira Lei de Newton" },
      { id: "c", text: "Lei da Gravitação Universal" },
      { id: "d", text: "Primeira Lei de Newton (Inércia)" },
    ],
    correctAlternativeId: "d",
    explanation:
      "A Primeira Lei de Newton, também chamada de Lei da Inércia, afirma que um corpo tende a manter seu estado de repouso ou movimento retilíneo uniforme a não ser que uma força externa atue sobre ele.",
    tags: ["Newton", "inércia", "física"],
  },
  {
    id: "school-cien-003",
    world: "school",
    categoryId: "school-ciencias",
    subject: "Ciências",
    topic: "Química",
    difficulty: "hard",
    statement: "Qual é o número atômico do oxigênio na tabela periódica?",
    alternatives: [
      { id: "a", text: "6" },
      { id: "b", text: "8" },
      { id: "c", text: "16" },
      { id: "d", text: "12" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O oxigênio (O) possui número atômico 8, ou seja, tem 8 prótons em seu núcleo. Está no período 2, grupo 16 da tabela periódica.",
    tags: ["tabela periódica", "oxigênio", "química"],
  },
  {
    id: "school-cien-004",
    world: "school",
    categoryId: "school-ciencias",
    subject: "Ciências",
    topic: "Biologia",
    difficulty: "easy",
    statement: "Qual é a unidade básica da vida?",
    alternatives: [
      { id: "a", text: "Tecido" },
      { id: "b", text: "Órgão" },
      { id: "c", text: "Célula" },
      { id: "d", text: "Molécula" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A célula é a unidade estrutural e funcional de todos os seres vivos. Todo organismo é formado por uma ou mais células, e todas as funções vitais ocorrem no nível celular.",
    tags: ["célula", "biologia", "seres vivos"],
  },
  {
    id: "school-cien-005",
    world: "school",
    categoryId: "school-ciencias",
    subject: "Ciências",
    topic: "Ecologia",
    difficulty: "medium",
    statement: "O que é a cadeia alimentar?",
    alternatives: [
      { id: "a", text: "A sequência de organismos em que cada um serve de alimento ao seguinte" },
      { id: "b", text: "O processo de transformação de energia solar em alimento" },
      { id: "c", text: "A relação entre predadores de uma mesma espécie" },
      { id: "d", text: "O ciclo da água na natureza" },
    ],
    correctAlternativeId: "a",
    explanation:
      "A cadeia alimentar representa a transferência de energia e matéria entre os seres vivos. Começa pelos produtores (plantas), passa pelos consumidores primários, secundários etc., e termina nos decompositores.",
    tags: ["cadeia alimentar", "ecologia", "ecossistema"],
  },
];
