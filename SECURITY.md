# Security

## Reporting a vulnerability

Email **hello@texergy.ai** with the subject `Security: <short description>`. Please do not open public issues for vulnerabilities.

Acknowledgement target: 2 business days. Fix target: depends on severity, generally < 14 days for high/critical issues.

## Threat model & mitigations

The waitlist is a small, narrowly-scoped attack surface (one POST endpoint, one token-gated admin page) but worth taking seriously because it touches user PII (email + ZIP).

| Threat | Mitigation |
|---|---|
| Cross-site form abuse / CSRF | Same-origin check on `/api/waitlist` — `Origin` header must match `Host`. No cookies are read by the API, but the check is kept for defense in depth. |
| Email/ZIP enumeration via response | `INSERT OR IGNORE` + identical `{ok:true}` response on insert and conflict. Admin token comparison uses `timingSafeEqual`. |
| Spam / bot signups | (1) Honeypot field — tripped requests silently succeed without DB write. (2) In-memory rate limit, 5 / hour / hashed IP. |
| Sensitive data at rest | Only email + optional ZIP is stored. **Raw IPs are never stored** — only `SHA-256(IP_HASH_SALT \|\| ip)`. |
| Injection | All DB access uses parameterized statements via `@libsql/client` (`{ sql, args }` form). No user input is interpolated into SQL or shell. |
| XSS via email content | Email HTML is built from a static template; the only user-supplied string (their ZIP) is HTML-escaped before insertion. |
| PII in server logs | The waitlist route logs **only the Resend message id** on successful sends, never the email address. Errors log a generic message; full stack traces stay server-side. |
| Token leakage in URLs | `Referrer-Policy: no-referrer` is set specifically on `/admin/*` so the `?token=…` query string can't leak via the Referer header on outbound clicks. |
| Token leakage at rest | `ADMIN_TOKEN` and `RESEND_API_KEY` live only in `.env.local` (gitignored) or platform secrets. `adminTokenMatches` rejects tokens shorter than 24 chars to prevent accidentally-weak values. |
| Cache poisoning / stale state | All `/api/*` and `/admin/*` responses set `Cache-Control: no-store, max-age=0` so no proxy caches dynamic responses. |
| Clickjacking | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'`. |
| Mixed-content / TLS downgrade | `Strict-Transport-Security` with `preload`. |
| MIME sniffing | `X-Content-Type-Options: nosniff`. |
| Sensitive browser APIs | `Permissions-Policy: camera=(), microphone=(), geolocation=()`. |
| Search-engine indexing of admin / API | `app/robots.ts` disallows `/admin/` and `/api/`, plus `X-Robots-Tag: noindex, nofollow, noarchive` is sent on every admin response as defense-in-depth. |
| Dependency CVEs | `npm audit` is clean as of the last release. `postcss` is pinned to `^8.5.13` via `overrides` to override Next's older transitive dep that had GHSA-qx2v-qp2m-jg93. |

## Residual trade-offs (acknowledged, not "fixed")

- **Email enumeration via timing.** A new signup takes ~700ms (Turso write + awaited Resend send); a duplicate takes ~50ms. An attacker can probe whether a specific email is on the waitlist by measuring response time. Acceptable trade-off for a non-sensitive list — fixing it would require padding all responses to ~700ms and consume Vercel function-time budget on every request. The 5-req/hour rate limit caps how many addresses an attacker can probe.
- **In-memory rate-limit on serverless.** The token bucket lives in process memory, so each Vercel function instance has its own counts. A determined attacker who triggers cold starts can exceed the per-IP cap. Move to a shared store (Upstash Redis, Turso `ratelimit` table) if abuse becomes real. For a small waitlist, the current setup is enough to deflect casual scripts.

## What we explicitly do NOT defend against

- **Sophisticated email-spoof bots** that solve the honeypot by inspecting CSS. Add hCaptcha/Turnstile if signups become a target.
- **Spoofed `X-Forwarded-For` upstream of the rate-limiter.** Vercel sanitizes XFF before our code runs, so on Vercel this is fine. On any other host, deploy behind a CDN/edge that sets a trusted XFF.
- **Database disclosure via host compromise.** Turso encrypts data at rest, but the auth token grants full read/write. Treat the token like a password.

## Operational hygiene

- Rotate `ADMIN_TOKEN` and `IP_HASH_SALT` if anyone outside the trust boundary has seen them.
- Rotate `RESEND_API_KEY` if it appears in any chat, screenshot, log, or error report.
- Rotate `TURSO_AUTH_TOKEN` similarly: `turso db tokens invalidate texergy-waitlist && turso db tokens create texergy-waitlist`.
- Review the waitlist regularly via `npm run waitlist:list` or `/admin/waitlist?token=…`. Delete records on user request (the `email` column is UNIQUE, so deletion is straightforward).
- Periodically `npm audit` (or rely on GitHub Dependabot) and apply patches to dependencies.
