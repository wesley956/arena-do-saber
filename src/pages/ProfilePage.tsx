import { PlayerProgress, World } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { DEFAULT_PROGRESS } from "../lib/storage";
import { xpProgressInLevel, xpToNextLevel } from "../lib/xp";
import {
  PlayerAchievement,
  ProfileCategoryStats,
  ProfileWorldStats,
  getAllProfileWorldStats,
  getPlayerAchievements,
  getPlayerProfileSummary,
  getNextPlayerAchievements,
} from "../lib/achievements";

interface ProfilePageProps {
  progress: PlayerProgress;
  onProgressUpdate: (p: PlayerProgress) => void;
  onBack: () => void;
}

const WORLD_DESCRIPTIONS: Record<World, string> = {
  school: "Português, Matemática, Ciências, História, Geografia e Inglês.",
  contest:
    "Português, Matemática / Raciocínio Lógico, Informática, Atualidades, Legislação e Conhecimentos Específicos.",
};

const ACHIEVEMENT_TONE_CLASSES: Record<PlayerAchievement["tone"], string> = {
  bronze: "border-orange-500/40 bg-orange-950/20 text-orange-200",
  silver: "border-slate-400/40 bg-slate-700/30 text-slate-100",
  gold: "border-amber-400/50 bg-amber-950/30 text-amber-200",
  violet: "border-violet-500/40 bg-violet-950/30 text-violet-200",
  emerald: "border-emerald-500/40 bg-emerald-950/25 text-emerald-200",
};

function formatPercent(value: number): string {
  return `${Math.max(0, Math.min(100, value))}%`;
}

function StatCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: string;
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <Card className="min-w-0 p-3 sm:p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-xl">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="break-words text-xs font-bold uppercase leading-tight tracking-wide text-slate-400 sm:text-xs">
            {label}
          </p>
          <p className="mt-1 break-words text-xl font-black leading-tight text-white sm:text-2xl">
            {value}
          </p>
          {helper && (
            <p className="mt-1 break-words text-xs leading-snug text-slate-400 sm:text-xs">
              {helper}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function MiniProgressBar({ value }: { value: number }) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900/80">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
        style={{ width: formatPercent(value) }}
      />
    </div>
  );
}

function CategoryProgressCard({ stats }: { stats: ProfileCategoryStats }) {
  const activityLabel = stats.answered > 0
    ? `${stats.answered} respondida(s)`
    : stats.soloSeen > 0
      ? `${stats.soloSeen} vista(s) no Treino Solo`
      : "Sem progresso ainda";

  return (
    <div className="min-w-0 rounded-2xl border border-slate-700/70 bg-slate-900/45 p-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-xl">{stats.icon || "📘"}</span>
            <h4 className="min-w-0 break-words font-black leading-tight text-white">
              {stats.categoryName}
            </h4>
          </div>
          <p className="mt-1 break-words text-xs leading-snug text-slate-400">{activityLabel}</p>
        </div>
        {stats.hasEmblem && (
          <span className="shrink-0 rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-1 text-xs font-black uppercase tracking-wide text-amber-200">
            Insígnia
          </span>
        )}
      </div>

      <MiniProgressBar value={stats.progressPercent} />

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-slate-800/70 p-2">
          <p className="font-black text-emerald-300">{stats.correct}</p>
          <p className="text-slate-400">acertos</p>
        </div>
        <div className="rounded-xl bg-slate-800/70 p-2">
          <p className="font-black text-rose-300">{stats.wrong}</p>
          <p className="text-slate-400">erros</p>
        </div>
        <div className="rounded-xl bg-slate-800/70 p-2">
          <p className="font-black text-indigo-300">{stats.accuracy}%</p>
          <p className="text-slate-400">taxa</p>
        </div>
      </div>
    </div>
  );
}

function WorldProgressSection({ worldStats }: { worldStats: ProfileWorldStats }) {
  return (
    <Card className="min-w-0 p-5">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
            Progresso por mundo
          </p>
          <h3 className="mt-1 break-words text-2xl font-black leading-tight text-white">
            {worldStats.label}
          </h3>
          <p className="mt-1 break-words text-sm leading-snug text-slate-400">
            {WORLD_DESCRIPTIONS[worldStats.world]}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
          <p className="text-2xl font-black text-white">
            {worldStats.conqueredEmblems}/6
          </p>
          <p className="text-xs text-slate-400">insígnias</p>
        </div>
      </div>

      <MiniProgressBar value={(worldStats.conqueredEmblems / 6) * 100} />

      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-3 text-sm">
        <div className="rounded-xl bg-slate-900/50 p-3">
          <p className="font-black text-white">{worldStats.answered}</p>
          <p className="text-xs text-slate-400">respondidas</p>
        </div>
        <div className="rounded-xl bg-slate-900/50 p-3">
          <p className="font-black text-emerald-300">{worldStats.correct}</p>
          <p className="text-xs text-slate-400">acertos</p>
        </div>
        <div className="rounded-xl bg-slate-900/50 p-3">
          <p className="font-black text-rose-300">{worldStats.wrong}</p>
          <p className="text-xs text-slate-400">erros</p>
        </div>
        <div className="rounded-xl bg-slate-900/50 p-3">
          <p className="font-black text-indigo-300">{worldStats.accuracy}%</p>
          <p className="text-xs text-slate-400">taxa</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        {worldStats.categories.map((categoryStats) => (
          <CategoryProgressCard key={categoryStats.categoryId} stats={categoryStats} />
        ))}
      </div>
    </Card>
  );
}

function AchievementCard({ achievement }: { achievement: PlayerAchievement }) {
  const toneClass = achievement.unlocked
    ? ACHIEVEMENT_TONE_CLASSES[achievement.tone]
    : "border-slate-700/70 bg-slate-900/50 text-slate-400";

  return (
    <div className={`min-w-0 rounded-2xl border p-4 transition-all ${toneClass}`}>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/20 text-2xl">
            {achievement.unlocked ? achievement.icon : "🔒"}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="break-words font-black leading-tight text-white">
              {achievement.title}
            </h4>
            <p className="mt-1 break-words text-sm leading-snug opacity-80">
              {achievement.description}
            </p>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded-full bg-black/20 px-2 py-1 text-xs font-black uppercase tracking-wide">
          {achievement.unlocked ? "Desbloqueada" : "Bloqueada"}
        </span>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between gap-2 text-xs font-bold opacity-80">
          <span className="break-words">{achievement.progressLabel}</span>
          <span className="shrink-0">{achievement.progressPercent}%</span>
        </div>
        <MiniProgressBar value={achievement.progressPercent} />
      </div>
    </div>
  );
}

export function ProfilePage({ progress, onProgressUpdate, onBack }: ProfilePageProps) {
  const summary = getPlayerProfileSummary(progress);
  const worldStats = getAllProfileWorldStats(progress);
  const achievements = getPlayerAchievements(progress);
  const unlockedAchievements = achievements.filter((achievement) => achievement.unlocked).length;
  const nextAchievements = getNextPlayerAchievements(progress);
  const xpInLevel = xpProgressInLevel(progress.xp);
  const xpToNext = xpToNextLevel(progress.xp);

  function resetProgress() {
    const confirmed = window.confirm("Tem certeza que deseja zerar seu progresso local?");
    if (confirmed) onProgressUpdate({ ...DEFAULT_PROGRESS });
  }

  return (
    <AppShell
      header={
        <Header
          progress={progress}
          title="Perfil do Jogador"
          subtitle="Sua jornada na Arena do Saber"
          onBack={onBack}
        />
      }
    >
      <div className="space-y-6">
        <Card className="min-w-0 overflow-hidden p-5 sm:p-6" glow>
          <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-600/30 to-indigo-600/20 text-4xl shadow-lg shadow-violet-950/30">
                🧙‍♂️
              </div>
              <div className="min-w-0">
                <p className="break-words text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
                  Arena do Saber
                </p>
                <h2 className="mt-1 break-words text-3xl font-black leading-tight text-white">
                  Estudante Lv. {progress.level}
                </h2>
                <p className="mt-1 break-words leading-snug text-slate-400">
                  {progress.xp} XP total · faltam {xpToNext} XP para o Lv. {progress.level + 1}
                </p>
              </div>
            </div>
            <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 lg:max-w-xs">
              <div className="flex min-w-0 items-center justify-between gap-3 text-sm">
                <span className="min-w-0 break-words text-slate-400">Progresso do nível</span>
                <span className="shrink-0 font-black text-white">{xpInLevel}%</span>
              </div>
              <MiniProgressBar value={xpInLevel} />
            </div>
          </div>
        </Card>

        <section className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          <StatCard icon="🎮" label="Perguntas" value={summary.totalAnswered} helper="Respondidas" />
          <StatCard icon="✅" label="Acertos" value={summary.totalCorrect} />
          <StatCard icon="❌" label="Erros" value={summary.totalWrong} />
          <StatCard icon="📈" label="Acerto" value={`${summary.accuracy}%`} helper="Taxa geral" />
          <StatCard icon="🌍" label="Mundo" value={summary.mostStudiedWorld} helper="Mais estudado" />
          <StatCard icon="📚" label="Matérias" value={summary.categoriesWithProgress} helper="Com progresso" />
          <StatCard icon="🏅" label="Insígnias" value={summary.completedEmblemsCount} />
          <StatCard
            icon="📝"
            label="Caderno"
            value={summary.scratchpadCount}
            helper="Anotações salvas"
          />
        </section>

        <section className="space-y-4">
          {worldStats.map((item) => (
            <WorldProgressSection key={item.world} worldStats={item} />
          ))}
        </section>

        {nextAchievements.length > 0 && (
          <Card className="min-w-0 p-5 border-sky-400/25 bg-sky-950/15">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                  Próximas metas
                </p>
                <h3 className="mt-1 break-words text-2xl font-black leading-tight text-white">
                  Continue sua evolução
                </h3>
                <p className="mt-1 break-words text-sm leading-snug text-slate-400">
                  Estas são as conquistas mais próximas com base no seu progresso local.
                </p>
              </div>
              <div className="w-fit shrink-0 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm font-black text-sky-200">
                {nextAchievements.length} meta(s)
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
              {nextAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </Card>
        )}

        <Card className="min-w-0 p-5">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                Conquistas
              </p>
              <h3 className="mt-1 break-words text-2xl font-black leading-tight text-white">
                Mural do Jogador
              </h3>
              <p className="mt-1 break-words text-sm leading-snug text-slate-400">
                {unlockedAchievements}/{achievements.length} conquistas desbloqueadas com dados reais do progresso local.
              </p>
            </div>
            <div className="w-fit shrink-0 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-black text-amber-200">
              {unlockedAchievements} desbloqueada(s)
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </Card>

        <Card className="min-w-0 p-5">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="break-words font-black text-white">Dados locais</h3>
              <p className="mt-1 break-words text-sm leading-snug text-slate-400">
                Esta tela usa apenas progresso salvo no navegador: XP, acertos, erros,
                insígnias, histórico do Treino Solo e anotações do Caderno.
              </p>
            </div>
            <Button variant="danger" onClick={resetProgress}>
              Zerar progresso local
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
