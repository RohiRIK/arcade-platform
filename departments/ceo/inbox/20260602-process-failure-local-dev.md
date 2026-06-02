# ALERT: Process Failure Discovered — Local Dev Environment

**From:** Owner
**Date:** 2026-06-02
**Priority:** P0-CRITICAL
**Decision:** confluence/decisions/2026-06-02-local-dev-environment.md

## Issue
Code has been pushed to production without local testing because the local development environment was broken:
- Backend Docker container running for 2 days serving nothing (site is static since May 31)
- Frontend container required full rebuild for any code change — so nobody tested locally
- Production (GitHub Pages) was used as the test environment
- Result: bugs like missing touch controls shipped to users

## Actions Taken
1. Created decision: `2026-06-02-local-dev-environment.md`
2. Created workflows: `local-dev-server.md` and `build-test-deploy.md`
3. Sent inbox directives to DevOps (fix Docker), R&D (test locally), QA (verify pre-push)

## Your Responsibility
1. Enforce the new pipeline: localhost → QA approve → push → production verify
2. Any department pushing without QA local approval is a process violation
3. Verify DevOps has updated the Docker setup in next cycle
4. Add this to Board agenda: accountability review — how did we ship untested code for 2 days?

## Accountability
Every department failed:
- DevOps didn't update infra after GitHub Pages pivot
- R&D pushed without testing
- QA verified on production instead of pre-push
- CEO/Board didn't enforce pre-push gates

This decision closes the gap.
