# ESOP Decision Tree — Master Logic & Gap Analysis

## Overview

The assessment is designed as a **continuous diagnostic flow** that provides genuine value to the user. The Hot/Warm/Cold lead classification is a byproduct of the flow, not its sole purpose. Every user completes the full question set for their branch so the experience feels thorough and credible.

---

## Entry Point

**Q1. What do you want to achieve?**
If the user selects "Retain talent" or "Need ESOP support", they enter the ESOP Track.

**Q2. Do you currently have an ESOP or employee share option plan?**

| Option | Next Step |
|---|---|
| A. Yes, we already have one | Branch A |
| B. No, but we are planning to set one up | Branch B |
| C. No, we do not have one yet | Branch C |
| D. Not sure | Treat as Branch C |

---

## Universal Context Questions (CRM Data — Non-Routing)

Asked to **everyone** immediately after Q2. These do not affect Hot/Warm/Cold routing. They provide valuable CRM context for the sales call and make the assessment feel like a proper diagnostic.

**Q_Context_1. What stage is your company currently at?**
- Bootstrapped / Seed
- Series A or B
- Growth / Scale-up
- Mature / Profitable SME

**Q_Context_2. Roughly how many employees do you have?**
- 1 to 10
- 11 to 50
- 51 to 200
- More than 200

After answering, users proceed to their respective branch.

---

## Branch A: Already Has ESOP

**Q3A. Have you completed a formal ESOP valuation before?**

| Option | Next Step | Lead |
|---|---|---|
| A. Yes | Go to Q4A | — |
| B. No | End of flow | **HOT** |
| C. Not sure | End of flow | **HOT** |

> **Why HOT immediately for B/C:** Having an active ESOP without a formal independent valuation is an existing compliance, governance, and audit risk. The user needs to act regardless of timing or whether anyone is asking. This is the one branch where we cut the flow short because the urgency is structural, not situational.

**Q4A. Are you satisfied with your current valuation or provider?**

| Option | Next Step |
|---|---|
| A. Yes, satisfied | Go to Q5A |
| B. No, not satisfied | Go to Q5B |
| C. Not sure | Go to Q5B (treat as dissatisfied) |

**Q5A. Would price be a deciding factor in switching provider?**
- Yes, price matters
- No, price is not the main factor
- Maybe, if quality and credibility are strong

All options go to Q6A.

**Q5B. What are you dissatisfied with?**

| Option | Note |
|---|---|
| A. Price is too high | Direct cost concern |
| B. Report quality is weak | The valuation methodology or output is not credible |
| C. Hard to explain to employees, board, or investors | The report is technically correct but not usable for communication |
| D. Process is slow or painful | Often because the provider does not liaise with auditors directly — they hand over the report and leave the company to manage the relationship alone |
| E. Provider does not understand startups or ESOPs | Many cap table management software providers are not valuation advisors. They manage the HR system and cap table but do not advise on methodology, auditor communication, or employee education |
| F. Other | — |

All options go to Q6A.

**Q6A. When is your next ESOP grant, refresh, or review?**
- Within 1 month
- Within 1 to 3 months
- More than 3 months
- Not sure

**Branch A Outcome Logic:**

| Satisfaction | Lead | Reasoning |
|---|---|---|
| Satisfied (Q4A = Yes) | **WARM** | No urgent pain. They are happy. Report is still valuable for comparison and future planning. |
| Dissatisfied (Q4A = No or Not sure) | **HOT** | Strong dissatisfaction regardless of timing. Even if the next grant is 6 months away, they have a provider problem that needs solving now. |

The timing question (Q6A) is asked to everyone in Branch A who reaches it. It does not change the Hot/Warm classification, but it provides valuable context for the sales call and personalizes the report.

---

## Branch B: Planning ESOP & Branch C: No ESOP

Both branches follow the **exact same diagnostic flow** to ensure continuity. The only difference is the context set in Q2.

**Q3_BC. Is anyone currently asking about equity, options, or ESOP?**

*Examples to display as helper text: existing investors asking about your cap table, auditors requesting a formal valuation, employees or candidates asking to be part of the company's equity plan.*

| Option | Next Step |
|---|---|
| A. Yes, actively | Go to Q4_BC |
| B. No, not yet | Go to Q4_BC |
| C. Not directly, but we expect it to come up soon | Go to Q4_BC |

**Q4_BC. What is your main concern about setting up or using ESOPs?**

This question is asked to **everyone** in B/C to ensure continuity and to determine which of the 4 standardized PDF reports to send.

| Option | Report Mapped |
|---|---|
| A. How much equity to allocate | ESOP Structuring & Dilution Guide |
| B. How to value the company or options | ESOP Structuring & Dilution Guide |
| C. Dilution | ESOP Structuring & Dilution Guide |
| D. Legal, tax, or compliance requirements | ESOP Communication & Legal Guide |
| E. Explaining ESOP to employees | ESOP Communication & Legal Guide |
| F. Not sure where to start | ESOP Starter Guide |

All options go to Q5_BC.

**Q5_BC. When do you expect to make a decision, respond, or issue options?**
- Within 1 month
- Within 1 to 3 months
- More than 3 months
- Not sure

**Branch B/C Outcome Logic:**

| Q3 (Anyone asking?) | Q5 (Timing) | Lead |
|---|---|---|
| Yes / May come up soon | Within 1–3 months | **HOT** |
| Yes / May come up soon | More than 3 months / Not sure | **WARM** |
| No | Within 1–3 months | **WARM** |
| No | More than 3 months / Not sure | **COLD** |

---

## CTA Mapping by Lead Temperature

| Lead | Primary CTA | Secondary CTA | Report? |
|---|---|---|---|
| HOT | Schedule a call immediately | — | Not shown upfront |
| WARM | Get your ESOP report | Book a call | Yes |
| COLD | Get your ESOP report | — | Yes |

---

## Standardized PDF Report Strategy

Instead of dynamic parsing code generating 50+ variations, the assessment maps each user to one of **4 core static PDF reports**. The deliverable key is passed to Zapier / Google Script, which pulls the matching PDF from Google Drive and emails it.

| Report | Who Gets It | Trigger |
|---|---|---|
| **ESOP Compliance & Governance Guide** | Branch A (Already has ESOP) | Anyone in Branch A |
| **ESOP Structuring & Dilution Guide** | Branch B/C — concern is allocation, valuation, or dilution | Q4_BC = A, B, or C |
| **ESOP Communication & Legal Guide** | Branch B/C — concern is legal/tax or explaining to employees | Q4_BC = D or E |
| **ESOP Starter Guide** | Branch B/C — not sure where to start, or Cold leads | Q4_BC = F (default for Cold) |

---

## Gap Analysis vs Current Codebase

The current production code uses a **linear question flow** with point-based scoring to classify results. The new design requires a **branching state machine** where the next question depends on previous answers. The key files that need to be updated are:

| File | Current State | Required Change |
|---|---|---|
| `src/content/questions.ts` | Linear ordered questions with scores | Replace with new tree nodes; remove scoring; add branch metadata |
| `src/lib/routing.ts` | Iterates questions in order | Rewrite as a branching router using answer-based `nextQuestion` logic |
| `src/lib/scoring.ts` | Point accumulation + hard trigger rules | Replace with explicit `calculateEsopResult()` using the new tree logic |
| `src/content/outcomes.ts` | 4 coarse ESOP result buckets | Replace with Hot/Warm/Cold outcomes + sub-variant copy |
| `src/app/scorecard/result/page.tsx` | Single card layout for all results | Add conditional rendering: HOT = call only, WARM = report + call, COLD = report only |
