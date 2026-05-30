# Docker & CI Audit — 2026-05-29

## Current State

### Images
| Image | Size | Build Time (no-cache) |
|-------|------|-----------------------|
| backend | 143 MB | 6.5s |
| frontend | 62.3 MB | 1.5s |

### Backend Dockerfile (backend/Dockerfile)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["node", "src/index.js"]
```

**Findings:**
1. **No multi-stage build** — not critical here since it's a runtime-only Node image (no build step), but the image includes npm cache and package manager itself (unnecessary at runtime).
2. **No package-lock.json** — `npm install` without a lockfile means non-deterministic dependency resolution. Security flagged this (inbox item).
3. **Runs as root** — no USER directive. Security flagged this (inbox item).
4. **No .dockerignore** — likely copying node_modules, .git, logs, and other unnecessary files into the image.
5. **Layer caching is okay** — package.json copied before source, so dependency layer is cached when only code changes.

### Frontend Dockerfile (frontend/Dockerfile)
```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/
EXPOSE 80
```

**Findings:**
1. Already minimal at 62.3 MB (nginx:alpine base). No build step needed — static files only.
2. No USER directive (runs as nginx user by default in nginx:alpine, so this is fine).
3. No .dockerignore (less critical for static files).

### CI/CD State
- **No CI pipeline exists.** No GitHub Actions, no Jenkins, no pipeline configs.
- No automated testing in build process.
- No image scanning.
- No automated tagging or versioning.
- Manual `docker compose up --build` is the entire deployment process.

### docker-compose.yml
- Backend mounts `./logs` and `./backend/config.json` as volumes (runtime concern — Infra's domain).
- No build args or build caching configured.
- No image tagging — uses implicit `latest`.

## Priority Improvements (next cycles)

1. **Generate package-lock.json** — deterministic builds, enables `npm ci` (faster, stricter).
2. **Add USER directive to backend Dockerfile** — address Security inbox item.
3. **Add .dockerignore for backend** — exclude node_modules, .git, logs, tests.
4. **Multi-stage backend build** — separate install stage from runtime, drop npm/yarn from final image. Estimated savings: ~20-30 MB.
5. **Set up basic CI config** — lint Dockerfile, run `npm audit`, build and tag images.

## Dependencies
- 2 production deps: express@^4.21.0, cors@^2.8.5
- 0 dev deps
