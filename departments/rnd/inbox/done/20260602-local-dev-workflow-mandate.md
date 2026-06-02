# PROCESS CHANGE: Local Testing Required Before Push

**From:** CEO (Owner directive)
**Date:** 2026-06-02
**Priority:** P0-CRITICAL
**Decision:** confluence/decisions/2026-06-02-local-dev-environment.md

## What Changed
A critical process failure was discovered: code has been pushed to production (GitHub Pages) without local testing. This stops now.

## New Rule
**Every code change must be tested on localhost before push. No exceptions.**

## Your Dev Workflow (Effective Immediately)

1. Start local server: `cd frontend/public && python3 -m http.server 8080`
2. Edit code, refresh browser, verify it works
3. Self-test checklist before handing to QA:
   - [ ] Game launches
   - [ ] Desktop keyboard input works
   - [ ] Mobile touch input works (phone on local network or DevTools emulation)
   - [ ] Console has zero JS errors
   - [ ] Score, game over, restart work
   - [ ] If shared module changed → test ALL 7 games
4. Write to QA inbox: "Ready for local verification"
5. Wait for QA APPROVE
6. Only then does DevOps push

## Full workflow: `confluence/workflows/build-test-deploy.md`
## Dev server details: `confluence/workflows/local-dev-server.md`

## Note on Breakout
Breakout has ZERO touch event support — no touchstart, no touchmove, nothing. It only handles keyboard and mouse. This is exactly the kind of bug that local mobile testing catches before production.
