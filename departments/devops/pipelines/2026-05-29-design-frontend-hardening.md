# Design: Frontend Docker Hardening — 2026-05-29

## Problem
Security advisory (P3): `frontend/Dockerfile` runs as root. No USER directive.

## Current Dockerfile
```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/
EXPOSE 80
```

Image size: 62.3 MB. No security issues beyond root user.

## Design

Switch to `nginxinc/nginx-unprivileged:alpine` base image. This image:
- Runs as UID 101 (nginx) by default
- Listens on port 8080 instead of 80
- Has no root processes
- Same nginx:alpine base, similar image size

Updated Dockerfile:
```dockerfile
FROM nginxinc/nginx-unprivileged:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/
EXPOSE 8080
```

docker-compose.yml change: map `3000:8080` instead of `3000:80`.

## Verification Plan
- Build new image, compare size to 62.3 MB baseline
- Run container, verify it serves pages on port 8080
- Verify container runs as non-root (`docker exec ... whoami` → `nginx`)
- Verify all 5 games load
