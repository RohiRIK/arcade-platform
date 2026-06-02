# Workflow: Build → Test → Deploy

## When to Use
- Every code change, from first edit to production deploy
- Applies to ALL departments: R&D writes code, DevOps validates infra, QA approves, then push

## Pipeline Overview

```
R&D: edit code
    ↓
R&D: test on local dev server (localhost:8080)
    ↓
R&D: self-verify (desktop + mobile, console clean)
    ↓
QA: verify on localhost (full qa-game-verification workflow)
    ↓
QA: APPROVE or BLOCK
    ↓
  [if APPROVE]
    ↓
DevOps: git push origin main
    ↓
CI: GitHub Pages deploy + smoke test
    ↓
QA: verify on https://arcade.rohi-lab.org (production)
    ↓
DONE
```

## Phase 1: R&D — Build & Self-Test

### Step 1: Start local dev server
```bash
cd frontend/public && python3 -m http.server 8080
```
See `local-dev-server.md` for details.

### Step 2: Make changes
Edit files under `frontend/public/`. Refresh browser after each save.

### Step 3: Self-verify (MANDATORY before handing to QA)
- [ ] Game launches on `localhost:8080`
- [ ] Desktop input works (keyboard)
- [ ] Mobile input works (touch d-pad) — use phone on local network or DevTools mobile emulation
- [ ] Console has zero JS errors (`F12` → Console tab)
- [ ] Score, game over, restart all function
- [ ] If shared module changed → test ALL 7 games, not just the one you touched

**If any check fails, fix it. Do NOT hand broken code to QA.**

### Step 4: Notify QA
R&D writes to QA inbox:
```
Subject: Ready for local verification — [what changed]
Server: http://localhost:8080
Games affected: [list]
What to test: [specific things]
```

## Phase 2: QA — Local Verification

### Step 5: QA runs full verification on localhost
Follow `qa-game-verification.md` against `http://localhost:8080`:
- Launch verification (all 7 games)
- Input verification (desktop + mobile)
- Gameplay verification (10+ seconds per game)
- Console check (zero errors)
- Regression (all games, not just changed ones)

### Step 6: QA Decision
- **All pass** → Write APPROVE to DevOps inbox with verification report
- **Any failure** → Write BLOCK to R&D inbox with bug details. Go back to Phase 1.

**No partial approvals. No "approve with known issues." All 7 games pass or nothing ships.**

## Phase 3: DevOps — Deploy

### Step 7: Push to production
Only after QA APPROVE:
```bash
git add -A
git commit -m "R&D: [description of change]"
git push origin main
```

### Step 8: CI runs automatically
GitHub Actions (`deploy-pages.yml`) does:
1. Deploy to GitHub Pages
2. Smoke test (HTTP 200, no config tab, no backend offline, no /api refs, games present)

### Step 9: Verify CI passed
Check GitHub Actions — if smoke test fails, **do NOT proceed**. Fix and re-push.

## Phase 4: QA — Production Verification

### Step 10: QA verifies live site
Wait 60 seconds after deploy, then run `qa-game-verification.md` against `https://arcade.rohi-lab.org`.

This catches environment-specific bugs:
- GitHub Pages CSP headers blocking scripts
- CORS differences
- Web Audio autoplay policies (stricter on some hosts)
- CDN caching serving stale files

### Step 11: QA Production Decision
- **All pass** → Done. Write summary to outbox.
- **Any failure** → P1-CRITICAL bug. File immediately. DevOps evaluates rollback via `git revert`.

## Department Responsibilities

| Phase | Department | Responsibility |
|-------|-----------|----------------|
| 1 | R&D | Write code, self-test on localhost, hand to QA |
| 2 | QA | Full verification on localhost, APPROVE or BLOCK |
| 3 | DevOps | Push to GitHub only after QA approval, monitor CI |
| 4 | QA | Production verification, flag environment-specific bugs |

## Anti-Patterns
- ❌ R&D pushes directly without QA approval — **forbidden**
- ❌ "It works in Docker" — Docker is not the test environment, localhost is
- ❌ QA approves on localhost, skips production check — environment bugs are real
- ❌ DevOps pushes despite CI failure — CI red = no deploy
- ❌ "Small change, no need to test" — small changes cause the worst bugs

## Hard Rule
**Code flows in one direction: localhost → QA approve → push → production verify.**
**No step is optional. No step is skippable. No exceptions.**
