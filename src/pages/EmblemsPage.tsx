import { PlayerProgress, World } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { ALL_CATEGORIES } from "../data/categories";

interface EmblemsPageProps {
  progress: PlayerProgress;
  onBack: () => void;
  onStartClassic: (world?: World) => void;
}

const WORLD_TITLES = {
  school: "🏫 Mundo Escola",
  contest: "🎯 Mundo Concurso",
} as const;

const BADGE_UNLOCK_PROGRESS = 3;

export function EmblemsPage({
  progress,
  onBack,
  onStartClassic,
}: EmblemsPageProps) {
  const completedEmblemSet = new Set(progress.completedEmblems);
  const completedCount = progress.completedEmblems.length;
  const totalCount = ALL_CATEGORIES.length;

  const unlockedChallengeCount = ALL_CATEGORIES.filter((category) => {
    const earned = completedEmblemSet.has(category.id);
    const categoryProgress = progress.categoryProgress[category.id] ?? 0;
    return !earned && categoryProgress >= BADGE_UNLOCK_PROGRESS;
  }).length;

  const completionPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const worldSections = [
    {
      world: "school" as const,
      categories: ALL_CATEGORIES.filter((category) => category.world === "school"),
    },
    {
      world: "contest" as const,
      categories: ALL_CATEGORIES.filter(
        (category) => category.world === "contest"
      ),
    },
  ];

  return (
    <AppShell
      header={
        <Header
          progress={progress}
          title="Coleção de Insígnias"
          subtitle={`${completedCount}/${totalCount} conquistadas`}
          onBack={onBack}
        />
      }
    >
      <div className="space-y-4">
        <Card className="overflow-hidden p-0" glow>
          <div className="border-b border-amber-500/20 bg-amber-950/25 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/15 text-3xl shadow-lg shadow-amber-950/30">
                🏆
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wide text-amber-300">
                  Sua coleção
                </p>
                <h1 className="mt-1 text-2xl font-black text-white">
                  Insígnias de Sabedoria
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Cada matéria tem uma insígnia. Acumule 3 acertos, vença o
                  desafio e acompanhe sua coleção completa aqui.
                </p>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-950/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-violet-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/25 p-3 text-center">
                <div className="text-2xl font-black text-amber-200">
                  {completedCount}
                </div>
                <div className="text-[11px] font-bold text-slate-400">
                  conquistadas
                </div>
              </div>

              <div className="rounded-2xl border border-violet-500/30 bg-violet-950/25 p-3 text-center">
                <div className="text-2xl font-black text-violet-200">
                  {unlockedChallengeCount}
                </div>
                <div className="text-[11px] font-bold text-slate-400">
                  desafios
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-center">
                <div className="text-2xl font-black text-emerald-200">
                  {completionPercent}%
                </div>
                <div className="text-[11px] font-bold text-slate-400">
                  domínio
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartClassic()}
              className="mt-4 w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
            >
              🎲 Buscar novas insígnias
            </button>
          </div>
        </Card>

        {worldSections.map((section) => {
          const earnedCategories = section.categories.filter((category) =>
            completedEmblemSet.has(category.id)
          );
          const pendingCategories = section.categories.filter(
            (category) => !completedEmblemSet.has(category.id)
          );

          return (
            <Card key={section.world} className="p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white">
                    {WORLD_TITLES[section.world]}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {earnedCategories.length}/{section.categories.length} insígnias
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onStartClassic(section.world)}
                  className="rounded-full border border-violet-500/40 bg-violet-950/30 px-3 py-1 text-xs font-black text-violet-100 transition hover:bg-violet-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                >
                  Jogar
                </button>
              </div>

              {earnedCategories.length > 0 && (
                <div className="mb-5">
                  <p className="mb-3 text-xs font-black uppercase tracking-wide text-emerald-300">
                    Conquistadas
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {earnedCategories.map((category) => (
                      <article
                        key={category.id}
                        className={`rounded-2xl border p-3 ${category.borderClass} bg-emerald-950/20 shadow-lg shadow-emerald-950/10`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${category.bgClass} text-white`}
                          >
                            {category.icon}
                          </div>

                          <div className="min-w-0">
                            <h3 className="break-words text-sm font-black leading-tight text-white">
                              {category.emblemName}
                            </h3>
                            <p className="mt-1 text-xs font-semibold text-slate-400">
                              {category.name}
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-slate-300">
                          Conquistada! Continue jogando para fortalecer seu domínio.
                        </p>

                        <div className="mt-3 rounded-full bg-emerald-500/15 px-3 py-1 text-center text-xs font-black uppercase tracking-wide text-emerald-200">
                          ✓ Conquistada
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                  Em andamento
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {pendingCategories.map((category) => {
                    const categoryProgress = Math.min(
                      progress.categoryProgress[category.id] ?? 0,
                      BADGE_UNLOCK_PROGRESS
                    );
                    const challengeUnlocked =
                      categoryProgress >= BADGE_UNLOCK_PROGRESS;
                    const missing = Math.max(
                      BADGE_UNLOCK_PROGRESS - categoryProgress,
                      0
                    );

                    return (
                      <article
                        key={category.id}
                        className={
                          "rounded-2xl border p-3 " +
                          (challengeUnlocked
                            ? "border-amber-400/60 bg-amber-950/25 shadow-lg shadow-amber-950/15"
                            : "border-slate-700/70 bg-slate-900/60")
                        }
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl " +
                              (challengeUnlocked
                                ? "bg-amber-500/20 text-amber-200"
                                : "bg-slate-800 text-slate-400")
                            }
                          >
                            {challengeUnlocked ? "⚔️" : "🔒"}
                          </div>

                          <div className="min-w-0">
                            <h3 className="break-words text-sm font-black leading-tight text-white">
                              {category.emblemName}
                            </h3>
                            <p className="mt-1 text-xs font-semibold text-slate-400">
                              {category.name}
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-slate-300">
                          {challengeUnlocked
                            ? "Desafio liberado! Vença 2 de 3 perguntas na Partida Clássica para conquistar."
                            : category.emblemDescription}
                        </p>

                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {Array.from({ length: BADGE_UNLOCK_PROGRESS }).map(
                            (_, index) => {
                              const filled = index < categoryProgress;

                              return (
                                <div
                                  key={index}
                                  className={
                                    "rounded-xl border px-2 py-2 text-center text-xs font-black " +
                                    (filled
                                      ? "border-violet-400/50 bg-violet-500/15 text-violet-200"
                                      : "border-slate-700 bg-slate-950/40 text-slate-500")
                                  }
                                >
                                  {filled ? "✓" : "·"} {index + 1}
                                </div>
                              );
                            }
                          )}
                        </div>

                        <div
                          className={
                            "mt-3 rounded-full px-3 py-1 text-center text-xs font-black uppercase tracking-wide " +
                            (challengeUnlocked
                              ? "bg-amber-500/15 text-amber-200"
                              : "bg-slate-800 text-slate-400")
                          }
                        >
                          {challengeUnlocked
                            ? "Desafio liberado"
                            : `Faltam ${missing} acerto${missing === 1 ? "" : "s"}`}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
