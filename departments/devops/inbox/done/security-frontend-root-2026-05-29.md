# Security → DevOps: Frontend Docker Root Advisory

**Date:** 2026-05-29
**From:** Security

`frontend/Dockerfile` runs as root (no USER directive). See `departments/security/advisories/frontend-docker-root.md` for details and recommended fix using `nginx-unprivileged` base image.

**Severity**: P3
