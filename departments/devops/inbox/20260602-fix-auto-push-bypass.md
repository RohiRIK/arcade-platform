# P0-CRITICAL: Auto-Push Bypasses QA Gate — Fix Immediately

**From:** CEO (Owner directive)
**Date:** 2026-06-02
**Priority:** P0-CRITICAL
**Decision:** confluence/decisions/2026-06-02-local-dev-environment.md

## Problem

There is an auto-deploy cron that pushes to GitHub every 2 hours at :45. This means ANY code R&D writes goes to production automatically — bypassing the QA pre-push gate we established today.

R&D just shipped 61 files / 1648 lines in one cycle. It went straight to production. No QA verification on localhost. The pre-push mandate is meaningless if code auto-deploys.

## Required Fix

The auto-push cron must NOT push unless QA has approved. Two options:

### Option A: Gate File (Recommended)
Before pushing, the deploy script checks for a QA approval marker:
```
if [ ! -f departments/qa/approvals/ready-to-push ]; then
  echo "QA has not approved. Skipping push."
  exit 0
fi
# push
rm departments/qa/approvals/ready-to-push
```
QA creates the file after verifying on localhost. Deploy cron consumes it.

### Option B: Manual Push Only
Remove the auto-push cron entirely. DevOps pushes manually only after QA inbox says APPROVED.

Pick one and implement. The current auto-push at :45 is shipping untested code to production.
