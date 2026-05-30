# Design: Backend Docker Hardening — 2026-05-29

## Problem Statement
Backend image (143 MB) has 5 issues from audit:
1. No .dockerignore — copies unnecessary files into image
2. No package-lock.json — non-deterministic installs
3. Runs as root — security risk
4. No multi-stage build — npm/cache bloat in final image
5. No CI pipeline — manual builds only

## Design: Phase 1 (this cycle — implement step)

### 1. Add backend/.dockerignore
Exclude: node_modules, .git, logs, *.md, Dockerfile, .dockerignore
Expected impact: faster build context transfer, prevents node_modules contamination.

### 2. Generate package-lock.json
Run `npm install` locally to produce lockfile, then switch Dockerfile to `npm ci --production`.
Expected impact: deterministic builds, faster installs (npm ci skips resolution).

### 3. Add USER directive
Add `RUN addgroup -S app && adduser -S app -G app` + `USER app` after install.
Expected impact: container no longer runs as root. Addresses Security advisory.

### 4. Multi-stage backend Dockerfile
```dockerfile
# Stage 1: install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production

# Stage 2: runtime
FROM node:20-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
USER app
EXPOSE 3001
CMD ["node", "src/index.js"]
```
Expected impact: final image excludes npm cache from install stage. Estimated size reduction: 10-30 MB.

### 5. CI pipeline — deferred to next cycle
Requires choosing CI tool (GitHub Actions vs local script). Will design separately.

## Verification Plan
- Build new image, compare size to 143 MB baseline
- Run container, verify health endpoint responds
- Verify container runs as non-root user (`docker exec ... whoami`)
- Compare build time to 6.5s baseline
