# Advisory: Frontend Docker Container Runs as Root

**Severity**: P3
**File**: `frontend/Dockerfile`

## Issue
`frontend/Dockerfile` has no `USER` directive. The `nginx:alpine` base image defaults to running as root. While the frontend only serves static files (lower risk than backend), a container escape from a root process grants full host access.

## Recommendation
1. Use `nginx-unprivileged` base image (e.g., `nginxinc/nginx-unprivileged:alpine`), which listens on 8080 as non-root by default
2. Or add a custom user and configure nginx to listen on a non-privileged port, then map externally

## Sent To
DevOps inbox — Dockerfile change required.
