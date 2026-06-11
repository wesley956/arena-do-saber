import { useState } from "react";
import { PlayerProgress, World } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/game/ProgressBar";
import { getCategoriesByWorld } from "../data/categories";
import {
  getCategoryStats,
  getWorldStats,
  CategoryStats,
  CategoryStatus,
} from "../lib/stats";
import { EMBLEM_THRESHOLD } from "../lib/gameEngine";

// ============================================================
// STUDY MAP PAGE — Mapa de Estudos
// ============================================================

interface StudyMapPageProps {
  progress: PlayerProgress;
  onBack: () => void;
  onTrainCategory: (world: World, categoryId: string) => void;
  onReviewErrors: (world: World) => void;
}

// ── helpers de UI ────────────────────────────────────────────

const STATUS_CONFIG: Record<
  CategoryStatus,
  { label: string; badge: string; dot: string }
> = {
  notStarted: {
    label: "Não iniciado",
    badge: "bg-slate-700/70 text-slate-400 border-slate-600",
    dot: "bg-slate-500",
  },
  inProgress: {
    label: "Em andamento",
    badge: "bg-blue-900/60 text-blue-300 border-blue-700",
    dot: "bg-blue-400",
  },
  emblemReady: {
    label: "Emblema pronto!",
    badge: "bg-amber-900/60 text-amber-300 border-amber-600",
    dot: "bg-amber-400 animate-pulse",
  },
  conquered: {
    label: "Conquistado 🏅",
    badge: "bg-emerald-900/60 text-emerald-300 border-emerald-700",
    dot: "bg-emerald-400",
  },
};

// ── sub-componente: card de uma matéria ───────────────────────

interface CategoryCardProps {
  categoryId: string;
  icon: string;
  name: string;
  colorToken: string;
  textClass: string;
  stats: CategoryStats;
  onTrain: () => void;
  onReview: () => void;
}

function CategoryCard({
  icon,
  name,
  colorToken,
  textClass,
  stats,
  onTrain,
  onReview,
}: CategoryCardProps) {
  const statusCfg = STATUS_CONFIG[stats.status];
  const progressToEmblem = Math.min(stats.correct, EMBLEM_THRESHOLD);

  return (
    <Card className="p-4 mb-3">
      {/* Cabeçalho */}
      <div className="flex items-start gap-3 mb-3">
        {/* Ícone colorido */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: colorToken + "25", border: `1px solid ${colorToken}50` }}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-white text-sm`}>{name}</span>
            {/* Badge status */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${statusCfg.badge}`}
            >
              {statusCfg.label}
            </span>
          </div>
          {/* Contador de perguntas */}
          <p className="text-xs text-slate-400 mt-0.5">
            {stats.total} {stats.total === 1 ? "pergunta" : "perguntas"} disponíveis
          </p>
        </div>

        {/* Dot de status */}
        <div
          className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${statusCfg.dot}`}
        />
      </div>

      {/* Progresso para emblema */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-400 font-medium">
            Emblema: {progressToEmblem}/{EMBLEM_THRESHOLD} acertos
          </span>
          {stats.hasEmblem && (
            <span className="text-xs text-amber-400 font-bold">🏅 Conquistado!</span>
          )}
        </div>
        <ProgressBar
          value={progressToEmblem}
          max={EMBLEM_THRESHOLD}
          colorClass={
            stats.hasEmblem
              ? "bg-gradient-to-r from-amber-500 to-yellow-400"
              : stats.status === "emblemReady"
              ? "bg-gradient-to-r from-amber-500 to-yellow-400"
              : stats.status === "inProgress"
              ? "bg-blue-500"
              : "bg-slate-600"
          }
          height="sm"
        />
      </div>

      {/* Mini estatísticas */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="bg-slate-900/60 rounded-lg py-1.5 px-1">
          <div className={`font-bold text-sm ${textClass}`}>{stats.correct}</div>
          <div className="text-slate-400 text-xs">Acertos</div>
        </div>
        <div className="bg-slate-900/60 rounded-lg py-1.5 px-1">
          <div className="font-bold text-sm text-rose-400">{stats.errors}</div>
          <div className="text-slate-400 text-xs">Erros</div>
        </div>
        <div className="bg-slate-900/60 rounded-lg py-1.5 px-1">
          <div className="font-bold text-sm text-violet-400">{stats.dominancePercent}%</div>
          <div className="text-slate-400 text-xs">Domínio</div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-2">
        <Button
          onClick={onTrain}
          size="sm"
          variant="primary"
          className="flex-1"
        >
          📖 Treinar
        </Button>
        {stats.errors > 0 && (
          <Button
            onClick={onReview}
            size="sm"
            variant="ghost"
            className="flex-1 border-rose-800/60 text-rose-400 hover:bg-rose-900/20"
          >
            🔖 Revisar ({stats.errors})
          </Button>
        )}
      </div>
    </Card>
  );
}

// ── sub-componente: cabeçalho do mundo ────────────────────────

interface WorldHeaderProps {
  world: World;
  label: string;
  icon: string;
  accentClass: string;
  conqueredEmblems: number;
  totalCategories: number;
  overallDominance: number;
  isOpen: boolean;
  onToggle: () => void;
}

function WorldHeader({
  label,
  icon,
  accentClass,
  conqueredEmblems,
  totalCategories,
  overallDominance,
  isOpen,
  onToggle,
}: WorldHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition-all duration-200 mb-2"
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1 text-left">
        <div className={`font-black text-base ${accentClass}`}>{label}</div>
        <div className="text-xs text-slate-400 mt-0.5">
          {conqueredEmblems}/{totalCategories} emblemas · {overallDominance}% domínio
        </div>
      </div>
      {/* Progresso de emblemas */}
      <div className="flex gap-1 items-center mr-1">
        {Array.from({ length: totalCategories }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < conqueredEmblems ? "bg-amber-400" : "bg-slate-600"
            }`}
          />
        ))}
      </div>
      <span className="text-slate-400 text-sm">{isOpen ? "▲" : "▼"}</span>
    </button>
  );
}

// ── componente principal ──────────────────────────────────────

export function StudyMapPage({
  progress,
  onBack,
  onTrainCategory,
  onReviewErrors,
}: StudyMapPageProps) {
  const [openWorlds, setOpenWorlds] = useState<Record<World, boolean>>({
    school: true,
    contest: true,
  });

  function toggleWorld(world: World) {
    setOpenWorlds((prev) => ({ ...prev, [world]: !prev[world] }));
  }

  const schoolCategories = getCategoriesByWorld("school");
  const contestCategories = getCategoriesByWorld("contest");
  const schoolStats = getWorldStats(progress, "school");
  const contestStats = getWorldStats(progress, "contest");

  const totalEmblems = progress.completedEmblems.length;
  const totalCategories = schoolCategories.length + contestCategories.length;

  return (
    <AppShell
      header={
        <Header
          progress={progress}
          title="Mapa de Estudos"
          subtitle="Acompanhe seu progresso por matéria"
          onBack={onBack}
        />
      }
    >
      {/* Resumo global */}
      <Card className="p-4 mb-5" glow>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">
          📊 Visão Geral
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-amber-400 font-black text-xl">
              {totalEmblems}
              <span className="text-slate-400 text-xs font-normal">/{totalCategories}</span>
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Emblemas</div>
          </div>
          <div className="border-x border-slate-700/50">
            <div className="text-emerald-400 font-black text-xl">
              {progress.totalCorrect}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Total Acertos</div>
          </div>
          <div>
            <div className="text-rose-400 font-black text-xl">
              {progress.wrongQuestionIds.length}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Para Revisar</div>
          </div>
        </div>
      </Card>

      {/* ── Mundo Escola ── */}
      <WorldHeader
        world="school"
        label="Mundo Escola"
        icon="🏫"
        accentClass="text-blue-400"
        conqueredEmblems={schoolStats.conqueredEmblems}
        totalCategories={schoolStats.totalCategories}
        overallDominance={schoolStats.overallDominance}
        isOpen={openWorlds.school}
        onToggle={() => toggleWorld("school")}
      />

      {openWorlds.school && (
        <div className="mb-4">
          {schoolCategories.map((cat) => {
            const stats = getCategoryStats(progress, cat.id);
            return (
              <CategoryCard
                key={cat.id}
                categoryId={cat.id}
                icon={cat.icon}
                name={cat.name}
                colorToken={cat.colorToken}
                textClass={cat.textClass}
                stats={stats}
                onTrain={() => onTrainCategory("school", cat.id)}
                onReview={() => onReviewErrors("school")}
              />
            );
          })}
        </div>
      )}

      {/* ── Mundo Concurso ── */}
      <WorldHeader
        world="contest"
        label="Mundo Concurso"
        icon="🎯"
        accentClass="text-amber-400"
        conqueredEmblems={contestStats.conqueredEmblems}
        totalCategories={contestStats.totalCategories}
        overallDominance={contestStats.overallDominance}
        isOpen={openWorlds.contest}
        onToggle={() => toggleWorld("contest")}
      />

      {openWorlds.contest && (
        <div className="mb-4">
          {contestCategories.map((cat) => {
            const stats = getCategoryStats(progress, cat.id);
            return (
              <CategoryCard
                key={cat.id}
                categoryId={cat.id}
                icon={cat.icon}
                name={cat.name}
                colorToken={cat.colorToken}
                textClass={cat.textClass}
                stats={stats}
                onTrain={() => onTrainCategory("contest", cat.id)}
                onReview={() => onReviewErrors("contest")}
              />
            );
          })}
        </div>
      )}

      {/* Emblemas conquistados */}
      {totalEmblems > 0 && (
        <Card className="p-4 mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">
            🏆 Emblemas Conquistados
          </p>
          <div className="flex flex-wrap gap-2">
            {progress.completedEmblems.map((id) => {
              const cat = [...schoolCategories, ...contestCategories].find(
                (c) => c.id === id
              );
              return (
                <span
                  key={id}
                  className="text-xs bg-amber-900/40 text-amber-300 border border-amber-800 rounded-full px-3 py-1 font-semibold flex items-center gap-1.5"
                >
                  <span>{cat?.icon ?? "🏅"}</span>
                  <span>{cat?.emblemName ?? id}</span>
                </span>
              );
            })}
          </div>
        </Card>
      )}

      <p className="text-center text-slate-400 text-xs mt-2">
        Treino por matéria · progresso salvo localmente
      </p>
    </AppShell>
  );
}
