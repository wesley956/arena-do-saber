import { Question } from "../../../types/game";

export const SCHOOL_PORTUGUES_QUESTIONS: Question[] = [
  {
    id: "school-port-001",
    world: "school",
    categoryId: "school-portugues",
    subject: "Português",
    topic: "Gramática",
    difficulty: "easy",
    statement: "Qual das opções abaixo é um exemplo de substantivo próprio?",
    alternatives: [
      { id: "a", text: "cidade" },
      { id: "b", text: "Brasil" },
      { id: "c", text: "bonito" },
      { id: "d", text: "correr" },
    ],
    correctAlternativeId: "b",
    explanation:
      "Substantivos próprios são nomes específicos de pessoas, lugares, marcas etc., escritos com letra maiúscula. 'Brasil' é o nome próprio de um país.",
    trap: "Cuidado: 'cidade' é substantivo comum, pois designa qualquer cidade, não uma específica.",
    tags: ["substantivo", "gramática", "classificação"],
  },
  {
    id: "school-port-002",
    world: "school",
    categoryId: "school-portugues",
    subject: "Português",
    topic: "Interpretação de Texto",
    difficulty: "medium",
    statement:
      "Leia o trecho: 'O tempo voa quando estamos felizes.' Qual figura de linguagem está presente?",
    alternatives: [
      { id: "a", text: "Hipérbole" },
      { id: "b", text: "Metonímia" },
      { id: "c", text: "Metáfora" },
      { id: "d", text: "Ironia" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A metáfora consiste em uma comparação implícita entre dois elementos. Dizer que 'o tempo voa' compara o tempo a um pássaro/avião que voa, sem usar conectivo de comparação.",
    tags: ["figuras de linguagem", "metáfora", "interpretação"],
  },
  {
    id: "school-port-003",
    world: "school",
    categoryId: "school-portugues",
    subject: "Português",
    topic: "Gramática",
    difficulty: "hard",
    statement:
      "Assinale a alternativa em que todas as palavras estão corretamente acentuadas:",
    alternatives: [
      { id: "a", text: "sáude, café, lápis" },
      { id: "b", text: "saúde, café, lápis" },
      { id: "c", text: "saúde, cafe, lápis" },
      { id: "d", text: "saúde, café, lapis" },
    ],
    correctAlternativeId: "b",
    explanation:
      "'Saúde' é acentuada por ser hiato tônico. 'Café' é acentuada por ser oxítona terminada em 'e'. 'Lápis' é acentuada por ser paroxítona terminada em 's'.",
    tags: ["acentuação", "ortografia", "gramática"],
  },
  {
    id: "school-port-004",
    world: "school",
    categoryId: "school-portugues",
    subject: "Português",
    topic: "Gramática",
    difficulty: "easy",
    statement: "Qual é o plural correto de 'cidadão'?",
    alternatives: [
      { id: "a", text: "cidadões" },
      { id: "b", text: "cidadãos" },
      { id: "c", text: "cidadães" },
      { id: "d", text: "cidadãos ou cidadões" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O plural de 'cidadão' é 'cidadãos'. Palavras terminadas em '-ão' podem ter plural em '-ãos', '-ões' ou '-ães', dependendo da palavra. 'Cidadão' pertence ao grupo que faz o plural em '-ãos'.",
    tags: ["plural", "gramática", "morfologia"],
  },
  {
    id: "school-port-005",
    world: "school",
    categoryId: "school-portugues",
    subject: "Português",
    topic: "Redação",
    difficulty: "medium",
    statement:
      "Em um texto dissertativo-argumentativo, qual é a função do parágrafo de conclusão?",
    alternatives: [
      { id: "a", text: "Apresentar novos argumentos sobre o tema" },
      { id: "b", text: "Reafirmar a tese e propor uma solução ou síntese" },
      { id: "c", text: "Contradizer o que foi dito na introdução" },
      { id: "d", text: "Listar os exemplos usados ao longo do texto" },
    ],
    correctAlternativeId: "b",
    explanation:
      "A conclusão retoma a tese apresentada na introdução, sintetiza os argumentos desenvolvidos e, em textos como o do ENEM, propõe uma intervenção ou solução para o problema abordado.",
    tags: ["redação", "dissertação", "estrutura textual"],
  },
];
