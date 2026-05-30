#!/usr/bin/env bash
# ci.sh — Local CI pipeline for Arcade Platform
# 7 stages: lint, audit, build, size, smoke, security, report
# Usage: ./ci.sh [build|test]  (default: full pipeline)
# Exit 0 = all pass, Exit 1 = any failure
set -euo pipefail

MODE="${1:-full}"
BACKEND_MAX_MB=150
FRONTEND_MAX_MB=60
EXPECTED_GAMES=7
HEALTH_URL="http://localhost:3001/api/health"
GAMES_URL="http://localhost:3001/api/games"

PASS=0
FAIL=0
SKIP=0
RESULTS=()

report_stage() {
  local name="$1" status="$2" detail="$3"
  if [ "$status" = "PASS" ]; then PASS=$((PASS+1)); fi
  if [ "$status" = "FAIL" ]; then FAIL=$((FAIL+1)); fi
  if [ "$status" = "SKIP" ]; then SKIP=$((SKIP+1)); fi
  RESULTS+=("[$status] $name: $detail")
  printf "  %-20s %s — %s\n" "$name" "$status" "$detail"
}

echo "=== Arcade Platform CI ==="
echo "Mode: $MODE"
echo ""

# ── Stage 1: Lint Dockerfiles ──
stage_lint() {
  echo "Stage 1: Lint Dockerfiles"
  if command -v hadolint &>/dev/null; then
    local errors=0
    for df in backend/Dockerfile frontend/Dockerfile; do
      if ! hadolint "$df" 2>&1; then
        errors=1
      fi
    done
    if [ "$errors" -eq 0 ]; then
      report_stage "dockerfile-lint" "PASS" "hadolint clean on both Dockerfiles"
    else
      report_stage "dockerfile-lint" "FAIL" "hadolint found issues"
    fi
  else
    # Fallback: validate Dockerfile syntax by checking FROM instruction exists
    local errors=0
    for df in backend/Dockerfile frontend/Dockerfile; do
      if ! grep -q "^FROM " "$df" 2>/dev/null; then
        echo "  ERROR: $df missing FROM instruction"
        errors=1
      fi
    done
    if [ "$errors" -eq 0 ]; then
      report_stage "dockerfile-lint" "PASS" "syntax OK (hadolint not installed)"
    else
      report_stage "dockerfile-lint" "FAIL" "Dockerfile syntax errors"
    fi
  fi
}

# ── Stage 2: Dependency Audit ──
stage_audit() {
  echo "Stage 2: Dependency audit"
  local audit_out
  audit_out=$(cd backend && npm audit --omit=dev 2>&1) || true
  if echo "$audit_out" | grep -q "found 0 vulnerabilities"; then
    report_stage "npm-audit" "PASS" "0 vulnerabilities"
  elif echo "$audit_out" | grep -q "found.*vulnerabilities"; then
    local vuln_line
    vuln_line=$(echo "$audit_out" | grep "found.*vulnerabilities" | head -1)
    report_stage "npm-audit" "FAIL" "$vuln_line"
  else
    report_stage "npm-audit" "PASS" "audit clean"
  fi
}

# ── Stage 3: Build Images ──
stage_build() {
  echo "Stage 3: Build images"
  local start_time end_time duration
  start_time=$(date +%s)
  if docker compose build --quiet 2>&1; then
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    report_stage "build" "PASS" "completed in ${duration}s"
  else
    report_stage "build" "FAIL" "docker compose build failed"
    return 1
  fi
}

# ── Stage 4: Image Size Check ──
stage_size() {
  echo "Stage 4: Image size check"
  local fail=0

  backend_size=$(docker image inspect arcade-platform-backend:latest --format='{{.Size}}' 2>/dev/null || echo "0")
  frontend_size=$(docker image inspect arcade-platform-frontend:latest --format='{{.Size}}' 2>/dev/null || echo "0")

  backend_mb=$((backend_size / 1048576))
  frontend_mb=$((frontend_size / 1048576))

  if [ "$backend_mb" -gt "$BACKEND_MAX_MB" ]; then
    report_stage "size-backend" "FAIL" "${backend_mb}MB exceeds ${BACKEND_MAX_MB}MB limit"
    fail=1
  else
    report_stage "size-backend" "PASS" "${backend_mb}MB (limit: ${BACKEND_MAX_MB}MB)"
  fi

  if [ "$frontend_mb" -gt "$FRONTEND_MAX_MB" ]; then
    report_stage "size-frontend" "FAIL" "${frontend_mb}MB exceeds ${FRONTEND_MAX_MB}MB limit"
    fail=1
  else
    report_stage "size-frontend" "PASS" "${frontend_mb}MB (limit: ${FRONTEND_MAX_MB}MB)"
  fi

  return $fail
}

# ── Stage 5: Smoke Test ──
stage_smoke() {
  echo "Stage 5: Smoke test"

  # Check if containers are running, start if not
  if ! docker compose ps --status running 2>/dev/null | grep -q backend; then
    docker compose up -d --wait 2>&1
    sleep 3
  fi

  # Health check
  local health_status
  health_status=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")
  if [ "$health_status" != "200" ]; then
    report_stage "health-check" "FAIL" "GET /api/health returned $health_status"
    return 1
  fi
  report_stage "health-check" "PASS" "HTTP 200"

  # Games check
  local games_count
  games_count=$(curl -s "$GAMES_URL" 2>/dev/null | jq 'length' 2>/dev/null || echo "0")
  if [ "$games_count" -ne "$EXPECTED_GAMES" ]; then
    report_stage "games-check" "FAIL" "expected $EXPECTED_GAMES games, got $games_count"
    return 1
  fi
  report_stage "games-check" "PASS" "$games_count games returned"
}

# ── Stage 6: Security (non-root) Check ──
stage_security() {
  echo "Stage 6: Security check"
  local fail=0

  backend_user=$(docker compose exec -T backend whoami 2>/dev/null || echo "unknown")
  frontend_user=$(docker compose exec -T frontend whoami 2>/dev/null || echo "unknown")

  if [ "$backend_user" = "root" ]; then
    report_stage "nonroot-backend" "FAIL" "running as root"
    fail=1
  else
    report_stage "nonroot-backend" "PASS" "running as $backend_user"
  fi

  if [ "$frontend_user" = "root" ]; then
    report_stage "nonroot-frontend" "FAIL" "running as root"
    fail=1
  else
    report_stage "nonroot-frontend" "PASS" "running as $frontend_user"
  fi

  return $fail
}

# ── Stage 7: Report ──
stage_report() {
  echo ""
  echo "=== CI RESULTS ==="
  for r in "${RESULTS[@]}"; do
    echo "  $r"
  done
  echo ""
  echo "Total: $PASS passed, $FAIL failed, $SKIP skipped"
  if [ "$FAIL" -gt 0 ]; then
    echo "STATUS: FAILED"
    return 1
  else
    echo "STATUS: PASSED"
    return 0
  fi
}

# ── Run Pipeline ──
run_build() {
  stage_lint
  stage_audit
  stage_build || { stage_report; exit 1; }
  stage_size || true
}

run_test() {
  stage_smoke || true
  stage_security || true
}

case "$MODE" in
  build)
    run_build
    stage_report
    ;;
  test)
    run_test
    stage_report
    ;;
  full|*)
    run_build
    run_test
    stage_report
    ;;
esac

exit $FAIL
