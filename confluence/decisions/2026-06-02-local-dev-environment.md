# DECISION: Local Dev Environment & Pre-Push Testing Mandate

**Date:** 2026-06-02
**Author:** CEO (Owner directive)
**Status:** Active
**Priority:** P0-CRITICAL
**Affects:** R&D, DevOps, QA, CEO, Board

## Problem Statement

**Critical process failure discovered:** Code has been pushed to GitHub Pages (production) without any local testing. The local Docker environment was non-functional for development:

1. **Backend container running for no reason** — the site is 100% static since 2026-05-31. The backend (`localhost:3001`) serves APIs that nothing uses. Wasted resources.
2. **Frontend container has no hot reload** — files are `COPY`ed at build time. Every code change requires `docker compose build` (minutes). Developers skip local testing and push directly to GitHub.
3. **Result:** Production (GitHub Pages) was used as the test environment. Bugs like missing touch controls on Breakout shipped to users without anyone catching them locally.

## Root Cause

No documented local development workflow existed. The Docker setup was inherited from the pre-static era and never updated after the GitHub Pages migration. No one questioned why `docker compose build` was needed to test a static HTML file.

## Decisions

### 1. Remove Docker Entirely
Docker has NO role in this project. The site is static files served by GitHub Pages. GitHub Pages does not use nginx, does not use Docker, does not use a backend. Running Docker locally means testing a different environment than production — this is worse than useless, it's misleading.

**Actions:**
- Run `docker compose down` to stop all containers
- Delete `docker-compose.yml`
- Delete `frontend/Dockerfile`
- Delete `frontend/nginx.conf`
- Delete `backend/` directory entirely (no frontend code uses it)
- Remove any CI/CD references to Docker

**GitHub Pages does not load these files. They are dead weight in the repo.**

### 2. Local Dev Server
For local development and testing:
```bash
cd frontend/public && python3 -m http.server 8080
```
Or:
```bash
cd frontend/public && bunx serve
```
Zero dependencies. Instant start. File changes visible on browser refresh. **This matches production behavior exactly** — static files served over HTTP, nothing else.

### 3. Pre-Push Testing Mandate (HARD RULE)
**No code is pushed to GitHub without passing local QA verification.**

Pipeline: `R&D edit → R&D self-test on localhost → QA verify on localhost → QA APPROVE → DevOps push → QA verify production`

See workflows:
- `confluence/workflows/local-dev-server.md`
- `confluence/workflows/build-test-deploy.md`

Any push without QA local approval is a process violation.

## Department Actions Required

| Department | Action | Deadline |
|-----------|--------|----------|
| DevOps | Update `docker-compose.yml`: remove backend, add volume mount to frontend | Immediate |
| DevOps | Run `docker compose down && docker compose up -d` with new config | Immediate |
| R&D | Use `localhost:8080` (Python) or `localhost:3000` (nginx) for ALL development | Immediate |
| R&D | Self-test every change before handing to QA | Immediate |
| QA | Verify on localhost BEFORE approving any push | Immediate |
| QA | Verify on production AFTER every push | Immediate |
| All | Read and follow `build-test-deploy.md` workflow | Immediate |

## Accountability

This is a process failure, not a code failure. Code was shipped to production untested because no one built a local test environment after the static migration. Every department shares responsibility:
- **DevOps** — didn't update infrastructure after the GitHub Pages pivot
- **R&D** — pushed code without testing locally
- **QA** — verified on production instead of catching issues pre-push
- **CEO/Board** — didn't enforce a pre-push verification gate

This decision closes the gap. No exceptions.
