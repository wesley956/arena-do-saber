import { Question } from "../../../types/game";

export const CONTEST_MATEMATICA_QUESTIONS: Question[] = [
  {
    id: "contest-mat-001",
    world: "contest",
    categoryId: "contest-matematica",
    subject: "Matemática / Raciocínio Lógico",
    topic: "Lógica Proposicional",
    difficulty: "medium",
    statement:
      "Se 'Todo servidor público é honesto' e 'João é servidor público', o que podemos concluir?",
    alternatives: [
      { id: "a", text: "João pode ser desonesto" },
      { id: "b", text: "João é honesto" },
      { id: "c", text: "Nem todo servidor é honesto" },
      { id: "d", text: "Não é possível concluir nada" },
    ],
    correctAlternativeId: "b",
    explanation:
      "Este é um silogismo válido. Premissa 1: Todo A é B. Premissa 2: João é A. Conclusão: João é B. Portanto, João é honesto.",
    tags: ["silogismo", "lógica", "dedução"],
  },
  {
    id: "contest-mat-002",
    world: "contest",
    categoryId: "contest-matematica",
    subject: "Matemática / Raciocínio Lógico",
    topic: "Sequências Numéricas",
    difficulty: "easy",
    statement: "Qual é o próximo número na sequência: 2, 4, 8, 16, __?",
    alternatives: [
      { id: "a", text: "24" },
      { id: "b", text: "30" },
      { id: "c", text: "32" },
      { id: "d", text: "20" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A sequência é geométrica com razão 2 (cada termo é o dobro do anterior): 2, 4, 8, 16, 32.",
    tags: ["sequência geométrica", "progressão", "raciocínio lógico"],
  },
  {
    id: "contest-mat-003",
    world: "contest",
    categoryId: "contest-matematica",
    subject: "Matemática / Raciocínio Lógico",
    topic: "Porcentagem",
    difficulty: "hard",
    statement:
      "Um produto custava R$ 200,00. Teve um aumento de 10% e depois um desconto de 10%. Qual é o preço final?",
    alternatives: [
      { id: "a", text: "R$ 200,00" },
      { id: "b", text: "R$ 198,00" },
      { id: "c", text: "R$ 202,00" },
      { id: "d", text: "R$ 196,00" },
    ],
    correctAlternativeId: "b",
    explanation:
      "Após aumento de 10%: 200 × 1,10 = 220. Após desconto de 10%: 220 × 0,90 = 198. O preço final é R$ 198,00, não R$ 200,00, pois os percentuais se aplicam sobre valores diferentes.",
    trap: "Cuidado! Aumento de 10% seguido de desconto de 10% NÃO resulta no mesmo preço.",
    tags: ["porcentagem", "matemática financeira", "cálculo"],
  },
  {
    id: "contest-mat-004",
    world: "contest",
    categoryId: "contest-matematica",
    subject: "Matemática / Raciocínio Lógico",
    topic: "Lógica",
    difficulty: "medium",
    statement:
      "Se p é verdadeiro e q é falso, qual é o valor lógico de 'p ∧ q' (p E q)?",
    alternatives: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
      { id: "c", text: "Indeterminado" },
      { id: "d", text: "Depende do contexto" },
    ],
    correctAlternativeId: "b",
    explanation:
      "Na conjunção lógica (p ∧ q), o resultado só é verdadeiro quando AMBAS as proposições são verdadeiras. Se q é falso, então p ∧ q é falso, independentemente do valor de p.",
    tags: ["lógica proposicional", "conjunção", "tabela verdade"],
  },
  {
    id: "contest-mat-005",
    world: "contest",
    categoryId: "contest-matematica",
    subject: "Matemática / Raciocínio Lógico",
    topic: "Análise Combinatória",
    difficulty: "hard",
    statement:
      "De quantas maneiras diferentes 3 pessoas podem se sentar em 3 cadeiras distintas?",
    alternatives: [
      { id: "a", text: "3" },
      { id: "b", text: "6" },
      { id: "c", text: "9" },
      { id: "d", text: "12" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O número de permutações de 3 elementos é 3! = 3 × 2 × 1 = 6. Para a primeira cadeira há 3 opções, para a segunda 2, e para a terceira 1: 3 × 2 × 1 = 6.",
    tags: ["permutação", "análise combinatória", "fatorial"],
  },
];
