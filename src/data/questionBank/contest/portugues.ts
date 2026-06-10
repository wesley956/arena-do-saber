import { Question } from "../../../types/game";

export const CONTEST_PORTUGUES_QUESTIONS: Question[] = [
  {
    id: "contest-port-001",
    world: "contest",
    categoryId: "contest-portugues",
    subject: "Português",
    topic: "Interpretação Textual",
    difficulty: "medium",
    statement:
      "Em 'O presidente sancionou a lei', qual é a função sintática do termo 'a lei'?",
    alternatives: [
      { id: "a", text: "Sujeito" },
      { id: "b", text: "Objeto Direto" },
      { id: "c", text: "Objeto Indireto" },
      { id: "d", text: "Predicativo do sujeito" },
    ],
    correctAlternativeId: "b",
    explanation:
      "'A lei' é objeto direto, pois completa o sentido do verbo transitivo direto 'sancionar' sem o uso de preposição.",
    tags: ["sintaxe", "objeto direto", "análise sintática"],
  },
  {
    id: "contest-port-002",
    world: "contest",
    categoryId: "contest-portugues",
    subject: "Português",
    topic: "Gramática",
    difficulty: "hard",
    statement:
      "Em qual das alternativas o uso do pronome relativo está correto?",
    alternatives: [
      { id: "a", text: "O candidato que eu confio foi aprovado." },
      { id: "b", text: "O candidato em quem eu confio foi aprovado." },
      { id: "c", text: "O candidato no qual eu confio foi aprovado." },
      { id: "d", text: "Alternativas B e C estão corretas." },
    ],
    correctAlternativeId: "d",
    explanation:
      "O verbo 'confiar' exige preposição 'em'. Portanto, 'em quem' e 'no qual' (= em + o qual) estão ambos corretos. A alternativa A está errada por omitir a preposição.",
    tags: ["pronome relativo", "regência verbal", "gramática avançada"],
  },
  {
    id: "contest-port-003",
    world: "contest",
    categoryId: "contest-portugues",
    subject: "Português",
    topic: "Semântica",
    difficulty: "medium",
    statement:
      "Qual recurso de coesão textual está sendo utilizado em: 'João estudou muito. Ele passou no concurso.'",
    alternatives: [
      { id: "a", text: "Conjunção" },
      { id: "b", text: "Referência pronominal" },
      { id: "c", text: "Elipse" },
      { id: "d", text: "Substituição lexical" },
    ],
    correctAlternativeId: "b",
    explanation:
      "A referência pronominal ocorre quando um pronome retoma ou antecipa um termo já mencionado. 'Ele' retoma 'João', criando coesão entre as frases.",
    tags: ["coesão", "referência pronominal", "pronome"],
  },
  {
    id: "contest-port-004",
    world: "contest",
    categoryId: "contest-portugues",
    subject: "Português",
    topic: "Ortografia",
    difficulty: "easy",
    statement: "Qual das palavras abaixo está grafada corretamente?",
    alternatives: [
      { id: "a", text: "excessão" },
      { id: "b", text: "exeção" },
      { id: "c", text: "exceção" },
      { id: "d", text: "excessção" },
    ],
    correctAlternativeId: "c",
    explanation:
      "'Exceção' é a grafia correta. A palavra vem do latim 'exceptio' e significa aquilo que foge à regra. Não se escreve com 'ss' nem com 'x' dobrado.",
    tags: ["ortografia", "grafia correta", "vocabulário"],
  },
  {
    id: "contest-port-005",
    world: "contest",
    categoryId: "contest-portugues",
    subject: "Português",
    topic: "Concordância",
    difficulty: "hard",
    statement:
      "Assinale a alternativa em que a concordância verbal está correta:",
    alternatives: [
      { id: "a", text: "Fazem dois anos que não o vejo." },
      { id: "b", text: "Faz dois anos que não o vejo." },
      { id: "c", text: "Fazem dois anos que não o vejo." },
      { id: "d", text: "Faz dois anos que não o vejo ou fazem dois anos são ambas corretas." },
    ],
    correctAlternativeId: "b",
    explanation:
      "Verbos que indicam tempo decorrido (fazer, haver) são impessoais e devem ficar no singular. O correto é 'Faz dois anos', não 'Fazem dois anos'.",
    tags: ["concordância verbal", "verbos impessoais", "gramática normativa"],
  },
];
