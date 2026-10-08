# CareerOS

React/Vite frontend, Node.js/Express services, Auth.js (the NextAuth project)
Google OAuth, and Prisma with Neon Postgres. Auth.js uses its official Express
adapter because the application is not a Next.js application. The Express
adapter is experimental; its version is pinned and covered by regression tests.

## Local setup

Requires Node 22.12+ and pnpm 11.25.0.

1. In `backend`, run `pnpm install` and `pnpm db:generate`.
2. Copy `backend/.env.example` to `backend/.env`, preserving existing credentials.
   Set `DATABASE_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, and
   `INTERNAL_SERVICE_SECRET`. Generate independent secrets using
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
3. Configure a Google OAuth **Web application**, with origin
   `http://localhost:5173` and authorized redirect URI
   `http://localhost:5173/api/auth/callback/google`. Add test users if the Google
   consent screen is in testing mode. Never put the Google secret in `VITE_*`.
4. Prepare the database as described below, then run `pnpm db:seed` in `backend`.
5. Run `pnpm dev` in `backend` and `npm install` then `npm run dev` in `frontend`.
6. Open **http://localhost:5173** (use this hostname consistently for cookies
   and OAuth). Ports 3000–3003 run the gateway, profile, career, and AI services.

Google sign-in creates the student row. Profile edits, skills, analysis, roadmap
generation, task status, and dashboard data use persisted API records. Without
Google credentials, local servers boot but sign-in displays a configuration
error. There is no authentication bypass. Development without an OpenRouter key
uses the existing deterministic roadmap provider; production requires a real key.

## Database migration

Migrations are checked in under `backend/packages/database/prisma/migrations`.
Use an isolated Neon development branch and a direct connection for migration
testing before applying to production. The app uses the pooled connection.

- **Empty database:** from `backend/packages/database`, with `DATABASE_URL` set
  in the process environment, run `pnpm migrate:deploy`.
- **Existing database matching the old repository schema:** first verify the
  existing schema matches the baseline. Then run
  `pnpm exec prisma migrate resolve --applied 202610080001_baseline`, followed by
  `pnpm migrate:deploy`. Do not mark the baseline applied on an unrelated schema.
- Prisma CLI commands run in the database package; export `DATABASE_URL` in
  the shell or use Node's `--env-file=../../.env` with the Prisma CLI. The backend
  runtime loads `backend/.env`; Prisma CLI does not use that custom loader.

The Auth.js migration adds a verification timestamp and separate `auth_*`
tables. Legacy accounts/sessions and all career/profile data remain intact.
Legacy identities are not automatically linked by email. Existing users with
the same email need an explicit, verified account migration before Google
can link to their old profile; legacy sessions do not authenticate to Auth.js.

The connected database was inspected read-only during implementation. Its legacy
tables exist, but Auth.js tables were not present. **Migrations have not been
applied to the supplied database.** Test them on a Neon branch first.

## Verification

In `backend`: `pnpm typecheck` and `pnpm test`.
In `frontend`: `npm run build`.

Tests cover anonymous access, forged identities, private resource ownership,
service authentication, traversal, CSRF endpoints, session restoration and
logout revocation using a controlled adapter. They do not replace live Google
OAuth or migration tests. After configuring Google and migrating a test branch:
sign in, edit a profile, add skills, analyze a career, generate a roadmap, change
a task status, reload, and sign out. Confirm the API then returns 401.

## Deployment

Build the frontend with `npm ci && npm run build`. Start the backend with
`pnpm start` from `backend`; in production the gateway serves `frontend/dist`
and supports SPA routes. The Dockerfile packages both and exposes port 3000.
Supply secrets at runtime; `.env` files are excluded from the image.

Set `NODE_ENV=production`, HTTPS `APP_URL`, matching `CORS_ORIGINS`, real Google
credentials, and a real OpenRouter key. Register
`https://YOUR_DOMAIN/api/auth/callback/google` in Google. Put TLS in front of
the gateway and set `TRUST_PROXY_HOPS` to the exact number of trusted proxies.
Keep ports 3001–3003 private. All service calls additionally require an internal
secret; user identity is injected only after the gateway checks the session.

This deployment recipe is for one gateway instance. The in-memory rate limiter
must be replaced with a shared store before horizontal scaling. Configure
backups, monitoring, and provider quotas before launch. Live OAuth, migration
testing, dependency advisories, and production deployment remain release checks.

References: [Auth.js Express](https://authjs.dev/reference/express),
[Prisma adapter](https://authjs.dev/getting-started/adapters/prisma).
