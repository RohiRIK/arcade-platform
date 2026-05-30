# Advisory: Unauthenticated Config Write Endpoint

**Severity**: P2  
**File**: `backend/src/index.js`, lines 31-35  
**Endpoint**: `PUT /api/config`

## Issue
Any HTTP client can overwrite server configuration. No authentication, no authorization, no input validation. Combined with `cors()` allowing all origins (line 13), any website can modify the backend config via cross-origin request.

## Recommendation
1. Add authentication middleware to `PUT /api/config` (even a simple API key check)
2. Validate request body against a schema before applying
3. Restrict CORS to the frontend origin only: `cors({ origin: 'http://localhost:80' })`

## Sent To
R&D inbox — code-level fix required.
