#!/usr/bin/env bash
# ci.sh — Local CI pipeline for Arcade Platform (static site)
# Validates static files served via GitHub Pages. No Docker.
# Usage: ./ci.sh [build|test]  (default: full pipeline)
# Exit 0 = all pass, Exit 1 = any failure
set -euo pipefail

MODE="${1:-full}"
EXPECTED_GAMES=7
PUBLIC_DIR="frontend/public"

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
  printf "  %-25s %s — %s\n" "$name" "$status" "$detail"
}

echo "=== Arcade Platform CI (static) ==="
echo "Mode: $MODE"
echo ""

# ── Stage 1: File Structure Check ──
stage_structure() {
  echo "Stage 1: File structure"
  local errors=0

  # index.html must exist
  if [ ! -f "$PUBLIC_DIR/index.html" ]; then
    report_stage "index-html" "FAIL" "missing $PUBLIC_DIR/index.html"
    errors=1
  else
    report_stage "index-html" "PASS" "exists"
  fi

  # Count game JS files
  local game_count=0
  if [ -d "$PUBLIC_DIR/js/games" ]; then
    game_count=$(find "$PUBLIC_DIR/js/games" -name "*.js" -type f | wc -l)
  fi
  if [ "$game_count" -ge "$EXPECTED_GAMES" ]; then
    report_stage "game-files" "PASS" "$game_count game JS files (expected >=$EXPECTED_GAMES)"
  else
    report_stage "game-files" "FAIL" "$game_count game JS files (expected >=$EXPECTED_GAMES)"
    errors=1
  fi

  # No Docker artifacts should exist
  local docker_found=0
  for f in docker-compose.yml frontend/Dockerfile frontend/nginx.conf; do
    if [ -f "$f" ]; then
      echo "  WARNING: Docker artifact still exists: $f"
      docker_found=1
    fi
  done
  if [ -d "backend" ]; then
    echo "  WARNING: backend/ directory still exists"
    docker_found=1
  fi
  if [ "$docker_found" -eq 0 ]; then
    report_stage "no-docker" "PASS" "no Docker artifacts found"
  else
    report_stage "no-docker" "FAIL" "Docker artifacts still in repo"
    errors=1
  fi

  return $errors
}

# ── Stage 2: No Stale References ──
stage_stale_refs() {
  echo "Stage 2: Stale reference check"
  local errors=0

  # Check index.html for /api/ references
  if grep -q "/api/" "$PUBLIC_DIR/index.html" 2>/dev/null; then
    report_stage "no-api-refs" "FAIL" "/api/ references found in index.html"
    errors=1
  else
    report_stage "no-api-refs" "PASS" "no /api/ references"
  fi

  # Check for Backend offline
  if grep -qi "Backend offline" "$PUBLIC_DIR/index.html" 2>/dev/null; then
    report_stage "no-backend-offline" "FAIL" "'Backend offline' found in index.html"
    errors=1
  else
    report_stage "no-backend-offline" "PASS" "no 'Backend offline' message"
  fi

  # Check for Config tab
  if grep -qi "showSection('config')" "$PUBLIC_DIR/index.html" 2>/dev/null; then
    report_stage "no-config-tab" "FAIL" "Config tab found in index.html"
    errors=1
  else
    report_stage "no-config-tab" "PASS" "no Config tab"
  fi

  return $errors
}

# ── Stage 3: Asset Size Budget ──
stage_size() {
  echo "Stage 3: Asset size check"
  local total_kb
  total_kb=$(du -sk "$PUBLIC_DIR" | awk '{print $1}')
  local total_mb=$((total_kb / 1024))

  if [ "$total_kb" -gt 512000 ]; then
    report_stage "asset-size" "FAIL" "${total_mb}MB exceeds 500MB budget"
  else
    report_stage "asset-size" "PASS" "${total_kb}KB total (${total_mb}MB)"
  fi
}

# ── Stage 4: Local Server Smoke Test ──
stage_smoke() {
  echo "Stage 4: Local smoke test"

  # Start a simple HTTP server
  local port=8787
  (cd "$PUBLIC_DIR" && python3 -m http.server "$port" &>/dev/null) &
  local server_pid=$!
  sleep 1

  # Check HTTP 200
  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port/" 2>/dev/null || echo "000")
  if [ "$http_code" = "200" ]; then
    report_stage "http-200" "PASS" "localhost:$port returns 200"
  else
    report_stage "http-200" "FAIL" "localhost:$port returns $http_code"
  fi

  # Check games present in HTML
  if curl -s "http://localhost:$port/" 2>/dev/null | grep -q "launchGame\|data-game"; then
    report_stage "games-in-html" "PASS" "game launch mechanism found"
  else
    report_stage "games-in-html" "FAIL" "no game launch mechanism"
  fi

  kill "$server_pid" 2>/dev/null || true
  wait "$server_pid" 2>/dev/null || true
}

# ── Stage 5: Post-Deploy Verification ──
stage_deploy_verify() {
  echo "Stage 5: Production verification"
  local http_code
  http_code=$(curl -s -o /tmp/arcade-live.html -w "%{http_code}" https://arcade.rohi-lab.org 2>/dev/null || echo "000")
  if [ "$http_code" = "200" ]; then
    report_stage "prod-http-200" "PASS" "arcade.rohi-lab.org returns 200"
  else
    report_stage "prod-http-200" "FAIL" "arcade.rohi-lab.org returns $http_code"
    return 0
  fi

  # Hash comparison
  local live_hash local_hash
  live_hash=$(md5sum /tmp/arcade-live.html 2>/dev/null | awk '{print $1}')
  local_hash=$(md5sum "$PUBLIC_DIR/index.html" 2>/dev/null | awk '{print $1}')
  if [ "$live_hash" = "$local_hash" ]; then
    report_stage "hash-match" "PASS" "live matches local ($live_hash)"
  else
    report_stage "hash-match" "FAIL" "live=$live_hash local=$local_hash"
  fi
}

# ── Report ──
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
  stage_structure || true
  stage_stale_refs || true
  stage_size || true
}

run_test() {
  stage_smoke || true
  stage_deploy_verify || true
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
