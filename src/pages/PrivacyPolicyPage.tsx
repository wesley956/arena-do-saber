import { PlayerProgress } from "../types/game";
import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

interface PrivacyPolicyPageProps {
  progress: PlayerProgress;
  onBack: () => void;
  onHome: () => void;
}

export function PrivacyPolicyPage({
  progress,
  onBack,
  onHome,
}: PrivacyPolicyPageProps) {
  return (
    <AppShell
      header={
        <Header
          progress={progress}
          title="Política de Privacidade"
          subtitle="Dados locais · Versão Beta"
          onBack={onBack}
        />
      }
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-3 pb-8 sm:px-4">
        <Card className="p-5 sm:p-6">
          <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Esta política resume como o Arena do Saber trata dados nesta fase
            beta. O app foi pensado para funcionar sem cadastro e sem servidor.
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-black text-white">O que o app não coleta</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
            <li>• Não exige cadastro.</li>
            <li>• Não coleta nome, e-mail ou senha.</li>
            <li>• Não usa login, backend, Supabase ou Firebase nesta fase.</li>
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-black text-white">Dados salvos no dispositivo</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            O progresso do jogo, histórico do Treino Solo, conquistas e anotações
            do Caderno de Resolução podem ser salvos no próprio navegador ou app
            instalado usando armazenamento local, como <code>localStorage</code>.
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-black text-white">Como apagar os dados</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            O usuário pode limpar os dados pelo próprio navegador, apagando os
            dados do site, ou removendo/reinstalando o app instalado. Isso pode
            apagar progresso, histórico e anotações locais.
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-black text-white">Futuras versões</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Futuras versões podem incluir login, backup online ou recursos de
            sincronização. Caso isso aconteça, esta política deverá ser atualizada
            antes do uso desses recursos.
          </p>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={onBack}>
            Voltar para Sobre
          </Button>
          <Button variant="ghost" onClick={onHome}>
            Ir para Home
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
