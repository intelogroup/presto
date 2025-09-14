Diagnosis of /api/chat/status 500 error on remote Railway deployment

What I tested:
- GET /api/health => 200 OK (healthy)
- GET /api/status => 200 OK (operational)
- GET /api/templates => 200 OK
- GET /api/warmup => 200 OK (warmed-up)
- GET / (frontend) => 200 OK (frontend pages load)
- GET /api/chat/status => 500 Internal Server Error (remote)

Likely causes (remote-only):
- Unhandled exception inside routes/chat.js GET /status handler (check server logs)
- Possible culprits:
  - Accessing req.body without checking (fixed locally), or req.connection may be missing (fixed locally)
  - Requiring config/openai-config may throw in remote environment (missing env var or dependency)
  - A runtime error inside openai-config (e.g. wrong MODEL_CONFIG reference) — fixed locally by using PRIMARY_MODEL

Recommended debugging steps on Railway (you or your maintainer):
1. Open Railway logs for the backend service and filter for stack trace around the time you called GET /api/chat/status. Look for the exact error and file/line reference.
2. Verify environment variables in Railway: OPENROUTER_API_KEY must be set. Also confirm ALLOWED_ORIGINS includes your frontend origin(s).
3. If logs show the error originates from routes/chat.js line that logs request body or ip, consider applying the local patches in this repo (protecting req.body and req.connection access). These changes are already present in this branch and need deployment.
4. As a temporary measure, restart the Railway service to ensure the latest environment variables are picked up.
5. If you want, I can prepare a minimal PR with the logging fixes and the MODEL config fix (already applied locally). Deploying that PR to Railway should resolve the error if it originates from unguarded request body access or MODEL_CONFIG typo.

If you want me to proceed:
- I can push the code changes and open a PR (I cannot push to remote for you; you must approve/deploy), or
- I can prepare a patch file you can apply on your CI/deploy environment, or
- If you provide Railway logs (stack trace), I can pinpoint and patch the exact cause.

