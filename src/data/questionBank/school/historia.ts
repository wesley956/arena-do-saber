import { Question } from "../../../types/game";

export const SCHOOL_HISTORIA_QUESTIONS: Question[] = [
  {
    id: "school-hist-001",
    world: "school",
    categoryId: "school-historia",
    subject: "História",
    topic: "Brasil Colonial",
    difficulty: "easy",
    statement: "Em que ano o Brasil foi descoberto pelos portugueses?",
    alternatives: [
      { id: "a", text: "1492" },
      { id: "b", text: "1500" },
      { id: "c", text: "1520" },
      { id: "d", text: "1498" },
    ],
    correctAlternativeId: "b",
    explanation:
      "Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500, durante uma expedição portuguesa rumo às Índias.",
    tags: ["Brasil colonial", "descobrimento", "Cabral"],
  },
  {
    id: "school-hist-002",
    world: "school",
    categoryId: "school-historia",
    subject: "História",
    topic: "Independência do Brasil",
    difficulty: "medium",
    statement: "Quem proclamou a Independência do Brasil?",
    alternatives: [
      { id: "a", text: "Dom Pedro II" },
      { id: "b", text: "Tiradentes" },
      { id: "c", text: "Dom Pedro I" },
      { id: "d", text: "Joaquim José da Silva Xavier" },
    ],
    correctAlternativeId: "c",
    explanation:
      "Dom Pedro I proclamou a Independência do Brasil em 7 de setembro de 1822, às margens do Rio Ipiranga, em São Paulo.",
    tags: ["independência", "Dom Pedro I", "1822"],
  },
  {
    id: "school-hist-003",
    world: "school",
    categoryId: "school-historia",
    subject: "História",
    topic: "Segunda Guerra Mundial",
    difficulty: "hard",
    statement: "Em que ano terminou a Segunda Guerra Mundial?",
    alternatives: [
      { id: "a", text: "1943" },
      { id: "b", text: "1944" },
      { id: "c", text: "1945" },
      { id: "d", text: "1946" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A Segunda Guerra Mundial terminou em 1945. A Alemanha capitulou em maio de 1945 (VE Day) e o Japão em setembro de 1945 (VJ Day), após o lançamento das bombas atômicas.",
    tags: ["Segunda Guerra Mundial", "1945", "história mundial"],
  },
  {
    id: "school-hist-004",
    world: "school",
    categoryId: "school-historia",
    subject: "História",
    topic: "República Brasileira",
    difficulty: "easy",
    statement: "Em que ano foi proclamada a República no Brasil?",
    alternatives: [
      { id: "a", text: "1888" },
      { id: "b", text: "1889" },
      { id: "c", text: "1891" },
      { id: "d", text: "1900" },
    ],
    correctAlternativeId: "b",
    explanation:
      "A República foi proclamada no Brasil em 15 de novembro de 1889 pelo Marechal Deodoro da Fonseca, encerrando o período do Império.",
    tags: ["república", "Deodoro da Fonseca", "1889"],
  },
  {
    id: "school-hist-005",
    world: "school",
    categoryId: "school-historia",
    subject: "História",
    topic: "Revolução Industrial",
    difficulty: "medium",
    statement: "Em qual país teve início a Revolução Industrial?",
    alternatives: [
      { id: "a", text: "França" },
      { id: "b", text: "Alemanha" },
      { id: "c", text: "Estados Unidos" },
      { id: "d", text: "Inglaterra" },
    ],
    correctAlternativeId: "d",
    explanation:
      "A Revolução Industrial teve início na Inglaterra (Reino Unido) no século XVIII, por volta de 1760, impulsionada pelo uso da máquina a vapor e pela mecanização da produção têxtil.",
    tags: ["Revolução Industrial", "Inglaterra", "história moderna"],
  },
];
