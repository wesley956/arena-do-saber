import { Question } from "../../../types/game";

export const CONTEST_ESPECIFICOS_QUESTIONS: Question[] = [
  {
    id: "contest-esp-001",
    world: "contest",
    categoryId: "contest-especificos",
    subject: "Conhecimentos Específicos",
    topic: "Administração",
    difficulty: "medium",
    statement:
      "O processo administrativo que compreende as atividades de planejar, organizar, dirigir e controlar é conhecido como:",
    alternatives: [
      { id: "a", text: "Processo decisório" },
      { id: "b", text: "Ciclo PDCA" },
      { id: "c", text: "Funções administrativas (PODC)" },
      { id: "d", text: "Gestão por competências" },
    ],
    correctAlternativeId: "c",
    explanation:
      "As funções clássicas da administração são: Planejar, Organizar, Dirigir e Controlar (PODC), definidas por Henri Fayol. São a base da teoria administrativa clássica.",
    tags: ["PODC", "funções administrativas", "Fayol"],
  },
  {
    id: "contest-esp-002",
    world: "contest",
    categoryId: "contest-especificos",
    subject: "Conhecimentos Específicos",
    topic: "Gestão Pública",
    difficulty: "easy",
    statement:
      "O que é o orçamento público do tipo 'Base Zero'?",
    alternatives: [
      { id: "a", text: "Orçamento que começa do zero, sem considerar exercícios anteriores" },
      { id: "b", text: "Orçamento equilibrado, onde receitas igualam despesas" },
      { id: "c", text: "Orçamento que prioriza projetos de infraestrutura" },
      { id: "d", text: "Orçamento exclusivo para gastos com pessoal" },
    ],
    correctAlternativeId: "a",
    explanation:
      "O Orçamento Base Zero (OBZ) parte do zero a cada ciclo orçamentário, sem considerar os valores do exercício anterior. Cada despesa precisa ser justificada do início, buscando maior eficiência na alocação de recursos.",
    tags: ["orçamento público", "base zero", "gestão pública"],
  },
  {
    id: "contest-esp-003",
    world: "contest",
    categoryId: "contest-especificos",
    subject: "Conhecimentos Específicos",
    topic: "Direito Administrativo",
    difficulty: "hard",
    statement:
      "O ato administrativo que extingue outro ato por razão de conveniência e oportunidade é denominado:",
    alternatives: [
      { id: "a", text: "Anulação" },
      { id: "b", text: "Cassação" },
      { id: "c", text: "Revogação" },
      { id: "d", text: "Convalidação" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A revogação é a extinção de um ato administrativo válido por razões de conveniência e oportunidade (mérito administrativo). Já a anulação ocorre por razões de ilegalidade. A revogação é ato discricionário; a anulação, vinculado.",
    tags: ["revogação", "anulação", "ato administrativo", "direito administrativo"],
  },
  {
    id: "contest-esp-004",
    world: "contest",
    categoryId: "contest-especificos",
    subject: "Conhecimentos Específicos",
    topic: "Gestão de Pessoas",
    difficulty: "medium",
    statement:
      "A teoria motivacional de Maslow organiza as necessidades humanas em uma hierarquia. Qual é a necessidade que está no topo da pirâmide?",
    alternatives: [
      { id: "a", text: "Segurança" },
      { id: "b", text: "Sociais (pertencimento)" },
      { id: "c", text: "Autoestima" },
      { id: "d", text: "Autorrealização" },
    ],
    correctAlternativeId: "d",
    explanation:
      "Na Pirâmide de Maslow, as necessidades são (da base ao topo): fisiológicas, segurança, sociais, estima e autorrealização. A autorrealização representa o desenvolvimento pleno do potencial humano.",
    tags: ["Maslow", "motivação", "gestão de pessoas"],
  },
  {
    id: "contest-esp-005",
    world: "contest",
    categoryId: "contest-especificos",
    subject: "Conhecimentos Específicos",
    topic: "Ética no Serviço Público",
    difficulty: "easy",
    statement:
      "O Código de Ética Profissional do Servidor Público Civil Federal é regulamentado por qual decreto?",
    alternatives: [
      { id: "a", text: "Decreto nº 1.171/1994" },
      { id: "b", text: "Decreto nº 5.450/2005" },
      { id: "c", text: "Decreto nº 3.555/2000" },
      { id: "d", text: "Decreto nº 8.777/2016" },
    ],
    correctAlternativeId: "a",
    explanation:
      "O Código de Ética Profissional do Servidor Público Civil Federal foi instituído pelo Decreto nº 1.171, de 22 de junho de 1994. Estabelece deveres e vedações aos servidores públicos federais.",
    tags: ["ética", "servidor público", "Decreto 1.171"],
  },
];
