# Security

## Reporting a vulnerability

Email **hello@texergy.ai** with the subject `Security: <short description>`. Please do not open public issues for vulnerabilities.

Acknowledgement target: 2 business days. Fix target: depends on severity, generally < 14 days for high/critical issues.

## Threat model & mitigations

The waitlist is a small, narrowly-scoped attack surface (one POST endpoint, one token-gated admin page) but worth taking seriously because it touches user PII (email + ZIP).

| Threat | Mitigation |
|---|---|
| Cross-site form abuse / CSRF | Same-origin check on `/api/waitlist` — `Origin` header must match `Host`. No cookies are read by the API, but the check is kept for defense in depth. |
| Email/ZIP enumeration via timing or response | `INSERT OR IGNORE` + identical `{ok:true}` response on insert and conflict. Admin token comparison uses `timingSafeEqual`. |
| Spam / bot signups | (1) Honeypot field — tripped requests silently succeed without DB write. (2) In-memory rate limit, 5 / hour / hashed IP. |
| Sensitive data at rest | Only email + optional ZIP is stored. **Raw IPs are never stored** — only `SHA-256(IP_HASH_SALT \|\| ip)`. |
| Injection | All DB access uses parameterized statements (`better-sqlite3`'s `prepare(...).run({...})`). No user input is interpolated into SQL or shell. |
| XSS via email content | Email HTML is built from a static template; the only user-supplied string (their ZIP) is HTML-escaped before insertion. |
| Token leakage | `ADMIN_TOKEN` and `RESEND_API_KEY` live only in `.env.local` (gitignored). Never logged. Production deploys must use platform secrets. |
| Clickjacking | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'`. |
| Mixed-content / TLS downgrade | `Strict-Transport-Security` with `preload`. |
| MIME sniffing | `X-Content-Type-Options: nosniff`. |
| Sensitive browser APIs | `Permissions-Policy: camera=(), microphone=(), geolocation=()`. |
| Search-engine indexing of admin / API | `app/robots.ts` disallows `/admin/` and `/api/`. |

## What we explicitly do NOT defend against

- **Targeted resource exhaustion** by an attacker rotating IPs or spoofing `X-Forwarded-For` *upstream* of the rate-limiter. Fix: deploy behind a CDN/edge that sets a trusted `X-Forwarded-For`, or move rate-limit state to a shared store (Redis) keyed on a verified IP source.
- **Sophisticated email-spoof bots** that solve the honeypot by inspecting CSS. Add hCaptcha/Turnstile if signups become a target.
- **Database disclosure via host compromise.** SQLite file is plaintext. If your threat model includes a hostile sysadmin, encrypt the volume.

## Operational hygiene

- Rotate `ADMIN_TOKEN` and `IP_HASH_SALT` if anyone outside the trust boundary has seen them.
- Rotate `RESEND_API_KEY` immediately if it appears in any chat, screenshot, log, or error report.
- Review `data/waitlist.db` access — back up regularly, delete on user request (the table has an `email UNIQUE` index, so deletion is straightforward).
