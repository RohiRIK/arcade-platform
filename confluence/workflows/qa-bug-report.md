# Workflow: QA Bug Report

## When to Use
- Any defect found during verification
- Any unexpected behavior in any game or platform feature

## Process

### Step 1: Reproduce
1. Document exact steps to reproduce (click X, press Y, observe Z)
2. Reproduce at least twice to confirm it's consistent
3. If intermittent, note frequency and conditions

### Step 2: Classify
- **P1-CRITICAL**: Game unplayable, site broken, data loss, security issue
- **P2-HIGH**: Game partially broken, feature not working, visual corruption
- **P3-MEDIUM**: Cosmetic issue, minor glitch, non-blocking
- **P4-LOW**: Polish, nice-to-have, minor inconsistency

### Step 3: Document
File must include:
- Title: "[P-level] Game/Component — One-line description"
- Steps to reproduce (numbered)
- Expected behavior
- Actual behavior
- Screenshot or video if visual
- Browser console errors if any
- Environment (browser, URL, local vs production)

### Step 4: Route
- P1-CRITICAL → R&D inbox immediately + CTO notification
- P2-HIGH → R&D inbox
- P3/P4 → R&D inbox, batch is fine

## Anti-Patterns
- ❌ "Something seems off" without steps to reproduce
- ❌ Filing bugs without trying to reproduce
- ❌ Downgrading severity to avoid escalation — if the game is broken, it's P1
