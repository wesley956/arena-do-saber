import { useMemo, useState } from "react";
import { PlayerProgress } from "../types/game";
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
  onBack: () => void;
}

const TEST_CHECKLIST = [
  "Abrir o app e passar pelo tutorial inicial.",
  "Entrar na Partida Clássica e girar a roleta.",
  "Responder pelo menos uma pergunta certa e uma errada.",
  "Testar o Desafio da Insígnia quando aparecer.",
  "Abrir o Treino Solo e trocar de matéria.",
  "Abrir o Mapa de Estudos.",
  "Abrir a Coleção de Insígnias.",
  "Abrir a Revisão dos Erros.",
  "Fechar e abrir o app de novo para conferir se o progresso salvou.",
];

export function BetaFeedbackPage({ progress, onBack }: BetaFeedbackPageProps) {
  const [copied, setCopied] = useState(false);

  const feedbackTemplate = useMemo(
    () => `Arena do Saber — Feedback do Beta
Versão: ${APP_VERSION}
Build: ${APP_BUILD_LABEL}
Canal: ${APP_CHANNEL}
Data do build: ${APP_RELEASE_DATE}

Celular/modelo:
Android:
Tela onde aconteceu:
O que eu estava fazendo:
O que aconteceu:
O que eu esperava:
Conseguiu repetir o erro? Sim/Não

Print ou vídeo, se tiver:
`,
    []
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

  return (
    <AppShell
      header={
        <Header
          progress={progress}
          title="Feedback do Beta"
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
              <h1 className="text-xl font-black text-white">
                Teste público do Arena do Saber
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Use esta tela para orientar quem vai testar o app e copiar uma
                mensagem pronta para enviar o feedback.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
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
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-black text-white">
            O que testar
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
            className="mt-4 min-h-72 w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-3 text-sm leading-relaxed text-slate-200 outline-none focus:border-violet-400"
            value={feedbackTemplate}
            readOnly
          />
        </Card>
      </div>
    </AppShell>
  );
}
