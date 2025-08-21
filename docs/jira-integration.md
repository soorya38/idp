# Jira Integration (Backend + Frontend)

This document describes how to configure and use the Jira integration in the IDP app. It covers backend setup, endpoints, and the frontend Jira view.

## Overview
- Backend: `backend/src/services/jiraService.ts`, `backend/src/routes/jira.ts`
- Frontend: `src/components/Jira.tsx` and Sidebar entry
- Dev proxy forwards `/api` calls to backend

The integration uses Jira Cloud REST API v3 with Basic auth via email + API token. Do not expose credentials in the frontend; place them in `backend/.env`.

## Prerequisites
- Jira Cloud site and API token
- Node.js 18+, npm 9+
- App dependencies installed: `npm install`

## Use real Jira data (disable mocks)
1) Create a Jira API token (Atlassian Account → Security → Create and manage API tokens).
2) Set backend environment variables in `backend/.env`:
```bash
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=you@example.com
JIRA_API_TOKEN=your_api_token
BACKEND_MOCK=false
```
3) Restart the backend (or run both):
```bash
npm run dev:server
# or
npm run dev:all
```
4) Verify endpoints return live data:
```bash
curl "http://localhost:3001/api/jira/projects?maxResults=10" | jq '.values[0]'
curl "http://localhost:3001/api/jira/issues/mine?maxResults=10&fields=summary,status,issuetype,updated" | jq '.issues[0].fields.summary'
curl "http://localhost:3001/api/jira/projects/IDP/issues/grouped?maxResults=25&fields=summary,status" | jq '.groups | keys'
```

Notes:
- `JIRA_BASE_URL` should not include `/rest/...`; it must be the site root (e.g., `https://your-domain.atlassian.net`).
- The email must match the user for whom the token was created.
- Ensure the user has permission to browse the selected projects/boards.
- If your organization requires SSO and API tokens, ensure API token access is allowed.
- Behind corporate VPN/proxy, verify the backend host can reach Atlassian.

## Configure environment
Copy the example file:
```bash
cp backend/.env.example backend/.env
```
Set the following variables in `backend/.env`:
```bash
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=you@example.com
JIRA_API_TOKEN=your_api_token
# Optional overrides
PORT=3001
CORS_ORIGIN=http://localhost:5173
```
Notes:
- `JIRA_BASE_URL` must be your Jira site base, not the REST path.
- Generate API tokens from your Atlassian account settings.

## Run the app
- Backend only: `npm run dev:server`
- Frontend only: `npm run dev:front`
- Both together: `npm run dev:all`

Default URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Backend implementation
- Service: `backend/src/services/jiraService.ts`
  - Creates Axios clients with Basic auth
  - Methods: `getProjects`, `searchIssues`, `getMyIssues`
- Routes: `backend/src/routes/jira.ts`
  - `GET /api/jira/projects` — search/browse projects
    - Query: `query`, `startAt`, `maxResults`
  - `GET /api/jira/issues/search` — search issues by JQL
    - Query: `jql` (required), `startAt`, `maxResults`, `fields`
  - `GET /api/jira/issues/mine` — unresolved issues assigned to current user
    - Query: `startAt`, `maxResults`, `fields`
  - `GET /api/jira/issues/mine/grouped` — grouped issues (open, inprogress, blocked, completed, closed)
  - `GET /api/jira/projects/:projectKey/issues/grouped` — grouped issues scoped to a project

Error codes:
- `501` when Jira is not configured
- Upstream Jira status codes propagated where possible (e.g., `401`, `403`)

## Frontend view
- Component: `src/components/Jira.tsx`
  - Shows projects and tickets grouped by status
  - Dropdown to select a project key; tickets auto-refresh when the selection changes
  - Links: "Open Project", "Open Board", and "Open in Jira"
  - Calls backend endpoints using fetch
- Navigation: Sidebar includes `Jira` entry

Usage in UI:
- Open app → click `Jira` in the sidebar
- Project search: type text and click Search
- Refresh to reload projects and issues

## Curl examples
Projects:
```bash
curl "http://localhost:3001/api/jira/projects?query=platform&maxResults=20"
```
Issues by JQL:
```bash
echo "assignee = currentUser() AND statusCategory != Done ORDER BY updated DESC" | \
  xargs -0 -I {} curl --get --data-urlencode "jql={}" "http://localhost:3001/api/jira/issues/search?fields=summary,status"
```
My issues:
```bash
curl "http://localhost:3001/api/jira/issues/mine?maxResults=25&fields=summary,status,updated"
```

Grouped issues for my account:
```bash
curl "http://localhost:3001/api/jira/issues/mine/grouped"
```

Grouped issues by selected project key (e.g., IDP):
```bash
curl "http://localhost:3001/api/jira/projects/IDP/issues/grouped?maxResults=50&fields=summary,status,updated"
```

## Extending
- Add more Jira endpoints by expanding `jiraService.ts` and mounting routes in `jira.ts`
- Normalize responses to a stable shape for the UI
- Add caching/rate limiting where appropriate
- Consider OAuth/OIDC sign-in for user-level tokens rather than a shared API token

## Step-by-step guide
1) Install and run
```bash
npm install
npm run dev:all
```
2) Configure backend env in `backend/.env` (optional for mocks)
```bash
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=you@example.com
JIRA_API_TOKEN=your_api_token
BACKEND_MOCK=true   # leave true for mock data; set false for real Jira
```
3) Open the app at `http://localhost:5173`, go to Jira
4) Search/select a project, click "Load Tickets"
5) Click links to open Project/Board/Ticket in Jira
6) Turn off mock: set `BACKEND_MOCK=false` and reload; data comes from Jira

## Security
- Keep `JIRA_EMAIL` and `JIRA_API_TOKEN` only in server env
- Restrict CORS via `CORS_ORIGIN`
- Add RBAC when connecting to real users

## Troubleshooting
- 501 Not configured: Ensure `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` are set
- 401/403: Token or permissions issue
- CORS errors: Set `CORS_ORIGIN` correctly
- Network/DNS: Verify the Jira base URL is reachable from your machine
- Empty results: Confirm the authenticated user has access to the project and issues; try adjusting `fields`/`maxResults`.
