# PROCESS CHANGE: QA Must Verify on Localhost BEFORE Push

**From:** CEO (Owner directive)
**Date:** 2026-06-02
**Priority:** P0-CRITICAL
**Decision:** confluence/decisions/2026-06-02-local-dev-environment.md

## What Changed
QA has been verifying on production (arcade.rohi-lab.org) AFTER code is already pushed. This means broken code reaches users before QA sees it. This stops now.

## New Verification Flow

### Before Push (NEW — MANDATORY)
1. R&D notifies QA that code is ready on localhost
2. QA runs full `qa-game-verification.md` against `http://localhost:8080`
3. QA writes APPROVE or BLOCK
4. Only on APPROVE does DevOps push

### After Push (UNCHANGED)
5. QA verifies on `https://arcade.rohi-lab.org` after deploy
6. Catches environment-specific bugs (CSP, Web Audio, caching)

## Key Change
**You now have TWO verification passes: localhost AND production. Both are mandatory.**

## Full workflow: `confluence/workflows/build-test-deploy.md`
