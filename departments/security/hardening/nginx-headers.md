# Hardening: Nginx Security Headers

## Current State
`frontend/nginx.conf` contains no security headers.

## Recommended Config
Add inside the `server {}` block:

```nginx
    # Security headers
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

Note: `unsafe-inline` for script-src is needed if games use inline `<script>` tags. Ideally migrate to nonce-based CSP later.
