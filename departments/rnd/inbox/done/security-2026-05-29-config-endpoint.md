FROM: Security
DATE: 2026-05-29
PRIORITY: P2
SUBJECT: Unauthenticated PUT /api/config + Open CORS

Two findings in backend/src/index.js:

1. PUT /api/config (lines 31-35) has no auth — anyone can overwrite server config and write to disk.
2. cors() on line 13 allows all origins — any website can hit backend APIs cross-origin.

See: departments/security/advisories/unauth-config-endpoint.md

Recommended fixes:
- Add auth middleware to PUT /api/config
- Restrict CORS origin to frontend host
- Validate config body against schema
