import { FormEvent, useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PlayerProgress } from "../types/game";
import {
  ContestTrack,
  LocalPlayerProfile,
  PlayerGoal,
  StudyStage,
} from "../types/playerProfile";

interface JourneySetupPageProps {
  progress: PlayerProgress;
  profile: LocalPlayerProfile | null;
  isFirstRun?: boolean;
  onSave: (profile: LocalPlayerProfile) => void;
  onBack?: () => void;
}

const goalOptions: Array<{
  id: PlayerGoal;
  icon: string;
  title: string;
  description: string;
}> = [
  {
    id: "literacy",
    icon: "🔤",
    title: "Alfabetização",
    description: "Aprender letras, sons, sílabas, palavras e números.",
  },
  {
    id: "school",
    icon: "🏫",
    title: "Escola",
    description: "Melhorar nas matérias e estudar para provas.",
  },
  {
    id: "contest",
    icon: "🎯",
    title: "Concurso",
    description: "Preparar uma trilha voltada ao tipo de concurso.",
  },
  {
    id: "general",
    icon: "🧠",
    title: "Conhecimentos gerais",
    description: "Treinar cultura geral, raciocínio e revisão.",
  },
];

const stageOptions: Array<{
  id: StudyStage;
  title: string;
  description: string;
}> = [
  {
    id: "literacy",
    title: "Alfabetização",
    description: "Primeiras letras, sons, palavras, contagem e formas.",
  },
  {
    id: "fundamental1",
    title: "Fundamental I",
    description: "1º ao 5º ano, base escolar e leitura.",
  },
  {
    id: "fundamental2",
    title: "Fundamental II",
    description: "6º ao 9º ano, preparação para conteúdos mais avançados.",
  },
  {
    id: "highSchool",
    title: "Ensino Médio",
    description: "Português, matemática, ciências humanas e natureza.",
  },
  {
    id: "adult",
    title: "Adulto / Concurso",
    description: "Preparação prática, revisão e simulados.",
  },
];

const contestOptions: Array<{
  id: ContestTrack;
  title: string;
  description: string;
}> = [
  {
    id: "pm",
    title: "Polícia Militar",
    description: "Português, matemática, legislação e específicos.",
  },
  {
    id: "gcm",
    title: "Guarda Municipal",
    description: "Base escolar, legislação e conhecimentos municipais.",
  },
  {
    id: "cityHall",
    title: "Prefeitura",
    description: "Cargos administrativos, nível fundamental ou médio.",
  },
  {
    id: "bank",
    title: "Banco",
    description: "Matemática, português, informática e atualidades.",
  },
  {
    id: "administrative",
    title: "Administrativo",
    description: "Rotina administrativa, português e informática.",
  },
  {
    id: "court",
    title: "Tribunal",
    description: "Português, informática, legislação e raciocínio.",
  },
  {
    id: "other",
    title: "Outro",
    description: "Trilha geral de concurso para ajustar depois.",
  },
];

function getInitialGoal(profile: LocalPlayerProfile | null): PlayerGoal {
  return profile?.goal ?? "school";
}

function getInitialStage(profile: LocalPlayerProfile | null): StudyStage {
  return profile?.studyStage ?? "fundamental2";
}

function getInitialContestTrack(
  profile: LocalPlayerProfile | null
): ContestTrack {
  return profile?.contestTrack ?? "pm";
}

function getJourneySummary(
  goal: PlayerGoal,
  studyStage: StudyStage,
  contestTrack: ContestTrack
) {
  if (goal === "literacy") {
    return "O app vai priorizar uma jornada mais simples, visual e progressiva para alfabetização.";
  }

  if (goal === "contest") {
    const contest = contestOptions.find((item) => item.id === contestTrack);
    return `O app vai preparar sua base para concursos, começando pela trilha: ${
      contest?.title ?? "Concurso"
    }.`;
  }

  if (goal === "school") {
    const stage = stageOptions.find((item) => item.id === studyStage);
    return `O app vai focar nos conteúdos de escola conforme sua fase: ${
      stage?.title ?? "Escola"
    }.`;
  }

  return "O app vai manter uma jornada ampla para treinar raciocínio, revisão e conhecimentos gerais.";
}

export function JourneySetupPage({
  progress,
  profile,
  isFirstRun = false,
  onSave,
  onBack,
}: JourneySetupPageProps) {
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [goal, setGoal] = useState<PlayerGoal>(() => getInitialGoal(profile));
  const [studyStage, setStudyStage] = useState<StudyStage>(() =>
    getInitialStage(profile)
  );
  const [contestTrack, setContestTrack] = useState<ContestTrack>(() =>
    getInitialContestTrack(profile)
  );

  const journeySummary = useMemo(
    () => getJourneySummary(goal, studyStage, contestTrack),
    [goal, studyStage, contestTrack]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const now = new Date().toISOString();

    onSave({
      nickname: nickname.trim() || "Estudante",
      goal,
      studyStage: goal === "literacy" ? "literacy" : studyStage,
      contestTrack: goal === "contest" ? contestTrack : undefined,
      createdAt: profile?.createdAt ?? now,
      updatedAt: now,
    });
  }

  return (
    <AppShell>
      <form className="space-y-4 pb-8" onSubmit={handleSubmit}>
        <Card className="overflow-hidden p-0" glow>
          <div className="relative p-5 text-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.24),transparent_58%)]" />

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="relative mb-4 inline-flex min-h-11 items-center rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-black text-slate-200 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              >
                ← Voltar
              </button>
            )}

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-500/15 text-4xl shadow-xl shadow-violet-950/30">
              🧭
            </div>

            <p className="relative mt-3 text-xs font-black uppercase tracking-wide text-violet-200">
              {isFirstRun ? "Primeiro passo" : "Perfil de aprendizado"}
            </p>

            <h1 className="relative mt-1 text-2xl font-black text-white">
              Minha Jornada
            </h1>

            <p className="relative mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
              Conte para o Arena do Saber seu objetivo. Depois vamos usar isso
              para liberar conteúdos, trilhas e modos mais adequados.
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <label className="text-sm font-black text-white" htmlFor="nickname">
            Como devemos chamar o jogador?
          </label>
          <input
            id="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Ex: Jade, Ana, Pedro..."
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 text-base font-bold text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
          />

          <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
              Progresso atual
            </p>
            <p className="mt-1 text-sm font-bold text-slate-200">
              Lv. {progress.level} · {progress.xp} XP
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-black text-white">
            Qual é seu objetivo?
          </h2>

          <div className="mt-3 grid gap-2">
            {goalOptions.map((item) => {
              const selected = goal === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id)}
                  aria-pressed={selected}
                  className={`rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                    selected
                      ? "border-violet-300 bg-violet-500/20"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-600"
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span>
                      <span className="block text-base font-black text-white">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                        {item.description}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-black text-white">
            Qual fase combina mais com você?
          </h2>

          <div className="mt-3 grid gap-2">
            {stageOptions.map((item) => {
              const selected =
                goal === "literacy"
                  ? item.id === "literacy"
                  : studyStage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStudyStage(item.id)}
                  disabled={goal === "literacy" && item.id !== "literacy"}
                  aria-pressed={selected}
                  className={`rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-45 ${
                    selected
                      ? "border-sky-300 bg-sky-500/15"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-600"
                  }`}
                >
                  <span className="block text-base font-black text-white">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {goal === "contest" && (
          <Card className="p-4">
            <h2 className="text-lg font-black text-white">
              Qual tipo de concurso?
            </h2>

            <div className="mt-3 grid gap-2">
              {contestOptions.map((item) => {
                const selected = contestTrack === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setContestTrack(item.id)}
                    aria-pressed={selected}
                    className={`rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                      selected
                        ? "border-amber-300 bg-amber-500/15"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-600"
                    }`}
                  >
                    <span className="block text-base font-black text-white">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-300">
                      {item.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        <Card className="border-violet-400/30 bg-violet-950/20 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-violet-200">
            Caminho recomendado
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            {journeySummary}
          </p>
        </Card>

        <Button type="submit" fullWidth size="lg">
          Salvar minha jornada
        </Button>
      </form>
    </AppShell>
  );
}
