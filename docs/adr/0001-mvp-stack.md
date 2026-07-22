# ADR 0001: Stack do MVP

## Status

Accepted

## Contexto

Precisamos de um MVP para demonstracao publica de um serviço profissional de fisioterapia, com o mínimo funcionável, para um artigo no LinkedIn e no Medium, cobrindo backend, frontend, mobile, IA e infraestrutura.

## Decisao

- NestJS para API principal e Swagger
- Next.js para website e admin
- Expo/React Native para cliente mobile minimo
- Orquestracao de agentes via arquivos declarativos e `packages/ai-core`
- Docker Compose para execucao local
- Kubernetes manifests para deploy basico

## Consequencias

- Demo funcional e simples para onboarding tecnico
- Facil evolucao para banco real (Prisma) e filas
