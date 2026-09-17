# Kizo-Corpus — Product Requirements Document

**Status:** Draft v0.2 — re-scoped
**Last updated:** 2026-08-06
**Owner:** Kizhore
**Target:** September 16, 2026

---

## Problem Statement (V1)

Kizo-Corpus is for people on a journey of self-improvement — those who want to organise, reflect on, and lead their lives with purpose, but find that the act of tracking itself drains the very focus they're trying to protect. Existing tools scatter them across multiple apps, force them through rigid forms, and spend their mental energy on data entry instead of on learning, deciding, and building.

Kizo-Corpus is a web-based personal life-tracker that turns plain text — _"300 chai"_, _"1500 grocery yesterday"_ — into structured, categorised data through AI parsing, with reports that reveal patterns a person can't see in their own head. V1 ships as a focused expense tracker; later versions extend the same substrate to workouts, food, and other dimensions of a self-directed life.

What makes it different is not the parsing but the principle behind it: **anything that doesn't require your own mental energy should be automated away or not done at all.** The expense tracker is the first expression of that principle. A mind that no longer spends itself on data entry is free to learn, build, and create surplus — for itself and for the world.

---

## Goals (V1)

V1 is complete when all of the following are true:

1. **Authentication** — A user can sign up with email and password, log in, and log out. Each user's data is private to them.
2. **Natural-language entry** — A user can type a free-form expense into a single input field on the home screen.
3. **AI parsing** — The input is parsed into four structured fields: `amount`, `category`, `description`.
4. **Parse review** — The user sees what the AI understood and can correct it before it saves.
5. **Immediate feedback** — The saved expense appears in the list the moment it's stored.
6. **Manual correction** — A user can edit or delete any expense in the list.
7. **Reports** — A separate screen shows totals and category breakdowns for today, this week, and this month.
8. **Persistence and scoping** — Data persists across sessions and devices, scoped strictly to the logged-in user.

**What changed from v0.1:** Goal 8 (account management — password reset, account deletion) is cut to v1.5. Those are the exact features deferred on Payanam as scope creep; the core loop does not break without them.

---

## Architecture Constraint

The data layer and core flows must be designed so that adding new tracker types (workout, food) in later versions does not require rewriting v1 or migrating existing expense data. Recorded as an ADR in `docs/decisions/`.

---

## Non-Goals (V1)

Explicitly out of scope. Each is something a reasonable user or reviewer might expect — listed to prevent assumption and silent scope drift.

### Account Management — _cut in the v0.2 re-scope_

- **Password reset via email/OTP** — Requires OTP generation, expiry, single-use invalidation, and an email delivery service. Deferred exactly as it was on Payanam. In v1, a forgotten password is recoverable by the developer directly. → v1.5
- **Account deletion** — Requires a deletion flow, cascade rules, and session invalidation. The core loop does not break without it. → v1.5
- **Login rate limiting / brute-force protection** — Real work, and v1 has a single known user. → v1.5, before any non-builder signs up.
- **Email delivery entirely** — With password reset cut, v1 sends no email at all. One fewer external service, one fewer failure mode.

### Tracking & Data Entry

- **SMS reading / bank message parsing** — High technical cost (Android-only, permissions, per-bank formats). Would consume the whole v1 budget.
- **Recurring expenses** — Manual entry only.
- **Receipt photo upload / OCR** — Text is the sole entry mechanism.
- **Bank account integration / open banking** — Permanently out of v1.
- **Bulk import from CSV or other apps** — Not in v1.

### Reports & Insights

- **Pattern detection / AI-generated insights** — → v1.5. V1 ships totals and category breakdowns only.
- **Yearly reports** — Daily, weekly, monthly only.
- **Charts and graph libraries** — Numeric totals with simple proportional bars.
- **Budgets, alerts, goal-setting** — Not in v1.
- **Export to CSV or PDF** — Not in v1.
- **Search and filter on the expense list** — → v1.5, once there is enough data to need it.

### Categories & Customisation

- **Custom user-defined categories** — V1 ships a fixed set: Food, Transport, Shopping, Bills, Entertainment, Health, Other.
- **Tags, sub-categories, custom fields** — Not in v1.
- **Multi-currency** — INR only.

### Platform

- **Native mobile apps** — Responsive web only. PWA installability is a possible v1.5 addition.
- **Offline mode** — Network required.
- **Dark mode / theme switching** — Not in v1.

### Social

- **Sharing expenses with other users** — Not in v1.
- **Comparison with friends, feeds, leaderboards** — Permanently rejected; contradicts the product's philosophy.
- **Comments, notes, attachments on expenses** — Not in v1.

### Notifications & Automation

- **Email, push, or in-app notifications** — Not in v1.
- **Scheduled reports or digests** — Not in v1.
- **Webhooks or third-party integrations** — Not in v1.

### Engineering Practice — _cut in the v0.2 re-scope_

- **60% automated test coverage** — Zero tests were written on Payanam. Committing to a coverage target on a solo learning project sets up a requirement that will be quietly abandoned. Write tests where they earn their place; do not commit to a number.
- **Error monitoring (Sentry) and uptime monitoring (UptimeRobot)** — Production-ops tooling for an app with one user. → v1.5, before real users.
- **Analytics events table** — Metrics that matter in v1 are countable directly from the expenses table.
- **100 concurrent users target** — V1 has one user. This is an imagined constraint.

### Future Trackers

- **Workout, food, or any non-expense tracker** — Out of v1 by design. These are later versions on the same substrate.
- **Investment and savings tracking** — These are transfers, not expenses, and need their own model. → v2.

---

## Users / Personas

### Primary persona: Kizhore (and people like him)

**Profile**
22, lives in India, works in IT. Building skills with the long-term intent to start his own business. Phone is his primary device. Comfortable with apps, not a power user.

**Relationship with money — a study in contrasts**

- **High agency on big decisions:** disciplined with investments, deliberate about spending on upskilling.
- **Low agency on small decisions:** daily spending is chaotic, untracked, and invisible to him.

**Why he wants to track**
Not to save money — to _see himself clearly_. He suspects his daily spending leaks value he could redirect toward the life he's building. Every existing app makes tracking feel like punishment.

**Trigger**
Month-end disorientation. The balance is always slightly lower than it should be and he can't explain why. The trigger is the moment he stopped accepting _"I just spend a lot"_ as an answer.

**What success looks like in 3 months**

- He can name where his daily money goes without guessing.
- Month-end is no longer a surprise.
- He spends less mental energy on money — not because he has more, but because he understands it.
- He is still using the app.

**Implicit secondary group**
Young Indian professionals (~22-30), early-career, self-improvement minded, disciplined on long-term financial decisions and chaotic on short-term ones — willing to try a new tool _only if it respects their attention_.

---

## User Stories (V1)

Each story is a moment of use, and the unit of work we build and test against.

### Authentication

**Story 1 — Sign up**
As a new user, I want to create an account with email and password, so that my data is private to me and persists across devices.

_Acceptance criteria:_

- Email and password submitted together.
- Invalid email format and passwords under 8 characters are rejected with a clear message.
- Duplicate email is rejected with a clear message.
- On success I am logged in and land on the home screen.

**Story 2 — Log in**
As a returning user, I want to log in with email and password, so that I can reach my expenses.

_Acceptance criteria:_

- Wrong email and wrong password produce the same message.
- On success I land on the home screen with my expenses loaded.
- An already-logged-in user visiting the login page is redirected to home.

**Story 3 — Log out**
As a logged-in user, I want to log out, so that nobody else on this device sees my data.

_Acceptance criteria:_

- Logging out clears the session and returns me to the login screen.
- Protected screens are unreachable afterwards without logging in again.

### Expense Entry — _the core of this project_

**Story 4 — Add an expense by typing**
As a logged-in user, I want to type a natural-language expense and submit it, so that I can log it in under five seconds.

_Acceptance criteria:_

- The home screen has one prominent input field, focused on load.
- A loading indicator shows while parsing runs.
- The input field is disabled during parsing so the same entry cannot be submitted twice.
- The result appears in the list immediately after saving.

**Story 5 — Review the parse before it saves**
As a user, I want to see what the AI understood before it commits, so that I can catch mistakes before they enter my data.

_Acceptance criteria:_

- The parsed `amount`, `category`, `description` and `date_time` are shown in editable fields.
- Nothing is stored until I confirm.
- Confirming with no edits is a single tap — the fast path stays fast.
- Editing a field before confirming stores my corrected value, not the AI's.

**Story 6 — Unintelligible input**
As a user whose input the AI cannot parse at all, I want to be asked to rephrase rather than have garbage saved, so that my list stays clean.

_Acceptance criteria:_

- Input like _"asdkfj"_ produces _"I couldn't understand that — could you rephrase?"_
- Nothing is saved.
- My original text stays in the field so I can edit rather than retype.
- No guessing, no "did you mean".

**Story 7 — The AI returns something broken**
As a user, I want a malformed AI response to be handled cleanly, so that a bad response from the model never corrupts my data or crashes the screen.

_Acceptance criteria:_

- A response that is not valid JSON is rejected, and I see a plain-language error.
- A response missing a required field is rejected.
- A `category` outside the fixed seven is rejected — the model cannot invent categories.
- An `amount` that is not a positive number is rejected.
- In every case nothing is stored and my input is preserved.

**Story 8 — The AI service is unavailable**
As a user, I want to be told plainly when parsing is unavailable, so that I know the failure isn't mine and my input isn't lost.

_Acceptance criteria:_

- Service failure or timeout produces a clear message.
- My input is preserved for retry.
- Nothing is saved.

<!-- **Story 9 — Relative dates**
As a user, I want to write dates the way I speak them, so that I can log past expenses without picking a date.

_Acceptance criteria (reference date: 19 May 2026):_

- _"300 chai yesterday"_ → 18 May 2026
- _"1500 grocery 3 days ago"_ → 16 May 2026
- _"chips on 18th"_ → 18 May 2026
- _"snack on 18th previous month"_ → 18 April 2026
- No date mentioned → now (current date and time).
- A date resolving to the future is rejected with a clarification prompt — you can only log what has happened. -->

**Story 10 — Network failure while saving**
As a user, I want a save to either fully succeed or fully fail, so that my data is never half-written or duplicated.

_Acceptance criteria:_

- Failure before storage: clear error, input preserved for retry, nothing saved.
- No half-saved or duplicated entries under any retry.

### Correction

**Story 11 — Edit an expense**
As a user who spots a mistake, I want to open any expense and change any field, so that my data stays accurate.

_Acceptance criteria:_

- All four fields are editable.
- Saved changes appear in the list immediately and are reflected in reports.
- Cancelling discards changes.

**Story 12 — Delete an expense**
As a user, I want to remove an expense I added by mistake, so that it doesn't pollute my reports.

_Acceptance criteria:_

- Deletion requires explicit confirmation.
- Deleted expenses disappear from the list and from all report totals.

### Reports

**Story 13 — See my spending**
As a user, I want totals and category breakdowns for today, this week and this month, so that I can see where my money goes.

_Acceptance criteria:_

- Three views: today, this week, this month.
- Each shows a total and a per-category breakdown with proportional bars and numeric values.
- Boundaries follow my local timezone.
- Totals reflect the latest edits and deletions.

### Persistence & Privacy

**Story 14 — My data is mine**
As a user, I want my expenses available on any device I log into, and invisible to everyone else.

_Acceptance criteria:_

- Logging in on another device shows the same data.
- No request can read, edit or delete another user's expense, even with a hand-crafted request.

### Empty States

**Story 15 — First-time home screen**
As a brand-new user with nothing logged, I want to be invited to start rather than shown an empty list.

_Acceptance criteria:_

- A friendly message with a worked example: _"Type your first expense — try '300 chai' or '1500 grocery'."_
- The input is prominent and focused.
- No "no data" emptiness. The empty state is a welcome.

**Story 16 — Empty reports screen**
As a user with nothing logged, I want the dashboard to explain what will appear here, rather than show zeros.

_Acceptance criteria:_

- A message explaining what will appear once expenses exist.
- No misleading ₹0 totals.
- A link back to the home screen to add the first expense.

---

## Functional Requirements (V1)

### FR-1: Authentication

- **FR-1.1** Signup with email and password.
- **FR-1.2** Passwords stored only as a bcrypt hash, cost factor ≥ 10. Never logged, never stored in plain text.
- **FR-1.3** Email addresses unique across all accounts.
- **FR-1.4** Signup rejects invalid email format and passwords shorter than 8 characters, validated on the server regardless of client validation.
- **FR-1.5** Login verifies the password before issuing a session. A session is never issued on a failed login.
- **FR-1.6** Wrong email and wrong password return the same message and status code.
- **FR-1.7** The session token is stored in an httpOnly cookie so client-side JavaScript cannot read it.
- **FR-1.8** Sessions expire after 7 days. Logout clears the cookie.
  _Known limitation, accepted for v1: a stateless token cannot be revoked server-side. Logout removes the client's copy; the token itself remains valid until expiry. Server-side revocation arrives with the sessions table in v1.5, alongside account deletion._
- **FR-1.9** The signing secret is read from the environment. A missing secret causes a loud startup failure, never a fallback default.

### FR-2: AI Parsing — _the core requirement set_

- **FR-2.1** The home screen presents a single text input as the primary entry mechanism.
- **FR-2.2** On submit, the raw input is sent to the parser together with the user's current local date, time and timezone.
- **FR-2.3** The AI call happens **server-side only**. The API key is never exposed to the browser.
- **FR-2.4** The parser returns four fields: `amount` (positive number), `category` (one of the seven fixed categories), `description` (string), `date_time` (ISO 8601).
- **FR-2.5** **Every AI response is validated against a schema before use.** The model's output is untrusted input and is treated exactly like user input.
- **FR-2.6** Validation rejects, without saving: malformed JSON, a missing required field, a `category` outside the fixed seven, an `amount` that is not a positive number, and an unparseable `date_time`.
- **FR-2.7** Unintelligible input produces a rephrase prompt. No guessing, no partial save.
- **FR-2.8** The parsed result is shown in editable fields and requires explicit confirmation before storage. What is stored is what the user confirmed, not what the model returned.
<!-- - **FR-2.9** Relative dates are resolved against the user's local date: "yesterday", "N days ago", "last Monday", "on the 18th", "18th previous month".
- **FR-2.10** A date resolving to the future is rejected with a clarification prompt.
- **FR-2.11** Absent any date in the input, `date_time` defaults to now. -->
- **FR-2.12** The **raw input text is stored alongside the parsed expense.** Without it, parse quality cannot be measured (SM-3), prompt changes cannot be evaluated, and a bad parse cannot be diagnosed after the fact.
- **FR-2.13** The **prompt version is stored on each expense**, so a change in parse quality can be attributed to a specific prompt.
- **FR-2.14** The parse endpoint is rate-limited per user. It is the only endpoint that costs money per call.
- **FR-2.15** A parse call that exceeds a defined timeout is abandoned and surfaced as a service error, never left hanging.
- **FR-2.16** The parsing layer is isolated behind a single module so the model or provider can be swapped without touching business logic.
- **FR-2.17** The input field is for **creation only**. Edit, delete, query and search are not invokable through it.

### FR-3: Storage & Persistence

- **FR-3.1** Every expense is associated with the authenticated user who created it.
- **FR-3.2** Data persists across sessions, devices and restarts.
- **FR-3.3** Every read, edit and delete verifies ownership **server-side** against the authenticated user. A client-side check is UX only, never security.
- **FR-3.4** A save is atomic: fully written with all fields, or not written at all.
- **FR-3.5** All database access uses parameterised queries. No user input and no model output is ever concatenated into SQL.
- **FR-3.6** Timestamps are stored in UTC and converted to the user's local timezone for display.
- **FR-3.7** Amounts are stored as integers in the smallest currency unit (paise).

### FR-4: Expense List

- **FR-4.1** Expenses are listed newest first.
- **FR-4.2** Each item shows amount, category, description and date/time.
- **FR-4.3** Opening an item exposes all four fields for editing.
- **FR-4.4** Edits save atomically and appear immediately in the list and in reports.
- **FR-4.5** Deletion requires explicit confirmation.
- **FR-4.6** Deletion is a hard delete. Removed expenses do not appear in reports.

### FR-5: Reports

- **FR-5.1** A dedicated screen, separate from the home screen, shows three views: today, this week, this month.
- **FR-5.2** Each view shows the total and a per-category breakdown as proportional bars with numeric values. No chart library.
- **FR-5.3** Boundaries follow the user's local timezone: today = local midnight to midnight, week = Monday to Sunday, month = 1st to last day.
- **FR-5.4** Totals include **every** expense in the window. No truncation, no sampling, no approximation.
- **FR-5.5** Reports reflect the current state of the data, including the most recent edits and deletions.
- **FR-5.6** A period with no expenses shows an explicit empty state, not a misleading zero.

### FR-6: Empty & Error States

- **FR-6.1** A first-time user sees a welcoming empty state with a worked example input.
- **FR-6.2** An empty reporting period shows a helpful message, not zeros.
- **FR-6.3** Network failures, API errors and parse failures each surface a plain-language message. Never a status code, never a stack trace.
- **FR-6.4** Any failed submission preserves the user's input for retry.
- **FR-6.5** Destructive actions require explicit confirmation.

### FR-7: Extensibility

- **FR-7.1** The data model must allow new tracker types (workout, food) to be added without modifying the v1 expense schema or migrating existing expense data.
- **FR-7.2** The parsing layer must allow a different model or provider without changes to business logic.

---

## Non-Functional Requirements (V1)

### NFR-1: Performance

- **NFR-1.1** Parse round-trip (submit → result displayed) completes within ~2 seconds under normal conditions. This depends on a third-party model, so it is a target, not a guarantee — the UI must remain honest and responsive when it is exceeded.
- **NFR-1.2** Home screen renders within 1 second with up to 100 expenses listed.
- **NFR-1.3** Non-AI endpoints respond within 300 ms at the 95th percentile.
- **NFR-1.4** Report correctness is never traded for speed. Correctness (FR-5.4) is non-negotiable; degrading performance at large data volumes is acceptable.

### NFR-2: Security

- **NFR-2.1** All traffic over HTTPS.
- **NFR-2.2** Passwords hashed with bcrypt, cost ≥ 10. Never logged or transmitted in plain text.
- **NFR-2.3** Session tokens signed and validated on every authenticated request, server-side.
- **NFR-2.4** Protected against SQL injection, XSS, CSRF and insecure direct object references. Ownership is checked on every data-touching request (FR-3.3).
- **NFR-2.5** Passwords, tokens and full expense contents are never written to logs.
- **NFR-2.6** All secrets — database URL, AI API key, signing secret — live in environment variables and are never committed.

### NFR-3: Reliability

- **NFR-3.1** An acknowledged save survives restarts and crashes.
- **NFR-3.2** An unavailable AI service produces a clear error and preserves input. It never fails silently and never stores unparsed data.
- **NFR-3.3** Errors are logged with enough context to debug — timestamp, user id, request id — without leaking sensitive data.

### NFR-4: Usability

- **NFR-4.1** Fully functional from 360px to 1920px.
- **NFR-4.2** Add expense, view reports and log out are each reachable within 2 taps of the home screen.
- **NFR-4.3** Keyboard accessible: tab navigation, Enter to submit.
- **NFR-4.4** Error messages in plain language.
- **NFR-4.5** Works on the latest two stable versions of Chrome, Safari, Firefox and Edge.

### NFR-5: Maintainability

- **NFR-5.1** Consistent style enforced by a linter and formatter.
- **NFR-5.2** Every architectural decision recorded as an ADR in `docs/decisions/`.
- **NFR-5.3** Parsing and report logic are testable independently of the UI and the database.
- **NFR-5.4** The project runs locally from a clean clone by following the README alone.
- **NFR-5.5** A running `docs/debt.md` records anything shipped that could not be rebuilt from scratch unaided.

### NFR-6: Cost

- **NFR-6.1** Monthly infrastructure cost (hosting + database + AI API) stays under ₹1,500 at v1 scale.
- **NFR-6.2** Parsing cost per entry averages under ₹0.50.
- **NFR-6.3** Rate limiting on the parse endpoint (FR-2.14) is the control that keeps NFR-6.1 true.

---

## Success Metrics (V1)

Measured 90 days after launch. Five metrics, each observable, all countable from the expenses table.

- **SM-1 — The builder's verdict.** At day 90, Kizhore can honestly answer yes to all three: _I trust this tool with my data. Logging feels good, not like a chore. I now know where my money goes in a way I didn't before._ If any is no, v1 has not succeeded regardless of the rest.

- **SM-2 — Voluntary adoption.** Kizo is his sole expense tracker for 90 consecutive days, without reminders or self-forcing. At least one expense logged on ≥ 70 of those days, spread naturally rather than batched at month-end.

- **SM-3 — Parse accuracy.** ≥ 90% of entries are saved without the user editing the AI's output. Measured as entries confirmed unedited ÷ total entries, over the last 30 days. This is measurable only because FR-2.12 stores the raw input.

- **SM-4 — Entry friction.** Median time from opening the app to a saved expense is ≤ 10 seconds. Friction is what kills SM-1's second clause.

- **SM-5 — Zero silent failures.** No incident where data was lost, miscategorised, or reported incorrectly without the user being told. Non-negotiable.

**Anti-metrics — never optimised for:** daily active users, time in app, session length, features used per session. A user who logs an expense in five seconds and closes the app has succeeded.

**How they're measured:** counted directly from the database; self-assessment recorded in `docs/post-launch-review.md` at days 30, 60 and 90. No analytics tooling in v1.

---

## Resolved Decisions

To be formalised as ADRs in `docs/decisions/`.

- **Framework: Next.js (App Router), TypeScript** — one codebase for frontend and API routes. Replaces the previous Vite + separate Express decision. Removes CORS handling, the two-server dev setup, and the split deployment. Keeps the AI key server-side by default.
- **Database: PostgreSQL**
- **AI parsing provider: Claude Haiku**, isolated behind one module (FR-2.16)
- **Hosting: Vercel** for the application, managed Postgres (Railway or Neon) for the database
- **Authentication: signed token in an httpOnly cookie**, 7-day expiry, with the revocation limitation stated in FR-1.8. Server-side sessions arrive in v1.5 with account deletion.
- **Confirmation flow: parse shown, explicit confirm before save**
- **Reports: numeric totals with proportional bars, no chart library**
- **Time: UTC in the database, converted to local for display**
- **Money: integers in paise**
- **Categories: a fixed TypeScript enum of seven**
- **Email delivery: none in v1** — removed along with password reset
- **Monitoring: none in v1** — added before non-builder users
- **Privacy Policy and Terms: required before any non-builder signs up**

---

## Open Questions

**OQ-1 — Confirmation flow friction.** Every entry requires a confirm tap. Does that break SM-4 (≤ 10 seconds) and SM-1's "feels good, not a chore"? Resolve with real usage in the first two weeks; consider auto-saving high-confidence parses and confirming only uncertain ones.
_Owner: Kizhore · Needed by: first 2 weeks of use · Blocks: Story 5, SM-4_

**OQ-2 — Low-confidence threshold.** What counts as "uncertain enough to flag"? Tune during prompt engineering, refine on real data.
_Owner: Kizhore · Needed by: parsing spike · Blocks: FR-2.8_

**OQ-3 — Prompt design and few-shot examples.** Not yet written. This is the highest-leverage unwritten artefact in the project.
_Owner: Kizhore · Needed by: parsing spike · Blocks: all of FR-2_

**OQ-4 — v1.5 scope.** Revisit after 30 days of real usage, not before.

**OQ-5 — Dates: calendar picker instead of AI parsing**

Decision (provisional): the date comes from a calendar that defaults to today.
The parser no longer returns a date at all.

Evidence: "previous month" resolved to Aug 2025 instead of Aug 2026 — a twelve-month
error that every guard passed. Re-run gave a different wrong day. Same input,
temperature 0.

Trade: adds friction on backdated entries (tap the date, then type), which works
against the low-friction purpose. But a silently wrong date is worse — if the user
can't trust dates, they start checking them, and checking is the mental load the
product exists to remove. A tap on rare entries beats doubt on every entry.

Side effect: prompt dropped from 204 to ~48 tokens.

Open: does backdating happen often enough that the friction matters?
Resolve with two weeks of real use, not argument.

If it does: add back only the forms that parsed reliably — "yesterday",
"N days ago" — as an override on the calendar default. Leave out "previous month",
"last Monday", "on the 18th", where the model was demonstrably unreliable.

---

## Future Versions

### V1.5 — the deferred essentials

Password reset via email · account deletion with session invalidation · server-side sessions and token revocation · login rate limiting · error and uptime monitoring · pattern detection (AI insights) · search and filter on the list · yearly reports · PWA installability

### V2 — Workout tracker

Validates the Architecture Constraint. Natural-language workout entry parsed into activity, duration, intensity, date/time and optional metrics. Same reliability and security contracts as v1.

### V3 — Food tracker

The hardest of the three, because portions and nutrition are ambiguous. Validates the parser against genuinely uncertain input.

### V4+ — Mood/journal, sleep, reading, habits

Added on personal need and real demand. No commitments.

### Permanently out of scope, across all versions

- **Social features** — sharing, comparison, feeds, leaderboards. Contradicts the private-caretaker philosophy.
- **Engagement-driven design** — streak guilt, gamification, notifications to drive usage. Contradicts the anti-metrics.
- **Advertising or monetisation through user data** — the data is the user's.

---

## Roadmap & the September 16 target

```
v1    →  Expense tracker            target: 16 Sept 2026
v1.5  →  Deferred essentials + insights
v2    →  Workout tracker            validates the extension architecture
v3    →  Food tracker               validates ambiguity handling
```

**What the date measures.** September 16 is a target for _understanding_, not for shipping. A v1 that goes live on the 16th with code that cannot be explained is a failure by this project's own standards — it repeats exactly what happened in the last week of Payanam. A v1 that is late but fully owned is a success.

The check on the 16th is not _"is it live?"_ It is _"can I open an empty file and rebuild any part of this?"_

**Build order.** Parsing spike first — before auth, before the UI, before anything. It is the only genuinely new surface in this project, it is the reason the project is interesting, and everything else is Payanam again. If the parser is not proven by week two, the scope is still too large.
