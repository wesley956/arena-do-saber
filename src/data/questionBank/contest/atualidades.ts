import { Question } from "../../../types/game";

export const CONTEST_ATUALIDADES_QUESTIONS: Question[] = [
  {
    id: "contest-atual-001",
    world: "contest",
    categoryId: "contest-atualidades",
    subject: "Atualidades",
    topic: "Geopolítica",
    difficulty: "medium",
    statement: "Atualmente, a composição do G20 inclui:",
    alternatives: [
      { id: "a", text: "19 países apenas" },
      { id: "b", text: "20 países soberanos" },
      { id: "c", text: "19 países, a União Europeia e a União Africana" },
      { id: "d", text: "Apenas os países do BRICS e da União Europeia" },
    ],
    correctAlternativeId: "c",
    explanation:
      "O G20 reúne 19 países, além da União Europeia e da União Africana. A pegadinha é lembrar que o nome G20 permaneceu, mesmo com a inclusão de organizações regionais como membros.",
    trap: "Não confunda o nome G20 com uma contagem simples de 20 países soberanos.",
    tags: ["G20", "geopolítica", "relações internacionais"],
  },
  {
    id: "contest-atual-002",
    world: "contest",
    categoryId: "contest-atualidades",
    subject: "Atualidades",
    topic: "Meio Ambiente",
    difficulty: "easy",
    statement: "Qual é o principal objetivo do Acordo de Paris?",
    alternatives: [
      { id: "a", text: "Reduzir a dívida externa dos países em desenvolvimento" },
      { id: "b", text: "Limitar o aquecimento global abaixo de 2°C acima dos níveis pré-industriais" },
      { id: "c", text: "Proibir o uso de combustíveis fósseis até 2030" },
      { id: "d", text: "Criar uma moeda global para o comércio internacional" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O Acordo de Paris, firmado em 2015, tem como objetivo central limitar o aumento da temperatura global a bem abaixo de 2°C em relação aos níveis pré-industriais, com esforços para limitar a 1,5°C.",
    tags: ["Acordo de Paris", "clima", "aquecimento global"],
  },
  {
    id: "contest-atual-003",
    world: "contest",
    categoryId: "contest-atualidades",
    subject: "Atualidades",
    topic: "Economia",
    difficulty: "hard",
    statement:
      "Na formação original do acrônimo BRICS, após a entrada da África do Sul, quais países formavam o grupo?",
    alternatives: [
      { id: "a", text: "Brasil, Reino Unido, Índia, Chile e Suécia" },
      { id: "b", text: "Brasil, Rússia, Índia, China e África do Sul" },
      { id: "c", text: "Bolívia, Romênia, Indonésia, Canadá e Singapura" },
      { id: "d", text: "Brasil, Rússia, Itália, China e Espanha" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O acrônimo BRICS ficou conhecido com Brasil, Rússia, Índia, China e África do Sul. Atualmente o grupo tem outros membros, então a pergunta foca na formação original do acrônimo após a entrada da África do Sul.",
    trap: "Cuidado: o grupo BRICS foi expandido, mas a sigla nasceu associada a esses cinco países.",
    tags: ["BRICS", "economia global", "geopolítica", "origem"],
  },
  {
    id: "contest-atual-004",
    world: "contest",
    categoryId: "contest-atualidades",
    subject: "Atualidades",
    topic: "Tecnologia",
    difficulty: "easy",
    statement: "O que significa a sigla 'IA' no contexto tecnológico atual?",
    alternatives: [
      { id: "a", text: "Informação Automática" },
      { id: "b", text: "Inteligência Artificial" },
      { id: "c", text: "Integração Avançada" },
      { id: "d", text: "Interface Adaptativa" },
    ],
    correctAlternativeId: "b",
    explanation:
      "IA significa Inteligência Artificial, campo da computação que desenvolve sistemas capazes de realizar tarefas que normalmente requerem inteligência humana, como reconhecimento de fala, visão computacional e tomada de decisão.",
    tags: ["IA", "inteligência artificial", "tecnologia"],
  },
  {
    id: "contest-atual-005",
    world: "contest",
    categoryId: "contest-atualidades",
    subject: "Atualidades",
    topic: "Brasil",
    difficulty: "medium",
    statement: "Qual é o nome do atual programa social federal que substituiu o Bolsa Família?",
    alternatives: [
      { id: "a", text: "Auxílio Brasil" },
      { id: "b", text: "Renda Cidadã" },
      { id: "c", text: "Bolsa Família" },
      { id: "d", text: "Brasil Sem Fome" },
    ],
    correctAlternativeId: "c",
    explanation:
      "O Bolsa Família foi reativado em 2023, substituindo o Auxílio Brasil que havia sido criado em 2021. O programa retornou com o nome original 'Bolsa Família' e com valores ampliados.",
    tags: ["Bolsa Família", "programa social", "Brasil"],
  },
];
