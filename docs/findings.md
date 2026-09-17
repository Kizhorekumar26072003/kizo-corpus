**_Phase-0 Findings_**

**Show, don't tell** You had a long paragraph explaining how dates work. The model got the year wrong. You replaced it with example pairs — "100 chai yesterday" → 21/09/2026 — and the year came out right. Examples work better than explanations.

**Non-determinism.** same input,temperature: 0, run twice → 01/08/2025 and 09/08/2025. Temperature zero reduces variation, it doesn't remove it. You can't assume the same input gives the same output.

**Placeholders** For "200 rs" the model returned description: "expense". It didn't leave the field empty — it invented something plausible. So a missing value doesn't arrive looking missing, and a check for "is it blank" won't catch it.

**Model choice** Flash took 2864ms and 470 tokens (292 of them thinking). Flash-Lite took ~850ms and ~80 tokens. Same answer. Extraction doesn't need a model that reasons — you paid 3× for nothing.

**The hang** One call took 90 seconds. Your app would have frozen with no way out. That's why FR-2.15 says every call needs a timeout — you now have evidence, not theory.

**The guard works** Five test inputs, five correct routings. Nothing wrong stored, nothing right blocked.

**Date removal** The one where i deleted the field, the entire failure class vanished, and the prompt dropped 204 → 48 tokens.That's the most consequential thing Phase 0 produced, and it's the one that changes the PRD and the schema.

_Reference_
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

**Rate limiting** "This model faces high traffic" — you hit it repeatedly. External dependency failing regardless of your code quality. Needs retry with backoff, and a fallback so the user's input is never lost.

**Retry with backoff** only retry what's worth retrying — a 429 or a timeout, yes. A malformed response, no, because the same request will produce the same garbage

**Fallback** — what you do when all retries fail.

The bad version: show an error, lose their text, they leave.

Options, in order of quality:

Keep their input in the field with a clear message so they can retry
Save the raw text now, parse it later when the service recovers
Drop to a plain form — amount, category, description — so the expense still gets recorded
