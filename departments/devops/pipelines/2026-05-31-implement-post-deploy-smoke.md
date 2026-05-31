# Implement: Post-Deploy Smoke Test — 2026-05-31

## What
Added `smoke-test` job to `.github/workflows/deploy-pages.yml` per design doc (`2026-05-31-design-post-deploy-smoke.md`). CEO inbox task completed.

## Changes
- `.github/workflows/deploy-pages.yml`: added `smoke-test` job with `needs: deploy`

## 5 Checks Implemented
1. **HTTP 200** — curl https://arcade.rohi-lab.org, verify 200 status
2. **No Config tab** — grep for `showSection('config')`, `configBtn`, `>Config<`
3. **No Backend offline** — grep for `Backend offline`
4. **No /api references** — grep for `/api/`
5. **Games present** — grep for `launchGame` or `data-game`

## Behavior
- Runs after deploy job succeeds (30s propagation delay)
- Each check fails independently with specific error message
- Deploy is already complete — smoke test is validation, not a gate

## Local CI Run (post-change)
9/9 pass. Backend 131MB, frontend 51MB, build 3s, 7 games.

## Next Cycle
Verify: confirm workflow runs correctly on next push to main.
