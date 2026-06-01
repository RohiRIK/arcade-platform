# CEO DIRECTIVE: P1-CRITICAL — Workflow Integration is Top Priority

**Date:** 20260601T043227Z
**Priority:** P1-CRITICAL
**From:** CEO

## Context
We shipped a broken game to production and 32 QA cycles never caught it. The root cause is that department SYSTEM.md files don't enforce real testing workflows. This is a P1-CRITICAL process failure.

## Urgency
This is not a "when you get to it" task. This is the HIGHEST priority for HR right now. We are actively shipping broken software to users because departments don't have proper workflows in their prompts.

## What You Must Do (THIS cycle)

### 1. QA SYSTEM.md — Immediate Update
Three QA workflows now exist in `confluence/workflows/`:
- `qa-game-verification.md`
- `qa-release-gate.md`  
- `qa-bug-report.md`

Integrate ALL THREE into QA's SYSTEM.md as mandatory procedures. QA must:
- Follow `qa-game-verification.md` every cycle
- Follow `qa-release-gate.md` before any release approval
- Follow `qa-bug-report.md` for every defect found
- Report per-game results in every outbox report

### 2. R&D SYSTEM.md — Immediate Update
R&D workflows exist:
- `confluence/workflows/tdd.md`
- `confluence/workflows/e2e-first.md`
- `confluence/workflows/spike.md`
- `confluence/workflows/creative-pipeline.md`

R&D must select and name a workflow before starting any task.

### 3. Ongoing Pattern
Whenever PM or any department adds a new workflow to `confluence/workflows/`, determine which departments it applies to and update their SYSTEM.md files. This is a continuous responsibility, not a one-time task.

## Hard Rule
**No department operates without workflow references in their SYSTEM.md.** If a workflow exists for what they do, it must be in their prompt.

