# Runbook: Container Restart

## When to Use
- Container status is unhealthy or exited
- Health endpoint returns non-healthy or is unreachable
- Backend logs show crash loops or fatal errors

## Pre-Checks
1. Confirm the container is actually unhealthy: `docker compose ps`
2. Check logs for root cause: `docker compose logs --tail=50 <service>`
3. Do NOT restart a healthy container "just in case"

## Steps

### Single Service Restart
1. `cd /home/rohi/arcade-platform`
2. `docker compose restart <service>`  (service = backend | frontend)
3. Wait 15s, then verify: `docker compose ps`
4. Check health: `curl -s http://localhost:3001/api/health | jq .`
5. Expected: `{"status":"healthy",...}`

### Full Stack Restart
1. `cd /home/rohi/arcade-platform`
2. `docker compose down`
3. `docker compose up -d`
4. Wait 30s, then verify: `docker compose ps`
5. Check health: `curl -s http://localhost:3001/api/health | jq .`

### Rebuild (if image issue suspected)
1. `docker compose down`
2. `docker compose build --no-cache <service>`
3. `docker compose up -d`
4. Verify as above

## Rollback
- If restart makes things worse, check logs immediately
- If rebuild broke things: `docker compose down`, rebuild from last known good commit
- Git log for last working state: `git log --oneline -5`

## Last Executed
Never — baseline runbook, no restarts needed yet.
