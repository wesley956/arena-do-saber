import { useMemo, useState } from "react";
import { PlayerProgress } from "../types/game";
import { LocalPlayerProfile } from "../types/playerProfile";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  APP_BUILD_LABEL,
  APP_CHANNEL,
  APP_RELEASE_DATE,
  APP_VERSION,
} from "../lib/appVersion";

interface BetaFeedbackPageProps {
  progress: PlayerProgress;
  profile: LocalPlayerProfile | null;
  onBack: () => void;
  onJourney: () => void;
}

const ONBOARDING_STORAGE_KEY = "arena-do-saber:onboarding-seen";

const TEST_CHECKLIST = [
  "Abrir o app como se fosse a primeira vez e ver o onboarding.",
  "Criar ou editar a Minha Jornada.",
  "Conferir se a Home mostra o Caminho recomendado.",
  "Abrir o menu lateral e testar Perfil, Jornada e Trilhas Futuras.",
  "Entrar na Partida Clássica pela Home.",
  "Entrar no Treino Solo pela Home.",
  "Responder uma pergunta certa e uma errada.",
  "Testar a Coleção de Insígnias.",
  "Abrir o Mapa de Estudos.",
  "Abrir a Revisão dos Erros.",
  "Fechar e abrir o app de novo para conferir se o progresso salvou.",
];

function getJourneySummary(profile: LocalPlayerProfile | null) {
  if (!profile) {
    return "Jornada ainda não definida.";
  }

  if (profile.goal === "literacy") {
    return `${profile.nickname} · Alfabetização`;
  }

  if (profile.goal === "school") {
    if (profile.studyStage === "fundamental1") {
      return `${profile.nickname} · Escola · Fundamental I`;
    }

    if (profile.studyStage === "fundamental2") {
      return `${profile.nickname} · Escola · Fundamental II`;
    }

    if (profile.studyStage === "highSchool") {
      return `${profile.nickname} · Escola · Ensino Médio`;
    }

    return `${profile.nickname} · Escola`;
  }

  if (profile.goal === "contest") {
    if (profile.contestTrack === "pm") {
      return `${profile.nickname} · Concurso · Polícia Militar`;
    }

    if (profile.contestTrack === "gcm") {
      return `${profile.nickname} · Concurso · Guarda Municipal`;
    }

    if (profile.contestTrack === "cityHall") {
      return `${profile.nickname} · Concurso · Prefeitura`;
    }

    if (profile.contestTrack === "bank") {
      return `${profile.nickname} · Concurso · Banco`;
    }

    if (profile.contestTrack === "administrative") {
      return `${profile.nickname} · Concurso · Administrativo`;
    }

    if (profile.contestTrack === "court") {
      return `${profile.nickname} · Concurso · Tribunal`;
    }

    return `${profile.nickname} · Concurso · Geral`;
  }

  return `${profile.nickname} · Conhecimentos gerais`;
}

export function BetaFeedbackPage({
  progress,
  profile,
  onBack,
  onJourney,
}: BetaFeedbackPageProps) {
  const [copied, setCopied] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const journeySummary = getJourneySummary(profile);

  const feedbackTemplate = useMemo(
    () => `Arena do Saber — Feedback do Beta
Versão: ${APP_VERSION}
Build: ${APP_BUILD_LABEL}
Canal: ${APP_CHANNEL}
Data do build: ${APP_RELEASE_DATE}

Jornada atual: ${journeySummary}
Nível: ${progress.level}
XP: ${progress.xp}
Acertos: ${progress.totalCorrect}
Erros salvos: ${progress.wrongQuestionIds.length}
Insígnias: ${progress.completedEmblems.length}

Celular/modelo:
Android:
Tela onde aconteceu:
O que eu estava fazendo:
O que aconteceu:
O que eu esperava:
Conseguiu repetir o erro? Sim/Não

Print ou vídeo, se tiver:
`,
    [journeySummary, progress]
  );

  async function copyFeedbackTemplate() {
    try {
      await navigator.clipboard.writeText(feedbackTemplate);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  function resetOnboarding() {
    try {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      setResetDone(true);
      window.setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch {
      setResetDone(false);
    }
  }

  return (
    <AppShell
      header={
        <Header
          progress={progress}
          title="Centro do Beta"
          subtitle={`${APP_VERSION} · ${APP_BUILD_LABEL}`}
          onBack={onBack}
        />
      }
    >
      <div className="space-y-4">
        <Card className="p-4 sm:p-5" glow>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-2xl">
              🧪
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-200">
                Teste público
              </p>
              <h1 className="mt-1 text-xl font-black text-white">
                Centro do Beta
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Use esta área para testar a versão atual, copiar um modelo de
                feedback e revisar a jornada do jogador.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Versão
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {APP_VERSION}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Build
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {APP_BUILD_LABEL}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Canal
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {APP_CHANNEL}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Data
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {APP_RELEASE_DATE}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-violet-400/25 bg-violet-950/15 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-violet-200">
            Jornada atual
          </p>

          <h2 className="mt-1 text-lg font-black text-white">
            {journeySummary}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Essa informação ajuda a testar se a Home, o Treino Solo e a Partida
            Clássica estão seguindo o objetivo escolhido pelo jogador.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button type="button" size="sm" onClick={onJourney}>
              Editar minha jornada
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={resetOnboarding}
            >
              {resetDone ? "Reabrindo tutorial..." : "Rever onboarding"}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-black text-white">
            Checklist do teste
          </h2>

          <div className="mt-3 space-y-2">
            {TEST_CHECKLIST.map((item, index) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/55 p-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-black text-violet-200">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-slate-300">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-white">
                Mensagem pronta para WhatsApp
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Copie, preencha e envie junto com print ou vídeo se encontrar
                algum problema.
              </p>
            </div>

            <Button variant="secondary" onClick={copyFeedbackTemplate}>
              {copied ? "Copiado!" : "Copiar modelo"}
            </Button>
          </div>

          <textarea
            className="mt-4 min-h-80 w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-3 text-sm leading-relaxed text-slate-200 outline-none focus:border-violet-400"
            value={feedbackTemplate}
            readOnly
          />
        </Card>

        <Card className="border-emerald-400/25 bg-emerald-950/15 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-200">
            Dados locais
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Nesta versão beta, progresso, jornada, erros e conquistas ficam
            salvos no próprio dispositivo. Ainda não existe conta online nem
            sincronização em nuvem.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
