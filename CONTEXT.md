# Bain Squared Scorecard — Working Context

This file is loaded first by Claude Code on every session. Keep it tight, current, and decision-focused. When a decision changes, update this file before writing code.

## What this is

A two-track Intangible Asset Valuation scorecard hosted on Vercel. Routes the user to ESOP or Brand/IP, scores their answers, applies sales-segmentation tags, and lands them on a tailored CTA. It is a product surface for the Bain Squared IA Valuation pillar, not a marketing widget.

Linked docs: `PRD.md` (problem, goal, scope), `PROJECT_GUIDE.md` (build phases, full architecture), `../_shared/Bain_Squared_context.md` (firm-wide brand and positioning), `../_shared/BRAND_GUIDELINES.md`, `../_shared/DESIGN_TOKENS.md`.

## Stack

- Next.js 14 (App Router), TypeScript strict
- Tailwind CSS, Radix UI primitives (Dialog, RadioGroup, Progress)
- React Hook Form + Zod for form state and validation
- Vercel Postgres for lead storage
- Resend for transactional email
- Framer Motion for the score reveal and progress bar
- Vercel for hosting; auto deploys from `main`, preview URLs on every branch

## Code conventions

- TypeScript strict mode on. No `any`. No `// @ts-ignore`. If types fight, fix the types.
- Tailwind only. No inline styles, no CSS modules, no styled-components.
- All colors, spacing, typography, and shadows reference `tailwind.config.ts` tokens. No raw hex anywhere in component files.
- All copy lives in `src/content/`, never inline in components.
- Pure functions for scoring, routing, and tag derivation in `src/lib/`. Side-effect-free, unit-tested.
- Server components by default. Client components only where state, motion, or browser APIs require it.
- One question schema is the source of truth. Adding, removing, or reordering questions is a content change in `src/content/questions.ts`, not a code change anywhere else.

## File structure

```
src/
  app/
    page.tsx                 (landing)
    scorecard/
      page.tsx               (assessment shell)
      result/page.tsx        (result page)
    api/
      submit/route.ts        (lead capture)
    styleguide/page.tsx      (every component, every state — visual regression check)
  components/
    ui/                      (Bracket, Button, Card, Badge, Progress, ScoreCard)
    scorecard/               (Question, OptionGroup, ProgressHeader, ResultCTA)
  content/
    questions.ts             (question schema + content, source of truth)
    outcomes.ts              (score-range to outcome mapping per track)
    copy.ts                  (landing + result page copy)
  lib/
    scoring.ts               (calculateScore — pure)
    routing.ts               (determineTrack — pure)
    tags.ts                  (deriveTags — pure)
    db.ts                    (Postgres client)
  emails/
    UserResultEmail.tsx
    SalesLeadEmail.tsx
  styles/
    globals.css
```

## Brand voice rules

These are hard rules. Treat them as production-blocking if violated.

- No em dashes as punctuation. Use commas, full stops, or rephrase.
- No exclamation points anywhere in the UI or in either email template.
- Banned vocabulary: `leverage` (verb), `synergy`, `unlock value`, `transform` (when used as a marketing verb), `robust`, `best-in-class`, `world-class`, `holistic`, `journey`, `seamlessly`, `empower`. Where the underlying meaning is real, write the literal mechanism instead.
- No urgency manipulation. No countdown timers. No "limited spots." No "only X left."
- Answer-first structure on every screen. Lead with the takeaway. The reader can scroll if they want the why.
- The `[ ]` bracket motif is the signature element. Use it only for the user's track name (`[ESOP]`, `[Brand & IP]`), their score (`[74]`), and the result label (`[ESOP Valuation Gap]`). Never decorative. Never in marketing copy.
- Operator-to-operator. The reader is a founder, CFO, or operator who has seen worse than the assessment they're about to take. Match their pace.
- Do not lean on "former CFOs" or any team-pedigree framing as the credibility signal. The team is operators with finance backgrounds. That's the line.
- Do not position Bain Squared as a fundraising consultant or capital raiser. The firm provides valuation; clients use it for their own fundraising.

## Bain Squared context Claude Code needs to hold

- The scorecard sells into Pillar 3: Intangible Asset Valuation (legacy, project-based).
- Engagement model: fixed-fee per valuation, 4 to 6 weeks. Annual retainer available for companies with regular ESOP grant cycles.
- Methodologies referenced in result-page diagnoses: Black-Scholes and binomial lattice for ESOPs (under SFRS(I) 2 / IFRS 2), Relief-from-Royalty for brand and IP, Multi-Period Excess Earnings for customer relationships, income-based for software and data assets.
- Compliance triggers users will recognise: SFRS(I) 2 / IFRS 2 grant-date fair value, IRAS treatment of ESOP exercise, ACRA filings, SGX disclosure obligations, PPA in M&A, PDPA where data assets are in scope.
- Cross-sell logic that affects copy: ESOP valuation clients often need Fractional CFO support next; PPA clients often need Financial Transformation. The result-page CTA can hint at this without selling it.

## Scorecard structure

- Two tracks: `esop` and `brand_ip`. Brand/IP is the bucket for everything in the IA Valuation pillar that isn't ESOP — brand, IP, software and data assets, customer relationships.
- Routing: Q1 asks why they're here. If "not sure," Q2 clarifies. Otherwise the user is dropped straight into the track.
- Each track: 7 to 8 questions. Last question is open-text ("Anything else worth knowing before we look at this together?"). Open-text is required, generous (multi-line), no character cap, and surfaces prominently in the sales lead email.
- Scoring: each option carries an integer score 0 to 3. Sum within track. Outcome ranges defined in `src/content/outcomes.ts`.
- Tags: derived from selected options and option combinations. Tags drive sales triage. Not user-visible.

## Backend tags (sales-triage taxonomy)

Nine tags, matching the project guide. Stored in `src/lib/tags.ts` as a single pure function.

- `esop_hot_lead` — ESOP track + grant timeline within 3 months OR audit/board pressure flagged
- `esop_needs_report` — ESOP track + no formal valuation done, or last one over 12 months old
- `esop_education_lead` — ESOP track + hasn't issued yet, exploring
- `esop_stakeholder_pressure` — ESOP track + board, auditor, or institutional investor named as the trigger
- `fundraising_valuation_lead` — Brand/IP track + raising or in DD
- `brand_valuation_lead` — Brand/IP track + brand licensing or M&A driving the need
- `software_data_valuation_lead` — Brand/IP track + tech IP, data assets, or proprietary algorithms named
- `ownership_risk_lead` — Brand/IP track + family business, equity dispute, or shareholder restructuring flagged
- `strategic_transaction_lead` — Either track + M&A imminent (≤6 months)

A submission can carry multiple tags. Sales prioritises by union, not intersection.

## Result page rules

- Show score and diagnosis immediately on completion. No gate.
- Gate only the recommended-next-step CTA behind email submission. This is the high-trust pattern: user sees their value upfront, gives email to unlock the next step.
- Outcome copy lives in `src/content/outcomes.ts`. Two to three sentences per outcome. Names the diagnosis, says what's at stake, names the engagement.
- The CTA names the engagement specifically, e.g. "Book an ESOP Valuation Readiness Call" or "Book a Brand IP Valuation Scoping Call." Never a generic "Book a call."
- The user's open-text answer is included verbatim in the sales lead email, surfaced above the structured fields.
- Score is animated from 0 to final value over the deliberate-easing duration. Score number is the marquee element on the page; everything else supports it.

## Don't do this

- Don't add libraries without checking with Nic first.
- Don't ship loading skeletons that aren't tied to a real loading state.
- Don't gate the assessment behind email. Gate the result CTA only.
- Don't auto-redirect after submission. The user clicks to continue.
- Don't use stock illustrations or AI-generated imagery. The DESIGN_TOKENS direction rejects them.
- Don't show the user their backend tags.
- Don't email the user before they submit, even on completion.
- Don't reuse the same outcome copy across both tracks. Each track gets its own outcomes.
- Don't add a progress percentage that lies (e.g. shows 50% when only Q3 of 8 has been answered). Use real progress.
- Don't use the word "journey" anywhere in the UI.

## Domain

Default: `assessment.bainsquared.com` as a CNAME pointing to Vercel. Vercel issues SSL automatically. Robots.txt allows the landing route, disallows `/scorecard` and `/scorecard/result`.

## Open questions for Nic (resolve before launch)

- Final domain confirmation. Subdomain is the recommended default; confirm before DNS work.
- Sales inbox address. Placeholder: `scorecard-sales@bainsquared.com`.
- Booking flow. Calendly URL or alternative. Placeholder: `https://calendly.com/bainsquared/ia-valuation`.
- Whether the landing page should include a "talk to us without scoring" escape-hatch link for visitors who already know what they need.
- Whether the Brand/IP track should include a Singapore-specific question (PDPA-classified data assets, ACRA-registered brand, regional licensing structure) or stay generic for v1.
- Whether to include the Privilege Press privacy policy template or write a Bain-Squared-specific one.
- Resend sending domain. SPF and DKIM need to be configured before the first send.
