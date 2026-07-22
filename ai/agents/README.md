# AI Agents Catalog

Este diretorio descreve os agentes do MVP.

## Agentes disponiveis

- `content-agent`: estrutura artigos para LinkedIn e Medium
- `seo-agent`: ajusta titulos, slugs e palavras-chave
- `legal-agent`: revisao de compliance basico
- `reporting-agent`: gera resumo com metricas de publicacao

Cada agente recebe um payload JSON no formato:

```json
{
  "draft": "texto inicial",
  "channel": "linkedin|medium",
  "tone": "tecnico|executivo"
}
```
