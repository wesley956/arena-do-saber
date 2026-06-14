# Arena do Saber

> Um jogo educacional de quiz com roleta, insígnias, desafios e treino inteligente.

O **Arena do Saber** é um jogo de perguntas e respostas com foco em aprendizado. Ele combina a dinâmica divertida de jogos de trivia com recursos voltados para estudo escolar e preparação para concursos, criando uma experiência simples, motivadora e útil para revisar conteúdos por matéria.

O projeto está organizado em dois mundos principais: **Mundo Escola** e **Mundo Concurso**. Cada mundo possui categorias próprias, perguntas separadas por matéria, modos de jogo e ferramentas de apoio ao estudo.

---

## ✨ Funcionalidades principais

- 🎡 **Partida Clássica com roleta** para sortear categorias.
- 🏅 **Insígnias de Sabedoria** como objetivo principal da Partida Clássica.
- ⚔️ **Desafio da Insígnia** com combo de 3 perguntas.
- 🎯 **Treino Solo** por matéria/categoria.
- 🔁 **Ciclo inteligente de perguntas** no Treino Solo para reduzir repetições.
- 💾 **Histórico persistente do Treino Solo** usando \`localStorage\`.
- 🗺️ **Mapa de Estudos** para organizar o avanço do jogador.
- 📝 **Caderno de Resolução** para anotações, raciocínio e contas por questão.
- 🆚 **Duelo Rápido local** para partidas simples no mesmo dispositivo.
- 📚 **Banco com 180 perguntas** originais e separadas por mundo/matéria.
- ✅ **Validação automática do banco de perguntas** com \`npm run verify\`.

---

## 🌍 Mundos do jogo

### 🏫 Mundo Escola

Voltado para conteúdos escolares de base, com linguagem didática e perguntas úteis para revisão.

Categorias:

- Português
- Matemática
- Ciências
- História
- Geografia
- Inglês

### 🏛️ Mundo Concurso

Voltado para preparação inicial de concursos, com foco em raciocínio, interpretação, conhecimentos gerais e rotina administrativa.

Categorias:

- Português
- Matemática / Raciocínio Lógico
- Informática
- Atualidades
- Legislação / Direito
- Conhecimentos Específicos

---

## 🎡 Como funciona a Partida Clássica

A **Partida Clássica** é o modo principal do jogo. Ela usa uma roleta de categorias e transforma o progresso do jogador em uma missão: conquistar todas as **Insígnias de Sabedoria** do mundo escolhido.

Fluxo da partida:

1. O jogador escolhe um mundo.
2. A roleta sorteia uma categoria.
3. O jogador responde uma pergunta da categoria sorteada.
4. Cada acerto aumenta o progresso naquela categoria.
5. Ao atingir \`3/3\`, o **Desafio da Insígnia** é liberado.
6. O desafio tem 3 perguntas da mesma categoria.
7. Acertando 2 ou 3 perguntas, o jogador conquista a insígnia.
8. Ao conquistar as 6 insígnias do mundo, vence a partida.

A ideia é deixar a Partida Clássica com um objetivo claro, mantendo o ritmo de quiz com roleta e adicionando uma camada de conquista por matéria.

---

## 🏅 Insígnias de Sabedoria

Cada categoria do mundo escolhido representa uma insígnia.

Estados possíveis de uma categoria:

- \`0/3\` — ainda sem progresso.
- \`1/3\` — progresso inicial.
- \`2/3\` — quase liberando o desafio.
- \`Desafio liberado\` — o jogador já acumulou 3 acertos e pode tentar conquistar a insígnia.
- \`Conquistada\` — o jogador venceu o desafio da categoria.

A regra principal é simples: primeiro o jogador domina a categoria com 3 acertos, depois precisa provar esse domínio no Desafio da Insígnia.

---

## ⚔️ Desafio da Insígnia

O **Desafio da Insígnia** é liberado quando o jogador chega a \`3/3\` em uma categoria da Partida Clássica.

Regras:

- O desafio possui 3 perguntas da mesma categoria.
- O jogador precisa acertar pelo menos 2 de 3.
- \`2/3\` ou \`3/3\` conquista a insígnia.
- \`0/3\` ou \`1/3\` falha o desafio, mas o progresso da categoria continua em \`3/3\`.
- Se falhar, o jogador pode tentar novamente depois.

Mensagens de resultado:

- \`3/3\`: **Desafio perfeito! Insígnia conquistada!**
- \`2/3\`: **Desafio vencido! Insígnia conquistada!**
- \`1/3\`: **Quase! Você precisa acertar pelo menos 2. Tente novamente.**
- \`0/3\`: **A insígnia escapou desta vez. Continue tentando.**

---

## 🎯 Como funciona o Treino Solo

O **Treino Solo** é um modo de estudo por matéria, ideal para praticar sem pressão de vitória ou derrota.

Principais características:

- O jogador escolhe uma categoria/matéria.
- As perguntas são selecionadas em ciclo para evitar repetição excessiva.
- O histórico de perguntas vistas é salvo em \`localStorage\`.
- Ao voltar ao jogo em outra sessão, o Treino Solo tenta priorizar perguntas ainda não vistas naquela categoria.
- Quando todas ou quase todas as perguntas já foram vistas, o ciclo pode recomeçar com segurança.

Esse modo é ideal para revisar conteúdos, testar conhecimento e estudar no próprio ritmo.

---

## 📝 Caderno de Resolução

O **Caderno de Resolução** permite que o jogador registre seu raciocínio por pergunta.

Ele pode ser usado para:

- escrever contas;
- anotar ideias;
- explicar o próprio raciocínio;
- registrar dúvidas;
- revisar como chegou a uma resposta.

Esse recurso ajuda a transformar o quiz em uma ferramenta real de estudo, não apenas em uma sequência de acertos e erros.

---

## 📚 Banco de perguntas

O projeto possui um banco inicial com **180 perguntas**.

Distribuição geral:

| Mundo | Total de perguntas |
|---|---:|
| Mundo Escola | 90 |
| Mundo Concurso | 90 |
| **Total** | **180** |

Cada uma das 12 categorias possui **15 perguntas**.

Distribuição ideal por categoria:

| Dificuldade | Quantidade ideal |
|---|---:|
| Fácil | 5 |
| Média | 6 |
| Difícil | 4 |

As perguntas são organizadas em arquivos separados por mundo e matéria dentro de \`src/data/questionBank/\`.

---

## ✅ Validação automática

O projeto possui validação automática para manter a qualidade do banco de perguntas.

O validador verifica, entre outros pontos:

- IDs duplicados;
- categorias inválidas;
- mundos inválidos;
- alternativa correta inexistente;
- quantidade de alternativas por pergunta;
- quantidade mínima de perguntas por categoria;
- explicações obrigatórias;
- explicações curtas demais;
- distribuição por dificuldade;
- estatísticas por mundo e categoria.

Para rodar a validação completa:

\`\`\`bash
npm run verify
\`\`\`

Esse comando deve executar a verificação de tipos, a validação das perguntas e o build do projeto.

---

## 🧰 Tecnologias

- **React** — construção da interface.
- **TypeScript** — tipagem estática e segurança no desenvolvimento.
- **Vite** — ambiente de desenvolvimento e build rápido.
- **TailwindCSS** — estilização utilitária.
- **LocalStorage** — persistência local do histórico do Treino Solo.
- **Node.js / npm** — gerenciamento de dependências e scripts.

---

## 🚀 Como rodar localmente

Instale as dependências:

\`\`\`bash
npm install
\`\`\`

Inicie o servidor de desenvolvimento:

\`\`\`bash
npm run dev
\`\`\`

Valide o projeto:

\`\`\`bash
npm run verify
\`\`\`

Gere o build de produção:

\`\`\`bash
npm run build
\`\`\`

---

## 🗂️ Estrutura do projeto

Visão geral das principais pastas:

\`\`\`txt
src/pages/              Páginas principais do jogo
src/components/         Componentes reutilizáveis da interface
src/data/questionBank/  Banco de perguntas separado por mundo e matéria
src/lib/                Regras, seletores, engine e utilitários
scripts/                Scripts de validação e automação
\`\`\`

Arquivos e áreas importantes:

- \`src/pages/ClassicGamePage.tsx\` — Partida Clássica, roleta, insígnias e desafios.
- \`src/pages/SoloTrainingPage.tsx\` — Treino Solo por categoria.
- \`src/lib/questionSelector.ts\` — seleção de perguntas e ciclo inteligente.
- \`src/lib/soloTrainingHistory.ts\` — histórico persistente do Treino Solo.
- \`scripts/validate-questions.mjs\` — validação automática do banco de perguntas.

---

## 📌 Status do projeto

O **Arena do Saber** está em fase de **beta jogável e polido**, com o núcleo principal funcionando:

- modos de jogo ativos;
- banco inicial estruturado;
- validação automática;
- progressão por insígnias;
- treino inteligente;
- ferramentas de apoio ao estudo.

O projeto já possui uma base sólida para testes com usuários, expansão de conteúdo e evolução visual.

---

## 🛣️ Próximos passos possíveis

Ideias para evolução do projeto:

- Fazer deploy no **Vercel**.
- Expandir o banco de perguntas.
- Adicionar ranking local.
- Melhorar animações e feedback visual.
- Criar mais desafios e modos de revisão.

---

## 📄 Licença

Este projeto ainda não possui uma licença definida no repositório. Antes de distribuir publicamente, escolha uma licença compatível com o objetivo do projeto.

## PWA / App instalável

O Arena do Saber agora possui suporte básico a PWA. Após o deploy, por exemplo no Vercel, o jogo pode ser aberto pelo navegador e instalado no celular como aplicativo.

O suporte inclui:

- manifest em `public/manifest.webmanifest`;
- ícones em `public/icons/`;
- service worker em `public/sw.js`;
- registro seguro do service worker apenas em build de produção;
- botão discreto "Instalar app" quando o navegador disponibilizar o evento de instalação.

Para testar localmente o build de produção:

```bash
npm run build
npm run preview
```

## 🧪 Polimento pré-beta

Esta versão inclui ajustes de preparação para testes públicos:

- onboarding inicial exibido apenas no primeiro acesso;
- tela **Sobre o Arena do Saber**;
- tela **Política de Privacidade** simples;
- microcopy mais clara na Home;
- indicação de **Versão Beta**;
- melhorias leves de responsividade e toque em botões/cards;
- ajustes básicos de acessibilidade, como foco visível e nomes acessíveis em botões;
- reforço de que o progresso fica salvo localmente no dispositivo.

### Gerar APK debug

Após sincronizar o Capacitor/Android, o APK debug pode ser gerado com:

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

O APK geralmente fica em:

```txt
android/app/build/outputs/apk/debug/
```

## Checklist de Teste Beta

Use este roteiro ao enviar o APK ou PWA para amigos testarem:

1. Abrir o app e passar pelo onboarding inicial.
2. Conferir se a Home aparece com os botões compactos.
3. Abrir a Coleção de Insígnias.
4. Entrar na Partida Clássica.
5. Escolher Mundo Escola e girar a roleta.
6. Responder pelo menos uma pergunta certa e uma errada.
7. Testar o Desafio da Insígnia quando ele aparecer.
8. Entrar no Mundo Concurso e repetir uma rodada rápida.
9. Abrir o Treino Solo e trocar de matéria.
10. Abrir o Mapa de Estudos.
11. Abrir a Revisão dos Erros.
12. Fechar e abrir o app novamente para conferir se o progresso local foi salvo.

Modelo de feedback para testers:

Arena do Saber — Feedback do Beta
Versão:
Celular/modelo:
Android:
Tela onde aconteceu:
O que eu estava fazendo:
O que aconteceu:
O que eu esperava:
Conseguiu repetir o erro? Sim/Não
Print ou vídeo, se tiver:
---

## ✅ Fechamento pré-beta — 0.1.1-beta

O **Arena do Saber** está preparado para uma rodada de testes públicos controlados com amigos e usuários reais.

Principais melhorias aplicadas nesta fase:

- onboarding inicial com jornada personalizada;
- tela Sobre / Créditos;
- política de privacidade simples;
- PWA instalável;
- suporte Android/Capacitor;
- hardening das chaves de `localStorage` com migração de dados antigos;
- ajustes mobile com `safe-area` para celulares com notch/barra de gesto;
- acessibilidade básica em cards clicáveis, modal e animações reduzidas;
- bot local com personalidades;
- missão do dia na Home;
- Duelo Rápido com resultado do bot;
- Treino Solo com opção de continuar treinando;
- Perfil com progressão visual, próximas metas e conquistas;
- checklist de beta público em `docs/BETA_PUBLICO_CHECKLIST.md`.

Para validar tudo antes de publicar ou gerar APK:

```bash
npm run verify
```

