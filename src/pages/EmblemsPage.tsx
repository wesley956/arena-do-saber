import { PlayerProgress } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { ALL_CATEGORIES } from "../data/categories";

interface EmblemsPageProps {
  progress: PlayerProgress;
  onBack: () => void;
}

const WORLD_TITLES = {
  school: "🏫 Mundo Escola",
  contest: "🎯 Mundo Concurso",
} as const;

export function EmblemsPage({ progress, onBack }: EmblemsPageProps) {
  const completedEmblemSet = new Set(progress.completedEmblems);
  const completedCount = progress.completedEmblems.length;
  const totalCount = ALL_CATEGORIES.length;

  const schoolCategories = ALL_CATEGORIES.filter(
    (category) => category.world === "school"
  );
  const contestCategories = ALL_CATEGORIES.filter(
    (category) => category.world === "contest"
  );

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
        <Card className="p-4 sm:p-5" glow>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-2xl">
              🏆
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-white">
                Insígnias para conquistar
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Cada matéria tem uma insígnia. Acerte, libere desafios e acompanhe
                sua coleção completa aqui.
              </p>
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-900/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-violet-500 transition-all duration-300"
              style={{ width: `${Math.round((completedCount / totalCount) * 100)}%` }}
            />
          </div>

          <p className="mt-2 text-xs font-black uppercase tracking-wide text-amber-200">
            {completedCount}/{totalCount} conquistadas
          </p>
        </Card>

        {[
          { world: "school" as const, categories: schoolCategories },
          { world: "contest" as const, categories: contestCategories },
        ].map((section) => (
          <Card key={section.world} className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-white">
                {WORLD_TITLES[section.world]}
              </h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-black text-slate-300">
                {
                  section.categories.filter((category) =>
                    completedEmblemSet.has(category.id)
                  ).length
                }
                /{section.categories.length}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {section.categories.map((category) => {
                const earned = completedEmblemSet.has(category.id);

                return (
                  <article
                    key={category.id}
                    className={`rounded-2xl border p-3 ${
                      earned
                        ? `${category.borderClass} bg-amber-500/10 shadow-lg shadow-amber-950/20`
                        : "border-slate-700/70 bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${
                          earned
                            ? `${category.bgClass} text-white`
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {earned ? category.icon : "🔒"}
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
                      {earned
                        ? "Conquistada! Continue jogando para fortalecer seu domínio."
                        : category.emblemDescription}
                    </p>

                    <div
                      className={`mt-3 rounded-full px-3 py-1 text-center text-xs font-black uppercase tracking-wide ${
                        earned
                          ? "bg-amber-500/15 text-amber-200"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {earned ? "Conquistada" : "Bloqueada"}
                    </div>
                  </article>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
