# Verify: Frontend Docker Hardening — 2026-05-29

## Changes Made
1. Switched `frontend/Dockerfile` from `nginx:alpine` to `nginxinc/nginx-unprivileged:alpine`
2. Changed `listen 80` → `listen 8080` in `frontend/nginx.conf`
3. Changed `EXPOSE 80` → `EXPOSE 8080` in Dockerfile
4. Updated `docker-compose.yml` port mapping: `3000:80` → `3000:8080`

## Results
| Metric | Before | After |
|--------|--------|-------|
| Image size | 62.3 MB | 54 MB |
| User | root | nginx (non-root) |
| Listen port | 80 | 8080 |
| HTTP status | 200 | 200 |
| Games served | 5 | 5 |

## Verification
- `curl localhost:3000` → HTTP 200
- `docker compose exec frontend whoami` → `nginx`
- `/api/games` → 5 games (breakout, pong, snake, space-invaders, tetris)
- Security P3 advisory resolved: container no longer runs as root
