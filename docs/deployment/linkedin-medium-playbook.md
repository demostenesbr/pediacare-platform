# Playbook de Publicacao (LinkedIn + Medium)

## Objetivo

Publicar um artigo tecnico curto no LinkedIn e uma versao estendida no Medium com base no MVP da plataforma.

## Estrutura para LinkedIn

1. Gancho inicial (problema real em 1 frase)
2. Resumo da solucao em 3 bullets
3. Evidencia tecnica (API, DTO, Swagger, Docker/K8s)
4. CTA para leitura da versao completa no Medium

### Modelo pronto (LinkedIn)

Hoje finalizei um MVP fullstack para conteudo com agentes de IA.

- API NestJS com CRUD, DTO e Swagger
- Website/Admin em Next.js consumindo a mesma API
- Infra pronta com Docker Compose e Kubernetes

Tambem deixei um fluxo de agentes para padronizar conteudo entre LinkedIn e Medium.

Se quiser, compartilho o repositório e o passo a passo tecnico completo.

## Estrutura para Medium

1. Contexto e problema
2. Arquitetura do MVP
3. Backend: validacao, versionamento e persistencia Prisma
4. Frontend e mobile
5. Infra de execucao e deploy
6. Aprendizados e proximos passos

## Evidencias para print/screenshot

- Swagger em /api/docs
- Website listando conteudos
- Admin com totais por canal
- docker compose up com 3 servicos
- manifests Kubernetes aplicados

## Checklist antes de publicar

- Validar testes (unit + e2e) da API
- Revisar tom e ortografia
- Garantir que exemplos de endpoint batem com a OpenAPI
- Incluir link para docs tecnicos do repo
