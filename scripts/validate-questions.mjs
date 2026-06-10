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

const VALID_WORLDS = new Set(["school", "contest"]);
const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const IDEAL_DISTRIBUTION = { easy: 5, medium: 6, hard: 4 };
const WARNING_TOLERANCE = 1;

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
    let inString = false;
    let stringQuote = "";
    let escaped = false;
    let inLineComment = false;
    let inBlockComment = false;

    for (let i = start; i < source.length; i += 1) {
      const char = source[i];
      const next = source[i + 1];

      if (inLineComment) {
        if (char === "\n") inLineComment = false;
        continue;
      }

      if (inBlockComment) {
        if (char === "*" && next === "/") {
          inBlockComment = false;
          i += 1;
        }
        continue;
      }

      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === "\\") {
          escaped = true;
          continue;
        }
        if (char === stringQuote) {
          inString = false;
          stringQuote = "";
        }
        continue;
      }

      if (char === "/" && next === "/") {
        inLineComment = true;
        i += 1;
        continue;
      }

      if (char === "/" && next === "*") {
        inBlockComment = true;
        i += 1;
        continue;
      }

      if (char === '"' || char === "'" || char === "`") {
        inString = true;
        stringQuote = char;
        continue;
      }

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

function incrementCount(map, key, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function createDifficultyCount() {
  return { easy: 0, medium: 0, hard: 0 };
}

function formatDifficultyCount(counts) {
  return `${counts.easy}/${counts.medium}/${counts.hard}`;
}

function collectDistributionWarnings(categoryDifficultyCounts) {
  const warnings = [];

  for (const [categoryId, counts] of categoryDifficultyCounts.entries()) {
    const diffs = Object.entries(IDEAL_DISTRIBUTION).filter(([difficulty, ideal]) => {
      return Math.abs((counts[difficulty] ?? 0) - ideal) > WARNING_TOLERANCE;
    });

    if (diffs.length > 0) {
      warnings.push(
        `[DIST] ${categoryId}: distribuição ${formatDifficultyCount(counts)} está longe do ideal ` +
          `${formatDifficultyCount(IDEAL_DISTRIBUTION)}.`
      );
    }

    if ((counts.hard ?? 0) < IDEAL_DISTRIBUTION.hard - WARNING_TOLERANCE) {
      warnings.push(
        `[DIST-GRAVE] ${categoryId}: poucas questões hard (${counts.hard}); ideal é ${IDEAL_DISTRIBUTION.hard}.`
      );
    }
  }

  return warnings;
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
const worldCounts = new Map();
const difficultyCounts = new Map();
const categoryCounts = new Map();
const categoryDifficultyCounts = new Map();

for (const question of allQuestions) {
  if (!question.id) {
    errors.push(`${question.file}: pergunta sem id`);
    continue;
  }

  if (ids.has(question.id)) {
    errors.push(`ID duplicado: ${question.id} em ${question.file} e ${ids.get(question.id)}`);
  }

  ids.set(question.id, question.file);

  if (!question.world || !VALID_WORLDS.has(question.world)) {
    errors.push(`${question.id}: world inválido ou ausente`);
  } else {
    incrementCount(worldCounts, question.world);
  }

  if (!question.categoryId || !EXPECTED_CATEGORIES[question.categoryId]) {
    errors.push(`${question.id}: categoryId inválido ou ausente`);
  } else {
    const expectedWorld = EXPECTED_CATEGORIES[question.categoryId].world;

    if (question.world !== expectedWorld) {
      errors.push(`${question.id}: categoryId ${question.categoryId} pertence a ${expectedWorld}, mas world é ${question.world}`);
    }

    incrementCount(categoryCounts, question.categoryId);

    if (!categoryDifficultyCounts.has(question.categoryId)) {
      categoryDifficultyCounts.set(question.categoryId, createDifficultyCount());
    }
  }

  if (!question.subject) errors.push(`${question.id}: subject ausente`);
  if (!question.topic) errors.push(`${question.id}: topic ausente`);

  if (!question.difficulty || !VALID_DIFFICULTIES.has(question.difficulty)) {
    errors.push(`${question.id}: difficulty inválida ou ausente`);
  } else {
    incrementCount(difficultyCounts, question.difficulty);

    if (question.categoryId && categoryDifficultyCounts.has(question.categoryId)) {
      categoryDifficultyCounts.get(question.categoryId)[question.difficulty] += 1;
    }
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
    errors.push(`${question.id}: correctAlternativeId "${question.correctAlternativeId}" não existe nas alternativas`);
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

  if (!categoryDifficultyCounts.has(categoryId)) {
    categoryDifficultyCounts.set(categoryId, createDifficultyCount());
  }
}

const warnings = collectDistributionWarnings(categoryDifficultyCounts);

console.log("====================================");
console.log("Arena do Saber — Validação de Questões");
console.log("====================================");
console.log(`Arquivos lidos: ${files.length}`);
console.log(`Perguntas encontradas: ${allQuestions.length}`);
console.log("");
console.log("Perguntas por mundo:");
for (const world of ["school", "contest"]) {
  console.log(`- ${world}: ${worldCounts.get(world) ?? 0}`);
}
console.log("");
console.log("Perguntas por dificuldade (total):");
for (const difficulty of ["easy", "medium", "hard"]) {
  console.log(`- ${difficulty}: ${difficultyCounts.get(difficulty) ?? 0}`);
}
console.log("");
console.log("Distribuição por categoria (total | easy / medium / hard):");
for (const categoryId of Object.keys(EXPECTED_CATEGORIES)) {
  const total = categoryCounts.get(categoryId) ?? 0;
  const counts = categoryDifficultyCounts.get(categoryId) ?? createDifficultyCount();
  console.log(`- ${categoryId}: ${total} | ${formatDifficultyCount(counts)}  (ideal: ${formatDifficultyCount(IDEAL_DISTRIBUTION)})`);
}
console.log("");

if (warnings.length > 0) {
  console.warn(`⚠️  Alertas de distribuição (${warnings.length}):`);
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
  console.log("");
}

if (errors.length > 0) {
  console.error(`❌ Validação falhou com ${errors.length} erro(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("✅ Banco de questões validado com sucesso.");
