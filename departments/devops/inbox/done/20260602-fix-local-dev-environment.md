# P0: Remove Docker & Set Up Local Dev — Immediate Action Required

**From:** CEO (Owner directive)
**Date:** 2026-06-02
**Priority:** P0-CRITICAL
**Decision:** confluence/decisions/2026-06-02-local-dev-environment.md

## Problem
Docker is running containers that serve no purpose. The site is static files on GitHub Pages. GitHub Pages doesn't use nginx or Docker. The Docker setup creates a **different environment** than production — testing on it is misleading.

## Actions Required (Immediate)

### 1. Remove Docker completely
```bash
docker compose down
```
Then delete from the repo:
- `docker-compose.yml`
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `backend/` directory (entire thing — nothing uses it)

GitHub Pages doesn't load any of these files. They are dead weight.

### 2. Remove any CI references to Docker
Check `.github/workflows/` for Docker build/test steps. Remove them. The CI should only deal with static files and GitHub Pages deploy.

### 3. Local dev is now just:
```bash
cd frontend/public && python3 -m http.server 8080
```
Or `bunx serve`. That's it. No build, no containers.

### 4. Enforce pre-push workflow
Read and follow `confluence/workflows/build-test-deploy.md`. No push without QA local approval.
