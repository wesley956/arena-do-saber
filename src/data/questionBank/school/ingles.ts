import { Question } from "../../../types/game";

export const SCHOOL_INGLES_QUESTIONS: Question[] = [
  {
    id: "school-ing-001",
    world: "school",
    categoryId: "school-ingles",
    subject: "Inglês",
    topic: "Vocabulário",
    difficulty: "easy",
    statement: "What is the translation of 'apple' in Portuguese?",
    alternatives: [
      { id: "a", text: "Laranja" },
      { id: "b", text: "Banana" },
      { id: "c", text: "Maçã" },
      { id: "d", text: "Uva" },
    ],
    correctAlternativeId: "c",
    explanation:
      "'Apple' significa 'maçã' em português. É uma das palavras mais básicas do vocabulário em inglês.",
    tags: ["vocabulário", "frutas", "inglês básico"],
  },
  {
    id: "school-ing-002",
    world: "school",
    categoryId: "school-ingles",
    subject: "Inglês",
    topic: "Gramática",
    difficulty: "medium",
    statement: "Which sentence is grammatically correct?",
    alternatives: [
      { id: "a", text: "She don't like coffee." },
      { id: "b", text: "She doesn't likes coffee." },
      { id: "c", text: "She doesn't like coffee." },
      { id: "d", text: "She not like coffee." },
    ],
    correctAlternativeId: "c",
    explanation:
      "In the simple present tense for third person singular (he/she/it), we use 'doesn't' + base verb. 'She doesn't like coffee' is the correct form.",
    tags: ["gramática", "simple present", "terceira pessoa"],
  },
  {
    id: "school-ing-003",
    world: "school",
    categoryId: "school-ingles",
    subject: "Inglês",
    topic: "Interpretação",
    difficulty: "hard",
    statement: "What does the idiom 'bite the bullet' mean?",
    alternatives: [
      { id: "a", text: "Atirar em alguém" },
      { id: "b", text: "Enfrentar algo difícil com coragem" },
      { id: "c", text: "Comer devagar" },
      { id: "d", text: "Ter muito medo" },
    ],
    correctAlternativeId: "b",
    explanation:
      "'Bite the bullet' significa encarar uma situação difícil, dolorosa ou desagradável com determinação e coragem. Exemplo: 'Just bite the bullet and apologize.'",
    tags: ["idioms", "expressões", "inglês avançado"],
  },
  {
    id: "school-ing-004",
    world: "school",
    categoryId: "school-ingles",
    subject: "Inglês",
    topic: "Vocabulário",
    difficulty: "easy",
    statement: "What is the meaning of the word 'beautiful'?",
    alternatives: [
      { id: "a", text: "Feio" },
      { id: "b", text: "Bonito / Belo" },
      { id: "c", text: "Grande" },
      { id: "d", text: "Pequeno" },
    ],
    correctAlternativeId: "b",
    explanation:
      "'Beautiful' significa 'bonito' ou 'belo' em português, usado para descrever algo ou alguém com beleza. Exemplo: 'She is beautiful.'",
    tags: ["vocabulário", "adjetivos", "inglês básico"],
  },
  {
    id: "school-ing-005",
    world: "school",
    categoryId: "school-ingles",
    subject: "Inglês",
    topic: "Tempos Verbais",
    difficulty: "medium",
    statement: "Which sentence is in the Past Simple tense?",
    alternatives: [
      { id: "a", text: "She is studying now." },
      { id: "b", text: "She will study tomorrow." },
      { id: "c", text: "She studied yesterday." },
      { id: "d", text: "She has studied a lot." },
    ],
    correctAlternativeId: "c",
    explanation:
      "O Past Simple (passado simples) é usado para ações concluídas no passado. 'Studied' é o passado simples de 'study'. As outras alternativas estão no Present Continuous, Future Simple e Present Perfect.",
    tags: ["past simple", "tempos verbais", "gramática"],
  },
];
