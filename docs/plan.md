## Phase gates

Every phase has an entry check (may I start?) and an exit check (am I done?). Both are observable — something to run, not something to feel.

A phase is done when its exit check passes. Not when it seems finished, not when it is boring, not when the next thing looks more interesting.

### Phase 0 — Parser spike

Entry: PRD scoped. Claude API key in .env, gitignored.

Work: One throwaway file. String in, structured JSON out. No UI, no auth, no database, no Next.js.

Exit check:

All four date cases from Story 9 resolve correctly.
"asdkfj" produces a clean rejection, not a crash and not a guess.
"dinner tomorrow" is rejected as a future date.
A response missing a field or with an invented category is caught by validation, not stored.

Artefacts: the working prompt, and a written list of every input that broke it.

Timebox: if the parser still fails basic cases after four focused hours, that is information about the project, not about you. Bring it back.

### Phase 1 — Design

Entry: Phase 0 exit passed. The parser's real output shape is known.

Work: docs/design.md — schema, API routes, wireframes. Plus the settled ADRs.

Exit check:

Schema written as real CREATE TABLE statements, not prose.
Every route documented with request shape, response shape, and error cases.
Wireframes for all four screens exist on paper.
Five ADRs written: Next.js, Claude Haiku isolation, cookie auth with its stated limitation, paise and UTC, and the v1.5 cuts.

The ADR that matters most is the last one. Both previous projects grew after being scoped. A written record of what was cut and why is what makes a cut hold.

### Phase 2 — Auth

Entry: Phase 1 exit passed. Schema exists.

Work: Signup, login, logout, session. Written from an empty file. No Payanam tab open. Where the stalling happens is the real debt map.

Exit check:

Sign up, log out, log back in on a different browser, data is there.
Create a second account. Logged in as B, attempt to fetch A's expense by id through a hand-crafted request. It must fail.
The signing secret missing from the environment causes a loud startup failure, not a silent fallback.

That second check is this project's security lesson, the way SQL injection was Payanam's. Test it deliberately.

### Phase 3 — Entry and parse flow

Entry: Phase 2 exit passed. Auth works.

Exit check:

Type an expense, see the parse, confirm, and it appears in the list.
Every failure path from Stories 6, 7 and 8 behaves as written — malformed JSON, missing field, invented category, service down. Test each one deliberately by breaking things on purpose.
Raw input and prompt version are stored alongside every expense.
Submitting twice quickly does not create two entries.
Phase 4 — List, edit, delete

Exit check: an expense can be edited and deleted, changes appear immediately in the list, and deleted expenses vanish from report totals.

### Phase 5 — Reports

Exit check: today, week and month totals are correct against a hand-counted set of test expenses. Timezone boundaries verified — an expense logged at 11:50pm lands in the right day.

### Phase 6 — Deploy

Exit check: live on a URL, working from a phone on mobile data, with all secrets in the host's environment and none in the repository.

### Phase 7 — Cloud migration (optional, separately scoped)

Only after Phase 6 is live and stable. The learning is the deliverable here, not the deployment — the app already works, so nothing is blocked if this goes badly.
