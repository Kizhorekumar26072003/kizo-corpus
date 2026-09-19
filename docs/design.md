# Kizo-Corpus — Design Document

**Status:** Draft v0.1
**Last updated:** 2026-09-21
**Owner:** Kizhore

---

## 3b. Data Model

### users

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  timezone      TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### tracker_entries

One table for every tracker type — see ADR-007. Shared fields are real columns;
type-specific fields live in `data`.

```sql
CREATE TABLE tracker_entries (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id),
  type             TEXT NOT NULL CHECK (type IN ('expense','food','workout')),
  entry_date       DATE NOT NULL,

  data             JSONB NOT NULL,
  amount           INTEGER,              -- paise; NULL for workouts

  -- parse provenance
  raw_input        TEXT NOT NULL,
  prompt_version   TEXT NOT NULL,
  model            TEXT NOT NULL,
  parse_status     TEXT NOT NULL CHECK (parse_status IN ('ok','confirm')),
  parse_original   JSONB,                -- what the model returned, if edited
  was_edited       BOOLEAN NOT NULL DEFAULT false,

  -- telemetry
  input_tokens     INTEGER,
  output_tokens    INTEGER,
  ai_latency_ms    INTEGER,
  total_latency_ms INTEGER,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_entries_user_date
  ON tracker_entries (user_id, entry_date DESC);
```

**Notes**

- `amount` is nullable — a workout has no amount. It is a real column, not inside
  `data`, because reports sum it and arithmetic needs the database to enforce the type.
- `parse_status` only holds `ok` or `confirm`. Anything invalid never becomes an
  entry; it goes to `parse_failures`. The two tables split on exactly that line.
- The index matches the shape of every query: filter by user, sort by date descending.

### parse_failures

```sql
CREATE TABLE parse_failures (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id),
  raw_input        TEXT NOT NULL,
  failure_reason   TEXT NOT NULL,
  model_response   TEXT,                 -- TEXT, not JSONB: it may not be valid JSON
  prompt_version   TEXT NOT NULL,
  model            TEXT NOT NULL,
  input_tokens     INTEGER,
  output_tokens    INTEGER,
  ai_latency_ms    INTEGER,
  total_latency_ms INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3c. API Contracts

### Rules that apply to every route

**The user id never appears in a request body or query string.** It is read
server-side from the signed httpOnly cookie. A client-supplied id means anyone
can change the number and reach another account's data.

**Every query filters by that user id.** `WHERE id = $1 AND user_id = $2`.
Ownership is checked on the server. A client-side guard is UX, never security.

**Authentication:** signed JWT in an httpOnly cookie, 7-day expiry (ADR-005).
The browser attaches it automatically — the client never handles the token.

**`401`** means no valid cookie and applies to every route except signup and login.
**`500`** means an unexpected server failure and applies everywhere. Neither is
repeated below.

---

### POST /api/signup

Creates an account and sets the session cookie.

**Request**

```json
{ "email": "example@gmail.com", "password": "hi@123" }
```

**Response 201**

```json
{ "status": "created" }
```

**Errors**

- `400` — invalid email format, or password shorter than 8 characters
- `409` — email already registered

---

### POST /api/login

**Request**

```json
{ "email": "example@gmail.com", "password": "hi@123" }
```

**Response 200**

```json
{ "message": "Logged in" }
```

**Errors**

- `401` — `"Invalid credentials"`. **Wrong email and wrong password return the
  identical response.** Distinguishing them lets an attacker discover which
  emails are registered.

---

### POST /api/logout

Clears the cookie. No request body — the cookie is already attached.

**Response 200**

```json
{ "message": "Logged out" }
```

**Note:** this clears the browser's copy only. The token itself stays valid until
it expires — the accepted limitation in ADR-005.

---

### POST /api/parse

Sends raw text to the model and returns the parsed result. **Stores nothing.**

**Request**

```json
{ "text": "200 chai", "type": "expense" }
```

**Response 200**

```json
{
  "status": "ok",
  "parsed": { "amount": 20000, "category": "Food", "description": "chai" },
  "meta": {
    "promptVersion": "v2",
    "model": "gemini-3.5-flash-lite",
    "inputTokens": 14,
    "outputTokens": 31,
    "aiLatencyMs": 1082,
    "totalLatencyMs": 1526
  }
}
```

`status` is `ok` or `confirm`. On `confirm` the client prefills an editable form
with `parsed`. On `ok` the client immediately calls `POST /api/entries` with no
user interaction — the user sees one action, not two.

**Errors**

- `400` — empty input, or longer than the allowed limit
- `422` — the model returned something that failed validation. Nothing stored in
  `tracker_entries`; a row is written to `parse_failures`.
- `429` — upstream rate limit, after retries were exhausted
- `504` — the call exceeded the timeout (FR-2.15)

**`promptVersion`** is a constant in the code, bumped by hand whenever the prompt
changes. It travels back in `meta` so the client can return it on create, which is
what makes accuracy attributable to a specific prompt.

---

### POST /api/entries

Saves a confirmed entry. The client sends everything `/api/parse` returned, plus
any corrections the user made.

**Request**

```json
{
  "type": "expense",
  "entry_date": "2026-09-21",
  "data": { "amount": 20000, "category": "Food", "description": "chai" },
  "amount": 20000,
  "raw_input": "200 chai",
  "parse_status": "confirm",
  "parse_original": {
    "amount": 20000,
    "category": "Transport",
    "description": "chai"
  },
  "was_edited": true,
  "meta": {
    "promptVersion": "v2",
    "model": "gemini-3.5-flash-lite",
    "inputTokens": 14,
    "outputTokens": 31,
    "aiLatencyMs": 1082,
    "totalLatencyMs": 1526
  }
}
```

**Response 201**

```json
{ "id": 42, "status": "created" }
```

**Errors**

- `400` — missing required fields, or `amount` not a positive integer

**Why this is a separate route from `/api/parse`:** on a `confirm`, the user edits
the values, so the server must receive the corrected version — that is a second
request by definition. Keeping one save path for both statuses means the logic
exists once instead of twice. It also means a failed save can be retried from the
client without paying for a second AI call.

`parse_original` is sent only when `was_edited` is true. It is the model's answer
next to the user's correction — a labelled example, and the raw material for
improving the prompt later.

---

### GET /api/entries

Lists this user's entries, newest first.

**Query parameters**

```
?limit=20&cursor=<id>
```

**Response 200**

```json
{
  "entries": [
    {
      "id": 42,
      "type": "expense",
      "entry_date": "2026-09-21",
      "amount": 20000,
      "data": { "amount": 20000, "category": "Food", "description": "chai" },
      "was_edited": false
    }
  ],
  "nextCursor": 38
}
```

**An empty list is `200` with `"entries": []`, not an error.** Having no entries
yet is a normal state — it is the empty state in Story 15, not a failure.

---

### PATCH /api/entries/:id

Edits an existing entry by hand. **No AI call.**

**Request** — only the fields being changed:

```json
{ "data": { "amount": 20000, "category": "Food", "description": "chai" } }
```

**Response 200**

```json
{ "id": 42, "status": "updated" }
```

**Errors**

- `400` — invalid field values
- `404` — no entry with that id **belonging to this user**. Same response whether
  the row does not exist or belongs to someone else; distinguishing them confirms
  the existence of other people's data.

The server sets `was_edited = true` itself. The client never sends that flag, for
the same reason it never sends `user_id` — a value the client controls is a value
the client can lie about.

---

### DELETE /api/entries/:id

**No request body.** The id is in the URL; the user comes from the cookie.

**Response 200**

```json
{ "message": "Deleted" }
```

**Errors**

- `404` — no entry with that id belonging to this user

---

### GET /api/reports

Totals and category breakdown for a period.

**Query parameters**

```
?period=today | week | month
```

Period boundaries are computed in the user's timezone, taken from their `users`
row — `today` is local midnight to midnight, `week` is Monday to Sunday, `month`
is the 1st to the last day.

**Response 200**

```json
{
  "period": "month",
  "from": "2026-09-01",
  "to": "2026-09-30",
  "total": 452000,
  "byCategory": [
    { "category": "Food", "total": 180000 },
    { "category": "Transport", "total": 95000 }
  ]
}
```

**Totals only — individual entries are not returned.** The screen shows sums; the
list lives at `GET /api/entries`. Nesting every entry inside each category would
ship the whole dataset a second time.

A period with no entries returns `200` with `"total": 0` and an empty
`byCategory` — the client renders the empty state from that, rather than showing
a misleading zero as though it were data.

**Errors**

- `400` — unrecognised `period`

**Note:** `period` is limited to `today`, `week` and `month`, matching the PRD.
"Last 30 days", "custom" and "all" are not in v1 and are not listed here.
Adding one is a scope change under the change-control rule.

---

## Open items

- **OQ-1** — whether `ok` genuinely auto-saves without any user interaction.
  The contract above assumes it does. Resolve with real use (ADR-008).
- Retry-with-backoff and the offline fallback belong inside `/api/parse`,
  built in Phase 3.
- Pagination shape for `GET /api/entries` is cursor-based above; confirm it
  when the list screen is wireframed.
