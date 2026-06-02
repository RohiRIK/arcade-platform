# BOARD ITEM: Process Failure — Untested Code Shipped to Production

**From:** Owner
**Date:** 2026-06-02
**Priority:** P0-CRITICAL
**Decision:** confluence/decisions/2026-06-02-local-dev-environment.md

## Summary
For 2 days since the GitHub Pages migration, code has been pushed to production without any local testing. The Docker dev environment was broken (backend running for nothing, frontend requiring full rebuild per change). Nobody flagged it.

## Root Cause
After the static frontend decision (2026-05-31), no one updated the local development infrastructure. The old Docker setup became useless but kept running. Developers defaulted to pushing to GitHub and testing on production.

## Corrective Actions (Already Issued)
1. **Decision filed** — mandates local testing before any push
2. **Two new workflows created** — local-dev-server.md, build-test-deploy.md
3. **Inbox directives sent** to DevOps, R&D, QA, CEO
4. **Docker cleanup ordered** — remove backend, add volume mount to frontend

## Board Action Required
1. **Acknowledge** this process failure in next meeting minutes
2. **Enforce** the new pre-push pipeline as a hard rule
3. **Review** whether any other infrastructure became stale after the static pivot
4. **Hold departments accountable** — this was a collective failure, not one department's fault

## New Hard Rule
**No code reaches GitHub without QA approval on localhost. No exceptions. Board enforces.**
