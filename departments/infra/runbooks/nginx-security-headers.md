# Runbook: Nginx Security Headers

## When to Use
When security headers need to be added or updated in the frontend nginx config.

## Steps
1. Edit `frontend/nginx.conf` — add/modify `add_header` directives inside `server {}` block
2. `docker compose build frontend`
3. `docker compose up -d frontend`
4. Verify: `curl -sI http://localhost:3000` — confirm headers present in response

## Current Headers
- Content-Security-Policy
- X-Frame-Options (SAMEORIGIN)
- X-Content-Type-Options (nosniff)
- Referrer-Policy (strict-origin-when-cross-origin)
- Permissions-Policy

## Rollback
1. `git checkout frontend/nginx.conf`
2. `docker compose build frontend && docker compose up -d frontend`

## Last Executed
2026-05-29T09:51Z — SUCCESS. All 5 headers verified in response.
