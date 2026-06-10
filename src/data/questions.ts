import { Question } from "../types/game";

// ============================================================
// QUESTIONS — Arena do Saber
// ============================================================
// Banco de perguntas organizado por mundo e matéria.
// Para adicionar novas perguntas, edite o arquivo correspondente em:
//   src/data/questionBank/school/   — perguntas do mundo Escola
//   src/data/questionBank/contest/  — perguntas do mundo Concurso
// ============================================================

// Escola
import { SCHOOL_PORTUGUES_QUESTIONS } from "./questionBank/school/portugues";
import { SCHOOL_MATEMATICA_QUESTIONS } from "./questionBank/school/matematica";
import { SCHOOL_CIENCIAS_QUESTIONS } from "./questionBank/school/ciencias";
import { SCHOOL_HISTORIA_QUESTIONS } from "./questionBank/school/historia";
import { SCHOOL_GEOGRAFIA_QUESTIONS } from "./questionBank/school/geografia";
import { SCHOOL_INGLES_QUESTIONS } from "./questionBank/school/ingles";

// Concurso
import { CONTEST_PORTUGUES_QUESTIONS } from "./questionBank/contest/portugues";
import { CONTEST_MATEMATICA_QUESTIONS } from "./questionBank/contest/matematica";
import { CONTEST_INFORMATICA_QUESTIONS } from "./questionBank/contest/informatica";
import { CONTEST_ATUALIDADES_QUESTIONS } from "./questionBank/contest/atualidades";
import { CONTEST_LEGISLACAO_QUESTIONS } from "./questionBank/contest/legislacao";
import { CONTEST_ESPECIFICOS_QUESTIONS } from "./questionBank/contest/especificos";

export const QUESTIONS: Question[] = [
  ...SCHOOL_PORTUGUES_QUESTIONS,
  ...SCHOOL_MATEMATICA_QUESTIONS,
  ...SCHOOL_CIENCIAS_QUESTIONS,
  ...SCHOOL_HISTORIA_QUESTIONS,
  ...SCHOOL_GEOGRAFIA_QUESTIONS,
  ...SCHOOL_INGLES_QUESTIONS,
  ...CONTEST_PORTUGUES_QUESTIONS,
  ...CONTEST_MATEMATICA_QUESTIONS,
  ...CONTEST_INFORMATICA_QUESTIONS,
  ...CONTEST_ATUALIDADES_QUESTIONS,
  ...CONTEST_LEGISLACAO_QUESTIONS,
  ...CONTEST_ESPECIFICOS_QUESTIONS,
];

// Helper para buscar pergunta por ID
export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
