import { AppShell } from "../components/layout/AppShell";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PlayerProgress } from "../types/game";
import { LocalPlayerProfile } from "../types/playerProfile";

interface LearningTracksPageProps {
  progress: PlayerProgress;
  profile: LocalPlayerProfile | null;
  onBack: () => void;
  onJourney: () => void;
  onStartSchool: () => void;
  onStartContest: () => void;
}

const tracks = [
  {
    icon: "🔤",
    title: "Alfabetização",
    status: "Planejada",
    description:
      "Trilha futura para letras, sons, sílabas, primeiras palavras, contagem, formas e cores.",
    details: [
      "Atividades mais visuais",
      "Perguntas com leitura simples",
      "Conteúdo adequado para crianças pequenas",
    ],
    tone: "border-sky-400/30 bg-sky-950/20",
  },
  {
    icon: "📚",
    title: "Ensino Fundamental I",
    status: "Planejada",
    description:
      "Base escolar do 1º ao 5º ano, com foco em leitura, interpretação, contas simples e ciências básicas.",
    details: [
      "Português inicial",
      "Matemática base",
      "Ciências e mundo ao redor",
    ],
    tone: "border-emerald-400/30 bg-emerald-950/20",
  },
  {
    icon: "🧩",
    title: "Ensino Fundamental II",
    status: "Base atual aproveitável",
    description:
      "Conteúdos do 6º ao 9º ano podem evoluir a partir do Mundo Escola já existente.",
    details: [
      "Mais níveis de dificuldade",
      "Mais categorias por série",
      "Treino por matéria",
    ],
    tone: "border-violet-400/30 bg-violet-950/20",
  },
  {
    icon: "🎓",
    title: "Ensino Médio / Vestibular",
    status: "Futuro",
    description:
      "Preparação para provas escolares, vestibulares e futuramente ENEM, com trilhas mais profundas.",
    details: [
      "Simulados maiores",
      "Assuntos por área",
      "Revisão por desempenho",
    ],
    tone: "border-indigo-400/30 bg-indigo-950/20",
  },
  {
    icon: "🎯",
    title: "Concursos direcionados",
    status: "Próxima grande expansão",
    description:
      "Em vez de perguntas soltas, o jogador escolhe o concurso e treina de acordo com a trilha.",
    details: [
      "PM, GCM, Prefeitura, Banco e Tribunais",
      "Matérias por edital",
      "Simulados e revisão dos erros",
    ],
    tone: "border-amber-400/30 bg-amber-950/20",
  },
  {
    icon: "🏛️",
    title: "Faculdade",
    status: "Futuro distante",
    description:
      "Uma expansão maior, para conteúdos técnicos e universitários. Deve vir só depois da base estar madura.",
    details: [
      "Trilhas por curso",
      "Conteúdo avançado",
      "Modo de estudo mais profundo",
    ],
    tone: "border-slate-500/30 bg-slate-900/70",
  },
];

function getProfileSummary(profile: LocalPlayerProfile | null) {
  if (!profile) {
    return "Você ainda pode definir sua jornada para o app recomendar melhor os caminhos.";
  }

  if (profile.goal === "literacy") {
    return "Sua jornada atual está apontada para alfabetização. Essa trilha será preparada em fases futuras.";
  }

  if (profile.goal === "contest") {
    return "Sua jornada atual está apontada para concursos. Essa é uma das próximas expansões mais importantes.";
  }

  if (profile.goal === "school") {
    return "Sua jornada atual está apontada para estudo escolar. O Mundo Escola atual já é a base dessa evolução.";
  }

  return "Sua jornada atual está em conhecimentos gerais, usando o app como treino amplo.";
}

export function LearningTracksPage({
  progress,
  profile,
  onBack,
  onJourney,
  onStartSchool,
  onStartContest,
}: LearningTracksPageProps) {
  return (
    <AppShell
      header={
        <Header
          progress={progress}
          title="Trilhas Futuras"
          subtitle="Expansão planejada do Arena do Saber"
          onBack={onBack}
        />
      }
    >
      <div className="space-y-4 pb-8">
        <Card className="overflow-hidden p-0" glow>
          <div className="relative p-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.24),transparent_60%)]" />

            <div className="relative flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-violet-500/15 text-3xl shadow-xl shadow-violet-950/30">
                🗺️
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wide text-violet-200">
                  Plano de expansão
                </p>
                <h1 className="mt-1 text-2xl font-black leading-tight text-white">
                  O Arena do Saber vai crescer por jornadas
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Esta área prepara o app para alfabetização, escola, concursos
                  direcionados e, no futuro, faculdade — sem quebrar a base atual.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-400/25 bg-emerald-950/15 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-200">
            Sua jornada atual
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            {getProfileSummary(profile)}
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button type="button" size="sm" onClick={onJourney}>
              Editar minha jornada
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={onStartSchool}>
              Treinar escola
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={onStartContest}>
              Treinar concurso
            </Button>
          </div>
        </Card>

        <section className="grid gap-3">
          {tracks.map((track) => (
            <Card key={track.title} className={`p-4 ${track.tone}`}>
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950/70 text-2xl">
                  {track.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-black leading-tight text-white">
                      {track.title}
                    </h2>
                    <span className="w-fit rounded-full border border-slate-600 bg-slate-950/60 px-3 py-1 text-xs font-black text-slate-200">
                      {track.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {track.description}
                  </p>

                  <div className="mt-3 grid gap-2">
                    {track.details.map((detail) => (
                      <div
                        key={detail}
                        className="rounded-2xl border border-slate-800 bg-slate-950/35 px-3 py-2 text-sm font-bold text-slate-300"
                      >
                        ✦ {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
