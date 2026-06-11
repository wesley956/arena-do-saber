import { PlayerProgress } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

interface AboutPageProps {
  progress: PlayerProgress;
  onBack: () => void;
  onPrivacy: () => void;
}

export function AboutPage({ progress, onBack, onPrivacy }: AboutPageProps) {
  return (
    <AppShell
      header={
        <Header
          progress={progress}
          title="Sobre"
          subtitle="Arena do Saber · Beta"
          onBack={onBack}
        />
      }
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-3 pb-8 sm:px-4">
        <Card className="p-5 sm:p-6">
          <p className="mb-3 inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-violet-200">
            Versão Beta
          </p>
          <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl">
            Arena do Saber
          </h1>
          <p className="mt-3 leading-relaxed text-slate-300">
            O Arena do Saber é um jogo educacional de perguntas e respostas com
            foco em aprendizado. Ele combina roleta, insígnias, desafios e treino
            inteligente para ajudar estudantes em conteúdos escolares e em
            preparação para concursos.
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="text-lg font-black text-white">🎓 Como funciona</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
              <li>• Mundo Escola e Mundo Concurso.</li>
              <li>• Partida Clássica com roleta e Insígnias de Sabedoria.</li>
              <li>• Desafio da Insígnia com combo de 3 perguntas.</li>
              <li>• Treino Solo para estudar no seu ritmo.</li>
              <li>• Caderno de Resolução para anotar raciocínios.</li>
            </ul>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-black text-white">📲 PWA / APK</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              O jogo foi preparado para funcionar como PWA instalável. Depois do
              deploy, ele pode ser aberto no navegador e instalado no celular
              como aplicativo. A versão Android/APK também usa os dados locais do
              dispositivo para manter o progresso.
            </p>
          </Card>
        </div>

        <Card className="p-5">
          <h2 className="text-lg font-black text-white">🔐 Dados locais</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Nesta fase, o Arena do Saber não usa login nem backend. O progresso,
            histórico de treino e anotações ficam salvos localmente no navegador
            ou no app instalado.
          </p>
          <div className="mt-4">
            <Button variant="secondary" onClick={onPrivacy}>
              Ver Política de Privacidade
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-black text-white">✨ Créditos</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Projeto criado como um MVP jogável de quiz educacional, com foco em
            diversão, estudo e evolução contínua. Conteúdo e mecânicas foram
            organizados para testes públicos em fase beta.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
