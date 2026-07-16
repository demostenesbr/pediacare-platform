# Anatomia de um Monorepo com IA em Produção: decisões, trade-offs e código

*Uma análise técnica de como estruturar um monorepo que combina produto tradicional, agentes de IA/RAG e infraestrutura distribuída — usando a PediaCare Platform como estudo de caso.*

---

## Por que este artigo existe

Existe muito conteúdo sobre "como organizar um monorepo" e muito conteúdo sobre "como construir agentes de IA", mas pouco sobre a interseção dos dois: **como você estrutura um sistema onde a IA não é um apêndice, mas um domínio de primeira classe, com o mesmo rigor de versionamento, teste e deploy que qualquer outro serviço?**

Este artigo usa a estrutura da PediaCare Platform como estudo de caso e assume que você já conhece os conceitos básicos de monorepo, containers e CI/CD — o foco aqui é justificar decisões e mostrar como elas se traduzem em código e configuração real.

```
pediacare-platform/
apps/
├── website/                  # Next.js public site
├── admin/                    # Next.js admin portal
├── api/                      # NestJS REST API
├── ai-service/               # AI agents and RAG
├── worker/                   # Queues and scheduled jobs
└── notification-service/     # Email, SMS, push
packages/
├── ui/  ├── auth/  ├── api-client/  ├── ai-core/  ├── prompts/
├── validation/  ├── shared/  ├── types/  ├── config/  └── logger/
database/
├── prisma/  └── seed/
infrastructure/
├── docker/  ├── kubernetes/  ├── terraform/  ├── monitoring/  └── github-actions/
docs/
├── architecture/  ├── api/  ├── prompt-engineering/  ├── deployment/  └── adr/
scripts/
```

---

## 1. A escolha do monorepo não é sobre pastas, é sobre *build graph*

A decisão que mais afeta produtividade de longo prazo não é "colocar tudo numa pasta só" — é ter uma ferramenta que entenda o **grafo de dependências** entre `apps/` e `packages/` (Nx, Turborepo ou Bazel).

Sem isso, um monorepo grande vira um monolito de build: qualquer mudança dispara rebuild e testes de tudo. Com um grafo de dependências explícito, você ganha:

```jsonc
// turbo.json (exemplo simplificado)
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.ts", "test/**/*.ts"]
    }
  }
}
```

Isso permite que o CI rode `turbo run test --filter=...[HEAD^1]` — ou seja, **testa apenas o que mudou e o que depende do que mudou**. Se você alterar `packages/validation`, o Turborepo sabe que `api`, `admin` e `ai-service` dependem dele e os inclui no pipeline; se você alterar só `apps/website`, nada mais é tocado.

Esse é o critério técnico real para decidir monorepo vs. multi-repo: **a existência (ou não) de reuso pesado de lógica entre apps**. Se `packages/types`, `packages/validation` e `packages/auth` são consumidos por 4+ aplicações, o custo de sincronizar versões entre repositórios separados supera o custo de ferramenta de build incremental.

---

## 2. Fronteiras de domínio dentro de `apps/`

Cada pasta em `apps/` representa um *deployment unit* independente — isso importa porque define o **blast radius** de uma falha.

```typescript
// apps/api/src/app.module.ts — exemplo de composição de módulos NestJS
@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    AuthModule,           // consome packages/auth
    PatientsModule,
    AppointmentsModule,
    IntegrationModule,    // chama ai-service via api-client
  ],
})
export class AppModule {}
```

Note que a `api` **não importa `ai-core` diretamente** — ela se comunica com `ai-service` via `packages/api-client`, tipicamente sobre HTTP ou uma fila. Essa é uma decisão deliberada: chamadas a LLMs têm latência e taxa de erro muito diferentes de uma query SQL. Se `ai-service` cair ou ficar lento, isso não pode travar threads da API principal — daí o desacoplamento via rede/fila em vez de import direto.

```typescript
// packages/api-client/src/ai.client.ts
export class AiServiceClient {
  async summarizePatientHistory(patientId: string): Promise<Summary> {
    return this.http.post('/agents/summarize', { patientId }, {
      timeout: 8000,
      retries: 2,
    });
  }
}
```

Timeout explícito, retries limitados — porque um agente de IA que "trava" não pode derrubar o restante do sistema.

---

## 3. `ai-service`: RAG como pipeline, não como prompt gigante

O erro mais comum em sistemas de IA "colados" em cima de um produto existente é tratar RAG como "um prompt bem grande com contexto colado". Na estrutura da PediaCare, RAG é um pipeline com etapas testáveis:

```typescript
// apps/ai-service/src/agents/clinical-summary.agent.ts
export class ClinicalSummaryAgent {
  constructor(
    private retriever: VectorRetriever,   // packages/ai-core
    private llm: LlmGateway,              // packages/ai-core
    private promptRegistry: PromptRegistry, // packages/prompts
  ) {}

  async run(patientId: string) {
    const chunks = await this.retriever.query({
      namespace: 'patient-records',
      filter: { patientId },
      topK: 8,
    });

    const prompt = this.promptRegistry.get('clinical-summary-v3');
    return this.llm.complete(prompt.render({ chunks }));
  }
}
```

Três decisões arquiteturais importantes aqui:

1. **`VectorRetriever` e `LlmGateway` vivem em `packages/ai-core`**, não em `ai-service` diretamente — isso permite trocar de provedor de embeddings ou de modelo (ex.: de um modelo para outro) sem reescrever a lógica de agente.
2. **`PromptRegistry` versiona prompts como `clinical-summary-v3`** — não como string hardcoded. Isso possibilita rollback instantâneo se uma nova versão de prompt piorar a qualidade da saída, e permite rodar testes A/B entre v2 e v3.
3. **`topK: 8` e `filter: { patientId }` são parâmetros testáveis** — o pipeline de RAG deve ter testes de regressão que validam que o retriever devolve os chunks certos antes mesmo de chegar ao LLM. Bug de retrieval é a causa mais comum de "alucinação" percebida pelo usuário.

`docs/prompt-engineering/` deveria conter, no mínimo: o histórico de versões de cada prompt, os *eval sets* usados para validar mudanças, e os critérios de aceite (ex.: taxa de alucinação, taxa de resposta fora do escopo clínico).

---

## 4. Infraestrutura: por que Kubernetes + Terraform, e não "só Docker Compose"

Para uma aplicação com um único container, Docker Compose resolveria. A necessidade de Kubernetes aparece quando **serviços diferentes têm perfis de escala diferentes**:

```yaml
# infrastructure/kubernetes/ai-service-deployment.yaml (trecho)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service
spec:
  replicas: 2
  template:
    spec:
      containers:
        - name: ai-service
          resources:
            requests: { cpu: "500m", memory: "1Gi" }
            limits:   { cpu: "2",    memory: "4Gi" }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-service-hpa
spec:
  scaleTargetRef: { name: ai-service, kind: Deployment }
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }
```

`ai-service` recebe limites de memória bem mais altos que `api` porque processamento de embeddings e streaming de resposta de LLM consomem memória de forma diferente de requisições REST simples. Rodar os dois no mesmo perfil de recurso é desperdício de custo ou gargalo de performance — dependendo de qual lado você errar.

Terraform entra para provisionar o que está *fora* do cluster — banco gerenciado, filas, buckets, secrets:

```hcl
# infrastructure/terraform/modules/vector-db/main.tf (trecho)
resource "aws_opensearch_domain" "vector_store" {
  domain_name    = "pediacare-vectors-${var.environment}"
  engine_version = "OpenSearch_2.11"

  cluster_config {
    instance_type  = var.environment == "production" ? "r6g.large.search" : "t3.small.search"
    instance_count = var.environment == "production" ? 3 : 1
  }
}
```

Note o uso de `var.environment` para diferenciar o dimensionamento entre produção e staging — infraestrutura como código só compensa quando você evita duplicar arquivos `.tf` por ambiente.

---

## 5. CI/CD: path filters como pré-requisito, não otimização

Sem *path filters*, todo push dispara build e deploy de tudo — o que, num monorepo com 6 aplicações, é lento e caro.

```yaml
# infrastructure/github-actions/deploy.yml (trecho)
on:
  push:
    branches: [main]

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      ai-service: ${{ steps.filter.outputs.ai-service }}
      api: ${{ steps.filter.outputs.api }}
    steps:
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            ai-service:
              - 'apps/ai-service/**'
              - 'packages/ai-core/**'
              - 'packages/prompts/**'
            api:
              - 'apps/api/**'
              - 'packages/auth/**'

  deploy-ai-service:
    needs: changes
    if: needs.changes.outputs.ai-service == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: echo "deploy ai-service"
```

Repare que o filtro de `ai-service` inclui `packages/prompts` — porque uma mudança de prompt **é** uma mudança de comportamento em produção e deveria disparar o mesmo pipeline de teste e deploy que uma mudança de código do agente. Times que tratam prompt como "conteúdo" e não como "código" tendem a pular esse teste — e é exatamente aí que regressões de qualidade de IA escapam para produção sem detecção.

---

## 6. ADR como artefato técnico, não burocracia

Um exemplo real do que deveria estar em `docs/adr/`:

> **ADR-014: Desacoplar `ai-service` da `api` via fila em vez de chamada HTTP síncrona**
>
> **Contexto**: chamadas síncronas de `api` para `ai-service` causavam timeouts em cascata durante picos de uso do LLM provider.
>
> **Decisão**: requisições de IA não críticas em tempo real (ex.: geração de resumo clínico) passam a ser enfileiradas via `worker`, com resultado entregue por webhook/polling. Apenas casos que exigem resposta síncrona (ex.: chat em tempo real) mantêm chamada HTTP direta com timeout agressivo.
>
> **Consequências**: aumenta complexidade de estado (status "pending"/"ready"), mas elimina timeouts em cascata e permite retry automático sem impacto no usuário.

Esse tipo de registro é o que separa um time que aprende com incidentes de um time que repete o mesmo erro de arquitetura seis meses depois com outra feature.

---

## 7. Monolito x microsserviços: critérios objetivos, não preferência

Em vez de comparar de forma genérica, vale usar três critérios técnicos concretos:

| Critério | Monolito | Multi-repo (microsserviços puros) | Monorepo híbrido (este caso) |
|---|---|---|---|
| **Blast radius de deploy** | Alto — qualquer bug pode derrubar tudo | Baixo — isolado por serviço | Baixo — isolado por `apps/`, deploy independente via K8s |
| **Custo de refatoração cross-cutting** | Baixo — tudo num só lugar | Alto — PRs coordenados em múltiplos repos | Baixo — um PR, CI valida todos os consumidores |
| **Overhead de infraestrutura/tooling** | Baixo | Alto — N pipelines, N configs de deploy | Médio — exige Nx/Turborepo + path filters bem configurados |
| **Escala seletiva de recursos** | Não — escala tudo junto | Sim | Sim — via Deployments/HPA independentes no K8s |
| **Velocidade de onboarding** | Alta (um repo, um contexto) | Baixa (múltiplos repos, múltiplos READMEs) | Alta-Média (um repo, mas exige entender o grafo de dependências) |

O monorepo híbrido não é "o melhor dos dois mundos" de forma gratuita — ele troca overhead de infraestrutura (múltiplos repositórios) por overhead de tooling de build (Nx/Turborepo bem configurado). Para times pequenos sem essa maturidade de tooling, um monolito modular ainda pode ser a escolha mais pragmática.

---

## 8. Integrações externas como parte do contrato de arquitetura

Um ponto frequentemente ignorado em discussões de arquitetura "pura": integrações com Figma, Canva e ferramentas de gestão (Trello, Jira, Linear) deveriam aparecer em `docs/architecture/`, com contratos explícitos — não como scripts ad-hoc:

- **Figma → Design Tokens**: um pipeline que exporta tokens do Figma (via API) para `packages/ui/tokens.json`, versionado e revisado em PR, evita divergência silenciosa entre design e implementação.
- **Trello/Jira ↔ GitHub Actions**: webhooks que atualizam status de card conforme o PR avança (`in review` → `in progress` → `done`) reduzem trabalho manual e criam rastreabilidade entre entrega técnica e visão de produto.
- **Canva**: menos relevante do ponto de vista de arquitetura de software, mas relevante do ponto de vista de *time-to-market* de comunicação — squads que produzem seus próprios materiais de suporte/onboarding sem depender de fila de design ganham velocidade.

Tratar essas integrações como "detalhe operacional" é um erro recorrente: elas afetam diretamente o tempo de ciclo entre decisão de produto e entrega técnica.

---

## Conclusão

A arquitetura da PediaCare Platform não é notável pela tecnologia em si — Next.js, NestJS, Kubernetes e RAG são, isoladamente, escolhas comuns em 2026. O que a torna um bom estudo de caso é a **disciplina de fronteiras**: cada decisão (monorepo com build graph, IA como serviço desacoplado, prompts versionados, path filters no CI, ADRs registrados) resolve um problema específico de blast radius, velocidade de time ou rastreabilidade.

Se você está migrando de um monolito para uma arquitetura mais distribuída, ou tentando trazer ordem para microsserviços que cresceram sem planejamento, o exercício mais valioso não é copiar esta estrutura — é fazer, para cada decisão acima, a pergunta: *qual problema real essa fronteira resolve no meu contexto?*

---

*Trabalha com arquitetura de sistemas que combinam produto tradicional e IA? Tenho interesse em discutir mais sobre versionamento de prompts, testes de regressão para agentes e estratégias de deploy para cargas de IA — fique à vontade para comentar ou conectar.*
