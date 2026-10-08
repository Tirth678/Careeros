# Deploy the frontend MVP

Import Tirth678/Careeros in Vercel. Select the branch codex/mvp-careeros-ui
and set Root Directory to frontend. Use Node.js 22.x.
The included vercel.json selects Vite, npm ci, npm run build:demo, and dist.
Enable access to files outside the root directory if Vercel asks:
frontend types reference backend/packages/shared-types (types only).

No environment variables or database credentials are needed for the demo.
This is a public fixture-based presentation, not authenticated production.
Profile, skills, and roadmap edits are in-memory and reset on reload.
AI is a UI preview. Roadmap guides link to roadmap.sh.
The /api/jobs function fetches public job pages with a 60-second CDN cache.
Some sources may block Vercel even when they work locally; the UI reports that.
Never put private keys, database URLs, or server secrets in VITE_ variables.

For real authenticated production, change Build Command to npm run build,
set VITE_NEON_AUTH_URL and VITE_API_URL to your deployed services, and configure
their allowed frontend origins. Host the backend separately. Do not use
build:demo for private student records. No database migrations are run here.
