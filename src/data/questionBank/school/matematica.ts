import { Question } from "../../../types/game";

export const SCHOOL_MATEMATICA_QUESTIONS: Question[] = [
  {
    id: "school-mat-001",
    world: "school",
    categoryId: "school-matematica",
    subject: "Matemática",
    topic: "Operações Básicas",
    difficulty: "easy",
    statement: "Qual é o resultado de 15 × 8?",
    alternatives: [
      { id: "a", text: "110" },
      { id: "b", text: "120" },
      { id: "c", text: "125" },
      { id: "d", text: "130" },
    ],
    correctAlternativeId: "b",
    explanation:
      "15 × 8 = 120. Podemos calcular como (10 × 8) + (5 × 8) = 80 + 40 = 120.",
    tags: ["multiplicação", "operações básicas"],
  },
  {
    id: "school-mat-002",
    world: "school",
    categoryId: "school-matematica",
    subject: "Matemática",
    topic: "Frações",
    difficulty: "medium",
    statement: "Qual é o resultado de 3/4 + 1/2?",
    alternatives: [
      { id: "a", text: "4/6" },
      { id: "b", text: "4/8" },
      { id: "c", text: "5/4" },
      { id: "d", text: "1/4" },
    ],
    correctAlternativeId: "c",
    explanation:
      "Para somar frações com denominadores diferentes, encontramos o MMC: MMC(4,2) = 4. Então: 3/4 + 2/4 = 5/4.",
    trap: "Não some os denominadores diretamente! 3/4 + 1/2 ≠ 4/6.",
    tags: ["frações", "adição", "MMC"],
  },
  {
    id: "school-mat-003",
    world: "school",
    categoryId: "school-matematica",
    subject: "Matemática",
    topic: "Geometria",
    difficulty: "hard",
    statement:
      "Um retângulo tem lados de 6 cm e 8 cm. Qual é o comprimento de sua diagonal?",
    alternatives: [
      { id: "a", text: "10 cm" },
      { id: "b", text: "12 cm" },
      { id: "c", text: "14 cm" },
      { id: "d", text: "7 cm" },
    ],
    correctAlternativeId: "a",
    explanation:
      "Pela fórmula de Pitágoras: d² = 6² + 8² = 36 + 64 = 100. Portanto d = √100 = 10 cm.",
    tags: ["geometria", "Pitágoras", "retângulo"],
  },
  {
    id: "school-mat-004",
    world: "school",
    categoryId: "school-matematica",
    subject: "Matemática",
    topic: "Álgebra",
    difficulty: "easy",
    statement: "Se 2x + 4 = 10, qual é o valor de x?",
    alternatives: [
      { id: "a", text: "2" },
      { id: "b", text: "3" },
      { id: "c", text: "4" },
      { id: "d", text: "5" },
    ],
    correctAlternativeId: "b",
    explanation:
      "2x + 4 = 10 → 2x = 10 - 4 → 2x = 6 → x = 3.",
    tags: ["álgebra", "equação", "1º grau"],
  },
  {
    id: "school-mat-005",
    world: "school",
    categoryId: "school-matematica",
    subject: "Matemática",
    topic: "Porcentagem",
    difficulty: "medium",
    statement: "Quanto é 25% de 200?",
    alternatives: [
      { id: "a", text: "25" },
      { id: "b", text: "40" },
      { id: "c", text: "50" },
      { id: "d", text: "75" },
    ],
    correctAlternativeId: "c",
    explanation:
      "25% de 200 = (25/100) × 200 = 0,25 × 200 = 50.",
    tags: ["porcentagem", "cálculo", "matemática básica"],
  },
];
