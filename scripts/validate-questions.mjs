import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const QUESTION_BANK_DIR = path.join(ROOT, "src", "data", "questionBank");

const EXPECTED_CATEGORIES = {
  "school-portugues": { world: "school", min: 15 },
  "school-matematica": { world: "school", min: 15 },
  "school-ciencias": { world: "school", min: 15 },
  "school-historia": { world: "school", min: 15 },
  "school-geografia": { world: "school", min: 15 },
  "school-ingles": { world: "school", min: 15 },

  "contest-portugues": { world: "contest", min: 15 },
  "contest-matematica": { world: "contest", min: 15 },
  "contest-informatica": { world: "contest", min: 15 },
  "contest-atualidades": { world: "contest", min: 15 },
  "contest-legislacao": { world: "contest", min: 15 },
  "contest-especificos": { world: "contest", min: 15 },
};

const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) return walk(fullPath);
    if (entry.isFile() && entry.name.endsWith(".ts")) return [fullPath];

    return [];
  });
}

function extractQuestionObjects(source) {
  const regex = /id:\s*"(school|contest)-[a-z]+-\d+"/g;
  const objects = [];
  let match;

  while ((match = regex.exec(source)) !== null) {
    const markerIndex = match.index;
    const start = source.lastIndexOf("{", markerIndex);

    if (start === -1) continue;

    let depth = 0;
    let end = -1;

    for (let i = start; i < source.length; i += 1) {
      const char = source[i];

      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;

      if (depth === 0) {
        end = i + 1;
        break;
      }
    }

    if (end !== -1) {
      objects.push(source.slice(start, end));
    }
  }

  return objects;
}

function getStringField(objectText, fieldName) {
  const match = objectText.match(new RegExp(`${fieldName}:\\s*"([^"]+)"`));
  return match?.[1];
}

function getExplanation(objectText) {
  const match = objectText.match(/explanation:\s*(?:"([^"]+)"|`([^`]+)`)/s);
  return match?.[1] ?? match?.[2] ?? "";
}

function getAlternativeIds(objectText) {
  const alternativesMatch = objectText.match(/alternatives:\s*\[([\s\S]*?)\]\s*,/);
  if (!alternativesMatch) return [];

  const alternativeSource = alternativesMatch[1];
  return [...alternativeSource.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
}

const errors = [];
const files = walk(QUESTION_BANK_DIR);

if (files.length === 0) {
  errors.push(`Nenhum arquivo .ts encontrado em ${QUESTION_BANK_DIR}`);
}

const allQuestions = [];

for (const file of files) {
  const source = fs.readFileSync(file, "utf-8");
  const questionObjects = extractQuestionObjects(source);

  for (const objectText of questionObjects) {
    const question = {
      id: getStringField(objectText, "id"),
      world: getStringField(objectText, "world"),
      categoryId: getStringField(objectText, "categoryId"),
      subject: getStringField(objectText, "subject"),
      topic: getStringField(objectText, "topic"),
      difficulty: getStringField(objectText, "difficulty"),
      correctAlternativeId: getStringField(objectText, "correctAlternativeId"),
      explanation: getExplanation(objectText),
      alternativeIds: getAlternativeIds(objectText),
      file: path.relative(ROOT, file),
    };

    allQuestions.push(question);
  }
}

const ids = new Map();
const categoryCounts = new Map();

for (const question of allQuestions) {
  if (!question.id) {
    errors.push(`${question.file}: pergunta sem id`);
    continue;
  }

  if (ids.has(question.id)) {
    errors.push(
      `ID duplicado: ${question.id} em ${question.file} e ${ids.get(question.id)}`
    );
  }

  ids.set(question.id, question.file);

  if (!question.world || !["school", "contest"].includes(question.world)) {
    errors.push(`${question.id}: world inválido ou ausente`);
  }

  if (!question.categoryId || !EXPECTED_CATEGORIES[question.categoryId]) {
    errors.push(`${question.id}: categoryId inválido ou ausente`);
  } else {
    const expectedWorld = EXPECTED_CATEGORIES[question.categoryId].world;

    if (question.world !== expectedWorld) {
      errors.push(
        `${question.id}: categoryId ${question.categoryId} pertence a ${expectedWorld}, mas world é ${question.world}`
      );
    }

    categoryCounts.set(
      question.categoryId,
      (categoryCounts.get(question.categoryId) ?? 0) + 1
    );
  }

  if (!question.subject) errors.push(`${question.id}: subject ausente`);
  if (!question.topic) errors.push(`${question.id}: topic ausente`);

  if (!question.difficulty || !VALID_DIFFICULTIES.has(question.difficulty)) {
    errors.push(`${question.id}: difficulty inválida ou ausente`);
  }

  if (question.alternativeIds.length !== 4) {
    errors.push(`${question.id}: deve ter exatamente 4 alternativas`);
  }

  const uniqueAlternativeIds = new Set(question.alternativeIds);

  if (uniqueAlternativeIds.size !== question.alternativeIds.length) {
    errors.push(`${question.id}: alternativas com IDs duplicados`);
  }

  if (!question.correctAlternativeId) {
    errors.push(`${question.id}: correctAlternativeId ausente`);
  } else if (!uniqueAlternativeIds.has(question.correctAlternativeId)) {
    errors.push(
      `${question.id}: correctAlternativeId "${question.correctAlternativeId}" não existe nas alternativas`
    );
  }

  if (!question.explanation || question.explanation.trim().length < 20) {
    errors.push(`${question.id}: explanation ausente ou curta demais`);
  }
}

for (const [categoryId, config] of Object.entries(EXPECTED_CATEGORIES)) {
  const count = categoryCounts.get(categoryId) ?? 0;

  if (count < config.min) {
    errors.push(`${categoryId}: esperado no mínimo ${config.min} perguntas, encontrado ${count}`);
  }
}

console.log("====================================");
console.log("Arena do Saber — Validação de Questões");
console.log("====================================");
console.log(`Arquivos lidos: ${files.length}`);
console.log(`Perguntas encontradas: ${allQuestions.length}`);
console.log("");

console.log("Perguntas por categoria:");
for (const categoryId of Object.keys(EXPECTED_CATEGORIES)) {
  console.log(`- ${categoryId}: ${categoryCounts.get(categoryId) ?? 0}`);
}

console.log("");

if (errors.length > 0) {
  console.error(`❌ Validação falhou com ${errors.length} erro(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("✅ Banco de questões validado com sucesso.");
