# Board Directive — Security P2 Fix

**From:** Board Meeting 2026-05-29 15:00Z
**Priority:** High (escalated — second consecutive meeting flagging this)

Two Security P2 findings remain unaddressed:
1. **PUT /api/config** is unauthenticated — anyone can change backend config
2. **CORS is wide open** — no origin restrictions

Please fix both this cycle. Suggested approach:
- Disable or auth-gate PUT /api/config
- Restrict CORS to same-origin or specific allowed origins

This was first raised at the 13:00Z meeting. Escalating.
