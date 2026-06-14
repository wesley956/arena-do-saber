# Checklist do Beta Público — Arena do Saber

Este checklist resume o estado atual do Arena do Saber para testes com amigos e usuários reais.

## Status atual

- Versão: 0.1.1-beta
- Tipo: beta jogável local
- Persistência: localStorage
- Conta online: ainda não possui
- Backend: ainda não possui
- Banco de perguntas: 180 perguntas validadas automaticamente
- Plataformas-alvo: navegador, PWA instalável e Android via Capacitor

## Funcionalidades prontas para teste

- Home com jornada recomendada
- Onboarding inicial
- Partida Clássica com roleta
- Insígnias de Sabedoria
- Desafio da Insígnia com combo de 3 perguntas
- Bot local com personalidades
- Treino Solo por matéria
- Treino Solo com histórico persistente e opção de continuar treinando
- Mapa de Estudos
- Caderno de Resolução
- Revisão dos Erros
- Duelo Rápido local
- Perfil com estatísticas, conquistas e próximas metas
- Tela Sobre / Créditos
- Política de Privacidade simples
- Tela de feedback beta
- PWA instalável
- Estrutura Android/Capacitor

## Pontos para observar nos testes

- Se a navegação está clara no celular
- Se o jogador entende o objetivo da Partida Clássica
- Se o Desafio da Insígnia aparece no momento certo
- Se o Treino Solo parece útil para estudar
- Se o Caderno de Resolução ajuda ou atrapalha
- Se as missões do dia motivam a voltar
- Se o bot parece divertido ou injusto
- Se as telas cabem bem em celular pequeno
- Se os textos estão claros para crianças, estudantes e concurseiros
- Se algum botão fica escondido ou difícil de tocar

## Limitações conhecidas desta versão

- O progresso fica salvo somente no dispositivo atual.
- Não há login, sincronização online ou ranking global.
- O app ainda não tem trilhas completas para alfabetização, fundamental, faculdade ou editais específicos.
- O banco de perguntas já está validado, mas ainda pode crescer por faixa etária e objetivo.
- O APK final de distribuição ainda deve ser gerado apenas depois do teste beta no navegador/PWA.

## Antes de gerar APK

- Rodar `npm run verify`
- Testar no celular pelo navegador
- Testar instalação como PWA
- Testar Partida Clássica completa
- Testar Treino Solo com continuidade
- Testar Revisão dos Erros
- Testar reset de progresso
- Conferir política de privacidade
- Conferir nome, ícone e versão do app
