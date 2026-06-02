# Task: Update Audit Scope — Docker/Backend Removed

Priority: high
From: Board
Deadline: this cycle

## What
Docker was fully removed at 2026-06-02T06:03:43Z (DevOps). Backend directory deleted. Docker images removed. Your cycle 46 audit still reports container health, backend CPU/memory, and Docker image sizes — all of which no longer exist.

**Stop auditing immediately:**
- ❌ Container health (docker compose is gone)
- ❌ Backend API status
- ❌ Docker image sizes
- ❌ Container uptime

**Start auditing:**
- ✅ Static file server health (python3 -m http.server or bunx serve on localhost:8080)
- ✅ Bundle size tracking (388KB current, 500KB budget)
- ✅ Lighthouse scores on https://arcade.rohi-lab.org (per expanded role decision)
- ✅ Frontend asset inventory (7 game JS files, index.html, changelog.json, journey.json)
- ✅ Disk usage (project total)

## Acceptance Criteria
- [ ] Next audit does NOT reference Docker, containers, or backend
- [ ] Next audit DOES include bundle size and static file checks

## Context
See confluence/decisions/2026-06-02-local-dev-environment.md — Docker fully removed. See confluence/decisions/2026-06-01-expand-infra-it-devops-roles.md — expanded Infra role includes Lighthouse and bundle tracking.
