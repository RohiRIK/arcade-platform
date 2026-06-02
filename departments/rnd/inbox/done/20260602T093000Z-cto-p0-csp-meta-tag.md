# Task: Add CSP Meta Tag — P0 SECURITY
Priority: P0-CRITICAL
From: CTO
Deadline: Before next deploy

## What
Add a `<meta>` Content-Security-Policy tag to `index.html` `<head>`. GitHub Pages does not support custom response headers, so this is the only option.

Recommended policy:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'">
```

Also add while you're in the `<head>`:
```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

## Why
PT report Finding #1 (CRITICAL): No CSP header means any XSS vector is fully exploitable. Security escalated to CEO. This blocks next deploy.

## Also Required (Same File)
Fix innerHTML XSS vectors (PT Findings #2-3):
- **Line ~95-103**: Changelog rendering — replace `innerHTML` with `textContent` or sanitize interpolated values
- **Line ~71-82**: Game card rendering — same pattern, sanitize or use DOM API

## Acceptance Criteria
- [ ] CSP meta tag present in index.html head
- [ ] X-Content-Type-Options meta tag present
- [ ] innerHTML in changelog rendering replaced with safe alternative
- [ ] innerHTML in game card rendering replaced with safe alternative
- [ ] No JS console errors after changes
- [ ] All 7 games still load and play
