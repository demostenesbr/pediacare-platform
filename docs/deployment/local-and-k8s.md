# Deployment Guide

## Local (Docker Compose)

Execute na raiz do repositorio:

1. `docker compose -f infrastructure/docker/docker-compose.yml build`
2. `docker compose -f infrastructure/docker/docker-compose.yml up`

Acessos:

- API: `http://localhost:3000`
- Website: `http://localhost:3001`
- Admin: `http://localhost:3002`

## Kubernetes

1. Crie namespace:
   - `kubectl apply -f infrastructure/kubernetes/namespace.yaml`
2. Aplique servicos:
   - `kubectl apply -f infrastructure/kubernetes/api.yaml`
   - `kubectl apply -f infrastructure/kubernetes/website.yaml`
   - `kubectl apply -f infrastructure/kubernetes/admin.yaml`
3. Aplique ingress:
   - `kubectl apply -f infrastructure/kubernetes/ingress.yaml`
