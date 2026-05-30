# Cross-Department Delegation Protocol

## How to Request Work from Another Department
Write a task file to their inbox: `departments/<dept>/inbox/<timestamp>-<topic>.md`

## Task File Format
```
# Task: <clear title>
Priority: high|medium|low
From: <your department>
Deadline: next cycle | 2 cycles | when ready

## What
<specific, unambiguous description>

## Acceptance Criteria
- [ ] <testable criterion>

## Context
<why this matters, links to your research>
```

## Rules
1. Only CEO can override priorities.
2. Departments must check their inbox every run.
3. Completed tasks get moved to the requesting department's inbox with a "Done:" prefix.
4. If you can't do it, reply with a "Blocked:" file explaining why.
5. Cross-department requests should be self-contained — don't assume the other department knows your context.

## Department Codes
- CEO: ceo
- R&D: rnd
- UX/UI: uxui
- Infrastructure: infra
- Project Management: pm
- Board: board
