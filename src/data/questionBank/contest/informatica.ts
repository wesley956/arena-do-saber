import { Question } from "../../../types/game";

export const CONTEST_INFORMATICA_QUESTIONS: Question[] = [
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
  {
    id: "contest-info-004",
    world: "contest",
    categoryId: "contest-informatica",
    subject: "Informática",
    topic: "Sistemas Operacionais",
    difficulty: "easy",
    statement: "Qual dos itens abaixo é um sistema operacional?",
    alternatives: [
      { id: "a", text: "Microsoft Word" },
      { id: "b", text: "Google Chrome" },
      { id: "c", text: "Windows 11" },
      { id: "d", text: "Adobe Photoshop" },
    ],
    correctAlternativeId: "c",
    explanation:
      "Windows 11 é um sistema operacional desenvolvido pela Microsoft. O sistema operacional gerencia os recursos do computador e serve de base para a execução dos demais programas.",
    tags: ["sistema operacional", "Windows", "software"],
  },
  {
    id: "contest-info-005",
    world: "contest",
    categoryId: "contest-informatica",
    subject: "Informática",
    topic: "Pacote Office",
    difficulty: "medium",
    statement:
      "No Microsoft Excel, qual função é utilizada para somar um intervalo de células?",
    alternatives: [
      { id: "a", text: "=TOTAL()" },
      { id: "b", text: "=SOMA()" },
      { id: "c", text: "=ADICIONAR()" },
      { id: "d", text: "=CALCULAR()" },
    ],
    correctAlternativeId: "b",
    explanation:
      "A função =SOMA() (ou =SUM() em inglês) é usada no Excel para somar valores de um intervalo de células. Exemplo: =SOMA(A1:A10) soma todos os valores de A1 até A10.",
    tags: ["Excel", "planilha", "funções"],
  },
];
