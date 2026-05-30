# Advisory: Docker Containers Running as Root

**Severity**: Medium  
**Files**: `backend/Dockerfile`, `frontend/Dockerfile`

## Issue
Neither Dockerfile specifies a `USER` directive. Both containers run as root by default.

## Recommendation

**Backend** — add before `CMD`:
```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```

**Frontend** — nginx:alpine needs port 80 which requires root. Options:
- Use `nginx-unprivileged` base image and listen on 8080
- Or accept root for nginx (common pattern) but document the risk

## Sent To
Infra/DevOps inbox.
