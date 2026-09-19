Kizo-Corpus — Architecture Decision Records

Each record answers four things: what was decided, why, what was rejected, and what it costs. The fourth is the point — six months from now the what will be obvious and the why will not.

### ADR-001 — Next.js over Vite + separate Express

Status: Accepted · 2026-08-09

Decision Build the whole application in Next.js (App Router) with TypeScript. API routes live inside the same project. No separate Express server.

Why

One codebase instead of two. Payanam ran a Vite frontend and an Express backend as separate projects, which meant two dev servers, two deployments, and a CORS configuration to maintain.
Route handlers replace Express entirely for this scale of API.
The AI API key stays server-side by default, because server code and client code are explicitly separated by the framework rather than by convention.
It is a framework I have not used. On a personal project with no client and no commercial deadline, deliberate framework learning is a legitimate goal.

Rejected

Vite + React + Express — the Payanam stack. Known and faster to start, but keeps the two-codebase overhead and teaches nothing new.
Remix, Astro — not evaluated seriously; Next is the one I want to learn.

Cost

The server-versus-client component model is genuinely new and will slow me down early. Expect confusion about where code executes.
Almost none of Payanam's backend structure transfers directly.
Risk: the framework becomes the project. If three weeks in there is beautiful routing and no working parser, this decision was executed badly.

### ADR-002 — Web app, not a native mobile app

Status: Accepted · 2026-08-09

Decision V1 is a mobile-responsive web application. No Android or iOS build.

Why

Shipping speed matters more than platform fit here. A long build with no visible result kills motivation, and motivation is the actual constraint on a solo project with no external deadline.
No app store review, no release cycle, no device build tooling.
One codebase serves phone and desktop.
A PWA can be added later for a home-screen icon without app-store distribution.

Rejected

React Native / Flutter — better native feel, far more setup, and a second language of platform concerns to learn on top of Next.js.

Cost

No push notifications, no offline mode, no home-screen presence in v1.
Entry is slower than a native app: open browser, navigate, log in. This directly threatens SM-4 (median 10 seconds to a saved expense) and must be watched.

### ADR-003 — Claude Haiku for parsing, isolated behind one module

Status: Accepted · 2026-08-09

Decision Use Claude Haiku for natural-language expense parsing. All calls go through a single module; no other part of the codebase knows which model is in use.

Why

The task is structured extraction from a short string, not reasoning. It does not need the most capable model.
Cheapest and fastest in the family, which keeps NFR-6.2 (under ₹0.50 per entry) comfortably true.
Isolation means swapping models or providers later is one file, not a refactor. This satisfies FR-2.16.

Rejected

A larger model — better on ambiguous input, materially more expensive per call for a task that is mostly mechanical.
Writing a rules-based parser myself — regex over dates and amounts. Cheaper to run, but brittle, and it removes the entire reason this project is interesting.

Cost

Weaker on genuinely ambiguous input than a larger model would be. Acceptable because the user reviews and confirms every parse before it is stored (FR-2.8) — the confirmation step is what makes the cheap model safe.
A paid external dependency. If the API is down, the core feature is down (NFR-3.2).
Model output is untrusted input and must be schema-validated on every response (FR-2.5). The model can and will occasionally return something malformed.

### ADR-004 — Money stored as integers in paise

Status: Accepted · 2026-08-09

Decision All amounts are stored as integers in the smallest currency unit. ₹34.90 is stored as 3490.

Why

Floating-point numbers cannot represent decimal fractions exactly. Summing them produces drift, and report totals must be exact (FR-5.4).
Integer arithmetic is exact by definition.
Payment systems work in the smallest unit, so this is the shape any future integration expects.

Rejected

Float / double — silently wrong, and the wrongness only appears once there is enough data to notice.
Decimal type in Postgres — correct, but adds conversion handling in JavaScript, which has no native decimal type. Integers are simpler at this scale.

Cost

Every display point must divide by 100 and format. Every input point must multiply by 100. Forgetting once shows the user ₹349,000 instead of ₹3,490.
Conversion belongs in one place, not scattered through components.

### ADR-005 — Session token in an httpOnly cookie, with revocation accepted as a limitation

Status: Accepted · 2026-08-09

Decision The server issues a signed token stored in an httpOnly cookie, 7-day expiry. The token cannot be revoked server-side. This is a known and accepted limitation for v1.

Why

httpOnly means client-side JavaScript cannot read the cookie, so an injected script cannot steal the session. localStorage offers no such protection.
The browser attaches it automatically, removing the hand-written Authorization header on every request — the repetition that was already a visible problem on Payanam.
No sessions table to build, query, or clean up in v1.

Rejected

Token in localStorage — what Payanam did. Readable by any JavaScript on the page.
Sessions table in Postgres — genuinely better: logout deletes a row and the token dies immediately. Deferred to v1.5, where it arrives alongside account deletion, which is the feature that actually requires it.

Cost — stated plainly

Logout only clears the browser's copy of the token. The token itself remains valid until it expires. Anyone holding a copy of the string can still use it.
There is no way to force-log-out a device.
Mitigation: a 7-day expiry keeps the exposure window small, and v1 has one known user on trusted devices.
This limitation is recorded in FR-1.8 so it is never mistaken for an oversight.

### ADR-006 — What was cut from v1, and why

Status: Accepted · 2026-08-09

This is the record that holds the line. Both previous projects grew after being scoped, because nothing written down said what had already been decided against.

Decision The following are out of v1. Each was in the v0.1 PRD and was removed deliberately.

- Password reset via email/OTP → v1.5 OTP generation, expiry, single-use invalidation, and an email delivery service — for a v1 with one known user whose password can be reset directly in the database. This was deferred on Payanam as scope creep and then re-added here. Removing it eliminated email delivery from v1 entirely. One fewer service, one fewer failure mode, one fewer set of secrets.

- Account deletion → v1.5 Deletion flow, cascade rules, session invalidation across devices. The core loop does not break without it. It arrives with the sessions table, which is what makes "invalidate everywhere" actually possible (see ADR-005).

- Login rate limiting → v1.5 Real brute-force protection is real work. V1 has one user who knows their own password. Required before any non-builder signs up.

- 60% automated test coverage → dropped as a target Zero tests were written on Payanam. Committing to a coverage number on a solo learning project creates a requirement that gets quietly abandoned, which is worse than not having one. Tests get written where they earn their place — parsing validation and report arithmetic being the obvious candidates.

- Sentry and UptimeRobot → v1.5 Production-ops tooling for an application with one user. Added before real users, not before real usage.

- Analytics events table → dropped Everything in the success metrics is countable directly from the expenses table. An events table would be infrastructure serving no question anyone is asking.

- 100-concurrent-user target → dropped V1 has one user. This was an imagined constraint that would have shaped real decisions.

Why these specifically Every item above passed the same three tests: the core loop does not break without it, it was already deferred once on Payanam as scope creep, and it is CRUD or ops work rather than the AI parsing that is the actual point of this project.

Cost

Forgotten password in v1 means manual intervention. Acceptable at one user.
No monitoring means production problems are found by using the app.
Nothing here is permanently rejected. All of it is v1.5, in writing.

The rule this creates Anything on this list re-entering v1 requires writing down what it displaces and why it cannot wait — the change-control rule in the working protocols. A cut that can be reversed silently is not a cut.

Pending

### ADR-007 —

Expense schema and the multi-tracker seam. all the tracking lives in same table."200rs chai" is ambiguous between expense and food, so a tracker selector adds friction and invites wrong entries — one input, parser returns the type. we store data as JSON with amount as an separate column.

### ADR-008 —

Parse confidence and the confirmation flow. Depends on spike findings (OQ-2). May resolve OQ-1: whether high-confidence parses auto-save and only uncertain ones require confirmation.

### ADR-009 —

Deployment target. Vercel for v1. A separate record if the AWS migration in Phase 7 happens.
