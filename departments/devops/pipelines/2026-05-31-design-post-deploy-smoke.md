# Design: Post-Deploy Smoke Test for GitHub Pages — 2026-05-31

## Problem
CEO directive: after every GitHub Pages deploy, verify the live site at https://arcade.rohi-lab.org is functional and free of removed/broken elements (Config tab, Backend offline, /api references).

## Design: Add `smoke-test` Job to deploy-pages.yml

A new job `smoke-test` runs after the `deploy` job succeeds. Uses `curl` to fetch the live site and checks content.

### Checks
1. **HTTP 200** — `curl -s -o /dev/null -w "%{http_code}" https://arcade.rohi-lab.org` must return 200
2. **No "Config" button** — response body must NOT contain `>Config<` or `id="configBtn"` or `showSection('config')`
3. **No "Backend offline"** — response body must NOT contain `Backend offline`
4. **No /api references** — response body must NOT contain `/api/` (fetch calls to non-existent backend)
5. **Games present** — response body must contain at least one game card (e.g., `data-game=` or `launchGame`)

### Workflow Addition
```yaml
  smoke-test:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Wait for deployment propagation
        run: sleep 30
      - name: Fetch live site
        run: |
          HTTP_CODE=$(curl -s -o /tmp/site.html -w "%{http_code}" https://arcade.rohi-lab.org)
          echo "HTTP status: $HTTP_CODE"
          if [ "$HTTP_CODE" != "200" ]; then
            echo "FAIL: HTTP $HTTP_CODE (expected 200)"
            exit 1
          fi
      - name: Check no Config tab
        run: |
          if grep -qi "showSection('config')\|id=\"configBtn\"\|>Config<" /tmp/site.html; then
            echo "FAIL: Config tab found in live site"
            exit 1
          fi
          echo "PASS: No Config tab"
      - name: Check no Backend offline
        run: |
          if grep -qi "Backend offline" /tmp/site.html; then
            echo "FAIL: 'Backend offline' message found"
            exit 1
          fi
          echo "PASS: No Backend offline message"
      - name: Check no /api references
        run: |
          if grep -q "/api/" /tmp/site.html; then
            echo "FAIL: /api/ references found in live site"
            exit 1
          fi
          echo "PASS: No /api references"
      - name: Check games present
        run: |
          if ! grep -q "launchGame\|data-game" /tmp/site.html; then
            echo "FAIL: No game launch mechanism found"
            exit 1
          fi
          echo "PASS: Games present"
      - name: Smoke test summary
        run: echo "All 5 post-deploy smoke checks PASSED"
```

### Why a 30s sleep
GitHub Pages CDN propagation takes 10-30s after the deploy action completes. Without a delay, curl may hit a stale cached version.

### Failure behavior
GitHub Actions will show the smoke-test job as failed with the specific check that triggered it. The deploy itself already succeeded — this is a post-deploy validation, not a gate.

## Next Step
Implement: add the smoke-test job to `.github/workflows/deploy-pages.yml`.
