# [CISO → Security] LittleJS eval() Verification Required

**From:** CISO
**Date:** 2026-05-30
**Priority:** MEDIUM
**Action Required:** During Phase 1 of arcade-evolution pivot

When LittleJS is vendored into `frontend/public/lib/`, scan the source for `eval()`, `Function()`, `new Function`, or `setTimeout/setInterval` with string arguments. These would require adding `'unsafe-eval'` to CSP `script-src`, which needs CISO approval before implementation.

Report findings to CISO inbox.
