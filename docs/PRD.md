# Kizo-Corpus — Product Requirements Document

**Status:** Draft v0.1
**Last updated:** 2026-05-18
**Owner:** Kizhore

---

## Problem Statement V1

Kizo-Corpus is for people on a journey of self-improvement — those who want to organize, reflect on, and lead their lives with purpose, but find that the act of tracking itself drains the very focus they're trying to protect. Existing tools force them to scatter across multiple apps, fill out rigid forms, and spend mental energy on data entry instead of on learning, exploring, and making decisions.

Kizo-Corpus is a web-based personal life-tracker platform that turns plain-text input — "300 chai", "ran 5km", "two dosas at noon" — into structured, categorized data through AI parsing, with reports that reveal patterns the user can't see in their own head. V1 ships as a focused expense tracker; future versions extend the same substrate to workouts, food, and other dimensions of a self-directed life.

What makes it different is not the parsing alone, but the philosophy behind it: anything that doesn't require your own mental energy should be not done or outsourced . The expense tracker is the first expression of that principle within Kizo-Corpus — and every future product will address a different kind of problem with a same solution we confessed . A focused mind that no longer spends itself on data entry is a mind free to learn, build, and create surplus value for itself and for the world.

---

## Goals (V1)

V1 is complete when all of the following are true:

1. **Authentication** — A user can sign up with email and password, log in, and log out. Each user's data is private to them.

2. **Natural-language entry** — A user can type a free-form expense (e.g., _"300 chai"_, _"1500 grocery yesterday"_, _"two dosas at noon"_) into a single input field on the home screen.

3. **AI parsing** — Within ~2 seconds of submission, the input is parsed into four structured fields: `amount`, `category`, `description`, `date + time`.

4. **Immediate feedback** — The parsed expense appears in a list on the home screen the moment it's saved.

5. **Manual correction** — A user can tap any expense in the list to edit any of its fields and save the correction.

6. **Reports dashboard** — On a separate screen, a user can see totals and category breakdowns for: today, this week, this month.

7. **Persistence and scoping** — All data persists across sessions and devices, and is scoped strictly to the logged-in user.

8. **Account management** — A user can reset a forgotten password via email, and can permanently delete their account along with all associated data.

## Architecture Constraint

The data layer and core flows must be designed such that adding new tracker types (workout, food, etc.) in future versions does not require rewriting v1. This is documented separately in `docs/decisions/`.

---

## Non-Goals (V1)

The following are explicitly out of scope for V1. Each is something a reasonable user or reviewer might expect — listed here to prevent assumption, scope creep, and silent feature drift.

### Tracking & Data Entry

- **SMS reading / bank message parsing** — Deferred to a later version. High technical cost (Android-only, permission restrictions, per-bank parsing), would consume disproportionate v1 budget.
- **Recurring expenses** — Manual entry only in v1.
- **Receipt photo upload / OCR** — Out of scope; text input is the sole entry mechanism.
- **Bank account integration / open banking APIs** — Out of scope permanently for v1.
- **Bulk import from CSV or other apps** — Not in v1.

### Reports & Insights

- **Pattern detection / AI-driven insights** — Deferred to v1.5. V1 ships totals and category breakdowns only.
- **Yearly reports** — V1 covers daily, weekly, monthly only.
- **Charts and graphs** — V1 uses numeric and text-based reports only.
- **Budgets, alerts, and goal-setting** — Not in v1.
- **Export to CSV, PDF, or other formats** — Not in v1.

### Categories & Customization

- **Custom user-defined categories** — V1 ships a fixed category set (Food, Transport, Shopping, Bills, Entertainment, Health, Other).
- **Tags, sub-categories, or custom fields** — Not in v1.
- **Multi-currency support** — V1 assumes a single currency (INR).

### Platform & Distribution

- **Native mobile apps (Android/iOS)** — V1 is a mobile-responsive web app only. PWA installability is a possible v1.5 addition.
- **Offline mode** — Network connectivity required.
- **Dark mode / theme switching** — Not in v1.

### Social & Collaboration

- **Sharing expenses with other users** — Not in v1.
- **Comparison with friends, social feeds, leaderboards** — Out of scope permanently in the product vision.
- **Comments, notes, or attachments on expenses** — Not in v1.

### Notifications & Automation

- **Email, push, or in-app notifications** — Not in v1.
- **Scheduled reports or automated digests** — Not in v1.
- **Webhooks or third-party integrations** — Not in v1.

### Future Trackers

- **Workout tracker, food tracker, or any non-expense tracker** — Out of scope for v1 by design. These are v2+ products built on the same substrate.

- **Search and filter on expense list** — Deferred to v1.5 once users have enough data to need it.

- **Investment and savings tracking** — These are transfers, not expenses, and need a proper data model. Deferred to v2.

---

## Users / Personas

### Primary persona: Kizhore (and people like him)

**Profile:**
22, lives in India, works in IT. Currently honing his skills with the long-term intent to quit his job and start his own business. Uses his phone as his primary device. Average tech literacy — comfortable with apps but not a power user.

**Relationship with money:**
A study in contrasts.

- **High agency on big decisions:** disciplined with investments, intentional about spending on upskilling (courses, books, tools).
- **Low agency on small decisions:** daily expenses are chaotic, untracked, and invisible to him. He doesn't know where the money goes between paydays.

**Why he wants to track:**
Not to save money — to _see himself clearly._ He suspects (correctly) that his daily spending is leaking value he could redirect toward the life he's building. But every existing app makes tracking feel like punishment.

**Trigger:**
The recurring frustration of month-end disorientation — the bank balance is always slightly lower than it should be, and he can't explain why. Whatever the specific incident was, the trigger is the moment he stopped accepting "I just spend a lot" as an answer.

**What success looks like in 3 months:**

- He can name where his daily money goes without guessing.
- His month-end balance is no longer a surprise.
- He spends less mental energy worrying about money — not because he has more of it, but because he understands it.
- He's still using the app.

**Implicit secondary group: "People like Kizhore"**
Young Indian professionals (~22-30), early-career, in a self-improvement / surplus-creation mindset, disciplined about long-term financial decisions but chaotic about short-term ones, and willing to try a new tool _only if it respects their attention_.

---

## User Stories (V1)

User stories describe specific moments of use. Each maps to one or more Goals and is the unit of work we build and test against.

### Authentication

**Story 1 — Sign up**
As a new user, I want to create an account with my email and password, so that my expense data is private to me and persists across devices.

_Acceptance criteria:_

- I can enter email + password and submit.
- The system rejects weak passwords (minimum 8 characters) and invalid emails.
- On success, I'm logged in and taken to the home screen.
- Duplicate emails are rejected with a clear message.

**Story 2 — Log in**
As a returning user, I want to log in with my email and password, so that I can access my expenses.

**Story 3 — Log out**
As a logged-in user, I want to log out, so that no one else using my device can see my data.

**Story 4 — Reset forgotten password**
As a user who forgot my password, I want to receive a reset otp via email, so that I can regain access without contacting support.

**Story 5 — Delete account**
As a user, I want to permanently delete my account and all my data, so that I can leave the platform completely.

_Acceptance criteria:_

- Confirmation is required (typing the word "DELETE" or similar).
- All my expense data is removed.
- I can sign up again later with the same email if I choose.

### Expense Entry

**Story 6 — Add an expense by typing**
As a logged-in user, I want to type a natural-language expense (e.g., _"300 chai"_) into a single field and submit it, so that I can log the expense in under 5 seconds.

_Acceptance criteria:_

- The home screen has one prominent input field.
- After submit, AI parses the input within ~2 seconds.
- A loading indicator shows while parsing is in progress.
- The parsed result appears in the list immediately below.

**Story 7 — See the parse before it saves**
As a user who just submitted an expense, I want to see what the AI parsed before it commits, so that I can catch errors before they enter my data.

_(Open question: do we show a confirmation step, or save immediately with edit-after option? Decide in Phase 3.)_

**Story 8 — Handle AI parse uncertainty**
As a user whose input the AI cannot confidently parse, I want the system to ask me for clarification rather than save garbage data, so that my expense list stays clean and I'm never blocked from logging.

_Two sub-cases:_

- **Unintelligible input** (e.g., _"asdkfj"_): AI responds _"I couldn't understand that — could you rephrase?"_ The user re-enters. No "did you mean" guessing.
- **Ambiguous parse** (e.g., AI extracted an amount but is unsure about category or date): AI shows the parsed result inline with editable fields and a confirm button. User confirms or edits before save.

### Expense Correction

**Story 9 — Edit a parsed expense**
As a user who notices an AI parse mistake, I want to tap any expense in the list and edit any of its fields (amount, category, description, date/time), so that my data stays accurate.

**Story 10 — Delete an expense**
As a user, I want to delete an expense I added by mistake, so that it doesn't pollute my reports.

### Reports / Dashboard

**Story 11 — See today's spending**
As a user, I want to see how much I've spent today, broken down by category, so that I can sense-check my day's spending.

**Story 12 — See this week's spending**
As a user, I want to see this week's totals and category breakdown, so that I can spot short-term patterns.

**Story 13 — See this month's spending**
As a user, I want to see this month's totals and category breakdown, so that I'm never surprised at month-end.

### Persistence

**Story 14 — Data survives sessions and devices**
As a user, I want my expenses to be available when I log in from any device, so that my data is portable and durable.

### Empty States

**Story 15 — First-time home screen**
As a brand-new user with no expenses yet, I want to see an empty home screen that encourages me to log my first expense, so that I understand what to do and feel invited to start.

_Acceptance criteria:_

- Home screen shows a friendly message (e.g., _"Type your first expense to begin — try '300 chai' or '1500 grocery'"_).
- The input field is prominent and focused.
- No empty list, no "no data" sadness. The empty state is a welcome.

**Story 16 — Empty reports screen**
As a user who hasn't logged anything yet, I want the dashboard to show me a helpful message instead of empty zeros, so that I know what to expect once data exists.

_Acceptance criteria:_

- Dashboard shows a message like _"Once you log some expenses, you'll see your daily, weekly, and monthly breakdowns here."_
- No misleading ₹0 totals or blank charts.
- A clear call-to-action linking back to the home screen to add the first expense.

### Error States & Edge Cases

**Story 17 — Network failure during save**
As a user submitting an expense, I want the operation to either fully succeed or fully fail — never partially — so that my data is never corrupted or duplicated.

_Acceptance criteria:_

- If the network fails before the expense is saved, the user sees a clear error and the input remains in the field for retry.
- If the network fails _after_ the expense was saved, the system either retries or marks it clearly — never silently loses the data.
- No half-saved, half-categorized, or duplicated entries.

**Story 18 — Relative dates in input**
As a user, I want to use natural relative dates like _"yesterday"_, _"3 days ago"_, or _"last Monday"_, so that I can log expenses for past days without manually picking a date.

_Acceptance criteria:_

- _"300 chai yesterday"_ on May 19, 2026 saves as May 18, 2026.
- _"1500 grocery 3 days ago"_ on May 19, 2026 saves as May 16, 2026.
- _"chips on 18th"_ on May 20, 2026 saves as May 18, 2026.
- _"snack on 18th previous month"_ on May 20, 2026 saves as april 18, 2026.
- If no date is mentioned, the date defaults to **now** (current date and time).
- Future dates (_"tomorrow"_) are rejected with a clarification prompt — you can only log expenses that have happened.

---

## Functional Requirements (V1)

This section defines the system behaviors required for V1. Each requirement is numbered and maps back to one or more Goals and User Stories.

### FR-1: Authentication

- **FR-1.1** The system must support user signup with email and password.
- **FR-1.2** Passwords must be stored hashed (never plaintext). Hashing algorithm: bcrypt with cost factor ≥ 10.
- **FR-1.3** Email addresses must be unique across all accounts.
- **FR-1.4** The system must reject signups with invalid email format or passwords shorter than 8 characters.
- **FR-1.5** The system must support login via email + password and return a session token.
- **FR-1.6** Session tokens must expire after a defined period (default: 30 days) and be invalidated on logout.
- **FR-1.7** The system must support password reset via OTP sent to the registered email.
- **FR-1.8** OTPs must expire after 10 minutes and become invalid after a single use.
- **FR-1.9** The system must support permanent account deletion. Deletion enters a 7-day grace period during which the user can cancel by logging in again. After 7 days, the user record and all associated expense data are removed irrecoverably.
- **FR-1.10** Account deletion must require an explicit confirmation (e.g., typing "DELETE") and cannot be triggered by a single click.
- **FR-1.11** Active sessions must be invalidated when an account is deleted, immediately ending access on all devices.
- **FR-1.12** Failed login attempts must be rate-limited per email (e.g., max 5 attempts per 15 minutes) to prevent brute-force attacks.

### FR-2: Expense Entry & Parsing

- **FR-2.1** The home screen must present a single text input field as the primary mechanism for expense entry.
- **FR-2.2** On submission, the system must send the raw input to an AI parser along with the current date and time of the user.
- **FR-2.3** The AI parser must return four structured fields: `amount` (number), `category` (one of the seven fixed categories), `description` (string), `date_time` (ISO 8601 timestamp).
- **FR-2.4** Total round-trip time from submit to result displayed must be ≤ 2 seconds under normal network conditions.
- **FR-2.5** The system must display a loading indicator while parsing is in progress.
- **FR-2.6** If parsing fails (unintelligible input), the system must prompt the user to rephrase, without saving any data.
- **FR-2.7** If parsing succeeds but the AI flags any field as low-confidence, the system must show the parsed result with editable fields and require explicit user confirmation before saving.
- **FR-2.8** Relative dates ("yesterday", "last Monday", "3 days ago", "on 18th", "18th previous month") must be resolved to absolute dates using the user's current date as reference.
- **FR-2.9** If a parsed date resolves to the future, the system must reject the entry with a clarification prompt.
- **FR-2.10** If no date is mentioned in the input, the system must default to the current date and time.
- **FR-2.11** The chat input is reserved for **creation only**. Edit, delete, query, and search operations must not be invokable through the input field.

### FR-3: Expense Storage & Persistence

- **FR-3.1** Each saved expense must be associated with the authenticated user who created it.
- **FR-3.2** Expense data must persist across sessions, devices, and app restarts.
- **FR-3.3** A user must only be able to read, edit, or delete their own expenses.
- **FR-3.4** Save operations must be atomic: an expense is either fully saved with all fields, or not saved at all. No partial writes.
- **FR-3.5** On network failure during save, the system must inform the user and preserve their input for retry.

### FR-4: Expense List

- **FR-4.1** The home screen must display the user's expenses in reverse chronological order (most recent first).
- **FR-4.2** Each list item must show: amount, category, description, and date/time.
- **FR-4.3** Tapping an expense must open an editable view exposing all four fields.
- **FR-4.4** Edits must be saved atomically (per FR-3.4) and reflected immediately in the list.
- **FR-4.5** Deletion must require a confirmation step before removing the expense.
- **FR-4.6** Deletion is hard-delete: removed expenses are permanently gone and do not appear in reports.

### FR-5: Reports / Dashboard

- **FR-5.1** A dedicated dashboard screen, separate from the home screen, must display three views: today, this week, this month.
- **FR-5.2** Each view must show: total amount spent, and a breakdown by category displayed as colored proportional bars and numeric values. No chart libraries.
- **FR-5.3** Time boundaries follow the user's local timezone: "today" = midnight to midnight local, "week" = Monday to Sunday local, "month" = 1st to last day local.
- **FR-5.4** Reports must reflect the current state of stored data, including the most recent edits and deletions.
- **FR-5.5** If no expenses exist in a given period, the report must show an explicit empty state, not zero values that could mislead.

### FR-6: Empty & Error States

- **FR-6.1** First-time users with no expenses must see a welcoming empty state on the home screen, including an example input prompt.
- **FR-6.2** Users with no expenses in the reporting period must see a helpful empty state on the dashboard.
- **FR-6.3** Network failures, API errors, and parsing failures must each surface clear, user-readable messages — never raw error codes or stack traces.
- **FR-6.4** All destructive actions (delete expense, delete account) must require explicit confirmation.

### FR-7: Architecture Constraints

- **FR-7.1** The data model must be designed such that introducing new tracker types (workout, food, etc.) in future versions does not require modifying the v1 expense schema or migrating existing expense data.
- **FR-7.2** The AI parsing layer must be abstracted such that the underlying model/provider can be swapped without changes to business logic.

---

## Non-Functional Requirements (V1)

Non-functional requirements define the _qualities_ the system must exhibit, beyond what features it provides.

### NFR-1: Performance

- **NFR-1.1** AI parsing round-trip (submit → parsed result displayed) must complete in ≤ 2 seconds at the 95th percentile under normal network conditions (≥ 5 Mbps).
- **NFR-1.2** Home screen load (after login, with up to 100 expenses in the list) must render in ≤ 1 second.
- **NFR-1.3 (correctness):** Dashboard totals must include _every_ expense within
  the requested time window. No truncation, no approximation, no sampling.
- **NFR-1.4 (performance target):** For typical loads (up to ~1,000 expenses
  in the calculation window), the dashboard must render in ≤ 1.5 seconds.
  Beyond this scale, performance may degrade gracefully, but correctness
  (NFR-1.3) is non-negotiable.
- **NFR-1.5** API endpoints (excluding AI parsing) must respond in ≤ 300 ms at the 95th percentile.

### NFR-2: Security

- **NFR-2.1** All client-server communication must use HTTPS. HTTP traffic must be rejected.
- **NFR-2.2** Passwords must be hashed with bcrypt (cost factor ≥ 10). Plaintext passwords must never be logged, transmitted, or stored.
- **NFR-2.3** Session tokens must be signed (e.g., JWT with HMAC-SHA256 or stored as opaque tokens in a session table) and validated on every authenticated request.
- **NFR-2.4** The system must protect against the OWASP Top 10 vulnerabilities, particularly: SQL injection, XSS, CSRF, broken authentication, and insecure direct object references.
- **NFR-2.5** API endpoints that act on user data must verify the requester owns the resource (per FR-3.3).
- **NFR-2.6** Sensitive data in logs (passwords, OTPs, tokens, full expense lists) must be redacted or never logged.
- **NFR-2.7** Environment secrets (API keys, DB credentials, JWT secrets) must be stored outside the codebase (e.g., environment variables, never committed to git).

### NFR-3: Reliability

- **NFR-3.1** The system must achieve ≥ 99% uptime over any rolling 30-day window in production.
- **NFR-3.2** Data writes must be durable: a successfully acknowledged save must survive server restarts, crashes, and routine maintenance.
- **NFR-3.3** If the AI parsing service is unavailable, the system must surface a clear error to the user — never silently fail or save unparsed data.
- **NFR-3.4** All errors must be logged with sufficient context (timestamp, user ID, request ID, stack trace) to enable debugging — without leaking sensitive data (per NFR-2.6).

### NFR-4: Usability

- **NFR-4.1** The web app must be responsive and fully functional on screen widths from 360px (small phones) to 1920px (desktops).
- **NFR-4.2** Primary actions (add expense, view dashboard, log out) must be reachable in ≤ 2 taps from the home screen.
- **NFR-4.3** All interactive elements must be keyboard-accessible (Tab navigation, Enter to submit).
- **NFR-4.4** Error messages must be written in plain language, never technical jargon or raw codes.
- **NFR-4.5** The app must work on the latest two stable versions of Chrome, Safari, Firefox, and Edge. Older browsers may degrade but must not break.

### NFR-5: Maintainability

- **NFR-5.1** The codebase must follow a consistent style enforced by an automated linter and formatter (e.g., ESLint + Prettier).
- **NFR-5.2** Every architectural decision (DB choice, framework choice, deployment choice, etc.) must be documented as an ADR in `docs/decisions/`.
- **NFR-5.3** Business logic must be testable independently of the UI and the database (separation of concerns).
- **NFR-5.4** The system must have automated tests covering: authentication flows, expense CRUD, and AI parsing happy/failure paths. Target coverage: ≥ 60% on business logic.
- **NFR-5.5** A new developer onboarding to the codebase must be able to run the project locally within 30 minutes, following only the README.

### NFR-6: Scalability

V1 is not optimized for scale — it is optimized to ship. The following are the _modest_ scale targets V1 must handle without redesign:

- **NFR-6.1** The system must support up to **100 concurrent users** without performance degradation beyond stated thresholds (NFR-1).
- **NFR-6.2** A single user must be able to store up to 10,000 expenses without the dashboard calculation exceeding NFR-1.4. Storage of additional expenses must remain correct (per NFR-1.3) even if performance degrades beyond this scale.
- **NFR-6.3** Scaling beyond these limits is explicitly **out of scope** for v1. Re-architecture is acceptable when these limits are approached.

### NFR-7: Cost

- **NFR-7.1** Monthly infrastructure cost (hosting + database + AI API) must remain under **₹1,500/month** at v1 scale (NFR-6 limits).
- **NFR-7.2** AI parsing cost per expense entry must average under **₹0.50** at expected token volumes.

---

## Success Metrics (V1)

Success is measured 90 days after V1 ships. Each metric is observable, not subjective.

### The Headline Metric

- **SM-1: The Builder's Verdict**
  At day 90 post-launch, the builder (Kizhore) can honestly answer **yes** to all three:
  1. _"I trust this tool with my data."_ (Reliable)
  2. _"Logging an expense feels good, not like a chore."_ (Happy to log)
  3. _"I now know where my money goes in a way I didn't before."_ (On track)

  If any of these is "no," V1 has not succeeded — regardless of what the other metrics say.

### Product Metrics (supporting SM-1)

- **SM-2: Voluntary adoption**
  The builder uses Kizo-Corpus as his sole expense tracker for 90 consecutive days, _without setting reminders or forcing himself._ Defined as: at least one expense logged on ≥ 70 of those 90 days, with entries spread naturally across each day (not batched at month-end).

- **SM-3: Entry friction**
  Median time from "open the app" to "expense saved" is ≤ 10 seconds. Friction is what kills "happy to log."

- **SM-4: Parse accuracy**
  ≥ 90% of expense entries are saved without requiring manual correction. Measured as: (entries with no post-save edit) / (total entries) over the last 30 days. Low accuracy erodes trust (SM-1.1).

- **SM-5: Dashboard usage**
  The dashboard is opened at least once every 7 days, on average. Indicates the reports are valuable — that the builder is actually getting "on track" (SM-1.3), not just logging blindly.

- **SM-6: Retention (becomes meaningful with multiple users)**
  ≥ 60% of users who sign up log a second expense within 7 days of their first.

### Technical Metrics (supporting "reliable")

- **SM-7: Uptime**
  ≥ 99% uptime over any rolling 30-day window (mirrors NFR-3.1).

- **SM-8: API error rate**
  < 1% of API requests return 5xx server errors over a rolling 7-day window.

- **SM-9: Zero silent failures**
  Zero incidents where data was lost, miscategorized, or reported incorrectly without the user being notified. This is a _correctness_ metric and is non-negotiable.

- **SM-10: AI parsing reliability**
  < 5% of parse attempts fail with an "unintelligible input" response.

- **SM-11: Performance SLOs met**
  P95 latencies stated in NFR-1.1 through NFR-1.5 are met in production for ≥ 95% of measurement windows.

### Anti-metrics (what we will NOT optimize for)

- **Daily active users** — V1 is not a growth product. Engagement-for-its-own-sake contradicts the philosophy ("reclaim attention, don't capture it").
- **Time spent in app** — Less is better. A user who logs in 5 seconds and closes the app is succeeding, not failing.
- **Session length** — Same reason. Long sessions in a tracker mean something is wrong.
- **Number of features used per session** — Same reason. Doing one thing well > engaging with many things.

### How metrics will be measured

For v1, lightweight instrumentation only:

- **App-level events:** Log signup, login, expense create/edit/delete, dashboard open. Store in a basic events table.
- **Performance:** Server logs with timestamps for request start/end.
- **Builder's Verdict (SM-1):** Self-assessment by the builder at days 30, 60, and 90. Documented in a `docs/post-launch-review.md`.
- **Manual review:** Builder reviews own usage data weekly during the 90-day window.

Dedicated analytics tools (PostHog, Mixpanel, etc.) are explicitly out of scope for v1.

---

## Open Questions

All tech-stack and architecture questions raised during PRD drafting have been resolved. Each resolved decision will be formalized as an ADR in `docs/decisions/` during Phase 3.

### Resolved Decisions (to be formalized as ADRs)

- AI parsing provider: **Claude Haiku**
- Frontend stack: **Vite + React + TypeScript**
- Backend framework: **Node + Express**
- Database: **PostgreSQL**
- Hosting: **Vercel** (frontend), **Railway** (backend + DB)
- Email/OTP delivery: **Resend**
- Authentication: **JWT**, 30-day expiry
- Confirmation flow: parsed result shown, explicit confirm required before save
- Dashboard visualization: numeric totals with colored category bars (no charts library)
- Account deletion: 7-day grace period before permanent removal
- Time storage: **UTC** in database, converted to user-local for display
- Categories: hardcoded TypeScript enum (extension to other tracker types handled separately per Architecture Constraint)
- Rate limiting: IP-based
- Timezone detection: browser-detected at signup, stored on user record
- Database backups: managed-provider daily snapshots, 7-day retention
- Monitoring: UptimeRobot (uptime), Sentry (errors), host logs (performance)
- Privacy Policy and ToS: required before any non-builder user signs up

### Deferred Questions (revisit post-launch)

- **OQ-9** Exact threshold for "low-confidence" parses — to be tuned during Phase 6 prompt engineering, refined post-launch with real data.
- **OQ-19** Scope of v1.5 features (pattern detection, conversational mode) — revisit after 30 days of v1 usage.
- **OQ-20** Audience growth strategy — out of v1 scope; revisit post-launch.

---

## Future Versions / Out of Scope

V1 ships a focused expense tracker. The product vision extends well beyond this. The following are explicitly out of v1 scope but captured here to:

- Prevent loss of context
- Sequence future work in deliberate phases
- Make clear what the Architecture Constraint (no v1 rewrite) must accommodate

### V1.5 — Insights & Polish

The first iteration after v1 ships, focused on adding value _within_ the expense tracker before expanding to new tracker types.

- **Pattern detection (AI-driven insights)**
  Weekly AI-generated observations about the user's spending behavior — e.g., _"You spent ₹4,200 on food deliveries this week, 38% of total spending."_ Built on top of v1's real data.

- **Search and filter on expense list**
  Filter expenses by date range, category, amount, or text. Deferred from v1 because list sizes are small in the first month of use.

- **Yearly reports**
  Extend dashboard to include yearly view in addition to today/week/month.

- **PWA installability**
  Allow users to install Kizo-Corpus to their home screen, giving native-app feel without app-store distribution.

- **Conversational queries**
  Allow users to ask questions like _"how am I doing this week?"_ or report passive states like _"haven't spent today."_ The AI replies with context-aware answers based on the user's actual data. Foundation: requires pattern detection to be meaningful.

- **Charts and visualizations**
  Beyond simple colored bars: optional pie chart of category breakdown, line graph of spending over time. Decision deferred until users actually request it.

### V2 — Workout Tracker

Second tracker type, built on the same substrate as expenses. Validates the Architecture Constraint.

- Natural-language workout entry (_"ran 5km"_, _"45 min lifting"_, _"yoga 30 min yesterday"_)
- Parses into structured fields: activity, duration, intensity, date/time, optional metrics (distance, weight, reps)
- Dashboard with daily, weekly, monthly totals and category breakdowns (cardio, strength, mobility, etc.)
- Same reliability, security, and performance contracts as v1

### V3 — Food Tracker

Third tracker type. Most challenging of the three because food entries are ambiguous (portion sizes, nutritional inference).

- Natural-language food entry (_"two dosas at noon"_, _"chicken biryani for lunch"_, _"black coffee"_)
- Parses into: food items, approximate portions, meal time, date
- Optional: macro/calorie estimation via AI
- Reports: daily/weekly meal patterns, eating-time analysis

### V4+ — Other Trackers (TBD)

The platform substrate, once validated through v2 and v3, can extend to:

- Mood / journal tracker
- Sleep tracker
- Reading / learning tracker
- Habits tracker

Specific trackers will be added based on the builder's personal need and demand from real users. No commitments at this stage.

### Permanently Out of Scope (across all versions)

Some product directions are explicitly rejected, not deferred. These are decisions, not omissions.

- **Social features** — sharing, comparing with friends, social feeds, leaderboards. Contradicts the platform's "personal caretaker" philosophy. Tracking should be private.
- **Engagement-driven design** — push notifications to "increase usage," gamification, streak guilt, daily reminder badges. Contradicts the SM anti-metrics (time-in-app, session length, daily active users).
- **Advertising / monetization through user data** — the user's data is theirs, never sold or used for ad targeting.

### Roadmap Sequence

```
v1   →  Expense tracker  (ships Sept 16, 2026)
v1.5 →  Insights & polish  (~3 months post-v1)
v2   →  Workout tracker   (validates extension architecture)
v3   →  Food tracker      (validates AI ambiguity handling)
v4+  →  Additional trackers based on need
```
