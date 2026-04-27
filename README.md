# Texergy AI

AI-ranked electricity-plan recommendations for Texas residents — early-access waitlist landing page.

Texergy reads the fine print on Power-to-Choose listings (bill credits, tiered rates, TDU pass-throughs, ETFs, renewable mix) and ranks the plans that actually fit a given household's usage and priorities. This repo is the marketing site + waitlist signup that gates early access.

## Stack

- **Next.js 16** (App Router) on **React 19**, TypeScript strict
- **Tailwind v4** (CSS-only `@theme` config, no `tailwind.config.js`)
- **better-sqlite3** with WAL journal mode for the waitlist
- **Zod** for input validation
- **Resend** (optional, lazy-loaded) for confirmation emails
- Hardened CSP / HSTS / X-Frame-Options / Permissions-Policy in `next.config.ts`

## Quick start

```bash
npm install
cp .env.local.example .env.local

# Fill in ADMIN_TOKEN and IP_HASH_SALT (32-byte random strings).
# Optionally fill in RESEND_API_KEY + WAITLIST_FROM_EMAIL.
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"

npm run dev
# → http://localhost:3000
```

Visit `/` for the marketing page. The waitlist form posts to `/api/waitlist`.

## Environment variables

See `.env.local.example` for the full list. At minimum:

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_TOKEN` | yes | Gates `/admin/waitlist` |
| `IP_HASH_SALT` | yes | Salt for SHA-256 hashing client IPs (no raw IPs are stored) |
| `RESEND_API_KEY` | no | Enables confirmation emails. Without it, the waitlist still works — emails are skipped. |
| `WAITLIST_FROM_EMAIL` | no | Required if `RESEND_API_KEY` is set. e.g. `Texergy AI <hello@texergy.ai>` |
| `WAITLIST_REPLY_TO` | no | Reply-to address (defaults to `WAITLIST_FROM_EMAIL`) |
| `WAITLIST_DB_PATH` | no | SQLite path; default `./data/waitlist.db` |

## Viewing the waitlist

**Browser** — `http://localhost:3000/admin/waitlist?token=<ADMIN_TOKEN>`
Shows the table; "Export CSV" button on the page hits `/admin/waitlist/export?token=…`.

**CLI**
```bash
npm run waitlist:list    # pretty table
npm run waitlist:csv     # CSV to stdout
npm run waitlist:json    # JSON array
```

## Security model

- **CSRF** — same-origin check on `/api/waitlist` (rejects cross-origin POSTs)
- **Rate limit** — 5 requests / hour / hashed IP, in-memory token bucket
- **Bot trap** — invisible honeypot field; tripped requests get a silent `200`
- **No enumeration** — duplicate emails return the same `{ok:true}` shape (`INSERT OR IGNORE`)
- **No raw IPs stored** — only `SHA-256(salt || ip)`; salt rotation invalidates rate-limit cache only
- **Parameterized SQL** — all DB writes use bound parameters
- **Strict CSP** in production: `default-src 'self'`, no `'unsafe-eval'`, no third-party origins
- **HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Permissions-Policy** all set in `next.config.ts`
- **Admin route** — `timingSafeEqual` token check; non-matching tokens return a 403 page
- **`/admin/` and `/api/` blocked from indexing** via `app/robots.ts`

See [`SECURITY.md`](./SECURITY.md) for the threat model and how to report issues.

## Project layout

```
src/
  app/
    page.tsx                       Marketing landing
    layout.tsx
    globals.css
    robots.ts                      Disallows /admin/ and /api/
    api/waitlist/route.ts          POST endpoint
    admin/waitlist/page.tsx        Token-gated viewer
    admin/waitlist/export/route.ts CSV download
  components/
    FloatingNav.tsx
    PlanCarousel.tsx               Real plan samples from Power to Choose
    WaitlistForm.tsx
  lib/
    db.ts                          better-sqlite3 wrapper (WAL)
    email.ts                       Resend client (no SDK; pure fetch)
    rate-limit.ts                  In-memory token bucket
    validation.ts                  Zod schemas
    admin-auth.ts                  Constant-time token check
scripts/
  list-waitlist.mjs                CLI viewer
data/                              SQLite file lives here (gitignored)
```

## Deploying

The waitlist API and admin pages need a Node runtime that can write to a persistent volume (for SQLite). Good fits:

- **Fly.io** with a 1 GB volume mounted at `/app/data` and `WAITLIST_DB_PATH=/app/data/waitlist.db`
- **Railway** with a volume
- **Any small VPS** running `npm run build && npm run start` behind a reverse proxy

For platforms with **ephemeral disk** (Vercel serverless, Netlify Functions), swap `src/lib/db.ts` for a Postgres client (Neon, Supabase, etc.) — schema is small and the wrapper API is stable.

Set these as platform secrets in production: `ADMIN_TOKEN`, `IP_HASH_SALT`, `RESEND_API_KEY`, `WAITLIST_FROM_EMAIL`.

## License

MIT — see [`LICENSE`](./LICENSE).
