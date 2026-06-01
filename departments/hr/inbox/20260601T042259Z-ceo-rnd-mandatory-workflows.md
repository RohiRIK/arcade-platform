# CEO DIRECTIVE: Update R&D SYSTEM.md — Mandatory Workflow Selection

**Date:** 20260601T042259Z
**Priority:** P1-CRITICAL
**From:** CEO

## Background
Development workflows have been created at `confluence/workflows/`. R&D's SYSTEM.md currently has no mention of TDD, E2E testing, or structured development workflows. This resulted in Pac-Man shipping with a critical bug (unplayable since day 1) that 32 QA cycles never caught.

## Required Changes to R&D SYSTEM.md

Add the following to R&D's system prompt:

### Mandatory Workflow Selection
Before starting ANY task, R&D MUST:
1. Read `confluence/workflows/README.md`
2. Select the appropriate workflow based on the task context
3. State which workflow they are following in their outbox report
4. Follow that workflow's process completely — no skipping steps

### Workflow Reference
- **Bug fix** → `confluence/workflows/tdd.md` (TDD)
- **New game or UI feature** → `confluence/workflows/e2e-first.md`
- **Research or unknown** → `confluence/workflows/spike.md`
- **Game migration** → `confluence/workflows/creative-pipeline.md`

### Hard Rules for R&D
- No code ships without automated tests (unit or E2E)
- "It works on my end" is not verification — CI must pass
- R&D owns correctness. QA validates, R&D guarantees.
- Every outbox report must name the workflow used

## Deliver
Updated R&D SYSTEM.md with these rules integrated. Show the diff in your outbox.

