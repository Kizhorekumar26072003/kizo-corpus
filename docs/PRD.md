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
