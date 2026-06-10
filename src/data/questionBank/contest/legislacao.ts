import { Question } from "../../../types/game";

export const CONTEST_LEGISLACAO_QUESTIONS: Question[] = [
  {
    id: "contest-leg-001",
    world: "contest",
    categoryId: "contest-legislacao",
    subject: "Legislação / Direito",
    topic: "Constituição Federal",
    difficulty: "easy",
    statement:
      "Em qual ano foi promulgada a atual Constituição Federal do Brasil?",
    alternatives: [
      { id: "a", text: "1985" },
      { id: "b", text: "1988" },
      { id: "c", text: "1990" },
      { id: "d", text: "1994" },
    ],
    correctAlternativeId: "b",
    explanation:
      "A Constituição Federal de 1988, também chamada de 'Constituição Cidadã', foi promulgada em 5 de outubro de 1988, após o período da ditadura militar.",
    tags: ["Constituição Federal", "1988", "direito constitucional"],
  },
  {
    id: "contest-leg-002",
    world: "contest",
    categoryId: "contest-legislacao",
    subject: "Legislação / Direito",
    topic: "Direitos Fundamentais",
    difficulty: "medium",
    statement:
      "Segundo a Constituição Federal, é inviolável o direito à vida, à liberdade, à igualdade, à segurança e à:",
    alternatives: [
      { id: "a", text: "Saúde" },
      { id: "b", text: "Propriedade" },
      { id: "c", text: "Educação" },
      { id: "d", text: "Moradia" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O artigo 5° da CF/88 estabelece: 'Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade.'",
    tags: ["art. 5°", "direitos fundamentais", "CF/88"],
  },
  {
    id: "contest-leg-003",
    world: "contest",
    categoryId: "contest-legislacao",
    subject: "Legislação / Direito",
    topic: "Administração Pública",
    difficulty: "hard",
    statement:
      "Quais são os princípios da Administração Pública previstos no artigo 37 da CF/88?",
    alternatives: [
      { id: "a", text: "Legalidade, impessoalidade, moralidade, publicidade e eficiência" },
      { id: "b", text: "Legalidade, proporcionalidade, razoabilidade, publicidade e eficiência" },
      { id: "c", text: "Equidade, impessoalidade, moralidade, publicidade e celeridade" },
      { id: "d", text: "Legalidade, impessoalidade, moralidade, transparência e eficiência" },
    ],
    correctAlternativeId: "a",
    explanation:
      "O art. 37 da CF/88 prevê os princípios: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência — memorizado pelo acrônimo LIMPE.",
    tags: ["art. 37", "LIMPE", "administração pública", "CF/88"],
  },
  {
    id: "contest-leg-004",
    world: "contest",
    categoryId: "contest-legislacao",
    subject: "Legislação / Direito",
    topic: "Direito Penal",
    difficulty: "medium",
    statement:
      "Segundo o Código Penal Brasileiro, a maioridade penal ocorre a partir de quantos anos?",
    alternatives: [
      { id: "a", text: "16 anos" },
      { id: "b", text: "17 anos" },
      { id: "c", text: "18 anos" },
      { id: "d", text: "21 anos" },
    ],
    correctAlternativeId: "c",
    explanation:
      "O Código Penal Brasileiro, em seu artigo 27, estabelece que são penalmente inimputáveis os menores de 18 anos. Portanto, a maioridade penal ocorre aos 18 anos.",
    tags: ["maioridade penal", "Código Penal", "direito penal"],
  },
  {
    id: "contest-leg-005",
    world: "contest",
    categoryId: "contest-legislacao",
    subject: "Legislação / Direito",
    topic: "Direito do Trabalho",
    difficulty: "easy",
    statement:
      "A Consolidação das Leis do Trabalho (CLT) foi criada em qual ano?",
    alternatives: [
      { id: "a", text: "1930" },
      { id: "b", text: "1940" },
      { id: "c", text: "1943" },
      { id: "d", text: "1950" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A CLT foi aprovada pelo Decreto-Lei nº 5.452, de 1º de maio de 1943, durante o governo de Getúlio Vargas. Consolidou a legislação trabalhista existente no Brasil.",
    tags: ["CLT", "direito do trabalho", "legislação trabalhista"],
  },
];
