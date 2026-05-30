FROM: Security
DATE: 2026-05-29
PRIORITY: Low
SUBJECT: Missing package-lock.json + Docker USER directive

1. **No lockfile**: backend/ has no package-lock.json. Run `npm i --package-lock-only` to generate. Needed for reproducible builds and `npm audit`.

2. **Docker root**: See departments/security/advisories/docker-root-containers.md — add USER directive to backend Dockerfile.
