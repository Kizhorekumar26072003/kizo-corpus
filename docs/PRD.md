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
