# Bain Squared Intangible Value Scorecard — PRD

## Problem

Singapore founders and SME owners issuing ESOPs, preparing for fundraises, or holding brand and IP assets routinely undervalue what they own. They either skip a formal valuation entirely, lean on a number their accountant pulled out of the air, or commission a report that sits in a drawer until the auditor asks for it. The current Bain Squared site explains the Intangible Asset Valuation pillar clearly, but it gives the visitor no way to self-assess. People who would qualify for a Black-Scholes ESOP valuation, a PPA in an active M&A process, or a relief-from-royalty engagement on a brand they're about to license read the page, nod, and leave. We don't capture them, and the next time they think about valuation they're three quarters into a deal and calling someone else.

The scorecard exists to convert that traffic into segmented, qualified pipeline for the IA Valuation pillar, and to do it in a way that reads like Bain Squared rather than a Typeform.

## Goal

Generate 8 to 12 qualified leads per month for Intangible Asset Valuation engagements, segmented by track (ESOP vs Brand/IP) and triage tier (hot, warm, education), with enough context in each lead for sales to make first contact without a discovery call.

## Non-goals

Not a marketing widget. Not a calculator that returns a defensible valuation number. Not a tool that gates the assessment behind email. Not a portal with accounts, saved progress, or retake history. Not an internal admin dashboard. Lead data lives in Postgres; sales triages from a tagged email and SQL queries.

## Users

The scorecard is built for four reader types, in priority order:

1. Late-stage founder or CFO issuing or refreshing an ESOP grant tranche, with audit, board, or IRAS pressure pushing the timeline.
2. SME owner with brand or IP assets exploring whether there is valuation upside they are not capturing — typically driven by a licensing conversation, regional expansion, or an inbound M&A inquiry.
3. Finance lead preparing for a Series A/B raise or a strategic sale where intangible asset recognition materially affects deal economics or PPA outcomes.
4. Operator inside a family business or multi-shareholder SME where ownership risk has become live, often via shareholder restructuring or governance review.

If the reader doesn't fit one of these four, the scorecard is not for them and should route them out cleanly.

## Core flow

1. User lands on `assessment.bainsquared.com` (or `/scorecard`).
2. Reads the positioning copy, clicks Start.
3. Answers Q1 (routing) and, if "not sure," Q2 (clarifier).
4. Routed to ESOP or Brand/IP track for 7 to 8 questions, including one open-text at the end.
5. Sees their score, diagnosis, and recommended next step on the result page.
6. Submits email to unlock the CTA to book a Bain Squared call.
7. Receives a result email. Sales receives a tagged lead with the full submission, open-text answer prominently surfaced.

## Success metrics

- Completion rate (started → completed): ≥60%
- Email capture rate (completed → submitted): ≥70%
- Booked call rate (email submitted → call booked): ≥15%
- Time to complete: ≤3 minutes median
- Lead quality: ≥40% of submissions tagged as `esop_hot_lead`, `strategic_transaction_lead`, or `fundraising_valuation_lead`

These are v1 targets. Adjust after the first 30 days of real traffic.

## Out of scope (v1)

A/B testing different question copy. Partial progress saved across sessions. Blocking the same email from retaking the scorecard. White-label embeds for partners or syndication. A user-facing dashboard of past results. Anything that requires authentication.

## Tech stack

See PROJECT_GUIDE.md section 2. Next.js 14 on Vercel, TypeScript, Tailwind, Vercel Postgres, Resend, Framer Motion, Radix UI primitives. No additional libraries without sign-off from Nic.

## Brand and tone

See `Bain_Squared_context.md` and the voice rules in `CONTEXT.md`. The reader is a founder, CFO, or operator who has seen worse than the assessment they're about to take. The copy should match their pace: short declarative sentences when calling out an accountability moment, longer structured sentences when explaining a capital or governance consequence, no hedging, no encouragement, no exclamation points, no em dashes, no fundraising-advisor framing, no "former CFOs" credibility leaning. The bracket motif `[ ]` is the only signature flourish. Use it for the user's track name, their score, and the result label. Nowhere else.

The conversion event is the booked call, not the email submission. Build the surface accordingly.
