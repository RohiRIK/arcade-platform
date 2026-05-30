#!/bin/bash
# IT Department — Log Naming Violation Rename Script
# Renames non-compliant log files to YYYYMMDDTHHMMSSZ-dept.json format
# Generated: 2026-05-30 Cycle 12
# 
# Usage: ./rename-log-violations.sh [--dry-run]
# Default: dry-run mode (shows renames without executing)
# Pass --execute to actually rename files.

set -euo pipefail
cd "$(dirname "$0")/../../../logs"

DRY_RUN=true
if [[ "${1:-}" == "--execute" ]]; then
  DRY_RUN=false
fi

rename_file() {
  local old="$1" new="$2"
  if [[ ! -f "$old" ]]; then
    echo "SKIP (not found): $old"
    return
  fi
  if [[ -f "$new" ]]; then
    echo "SKIP (target exists): $old -> $new"
    return
  fi
  if $DRY_RUN; then
    echo "WOULD RENAME: $old -> $new"
  else
    mv "$old" "$new"
    echo "RENAMED: $old -> $new"
  fi
}

echo "=== Log Naming Violation Renames ==="
echo "Mode: $( $DRY_RUN && echo 'DRY RUN' || echo 'EXECUTING' )"
echo ""

# Security (2 files)
rename_file "2026-05-29T1200-security.json"   "20260529T120000Z-security.json"
rename_file "2026-05-30T0600-security.json"    "20260530T060000Z-security.json"

# DevOps (5 files)
rename_file "2026-05-29T1450-devops.json"      "20260529T145000Z-devops.json"
rename_file "2026-05-29T1605-devops.json"       "20260529T160500Z-devops.json"
rename_file "2026-05-29T20-10-devops.json"      "20260529T201000Z-devops.json"
rename_file "20260529-1502-devops.json"          "20260529T150200Z-devops.json"
rename_file "20260529-1840-devops.json"          "20260529T184000Z-devops.json"

# QA (8 files)
rename_file "2026-05-29T1850-qa.json"           "20260529T185000Z-qa.json"
rename_file "2026-05-30T0030-qa.json"            "20260530T003000Z-qa.json"
rename_file "2026-05-30T0642-qa.json"            "20260530T064200Z-qa.json"
rename_file "2026-05-30T2350-qa.json"            "20260530T235000Z-qa.json"
rename_file "20260529-1450-qa.json"              "20260529T145000Z-qa.json"
rename_file "20260529-1740-qa.json"              "20260529T174000Z-qa.json"
rename_file "20260529-1900-qa.json"              "20260529T190000Z-qa.json"
rename_file "20260529-2350-qa.json"              "20260529T235000Z-qa.json"

# Infra (1 file)
rename_file "20260529T0950-infra.json"           "20260529T095000Z-infra.json"

# UX/UI (1 file)
rename_file "20260529T081547Z-uxui-mobile-touch-build.json" "20260529T081548Z-uxui.json"

# Board (1 file)
rename_file "20260530-0700-board.json"           "20260530T070000Z-board.json"

echo ""
echo "Done. Total: 18 files targeted."
