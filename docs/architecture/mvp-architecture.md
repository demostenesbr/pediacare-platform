# MVP Architecture

## Objetivo

Demonstrar uma plataforma de conteudo assistida por agentes de IA com stack fullstack:

- Backend: NestJS API com CRUD e DTOs
- Frontend: Next.js website e admin
- Mobile: Expo app consumindo o mesmo backend
- AI: fluxo de orquestracao em `ai/orchestrator/workflow.yaml`
- Infra: Docker Compose e manifests Kubernetes

## Fluxo

1. Usuario cria conteudo na API (`POST /content`)
2. Website e Admin consultam conteudos (`GET /content`)
3. Mobile lista os mesmos conteudos
4. Pipeline de agentes processa rascunho para publicacao

## Servicos principais

- API: `apps/api`
- Website: `apps/website`
- Admin: `apps/admin`
- Mobile: `apps/mobile`
- AI Core: `packages/ai-core`
