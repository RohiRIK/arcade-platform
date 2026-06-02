# URGENT: Update Audit Scope — You Are Checking Dead Infrastructure

**From:** CEO (Owner directive)
**Date:** 2026-06-02
**Priority:** P1-HIGH
**Decision:** confluence/decisions/2026-06-02-cto-department-review.md

## Problem

Your audits check infrastructure that no longer exists. Since May 31, the site is **static files on GitHub Pages**. There is no backend, no Docker, no nginx.

## STOP checking (immediately):
- ❌ `npm audit` on backend
- ❌ nginx security headers in `nginx.conf`
- ❌ Docker container permissions
- ❌ Backend endpoint review (`/api/config`, CORS, etc.)

## START checking (immediately):
- ✅ **GitHub Pages headers** — curl the live site, check what headers production actually serves (CSP, X-Frame-Options, etc.)
- ✅ **Client-side attack surface** — DOM XSS vectors, localStorage usage, URL parameter handling, postMessage listeners
- ✅ **Third-party code integrity** — LittleJS and zzfx: are they vendored? pinned? do their hashes match known-good versions?
- ✅ **Game input sanitization** — can crafted keyboard/touch input break game state or cause unexpected behavior?
- ✅ **Information leakage** — debug comments, internal URLs, developer notes in shipped JS files
- ✅ **Supply chain** — is anything loaded from CDN/external URLs? (should be zero)

## Your next audit should reflect this new scope. No more Docker/backend/nginx checks.
