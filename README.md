# pediacare-platform

MVP fullstack para demonstrar desenvolvimento de software com suporte a agentes de IA, CRUDs, DTOs, APIs e infraestrutura de deploy.

## Servicos

- `apps/api`: NestJS API com CRUD de conteudo, DTOs, validacao e Swagger
- `apps/website`: front-end publico em Next.js consumindo a API
- `apps/admin`: painel administrativo em Next.js consumindo a API
- `apps/mobile`: cliente mobile minimo em Expo/React Native
- `packages/ai-core`: pipeline simples de orquestracao de agentes
- `ai/orchestrator/workflow.yaml`: definicao declarativa do fluxo de agentes

## Executar localmente

### API

```bash
cd apps/api
npm install
npm run start:dev
```

Endpoints:

- `http://localhost:3000/health`
- `http://localhost:3000/api/docs`

### Website

```bash
cd apps/website
npm install
set NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
npm run dev
```

### Admin

```bash
cd apps/admin
npm install
set NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
npm run dev
```

### Mobile

```bash
cd apps/mobile
npm install
set EXPO_PUBLIC_API_URL=http://localhost:3000
npm run start
```

## Infraestrutura

- Docker Compose: `infrastructure/docker/docker-compose.yml`
- Kubernetes: `infrastructure/kubernetes/*.yaml`

## Documentacao

- Arquitetura: `docs/architecture/mvp-architecture.md`
- API: `docs/api/mvp-endpoints.md`
- Deployment: `docs/deployment/local-and-k8s.md`
- Publicacao LinkedIn/Medium: `docs/deployment/linkedin-medium-playbook.md`
- Prompt engineering: `docs/prompt-engineering/agent-prompts.md`
- ADR: `docs/adr/0001-mvp-stack.md`
