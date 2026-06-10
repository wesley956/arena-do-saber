import { Question } from "../../../types/game";

export const SCHOOL_GEOGRAFIA_QUESTIONS: Question[] = [
  {
    id: "school-geo-001",
    world: "school",
    categoryId: "school-geografia",
    subject: "Geografia",
    topic: "Capital do Brasil",
    difficulty: "easy",
    statement: "Qual é a capital do Brasil?",
    alternatives: [
      { id: "a", text: "São Paulo" },
      { id: "b", text: "Rio de Janeiro" },
      { id: "c", text: "Brasília" },
      { id: "d", text: "Salvador" },
    ],
    correctAlternativeId: "c",
    explanation:
      "Brasília é a capital federal do Brasil desde 21 de abril de 1960, quando substituiu o Rio de Janeiro como capital. Foi planejada e construída pelo urbanista Lúcio Costa e pelo arquiteto Oscar Niemeyer.",
    tags: ["capital", "Brasília", "Brasil"],
  },
  {
    id: "school-geo-002",
    world: "school",
    categoryId: "school-geografia",
    subject: "Geografia",
    topic: "Continentes",
    difficulty: "medium",
    statement: "Qual é o maior continente do mundo em área?",
    alternatives: [
      { id: "a", text: "África" },
      { id: "b", text: "América" },
      { id: "c", text: "Ásia" },
      { id: "d", text: "Europa" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A Ásia é o maior continente do mundo, com aproximadamente 44,6 milhões de km², representando cerca de 30% da área total das terras emersas do planeta.",
    tags: ["continentes", "Ásia", "geografia física"],
  },
  {
    id: "school-geo-003",
    world: "school",
    categoryId: "school-geografia",
    subject: "Geografia",
    topic: "Rios do Brasil",
    difficulty: "hard",
    statement: "Qual é o maior rio do mundo em volume de água?",
    alternatives: [
      { id: "a", text: "Rio Nilo" },
      { id: "b", text: "Rio Yangtzé" },
      { id: "c", text: "Rio Amazonas" },
      { id: "d", text: "Rio Mississipi" },
    ],
    correctAlternativeId: "c",
    explanation:
      "O Rio Amazonas é o maior do mundo em volume de água, responsável por aproximadamente 20% de toda a água doce que flui para os oceanos. O Nilo é mais longo, mas o Amazonas carrega muito mais água.",
    tags: ["rio Amazonas", "rios", "hidrografia"],
  },
  {
    id: "school-geo-004",
    world: "school",
    categoryId: "school-geografia",
    subject: "Geografia",
    topic: "Regiões do Brasil",
    difficulty: "easy",
    statement: "Quantas regiões oficiais possui o Brasil?",
    alternatives: [
      { id: "a", text: "4" },
      { id: "b", text: "5" },
      { id: "c", text: "6" },
      { id: "d", text: "7" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O Brasil é dividido em 5 regiões oficiais: Norte, Nordeste, Centro-Oeste, Sudeste e Sul. Essa divisão é utilizada pelo IBGE para fins estatísticos e administrativos.",
    tags: ["regiões", "Brasil", "divisão regional"],
  },
  {
    id: "school-geo-005",
    world: "school",
    categoryId: "school-geografia",
    subject: "Geografia",
    topic: "Clima",
    difficulty: "medium",
    statement: "Qual é o tipo de clima predominante na Amazônia?",
    alternatives: [
      { id: "a", text: "Semiárido" },
      { id: "b", text: "Subtropical" },
      { id: "c", text: "Equatorial" },
      { id: "d", text: "Tropical de Altitude" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A Amazônia possui clima equatorial, caracterizado por altas temperaturas (em torno de 25-28°C), elevada umidade e chuvas abundantes e bem distribuídas ao longo do ano.",
    tags: ["clima", "Amazônia", "clima equatorial"],
  },
];
