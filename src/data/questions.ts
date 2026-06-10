import { Question } from "../types/game";

// ============================================================
// QUESTIONS — Arena do Saber
// ============================================================
// Para adicionar novas perguntas:
// 1. Copie o objeto de exemplo abaixo
// 2. Defina um id único (ex: "school-port-003")
// 3. Preencha world, categoryId, subject, topic, difficulty
// 4. Adicione o enunciado, alternativas e resposta correta
// 5. Sempre inclua a explicação
// 6. Adicione o objeto ao array QUESTIONS
// ============================================================

export const QUESTIONS: Question[] = [
  // ============================================================
  // ESCOLA — PORTUGUÊS
  // ============================================================
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

  // ============================================================
  // ESCOLA — MATEMÁTICA
  // ============================================================
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

  // ============================================================
  // ESCOLA — CIÊNCIAS
  // ============================================================
  {
    id: "school-cien-001",
    world: "school",
    categoryId: "school-ciencias",
    subject: "Ciências",
    topic: "Biologia",
    difficulty: "easy",
    statement: "Qual é o principal gás liberado pelas plantas durante a fotossíntese?",
    alternatives: [
      { id: "a", text: "Dióxido de carbono (CO₂)" },
      { id: "b", text: "Nitrogênio (N₂)" },
      { id: "c", text: "Oxigênio (O₂)" },
      { id: "d", text: "Hidrogênio (H₂)" },
    ],
    correctAlternativeId: "c",
    explanation:
      "Durante a fotossíntese, as plantas absorvem CO₂ e água, usando a energia solar para produzir glicose e liberar oxigênio como subproduto.",
    tags: ["fotossíntese", "plantas", "biologia"],
  },
  {
    id: "school-cien-002",
    world: "school",
    categoryId: "school-ciencias",
    subject: "Ciências",
    topic: "Física",
    difficulty: "medium",
    statement:
      "Um objeto em repouso tende a permanecer em repouso, e um objeto em movimento tende a permanecer em movimento. Isso descreve qual lei de Newton?",
    alternatives: [
      { id: "a", text: "Segunda Lei de Newton" },
      { id: "b", text: "Terceira Lei de Newton" },
      { id: "c", text: "Lei da Gravitação Universal" },
      { id: "d", text: "Primeira Lei de Newton (Inércia)" },
    ],
    correctAlternativeId: "d",
    explanation:
      "A Primeira Lei de Newton, também chamada de Lei da Inércia, afirma que um corpo tende a manter seu estado de repouso ou movimento retilíneo uniforme a não ser que uma força externa atue sobre ele.",
    tags: ["Newton", "inércia", "física"],
  },
  {
    id: "school-cien-003",
    world: "school",
    categoryId: "school-ciencias",
    subject: "Ciências",
    topic: "Química",
    difficulty: "hard",
    statement: "Qual é o número atômico do oxigênio na tabela periódica?",
    alternatives: [
      { id: "a", text: "6" },
      { id: "b", text: "8" },
      { id: "c", text: "16" },
      { id: "d", text: "12" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O oxigênio (O) possui número atômico 8, ou seja, tem 8 prótons em seu núcleo. Está no período 2, grupo 16 da tabela periódica.",
    tags: ["tabela periódica", "oxigênio", "química"],
  },

  // ============================================================
  // ESCOLA — HISTÓRIA
  // ============================================================
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

  // ============================================================
  // ESCOLA — GEOGRAFIA
  // ============================================================
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

  // ============================================================
  // ESCOLA — INGLÊS
  // ============================================================
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

  // ============================================================
  // CONCURSO — PORTUGUÊS
  // ============================================================
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
    difficulty: "easy",
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

  // ============================================================
  // CONCURSO — MATEMÁTICA / LÓGICA
  // ============================================================
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

  // ============================================================
  // CONCURSO — INFORMÁTICA
  // ============================================================
  {
    id: "contest-info-001",
    world: "contest",
    categoryId: "contest-informatica",
    subject: "Informática",
    topic: "Conceitos Básicos",
    difficulty: "easy",
    statement: "O que significa a sigla 'CPU'?",
    alternatives: [
      { id: "a", text: "Central Processing Unit" },
      { id: "b", text: "Computer Power Unit" },
      { id: "c", text: "Central Program Utility" },
      { id: "d", text: "Core Processing Utility" },
    ],
    correctAlternativeId: "a",
    explanation:
      "CPU significa 'Central Processing Unit' (Unidade Central de Processamento). É o componente principal do computador responsável por executar instruções e processar dados.",
    tags: ["hardware", "CPU", "computador"],
  },
  {
    id: "contest-info-002",
    world: "contest",
    categoryId: "contest-informatica",
    subject: "Informática",
    topic: "Internet",
    difficulty: "medium",
    statement: "Qual protocolo é utilizado para o envio seguro de páginas web?",
    alternatives: [
      { id: "a", text: "HTTP" },
      { id: "b", text: "FTP" },
      { id: "c", text: "HTTPS" },
      { id: "d", text: "SMTP" },
    ],
    correctAlternativeId: "c",
    explanation:
      "HTTPS (Hypertext Transfer Protocol Secure) é a versão segura do HTTP. Utiliza criptografia SSL/TLS para proteger a comunicação entre o navegador e o servidor.",
    tags: ["protocolo", "HTTPS", "segurança web"],
  },
  {
    id: "contest-info-003",
    world: "contest",
    categoryId: "contest-informatica",
    subject: "Informática",
    topic: "Segurança",
    difficulty: "hard",
    statement:
      "Qual tipo de ataque consiste em enganar o usuário para que revele informações confidenciais por meio de mensagens falsas?",
    alternatives: [
      { id: "a", text: "DDoS" },
      { id: "b", text: "Phishing" },
      { id: "c", text: "SQL Injection" },
      { id: "d", text: "Ransomware" },
    ],
    correctAlternativeId: "b",
    explanation:
      "Phishing é um tipo de ataque de engenharia social que utiliza mensagens falsas (e-mails, SMS, sites) para enganar o usuário e obter senhas, dados bancários ou outras informações confidenciais.",
    tags: ["phishing", "segurança", "engenharia social"],
  },

  // ============================================================
  // CONCURSO — ATUALIDADES
  // ============================================================
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

  // ============================================================
  // CONCURSO — LEGISLAÇÃO
  // ============================================================
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

  // ============================================================
  // CONCURSO — CONHECIMENTOS ESPECÍFICOS
  // ============================================================
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

  // ============================================================
  // ESCOLA — PORTUGUÊS (novas: 004 e 005)
  // ============================================================
  {
    id: "school-port-004",
    world: "school",
    categoryId: "school-portugues",
    subject: "Português",
    topic: "Pontuação",
    difficulty: "easy",
    statement:
      "Qual sinal de pontuação é usado para separar itens de uma enumeração?",
    alternatives: [
      { id: "a", text: "Ponto final (.)" },
      { id: "b", text: "Vírgula (,)" },
      { id: "c", text: "Ponto e vírgula (;)" },
      { id: "d", text: "Dois-pontos (:)" },
    ],
    correctAlternativeId: "b",
    explanation:
      "A vírgula é o sinal usado para separar elementos de uma enumeração. Ex.: 'Comprei pão, leite, ovos e café.' Os dois-pontos introduzem a enumeração, mas não a separam.",
    tags: ["pontuação", "vírgula", "gramática"],
  },
  {
    id: "school-port-005",
    world: "school",
    categoryId: "school-portugues",
    subject: "Português",
    topic: "Verbos",
    difficulty: "medium",
    statement:
      "Assinale a alternativa em que o verbo está no pretérito perfeito do indicativo:",
    alternatives: [
      { id: "a", text: "Ela cantava todas as noites." },
      { id: "b", text: "Ela cantará na festa." },
      { id: "c", text: "Ela cantou ontem à noite." },
      { id: "d", text: "Ela cante agora." },
    ],
    correctAlternativeId: "c",
    explanation:
      "O pretérito perfeito indica ação concluída no passado. 'Cantou' é a forma do pretérito perfeito. 'Cantava' é pretérito imperfeito; 'cantará' é futuro do presente; 'cante' é presente do subjuntivo.",
    trap: "Não confunda 'cantava' (imperfeito, ação habitual no passado) com 'cantou' (perfeito, ação concluída).",
    tags: ["verbo", "pretérito perfeito", "tempo verbal"],
  },

  // ============================================================
  // ESCOLA — MATEMÁTICA (novas: 004 e 005)
  // ============================================================
  {
    id: "school-mat-004",
    world: "school",
    categoryId: "school-matematica",
    subject: "Matemática",
    topic: "Porcentagem",
    difficulty: "easy",
    statement: "Quanto é 25% de 200?",
    alternatives: [
      { id: "a", text: "25" },
      { id: "b", text: "40" },
      { id: "c", text: "50" },
      { id: "d", text: "75" },
    ],
    correctAlternativeId: "c",
    explanation:
      "25% equivale a 25/100 = 1/4. Então 25% de 200 = 200 ÷ 4 = 50. Outra forma: 200 × 0,25 = 50.",
    tags: ["porcentagem", "cálculo", "matemática básica"],
  },
  {
    id: "school-mat-005",
    world: "school",
    categoryId: "school-matematica",
    subject: "Matemática",
    topic: "Regra de Três",
    difficulty: "medium",
    statement:
      "Se 3 cadernos custam R$ 12,00, quanto custam 7 cadernos do mesmo tipo?",
    alternatives: [
      { id: "a", text: "R$ 24,00" },
      { id: "b", text: "R$ 28,00" },
      { id: "c", text: "R$ 30,00" },
      { id: "d", text: "R$ 32,00" },
    ],
    correctAlternativeId: "b",
    explanation:
      "Regra de três simples e direta: 3 cadernos → R$ 12,00. Logo 1 caderno → R$ 4,00. Portanto, 7 cadernos → 7 × 4 = R$ 28,00.",
    tags: ["regra de três", "proporcionalidade", "matemática básica"],
  },

  // ============================================================
  // ESCOLA — CIÊNCIAS (novas: 004 e 005)
  // ============================================================
  {
    id: "school-cien-004",
    world: "school",
    categoryId: "school-ciencias",
    subject: "Ciências",
    topic: "Estados Físicos da Matéria",
    difficulty: "easy",
    statement:
      "Quando a água líquida se transforma em vapor, esse processo é chamado de:",
    alternatives: [
      { id: "a", text: "Fusão" },
      { id: "b", text: "Solidificação" },
      { id: "c", text: "Evaporação" },
      { id: "d", text: "Condensação" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A evaporação (ou vaporização) é a passagem do estado líquido para o gasoso. A fusão é de sólido para líquido; solidificação é o inverso; condensação é de gás para líquido.",
    trap: "Não confunda evaporação (líquido → gás) com condensação (gás → líquido).",
    tags: ["estados físicos", "mudança de estado", "água"],
  },
  {
    id: "school-cien-005",
    world: "school",
    categoryId: "school-ciencias",
    subject: "Ciências",
    topic: "Corpo Humano",
    difficulty: "medium",
    statement: "Qual é o órgão responsável por bombear o sangue para todo o corpo?",
    alternatives: [
      { id: "a", text: "Pulmão" },
      { id: "b", text: "Fígado" },
      { id: "c", text: "Rim" },
      { id: "d", text: "Coração" },
    ],
    correctAlternativeId: "d",
    explanation:
      "O coração é o órgão central do sistema circulatório, responsável por bombear o sangue para todos os tecidos do corpo através das artérias e receber o sangue de volta pelas veias.",
    tags: ["corpo humano", "coração", "sistema circulatório"],
  },

  // ============================================================
  // ESCOLA — HISTÓRIA (novas: 004 e 005)
  // ============================================================
  {
    id: "school-hist-004",
    world: "school",
    categoryId: "school-historia",
    subject: "História",
    topic: "República Brasileira",
    difficulty: "easy",
    statement: "Quem proclamou a República no Brasil?",
    alternatives: [
      { id: "a", text: "Dom Pedro II" },
      { id: "b", text: "Getúlio Vargas" },
      { id: "c", text: "Marechal Deodoro da Fonseca" },
      { id: "d", text: "Tiradentes" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A República foi proclamada em 15 de novembro de 1889 pelo Marechal Deodoro da Fonseca, com apoio do Exército e de setores da elite agrária, encerrando o período imperial.",
    trap: "Cuidado para não confundir com Dom Pedro I (Independência, 1822) ou Dom Pedro II (último imperador, deposto em 1889).",
    tags: ["república", "Deodoro da Fonseca", "1889"],
  },
  {
    id: "school-hist-005",
    world: "school",
    categoryId: "school-historia",
    subject: "História",
    topic: "Escravidão no Brasil",
    difficulty: "medium",
    statement: "Em que ano foi abolida a escravidão no Brasil?",
    alternatives: [
      { id: "a", text: "1870" },
      { id: "b", text: "1880" },
      { id: "c", text: "1888" },
      { id: "d", text: "1889" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A Lei Áurea, assinada pela Princesa Isabel em 13 de maio de 1888, aboliu oficialmente a escravidão no Brasil. O Brasil foi o último país das Américas a abolir a escravidão.",
    tags: ["escravidão", "Lei Áurea", "Princesa Isabel", "1888"],
  },

  // ============================================================
  // ESCOLA — GEOGRAFIA (novas: 004 e 005)
  // ============================================================
  {
    id: "school-geo-004",
    world: "school",
    categoryId: "school-geografia",
    subject: "Geografia",
    topic: "Pontos Cardeais",
    difficulty: "easy",
    statement:
      "Quando você está de frente para o norte, qual ponto cardinal fica à sua direita?",
    alternatives: [
      { id: "a", text: "Sul" },
      { id: "b", text: "Oeste" },
      { id: "c", text: "Leste" },
      { id: "d", text: "Nordeste" },
    ],
    correctAlternativeId: "c",
    explanation:
      "Quando estamos voltados para o Norte: à direita fica o Leste, à esquerda fica o Oeste, e atrás fica o Sul. Uma forma de lembrar: 'Norte, Leste, Sul, Oeste' (NESO), sentido horário.",
    tags: ["pontos cardeais", "orientação", "geografia"],
  },
  {
    id: "school-geo-005",
    world: "school",
    categoryId: "school-geografia",
    subject: "Geografia",
    topic: "Regiões do Brasil",
    difficulty: "medium",
    statement: "Quantas regiões o IBGE divide o território brasileiro?",
    alternatives: [
      { id: "a", text: "4 regiões" },
      { id: "b", text: "5 regiões" },
      { id: "c", text: "6 regiões" },
      { id: "d", text: "7 regiões" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O IBGE divide o Brasil em 5 regiões geográficas: Norte, Nordeste, Centro-Oeste, Sudeste e Sul. Cada região agrupa estados com características físicas, econômicas e culturais semelhantes.",
    tags: ["regiões", "IBGE", "divisão regional", "Brasil"],
  },

  // ============================================================
  // ESCOLA — INGLÊS (novas: 004 e 005)
  // ============================================================
  {
    id: "school-ing-004",
    world: "school",
    categoryId: "school-ingles",
    subject: "Inglês",
    topic: "Verbo To Be",
    difficulty: "easy",
    statement: "Complete the sentence: 'They ___ students.'",
    alternatives: [
      { id: "a", text: "is" },
      { id: "b", text: "am" },
      { id: "c", text: "are" },
      { id: "d", text: "be" },
    ],
    correctAlternativeId: "c",
    explanation:
      "O verbo 'to be' no presente para o pronome 'they' (eles/elas) é 'are'. Resumo: I am / You are / He-She-It is / We-They are.",
    trap: "Cuidado: 'is' é para he/she/it (terceira pessoa do singular), não para 'they' (plural).",
    tags: ["verbo to be", "gramática", "inglês básico"],
  },
  {
    id: "school-ing-005",
    world: "school",
    categoryId: "school-ingles",
    subject: "Inglês",
    topic: "Pronomes",
    difficulty: "medium",
    statement:
      "Choose the correct pronoun: '___ is my book. Please give it to ___.'",
    alternatives: [
      { id: "a", text: "This / I" },
      { id: "b", text: "This / me" },
      { id: "c", text: "That / I" },
      { id: "d", text: "It / me" },
    ],
    correctAlternativeId: "b",
    explanation:
      "'This' (este/esta) é pronome demonstrativo para algo próximo. Após o verbo 'give to', usamos o pronome objeto 'me', não o pronome sujeito 'I'. 'Give it to me' = dê para mim.",
    trap: "Pronomes sujeito (I, you, he) são usados antes do verbo. Pronomes objeto (me, you, him) são usados depois do verbo ou preposição.",
    tags: ["pronomes", "demonstrativos", "pronomes objeto"],
  },

  // ============================================================
  // CONCURSO — PORTUGUÊS (novas: 004 e 005)
  // ============================================================
  {
    id: "contest-port-004",
    world: "contest",
    categoryId: "contest-portugues",
    subject: "Português",
    topic: "Crase",
    difficulty: "easy",
    statement:
      "Em qual das frases abaixo o uso da crase está correto?",
    alternatives: [
      { id: "a", text: "Fui à escola de manhã." },
      { id: "b", text: "Entreguei o relatório à ele." },
      { id: "c", text: "Estava à frente à porta." },
      { id: "d", text: "Chegou à pé no trabalho." },
    ],
    correctAlternativeId: "a",
    explanation:
      "A crase ocorre quando há fusão da preposição 'a' com o artigo 'a' que antecede substantivo feminino. 'À escola' = a (prep.) + a (artigo) + escola. Nas demais: 'à ele' está errado (pronomes pessoais não admitem artigo); 'à pé' está errado (locução adverbial masculina).",
    trap: "Não se usa crase antes de pronomes pessoais, palavras masculinas (salvo exceções) nem antes de verbos.",
    tags: ["crase", "gramática", "uso da crase"],
  },
  {
    id: "contest-port-005",
    world: "contest",
    categoryId: "contest-portugues",
    subject: "Português",
    topic: "Concordância Verbal",
    difficulty: "medium",
    statement:
      "Assinale a alternativa com concordância verbal correta:",
    alternatives: [
      { id: "a", text: "Fazem dois anos que ele saiu." },
      { id: "b", text: "Faz dois anos que ele saiu." },
      { id: "c", text: "Fez dois anos que ele saiu." },
      { id: "d", text: "Faziam dois anos que ele saiu." },
    ],
    correctAlternativeId: "b",
    explanation:
      "Quando o verbo 'fazer' indica tempo decorrido, é impessoal e fica no singular: 'Faz dois anos'. O sujeito é inexistente (verbo impessoal), por isso não concorda com 'dois anos'.",
    trap: "O erro mais comum é usar 'Fazem dois anos', concordando o verbo com 'dois anos' como se fosse o sujeito.",
    tags: ["concordância verbal", "verbo fazer", "impessoal"],
  },

  // ============================================================
  // CONCURSO — MATEMÁTICA / LÓGICA (novas: 004 e 005)
  // ============================================================
  {
    id: "contest-mat-004",
    world: "contest",
    categoryId: "contest-matematica",
    subject: "Matemática / Raciocínio Lógico",
    topic: "Proporção",
    difficulty: "easy",
    statement:
      "Em uma turma, a relação de homens para mulheres é 2:3. Se há 15 mulheres, quantos homens há na turma?",
    alternatives: [
      { id: "a", text: "8" },
      { id: "b", text: "9" },
      { id: "c", text: "10" },
      { id: "d", text: "12" },
    ],
    correctAlternativeId: "c",
    explanation:
      "Se a proporção é 2:3, para cada 3 mulheres há 2 homens. Com 15 mulheres: 15 ÷ 3 = 5 grupos. Homens = 5 × 2 = 10.",
    tags: ["proporção", "razão", "raciocínio lógico"],
  },
  {
    id: "contest-mat-005",
    world: "contest",
    categoryId: "contest-matematica",
    subject: "Matemática / Raciocínio Lógico",
    topic: "Lógica — Negação",
    difficulty: "medium",
    statement:
      "A negação da proposição 'Todos os servidores chegaram no horário' é:",
    alternatives: [
      { id: "a", text: "Nenhum servidor chegou no horário." },
      { id: "b", text: "Alguns servidores não chegaram no horário." },
      { id: "c", text: "A maioria dos servidores chegou no horário." },
      { id: "d", text: "Todos os servidores chegaram atrasados." },
    ],
    correctAlternativeId: "b",
    explanation:
      "A negação de 'Todo A é B' é 'Existe (pelo menos um) A que não é B', ou seja, 'Algum A não é B'. Portanto: 'Alguns servidores NÃO chegaram no horário.'",
    trap: "Cuidado: a negação de 'todos' não é 'nenhum'. A negação de 'todos' é 'algum... não'.",
    tags: ["lógica", "negação", "proposição", "quantificadores"],
  },

  // ============================================================
  // CONCURSO — INFORMÁTICA (novas: 004 e 005)
  // ============================================================
  {
    id: "contest-info-004",
    world: "contest",
    categoryId: "contest-informatica",
    subject: "Informática",
    topic: "Atalhos de Teclado",
    difficulty: "easy",
    statement:
      "Qual atalho de teclado é usado para copiar um texto selecionado no Windows?",
    alternatives: [
      { id: "a", text: "Ctrl + X" },
      { id: "b", text: "Ctrl + V" },
      { id: "c", text: "Ctrl + C" },
      { id: "d", text: "Ctrl + Z" },
    ],
    correctAlternativeId: "c",
    explanation:
      "Ctrl + C copia o conteúdo selecionado para a área de transferência. Ctrl + X recorta, Ctrl + V cola e Ctrl + Z desfaz a última ação.",
    tags: ["atalhos", "Windows", "teclado"],
  },
  {
    id: "contest-info-005",
    world: "contest",
    categoryId: "contest-informatica",
    subject: "Informática",
    topic: "Arquivos e Pastas",
    difficulty: "medium",
    statement:
      "Qual extensão indica que um arquivo é um documento do Microsoft Word?",
    alternatives: [
      { id: "a", text: ".xls" },
      { id: "b", text: ".ppt" },
      { id: "c", text: ".pdf" },
      { id: "d", text: ".docx" },
    ],
    correctAlternativeId: "d",
    explanation:
      "A extensão .docx é o formato padrão do Microsoft Word (Office 2007 em diante). .xls e .xlsx são do Excel; .ppt e .pptx são do PowerPoint; .pdf é um formato de documento portátil.",
    tags: ["extensão de arquivo", "Word", "Office"],
  },

  // ============================================================
  // CONCURSO — ATUALIDADES (novas: 004 e 005)
  // ============================================================
  {
    id: "contest-atual-004",
    world: "contest",
    categoryId: "contest-atualidades",
    subject: "Atualidades",
    topic: "Fake News e Desinformação",
    difficulty: "easy",
    statement:
      "O que são 'fake news'?",
    alternatives: [
      { id: "a", text: "Notícias publicadas apenas em redes sociais" },
      { id: "b", text: "Informações falsas divulgadas como se fossem verdadeiras" },
      { id: "c", text: "Notícias sobre países estrangeiros" },
      { id: "d", text: "Reportagens sem identificação de autoria" },
    ],
    correctAlternativeId: "b",
    explanation:
      "Fake news são informações falsas, distorcidas ou enganosas deliberadamente fabricadas e divulgadas como se fossem verdadeiras. Podem causar danos sociais sérios, especialmente quando viralizadas em redes sociais.",
    tags: ["fake news", "desinformação", "mídia digital"],
  },
  {
    id: "contest-atual-005",
    world: "contest",
    categoryId: "contest-atualidades",
    subject: "Atualidades",
    topic: "Sustentabilidade",
    difficulty: "medium",
    statement:
      "O conceito de 'desenvolvimento sustentável' significa:",
    alternatives: [
      { id: "a", text: "Crescimento econômico sem qualquer limite" },
      { id: "b", text: "Atender às necessidades do presente sem comprometer as gerações futuras" },
      { id: "c", text: "Proibir o uso de recursos naturais" },
      { id: "d", text: "Substituir toda energia fóssil por nuclear" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O desenvolvimento sustentável, definido pelo Relatório Brundtland (1987), é aquele que satisfaz as necessidades do presente sem comprometer a capacidade das gerações futuras de satisfazerem as suas próprias necessidades.",
    tags: ["sustentabilidade", "desenvolvimento sustentável", "meio ambiente"],
  },

  // ============================================================
  // CONCURSO — LEGISLAÇÃO (novas: 004 e 005)
  // ============================================================
  {
    id: "contest-leg-004",
    world: "contest",
    categoryId: "contest-legislacao",
    subject: "Legislação / Direito",
    topic: "Hierarquia das Leis",
    difficulty: "easy",
    statement:
      "Qual é a lei suprema do ordenamento jurídico brasileiro, à qual todas as demais leis devem se conformar?",
    alternatives: [
      { id: "a", text: "Código Civil" },
      { id: "b", text: "Lei de Introdução às Normas do Direito Brasileiro" },
      { id: "c", text: "Constituição Federal" },
      { id: "d", text: "Código Penal" },
    ],
    correctAlternativeId: "c",
    explanation:
      "A Constituição Federal é a norma fundamental do Estado brasileiro. Todas as demais leis (ordinárias, complementares, decretos etc.) devem estar de acordo com ela, sob pena de inconstitucionalidade.",
    tags: ["Constituição Federal", "hierarquia", "ordenamento jurídico"],
  },
  {
    id: "contest-leg-005",
    world: "contest",
    categoryId: "contest-legislacao",
    subject: "Legislação / Direito",
    topic: "Cidadania e Direitos",
    difficulty: "medium",
    statement:
      "Segundo a Constituição Federal de 1988, são direitos sociais, entre outros:",
    alternatives: [
      { id: "a", text: "Trabalho, saúde, educação e moradia" },
      { id: "b", text: "Voto, liberdade de expressão e sigilo da correspondência" },
      { id: "c", text: "Imposto de renda, previdência e assistência social" },
      { id: "d", text: "Jurisdição, ampla defesa e contraditório" },
    ],
    correctAlternativeId: "a",
    explanation:
      "O artigo 6° da CF/88 prevê os direitos sociais: educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência social, proteção à maternidade e à infância, e assistência aos desamparados.",
    tags: ["direitos sociais", "art. 6°", "CF/88"],
  },

  // ============================================================
  // CONCURSO — CONHECIMENTOS ESPECÍFICOS (novas: 004 e 005)
  // ============================================================
  {
    id: "contest-esp-004",
    world: "contest",
    categoryId: "contest-especificos",
    subject: "Conhecimentos Específicos",
    topic: "Atendimento ao Público",
    difficulty: "easy",
    statement:
      "Qual postura é considerada adequada no atendimento ao público em órgãos públicos?",
    alternatives: [
      { id: "a", text: "Resolver apenas os problemas que o chefe determinar" },
      { id: "b", text: "Tratar os cidadãos com cordialidade, clareza e respeito" },
      { id: "c", text: "Priorizar o atendimento de conhecidos pessoais" },
      { id: "d", text: "Negar informações para preservar a privacidade do órgão" },
    ],
    correctAlternativeId: "b",
    explanation:
      "O atendimento ao público deve ser pautado por cordialidade, respeito, clareza e impessoalidade. O servidor público é um agente do Estado a serviço da coletividade, e tratar todos com igualdade é obrigação legal e ética.",
    tags: ["atendimento", "serviço público", "ética"],
  },
  {
    id: "contest-esp-005",
    world: "contest",
    categoryId: "contest-especificos",
    subject: "Conhecimentos Específicos",
    topic: "Ética no Serviço Público",
    difficulty: "medium",
    statement:
      "O uso de cargo público para obter vantagens pessoais é conhecido como:",
    alternatives: [
      { id: "a", text: "Nepotismo" },
      { id: "b", text: "Advocacia administrativa" },
      { id: "c", text: "Abuso de poder" },
      { id: "d", text: "Desvio de finalidade" },
    ],
    correctAlternativeId: "c",
    explanation:
      "O abuso de poder ocorre quando o agente público usa seu cargo ou função para obter vantagens pessoais indevidas, ultrapassando os limites de suas atribuições legais. É conduta que viola os princípios da moralidade e da impessoalidade.",
    trap: "O nepotismo refere-se especificamente à nomeação de parentes. O abuso de poder é mais amplo.",
    tags: ["ética", "abuso de poder", "serviço público"],
  },
];

// Helper para buscar pergunta por ID
export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
