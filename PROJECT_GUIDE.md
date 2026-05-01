# Bain Squared Intangible Value Scorecard — Project Guide

A reference document for planning, scoping, and building the scorecard. Hand this plus `DESIGN_TOKENS.md` to Claude Code as project context when you're ready to write code.

---

## 1. What we're building

A two-track interactive scorecard hosted on Vercel that:

1. Walks a founder or operator through 8 to 10 questions across a routing layer plus one of two specialist tracks (ESOP or Brand/IP).
2. Scores their answers in real time and assigns hidden backend tags for sales segmentation.
3. Lands them on a result page with a personalised diagnosis, a numeric score, and a tailored CTA to book a call with Bain Squared.

Three surfaces matter:

- **Landing page.** Positioning copy, social proof if available, single CTA into the assessment.
- **Assessment.** Question flow with branching logic, visible progress, and a clean step-by-step UX.
- **Result page.** Animated score reveal, diagnosis copy, recommended next step, lead capture form, CTA to book.

Total build time: two to four focused days if you stay disciplined. The bottleneck is not code, it's writing the question copy, scoring logic, and outcome diagnoses with confidence. Get those right before opening the editor.

---

## 2. Stack (decided, no debate)

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Vercel-native, SSR for SEO, route handlers for the API |
| Language | TypeScript | Question schema, scoring logic, and routing all benefit from types |
| Styling | Tailwind CSS | Maps cleanly to your DESIGN_TOKENS.md as theme tokens |
| Component primitives | Radix UI (Dialog, RadioGroup, Progress) | Accessible, unstyled, lets your tokens lead |
| Forms | React Hook Form + Zod | Form state, validation, and type inference in one |
| Lead storage | Vercel Postgres | Zero-config from Vercel dashboard, simple SQL |
| Email | Resend | Cleanest DX for transactional email; React Email templates |
| Analytics | Vercel Analytics + custom event log | Pageviews + custom funnel events (started, completed, submitted) |
| Motion | Framer Motion | Score count-up, progress fills, page transitions |
| Hosting | Vercel | Auto deploys from git, edge functions, preview branches |
| Domain | `bainsquared.com/scorecard` or `assessment.bainsquared.com` | Subdomain is cleaner if you plan to extend later |

If you're paying for tools you already own, swap Vercel Postgres for Supabase, Resend for whatever transactional provider Privilege Press uses, and Vercel Analytics for Plausible. Stack is portable; the decision tree above is the fast default.

---

## 3. Three documents to write before opening Claude Code

This is the part most people skip. Don't. Each of these compounds your speed once you start coding.

### 3.1 PRD (Product Requirements Document)

One markdown file at the project root, `PRD.md`. Not 20 pages. Two pages, max.

**Structure:**

```
# Bain Squared Intangible Value Scorecard — PRD

## Problem
One paragraph. Who is the user, what are they trying to figure out,
and why does the current Bain Squared site fail to answer that.

## Goal
One sentence. The single business outcome you're optimising for.
Example: "Generate 10 qualified leads per month for ESOP and intangible
asset valuation engagements, with sales-ready segmentation."

## Non-goals
What we are explicitly not building. Useful for fending off scope creep.
Example: "Not building user accounts. Not building a portal to view past
results. Not building admin dashboards. Lead data lives in Postgres and
gets emailed to sales."

## Users
Two or three user types in one line each.
Example:
- Founder issuing first ESOP, no formal valuation yet
- SME owner exploring whether their brand or processes have valuation upside
- Startup CFO preparing for a Series A and wanting a stronger valuation story

## Core flow
The happy path in five to seven bullets.
1. User lands on /scorecard
2. Clicks "Start"
3. Answers Q1 (routing) and Q2 (if routed to "not sure")
4. Answers 7 to 8 track-specific questions
5. Submits email at the result page
6. Sees diagnosis, score, and CTA
7. Receives confirmation email with their result; sales receives lead

## Success metrics
Three to five concrete metrics with thresholds.
Example:
- Completion rate (started → completed): ≥60%
- Email capture rate (completed → email submitted): ≥70%
- Booked call rate (email submitted → call booked): ≥15%
- Time to complete: ≤3 minutes median

## Out of scope (v1)
- A/B testing different question copy
- Saving partial progress
- Re-taking the scorecard for the same email
- White-labeled embeds for partners

## Tech stack
Reference this PROJECT_GUIDE.md.

## Brand and tone
Reference your existing Brand Voice MD. The scorecard is operator-to-operator;
no marketing fluff, no exclamation points, no urgency manipulation.
```

That's the PRD. You can write it in 30 minutes. Don't pad it.

### 3.2 CONTEXT.md (the file Claude Code reads first)

This is the working memory of the project. Claude Code looks for it on repository open. Keep it tight, current, and decision-focused.

**Structure:**

```
# Bain Squared Scorecard — Working Context

## What this is
[Two sentences max]

## Stack
[Bullet list, mirrors PROJECT_GUIDE.md section 2]

## Code conventions
- TypeScript strict mode on
- No `any`, no `// @ts-ignore`. If types fight, fix the types.
- Tailwind only. No inline styles, no CSS modules, no styled-components.
- All colors and spacing reference `tailwind.config.ts` tokens. No raw hex.
- All copy lives in `src/content/`, not inline in components.
- Pure functions for scoring and routing, in `src/lib/scoring.ts`.

## File structure
src/
  app/
    page.tsx                 (landing page)
    scorecard/
      page.tsx               (assessment shell)
      result/page.tsx        (result page)
    api/
      submit/route.ts        (lead capture endpoint)
  components/
    ui/                      (Button, Card, Badge, Progress)
    scorecard/               (Question, OptionGroup, ScoreCard)
  content/
    questions.ts             (question schema, source of truth)
    outcomes.ts              (result diagnoses)
    copy.ts                  (landing + result copy)
  lib/
    scoring.ts               (pure scoring functions)
    routing.ts               (track determination logic)
    tags.ts                  (backend tag derivation)
    db.ts                    (Postgres client)
  styles/
    globals.css

## Brand voice rules
- No em dashes as punctuation. Use commas, full stops, or rephrase.
- No corporate phrases ("leverage", "synergy", "unlock value").
- Answer-first structure on every screen. Lead with the takeaway.
- The [bracket] motif is signature. Use it for the user's track name,
  their score, and the result label. Do not use it for marketing copy.

## Don't do this
- Don't add libraries without checking with me first.
- Don't ship loading skeletons that aren't real loading states.
- Don't gate the assessment behind email. Gate the result.
- Don't auto-redirect after submission. The user clicks to continue.
- Don't use stock illustrations. The DESIGN_TOKENS.md rejects them.
```

That file becomes the project's North Star. Update it when decisions change.

### 3.3 Question schema (TypeScript, source of truth)

Before you build a single screen, define the question shape. This is the most leveraged 30 minutes of the entire build.

```ts
// src/content/questions.ts

export type Track = 'esop' | 'brand_ip';

export type BackendTag =
  | 'esop_hot_lead'
  | 'esop_needs_report'
  | 'esop_education_lead'
  | 'esop_stakeholder_pressure'
  | 'fundraising_valuation_lead'
  | 'brand_valuation_lead'
  | 'software_data_valuation_lead'
  | 'ownership_risk_lead'
  | 'strategic_transaction_lead';

export type Option = {
  id: string;                    // 'q1_a', 'q1_b', etc.
  label: string;                 // user-visible answer text
  score?: number;                // 0 to 3
  routesTo?: Track | 'q2';       // only on routing questions
  tags?: BackendTag[];           // applied if this option is selected
};

export type Question = {
  id: string;                    // 'q1_routing', 'esop_q3', etc.
  track: 'universal' | Track;
  order: number;                 // ordering within track
  type: 'single_select' | 'open_text';
  prompt: string;
  helper?: string;
  options?: Option[];            // omitted for open_text
  required: boolean;
};

export type Outcome = {
  track: Track;
  scoreRange: [number, number];  // inclusive
  title: string;                 // e.g. "ESOP Valuation Gap"
  description: string;           // 2 to 3 sentences
  recommendedNextStep: string;   // e.g. "Formal ESOP valuation scoping"
  ctaLabel: string;              // e.g. "Book an ESOP Valuation Readiness Call"
  ctaUrl: string;                // Calendly link or contact form
};

export type ScorecardSubmission = {
  track: Track;
  score: number;
  maxScore: number;
  outcome: Outcome;
  tags: BackendTag[];
  answers: Record<string, string | undefined>;     // questionId -> optionId
  openText: Record<string, string | undefined>;    // questionId -> text
  email: string;
  name?: string;
  company?: string;
  submittedAt: string;
};
```

Once this schema is in place, the question content is just a TypeScript array. Adding, editing, or reordering questions becomes a content task, not a code task. This is the single most important architectural decision in the project.

---

## 4. Build phases (with happy path)

Six phases. Each phase has a deliverable you can demo. Don't skip ahead.

### Phase 0: Setup (30 minutes)

- `npx create-next-app@latest` with TypeScript, Tailwind, App Router, ESLint
- Initialise git, push to GitHub, connect to Vercel for auto-deploys
- Install: `framer-motion`, `react-hook-form`, `zod`, `@radix-ui/react-radio-group`, `@radix-ui/react-progress`, `@vercel/postgres`, `resend`
- Set up `PRD.md`, `CONTEXT.md`, and copy `DESIGN_TOKENS.md` into the repo root

**Deliverable:** Clean Next.js project deploying to a Vercel preview URL on every push.

### Phase 1: Design system foundation (2 to 3 hours)

- Translate `DESIGN_TOKENS.md` into `tailwind.config.ts` (full mapping in section 5 below)
- Set up `globals.css` with CSS variables for runtime tokens, Inter and JetBrains Mono via `next/font`
- Build five primitive components: `Button`, `Card`, `Badge`, `Progress`, `Bracket` (the `[value]` wrapper)
- Build a `/styleguide` route that renders every component in every state. This becomes your visual regression check throughout the build.

**Deliverable:** A `/styleguide` page that proves every token from DESIGN_TOKENS.md is wired up correctly.

### Phase 2: Static screens (3 to 4 hours)

Build all three screens with hard-coded data. No logic, no routing, no scoring. Just structure and styling.

- **Landing page** at `/`. Hero with positioning copy, three benefit blocks, single CTA into `/scorecard`.
- **Assessment shell** at `/scorecard`. Question component with options, progress bar, "Next" button. Hard-code one question to start.
- **Result page** at `/scorecard/result`. Hard-code a sample score, outcome, and CTA. Build the score card animation here.

**Deliverable:** Three screens that look right and read right, even though clicking through them does nothing. This is your "happy path skeleton."

### Phase 3: Core logic (3 to 4 hours)

Now the brain. Pure functions in `src/lib/`. Test them in isolation before wiring to UI.

- `routing.ts`: `determineTrack(answers): Track` — looks at Q1 and (if needed) Q2 to assign track
- `scoring.ts`: `calculateScore(answers, questions): number` — sums option scores within the assigned track
- `tags.ts`: `deriveTags(answers): BackendTag[]` — applies tags based on selected options and combinations (e.g. "ESOP Hot Lead" requires both ESOP track plus timeline within 3 months)
- `outcomes.ts`: `getOutcome(track, score): Outcome` — maps score range to outcome

Write the question content (`questions.ts`) and outcomes (`outcomes.ts`) in full at this stage. This is content work disguised as engineering. It's where you stress-test whether the questions actually flow.

**Deliverable:** A test page or unit tests that take a sample answer set and return the correct track, score, tags, and outcome. No UI integration yet.

### Phase 4: Happy path wiring (2 to 3 hours)

Connect Phase 2 (static UI) to Phase 3 (logic). State management can be a simple React reducer or `useState` with a state object — no Zustand or Redux needed for this scope.

State shape:

```ts
type AssessmentState = {
  step: 'idle' | 'in_progress' | 'completed';
  currentQuestionId: string | null;
  track: Track | null;
  answers: Record<string, string>;
  openText: Record<string, string>;
};
```

Wire up:
- Question advance: select option → store answer → derive next question → render
- Routing: after Q1 (or Q2 if "not sure"), determine track and update state
- Completion: after final track question, calculate score, derive outcome, navigate to result page (passing state via URL search params or sessionStorage)
- Result page: read state, render score card, animate count-up, render outcome and CTA

Test the full happy path end-to-end. Click from landing → start → answer through → result. Multiple times. With both tracks.

**Deliverable:** Fully working scorecard, no backend yet. You can demo this to someone.

### Phase 5: Backend (2 to 3 hours)

Lead capture. Three pieces.

- **Form on result page.** Email required, name and company optional. React Hook Form + Zod validation. Show the score and outcome immediately on completion; gate the *recommended next step CTA* behind email submission. This is the high-trust pattern: user sees their value upfront, gives email to unlock the next step.
- **API route** at `/api/submit/route.ts`. Receives the full `ScorecardSubmission`, validates with Zod, writes to Postgres, fires Resend email to user (their result) and to your sales inbox (the lead with all tags).
- **Schema in Postgres.** One table, `submissions`, with columns for every field in `ScorecardSubmission`. Use Vercel Postgres dashboard to create it manually, or write a migration. JSON columns for `answers` and `tags` are fine for v1.

Email templates: two of them, both in React Email syntax living in `src/emails/`.
- `UserResultEmail.tsx`: their score, their outcome, the CTA button.
- `SalesLeadEmail.tsx`: full submission with tags highlighted, formatted for fast triage.

**Deliverable:** Submitting on the result page writes to Postgres, sends two emails, returns a success state. Failure modes handled (network error, validation error, duplicate email).

### Phase 6: Polish (2 to 3 hours)

- **Accessibility audit.** Tab through the entire flow with keyboard only. Run axe DevTools. Fix every violation. The DESIGN_TOKENS.md has specific a11y requirements; they're all non-negotiable.
- **Mobile.** Test on a real phone or Chrome DevTools device emulation. Question screens, score reveal animation, form submission. The score number should still feel marquee on a 380px viewport.
- **Performance.** Lighthouse score on the production deploy. Target ≥95 across the board. Common wins: optimise font loading with `next/font`, lazy-load Framer Motion if you can, ensure no client components where server components would do.
- **Edge cases.** What if the user refreshes mid-assessment? (For v1: state resets, that's fine, document it in CONTEXT.md.) What if Postgres is down at submit time? (Show error, suggest emailing directly, do not lose the data — write to a fallback queue or even just log to Vercel.) What if the user submits with the same email twice? (Allow it, they may want to retake.)
- **SEO.** Meta tags on landing page, OG image, sitemap.xml, robots.txt. The landing page should index. The scorecard and result pages should not (`noindex`) since they're transient.
- **Analytics events.** Fire events on: scorecard_started, question_answered (with question ID), scorecard_completed (with track and score), email_submitted. You'll thank yourself when you want to optimise the funnel later.

**Deliverable:** Production-ready scorecard at `bainsquared.com/scorecard`. Send to three friendly users for real-world testing before announcing.

---

## 5. Design system implementation

The DESIGN_TOKENS.md file is your source of truth. Here's how to wire it into the project.

### 5.1 Tailwind config from DESIGN_TOKENS.md

Replace the default `tailwind.config.ts` with this token-driven version. Every value comes from your tokens file.

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          canvas: '#E8E8E8',
          card: '#FFFFFF',
          'card-soft': '#F5F5F4',
          inverse: '#000000',
          accent: '#0048FF',
        },
        text: {
          primary: '#000000',
          secondary: '#525252',
          tertiary: '#A3A3A3',
          inverse: '#FFFFFF',
          accent: '#0048FF',
        },
        brand: {
          primary: '#0048FF',
          'primary-pressed': '#0036C2',
          'primary-soft': '#E8EFFF',
        },
        state: {
          'success': '#16A34A',
          'success-soft': '#DCFCE7',
          'warning': '#D97706',
          'warning-soft': '#FEF3C7',
          'danger': '#B91C1C',
          'danger-soft': '#FEE2E2',
          'info': '#0048FF',
          'info-soft': '#E8EFFF',
        },
      },
      fontFamily: {
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
        sans: ['var(--font-inter)', 'Helvetica Neue', 'Arial', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // [size, lineHeight] tuples from your token table
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
        '5xl': ['48px', '52px'],
        '6xl': ['60px', '64px'],
        display: ['80px', '84px'],
        score: ['96px', '96px'],
      },
      spacing: {
        // override default spacing with your 4px-based scale
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
        '40': '160px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        md: '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)',
        lg: '0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
      },
      transitionDuration: {
        instant: '0ms',
        fast: '120ms',
        base: '180ms',
        slow: '280ms',
        deliberate: '480ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
```

After this, every component uses semantic Tailwind classes: `bg-surface-card`, `text-text-primary`, `rounded-2xl`, `shadow-sm`, etc. No raw hex anywhere in component files.

### 5.2 Typography setup

In `src/app/layout.tsx`:

```tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-surface-canvas text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
```

The fonts load via Next.js's font system, are self-hosted automatically, and are eligible for preloading. No CDN calls at runtime.

### 5.3 Component primitives to build first

Five components carry the entire UI. Build them in this order.

1. **Bracket** — wraps any value in `[ ]` using mono font. The signature motif. Used everywhere.
   ```tsx
   <Bracket color="brand">{score}</Bracket>
   // renders: [74] in JetBrains Mono, brand color
   ```

2. **Button** — three variants (primary, secondary, ghost), all states (default, hover, focus-visible, active, disabled, loading). Pill radius for primary, rounded-md for secondary.

3. **Card** — surface-card background, rounded-xl, shadow-sm, padding-8 internally. Hover state lifts to shadow-md.

4. **Progress** — thin bar showing assessment progress. Uses brand-primary on a brand-primary-soft track. Animates with deliberate easing.

5. **ScoreCard** — the marquee component. Two-section card: top section pink/yellow/green tinted by score range, half-circle gauge, big mono score number wrapped in brackets, status chip. Bottom section white with score label and one-sentence description. Animate the score from 0 to final value over the deliberate duration.

Build each one to spec, render them in `/styleguide`, screenshot them, compare to your token file. Don't move on until they look right.

---

## 6. Backend and data

### 6.1 Database schema

One table. JSONB columns for the flexible parts so you don't fight migrations every time you add a question.

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  track TEXT NOT NULL CHECK (track IN ('esop', 'brand_ip')),
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  outcome_title TEXT NOT NULL,
  outcome_range_low INTEGER NOT NULL,
  outcome_range_high INTEGER NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]',
  answers JSONB NOT NULL,
  open_text JSONB NOT NULL DEFAULT '{}',
  user_agent TEXT,
  referrer TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_submissions_email ON submissions(email);
CREATE INDEX idx_submissions_track ON submissions(track);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX idx_submissions_tags ON submissions USING GIN (tags);
```

Querying for hot leads becomes:

```sql
SELECT * FROM submissions
WHERE tags @> '["esop_hot_lead"]'
  AND submitted_at > NOW() - INTERVAL '7 days'
ORDER BY submitted_at DESC;
```

### 6.2 Submission API route

```ts
// src/app/api/submit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { Resend } from 'resend';
import { UserResultEmail } from '@/emails/UserResultEmail';
import { SalesLeadEmail } from '@/emails/SalesLeadEmail';

const resend = new Resend(process.env.RESEND_API_KEY!);

const SubmissionSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
  track: z.enum(['esop', 'brand_ip']),
  score: z.number().int().min(0),
  maxScore: z.number().int().positive(),
  outcomeTitle: z.string(),
  outcomeRangeLow: z.number().int(),
  outcomeRangeHigh: z.number().int(),
  tags: z.array(z.string()),
  answers: z.record(z.string()),
  openText: z.record(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = SubmissionSchema.parse(body);

    // Persist
    await sql`
      INSERT INTO submissions (
        email, name, company, track, score, max_score,
        outcome_title, outcome_range_low, outcome_range_high,
        tags, answers, open_text, user_agent, referrer
      ) VALUES (
        ${data.email}, ${data.name ?? null}, ${data.company ?? null},
        ${data.track}, ${data.score}, ${data.maxScore},
        ${data.outcomeTitle}, ${data.outcomeRangeLow}, ${data.outcomeRangeHigh},
        ${JSON.stringify(data.tags)}, ${JSON.stringify(data.answers)},
        ${JSON.stringify(data.openText ?? {})},
        ${req.headers.get('user-agent') ?? null},
        ${req.headers.get('referer') ?? null}
      )
    `;

    // Email user
    await resend.emails.send({
      from: 'Bain Squared <scorecard@bainsquared.com>',
      to: data.email,
      subject: `Your ${data.track === 'esop' ? 'ESOP' : 'Intangible Asset'} Valuation Readiness Score`,
      react: UserResultEmail({ data }),
    });

    // Email sales
    await resend.emails.send({
      from: 'Bain Squared Scorecard <scorecard@bainsquared.com>',
      to: 'sales@bainsquared.com',
      subject: `[${data.tags.includes('esop_hot_lead') || data.tags.includes('strategic_transaction_lead') ? 'HOT' : 'NEW'}] Lead: ${data.email}`,
      react: SalesLeadEmail({ data }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submission error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### 6.3 Lead routing logic

You already defined nine backend tags in your context. Build them into `src/lib/tags.ts` as a single function:

```ts
export function deriveTags(state: AssessmentState): BackendTag[] {
  const tags: BackendTag[] = [];
  const { track, answers } = state;

  if (track === 'esop') {
    // ESOP Hot Lead: timeline within 3 months
    if (answers['esop_q8'] === 'esop_q8_a' || answers['esop_q8'] === 'esop_q8_b') {
      tags.push('esop_hot_lead');
    }
    // ESOP Needs Report: no formal valuation
    if (['esop_q4_b', 'esop_q4_c', 'esop_q4_d'].includes(answers['esop_q4'])) {
      tags.push('esop_needs_report');
    }
    // ... continue for each tag rule
  }

  if (track === 'brand_ip') {
    // Fundraising Valuation Lead: raising or due diligence
    if (['bip_q7_a', 'bip_q7_b'].includes(answers['bip_q7'])) {
      tags.push('fundraising_valuation_lead');
    }
    // ... continue
  }

  return tags;
}
```

Keep this logic pure (no side effects, no async). Test it. The tags are sales gold; bugs here cost you money.

---

## 7. Deployment

### 7.1 Vercel setup

- Connect the GitHub repo from the Vercel dashboard
- Every push to `main` deploys to production
- Every push to a feature branch gets a preview URL
- Set environment variables in Vercel project settings:
  - `RESEND_API_KEY`
  - `POSTGRES_URL` (auto-injected by Vercel Postgres)
  - `SALES_INBOX` (optional, default to `sales@bainsquared.com`)

### 7.2 Domain

Two options. Subdomain is the cleaner long-term play.

- **Subdomain (recommended):** `assessment.bainsquared.com`. Add CNAME in your DNS pointing to Vercel. Vercel auto-issues the SSL cert.
- **Path:** `bainsquared.com/scorecard`. Requires a rewrite rule on whatever hosts the main bainsquared.com site, or moving the main site to Vercel too.

### 7.3 Pre-launch checklist

- [ ] Lighthouse ≥95 on landing and result pages
- [ ] Real-device testing on iPhone and a mid-range Android
- [ ] Three friendly users complete the full flow without friction
- [ ] Sales inbox receives a properly formatted email with all tags visible
- [ ] User receives a result email that renders correctly in Gmail, Outlook, Apple Mail
- [ ] Database query for "show me all leads from the last 7 days" works
- [ ] Open Graph image and meta tags render correctly in LinkedIn and Twitter previews
- [ ] Robots.txt allows the landing page, disallows `/scorecard` and `/scorecard/result`
- [ ] Privacy policy page linked from the form (Privilege Press already has the framework; reuse the structure)
- [ ] Email "from" address is verified in Resend, SPF and DKIM configured

---

## 8. What to do first (this week)

If you want a clear sequence to start tomorrow, here it is.

**Day 1 (90 minutes):**
1. Write `PRD.md` (30 min)
2. Write `CONTEXT.md` (30 min)
3. Draft the question schema and full question content in a Google Doc, with scoring annotated next to each option (30 min)

**Day 2 (3 to 4 hours):**
4. Run Phase 0 setup (project scaffold, deploy to Vercel)
5. Run Phase 1 design system foundation
6. Build the `/styleguide` route

**Day 3 (4 to 5 hours):**
7. Run Phase 2 (static screens with hard-coded data)
8. Run Phase 3 (core logic, with tests)

**Day 4 (4 to 5 hours):**
9. Run Phase 4 (happy path wiring)
10. Run Phase 5 (backend, email, lead capture)

**Day 5 (2 to 3 hours):**
11. Run Phase 6 (polish, a11y, performance)
12. Send to three friendly users for testing
13. Address feedback, ship

You can compress this into a long weekend if the question copy is locked before you start coding. The reason most projects like this drag on is that founders try to write the question copy *while* coding, which means every revision triggers a code change. Lock the copy first.

---

## 9. Risks and traps to avoid

**The question copy isn't locked.** This is the single biggest project killer. Treat questions as immutable content during the build. If you're still wordsmithing during Phase 4, stop and finish the copy first.

**Scope creep on the result page.** "What if we also showed... " is the enemy. The result page does four things: shows the score, names the diagnosis, tells them the recommended next step, and offers the CTA. That's it.

**Premature optimisation of the scoring weights.** Your initial score weights are a hypothesis. Don't tune them in your head. Ship, watch real users, then adjust based on the conversion data. Tags are easier to tune than scores; use tags for sales triage, scores for user-facing diagnosis.

**Treating the email gate as the conversion event.** It's not. The conversion event is the booked call. Email capture is a leading indicator. Set up Calendly tracking (or whatever booking tool) to close the loop.

**Building admin dashboards.** Resist. SQL queries against Postgres are your dashboard for v1. If you want a UI, hook up Retool or use Postico locally. Don't build internal tools.

**Mobile as an afterthought.** Half your traffic will be mobile. Design for 380px first. The score reveal must feel as good on a phone as on desktop. The DESIGN_TOKENS.md hero sizes account for this; use them.

**Forgetting the open-text question matters most.** Q10 in both tracks ("anything else you want to share") is where the highest-intent leads explain themselves in their own words. Make sure that field is generous (multi-line, no character cap), and make sure it gets piped to the sales email prominently.

---

## 10. Handoff to Claude Code

When you're ready to start building, your prompt to Claude Code is roughly:

> Read PROJECT_GUIDE.md, DESIGN_TOKENS.md, CONTEXT.md, and PRD.md. We're starting with Phase 0 setup. Scaffold a Next.js 14 project with TypeScript, Tailwind, App Router, and ESLint. Install the dependencies listed in section 2. Set up the file structure from CONTEXT.md. Deploy to Vercel. Then we'll move to Phase 1.

From there, work phase by phase. End each phase by reviewing the deliverable against this guide before moving on. Update CONTEXT.md when decisions change.

The project should be live in production within a week. If it's taking longer, the bottleneck is question copy, not code.
