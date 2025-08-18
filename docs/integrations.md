# IDP Backend Integrations: Setup and Usage

This document explains how to run the new backend service, configure integrations (Jira, Confluence, GitHub, ArgoCD, AWS, Google, Grafana, Loki, Prometheus), and call the placeholder APIs.

## What’s included
- TypeScript Express server at `backend/`
- Health endpoint: `GET /api/health`
- Integration endpoints (placeholders):
  - `GET /api/integrations/github/repos`
  - `GET /api/integrations/jira/issues`
  - `GET /api/integrations/confluence/pages`
  - `GET /api/integrations/argocd/apps`
  - `GET /api/integrations/aws/summary`
  - `GET /api/integrations/google/summary`
  - `GET /api/integrations/grafana/dashboards`
  - `GET /api/integrations/loki/labels`
  - `GET /api/integrations/prometheus/query?query=<promql>`

The endpoints return basic, safe stub responses until you add real calls. This gives you a consistent API surface to integrate the UI now and progressively implement providers securely on the server side.

## Requirements
- Node.js 18+
- npm 9+

## Install
```bash
npm install
```

## Environment
Copy the example and fill in what you need:
```bash
cp backend/.env.example backend/.env
```

Supported variables (all optional unless noted):
- General
  - `PORT` (default: 3001) — backend port
  - `CORS_ORIGIN` (default: http://localhost:5173) — allowed origin for the frontend
- GitHub
  - `GITHUB_TOKEN` — GitHub PAT with read scopes (e.g., `repo:read`, `read:org`)
- Jira (Atlassian Cloud)
  - `JIRA_BASE_URL` — e.g., `https://your-domain.atlassian.net`
  - `JIRA_EMAIL` — Atlassian account email
  - `JIRA_API_TOKEN` — API token from Atlassian
- Confluence
  - `CONFLUENCE_BASE_URL` — e.g., `https://your-domain.atlassian.net/wiki`
- ArgoCD
  - `ARGOCD_BASE_URL` — e.g., `https://argocd.example.com`
  - `ARGOCD_TOKEN` — ArgoCD API token
- AWS
  - `AWS_REGION` — e.g., `us-east-1`
- Google Cloud
  - `GOOGLE_PROJECT_ID` — e.g., `my-gcp-project`
- Grafana
  - `GRAFANA_URL` — e.g., `https://grafana.example.com`
- Loki
  - `LOKI_URL` — e.g., `http://loki:3100`
- Prometheus
  - `PROMETHEUS_URL` — e.g., `http://prometheus:9090`

Mocking:
- **BACKEND_MOCK=true** (default) makes the backend return mock data for all integrations. This keeps the frontend free of any mock data and allows testing without external credentials. Set to `false` to hit real services.

Notes:
- Do not expose secrets in the frontend. Keep tokens and credentials only in `backend/.env` or a proper secrets manager.

## Run (development)
- Backend only: `npm run dev:server`
- Frontend only: `npm run dev:front`
- Both (recommended): `npm run dev:all`

Vite proxy forwards `/api/*` calls from the frontend to `http://localhost:3001` during development. Default URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

Health check:
```bash
curl http://localhost:3001/api/health
```

## Build and run (production-like)
```bash
npm run build:server
npm run start:server
```
Set `CORS_ORIGIN` to your frontend URL (e.g., `https://app.example.com`). Place the server behind your preferred reverse proxy if needed.

## API usage (examples)
- GitHub repos (stub)
```bash
curl http://localhost:3001/api/integrations/github/repos
```
- Jira issues (stub)
```bash
curl http://localhost:3001/api/integrations/jira/issues
```
- Confluence pages (stub)
```bash
curl http://localhost:3001/api/integrations/confluence/pages
```
- ArgoCD apps (stub)
```bash
curl http://localhost:3001/api/integrations/argocd/apps
```
- AWS summary (stub)
```bash
curl http://localhost:3001/api/integrations/aws/summary
```
- Google summary (stub)
```bash
curl http://localhost:3001/api/integrations/google/summary
```
- Grafana dashboards (stub)
```bash
curl http://localhost:3001/api/integrations/grafana/dashboards
```
- Loki labels (stub)
```bash
curl http://localhost:3001/api/integrations/loki/labels
```
- Prometheus query (stub)
```bash
curl "http://localhost:3001/api/integrations/prometheus/query?query=up"
```

## Extending the integrations
Implement real provider calls server-side in `backend/src/routes/integrations.ts`. Example: GitHub repos (list user/org repos) with a PAT from `GITHUB_TOKEN`.

```ts
// backend/src/routes/integrations.ts
import axios from 'axios';
import { Router } from 'express';
import { config } from '../config.js';

export const integrationsRouter = Router();

integrationsRouter.get('/github/repos', async (_req, res) => {
  if (!config.integrations.githubToken) {
    return res.status(501).json({ error: 'GitHub not configured' });
  }
  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${config.integrations.githubToken}`,
        Accept: 'application/vnd.github+json',
      },
      params: { per_page: 50, sort: 'updated' },
    });
    return res.json({ items: response.data });
  } catch (err: any) {
    return res.status(502).json({ error: 'GitHub API error', details: err?.response?.data ?? null });
  }
});
```

General guidance:
- Keep credentials in env vars or secrets manager, never in the client app.
- Use server-side routes to normalize outputs for the UI.
- Add rate limiting and caching as needed for external APIs.
- Prefer service-specific SDKs if you need deeper functionality (e.g., AWS SDK v3, Google Cloud client libraries).

## Security and observability
- Security
  - `helmet` for HTTP hardening
  - CORS restricted via `CORS_ORIGIN`
  - Secrets in env (or Vault/KMS in production)
- Logging
  - `pino` structured logs; pretty mode in dev
- Error handling
  - Central error handler returns 500 without leaking internals

## Troubleshooting
- 501 Not Implemented/Configured: The provider lacks required env vars. Set them in `backend/.env`.
- 401/403 from providers: Check token scopes and validity.
- CORS errors: Align `CORS_ORIGIN` with your frontend URL.
- Port in use: Change `PORT` in `backend/.env` and update Vite `server.proxy` target.

## File map
- Server entry: `backend/src/index.ts`
- Config/env: `backend/src/config.ts`, `backend/.env.example`
- Routes: `backend/src/routes/*`
- Logger: `backend/src/logger.ts`
- Build config: `backend/tsconfig.json`

## Next steps
- Add OAuth flows (GitHub/OIDC/Atlassian) instead of static tokens
- Implement pagination, filtering, and auth on each route
- Generate OpenAPI spec and serve it under `/api/docs`

See also:
- Jira integration details: `docs/jira-integration.md`

