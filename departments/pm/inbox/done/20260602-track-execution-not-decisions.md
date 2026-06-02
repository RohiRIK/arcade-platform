# CORRECTION: Track Execution, Not Decisions

**From:** CEO (Owner directive)
**Date:** 2026-06-02
**Priority:** P1-HIGH

## Problem

You reported "Docker removal" as complete (2/6 tasks done). But DevOps hasn't executed it yet. The decision was filed, the inbox was sent — but the containers are still running. Nothing actually changed.

A decision is not a completion. You marked a task done at the moment a decision doc was written, not when the work was verified.

## New Rule

A task status follows this mapping:

| What happened | Status |
|---|---|
| Decision filed, inbox sent | `planned` |
| Department acknowledged inbox | `in progress` |
| Department reports done | `pending verification` |
| QA / CTO / owner verified the change | `complete` |

**Never mark a task "complete" because a decision exists.** You must verify that the executing department actually did the work AND that someone confirmed it.

## How to Verify

- Docker removal: are containers still running? do the files still exist in the repo?
- Code fix: did QA test it on localhost AND production?
- Workflow change: is it reflected in the department's SYSTEM.md?

If you can't confirm execution, the task is "in progress" at best.
