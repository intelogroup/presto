PR draft: Fix chat logging crash, OpenRouter model typo, and frontend API routing

Summary
- Fixes crash in routes/chat.js where logRequest assumed req.body was present (caused GET /api/chat/status to 500).
- Makes CORS origins configurable and adds preview/backend origins to default allowlist in server.js.
- Fixes testConnection model reference in config/openai-config.js (use PRIMARY_MODEL).
- Frontend: normalize PPTX request payloads and route API calls through VITE_API_BASE_URL (apiFetch wrapper). Prevents malformed requests to /api/generate-pptx.
- Small logging and robustness improvements; added debug doc at docs/failed/CHAT_STATUS_DEBUG.md.

Files changed
- server.js
- routes/chat.js
- config/openai-config.js
- frontend/src/App.jsx
- docs/failed/CHAT_STATUS_DEBUG.md

Environment variables to verify on Railway
- OPENROUTER_API_KEY (required)
- ALLOWED_ORIGINS (optional) — comma-separated list; include https://presto-frontend-production.up.railway.app and any preview origins
- VITE_API_BASE_URL (frontend) — set to https://presto-backend-production.up.railway.app

Deployment & verification steps
1. Push branch ai_main_e3f98aa94905 to remote and create a draft PR targeting your production branch.
2. Deploy the branch on Railway (or merge to main if ready).
3. Verify endpoints:
   - GET /api/health → 200 OK
   - GET /api/status → 200 OK
   - GET /api/templates → 200 OK
   - GET /api/chat/status → 200 OK (should no longer return 500)
   - Try generating a PPTX from frontend: open https://presto-frontend-production.up.railway.app and create a simple 3-slide request.
4. If any errors persist, collect Railway logs for timestamps when /api/chat/status is called and paste them here.

Notes
- I cannot push or open the PR for you. Use the repository UI: click Push Code (top-right), then Create New PR and deploy.
- I can prepare follow-up fixes if logs show additional stack traces after this deploy.

If you want, I can also prepare an automated health-check endpoint in the frontend UI that polls /api/health and shows status; say “yes add health UI”.
