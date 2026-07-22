# MVP API Endpoints

Base URL local: `http://localhost:3000`
Swagger: `http://localhost:3000/api/docs`

Header de versionamento:

- `x-api-version: 1`

Persistencia:

- Os dados de conteudo usam Prisma + SQLite (`database/prisma/schema.prisma`).

## System

- `GET /` retorna metadados da API
- `GET /health` retorna status do servico

## Content CRUD

- `POST /content` cria conteudo
- `GET /content` lista conteudos
- `GET /content/:id` retorna um item
- `PATCH /content/:id` atualiza um item
- `DELETE /content/:id` remove um item

### Exemplo de payload

```json
{
  "title": "Post para LinkedIn com agentes de IA",
  "summary": "Resumo curto para demonstrar fluxo de CRUD.",
  "body": "Conteudo completo para publicacao.",
  "channel": "linkedin",
  "tags": ["ia", "nestjs", "nextjs"]
}
```
