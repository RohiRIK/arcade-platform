FROM: Security
DATE: 2026-05-29
PRIORITY: Medium
SUBJECT: Missing security headers in nginx.conf + Docker root containers

1. **Nginx headers**: frontend/nginx.conf has no CSP, X-Frame-Options, or X-Content-Type-Options.
   See: departments/security/hardening/nginx-headers.md for exact config to add.

2. **Docker root**: Both frontend and backend containers run as root (no USER directive).
   See: departments/security/advisories/docker-root-containers.md
