# ESOP Decision Tree — Revised Master Mapping v3

## Purpose

This file defines the revised ESOP assessment logic for Bain Squared's Intangible Asset / ESOP diagnostic flow.

The goal is to classify every respondent into the correct commercial outcome while preserving a credible assessment experience.

The system must produce a structured result object for every completed ESOP-path respondent. The core decision fields are:

1. `track`
2. `result_code`
3. `lead_temperature`
4. `lead_temperature_ui`
5. `lead_score`
6. `report_key`
7. `cta_mode`
8. `delivery_policy`
9. `result_page_booking_policy`
10. `report_booking_prompt_policy`
11. `calendar_redirect_policy`
12. `crm_tags`
13. `answers`

The core design principle is:

```text
Question routing is handled by a branching state machine.
Lead classification is handled by deterministic business rules.
Report assignment is handled by concern/track mapping.
Result-page CTA assignment is handled by lead temperature.
Report delivery is immediate for all lead temperatures.
Booking prompts are controlled separately for the results page and the PDF/report itself.
Internal prioritization is handled by scoring.
```

Do not collapse these into one result bucket.

---

## v3 Outcome Flow Update

This version implements the revised final outcome flow:

```text
All leads receive or are prompted to download their assigned report/results immediately.
HOT leads see: report sent/download confirmation + strong booking prompt + manual booking link only.
WARM and WARM_LOW leads see: report sent/download confirmation only on the results page. Any booking prompt belongs inside the report/PDF or later nurture email.
COLD leads see: report/results sent or download confirmation only. No booking prompt appears on the results page or inside the report.
No user should be automatically redirected to Cal.com or any booking page.
```

---

# 1. Core Architecture

## 1.1 What the user experiences

The user experiences a short guided diagnostic.

They should feel like they are answering a natural sequence of questions, not being pushed through a sales qualification form.

The front-end experience can still look mostly linear, but the logic underneath must be branching.

## 1.2 What the system actually does

The system should evaluate the user's answers in this order:

```text
1. Identify the ESOP track.
2. Route to the correct branch.
3. Apply hard-trigger rules.
4. Assign lead temperature.
5. Assign report key.
6. Assign result-page CTA mode.
7. Assign delivery policy.
8. Assign result-page booking policy.
9. Assign report booking prompt policy.
10. Calculate internal lead score.
11. Send structured payload to CRM / Zapier / Google Script.
```

## 1.3 Why this must not be pure point scoring

Point scoring should not be used as the primary classifier because certain answers create hard business outcomes.

Example:

```text
Already has ESOP + no formal valuation = HOT
```

This should remain HOT even if:

```text
Timing = More than 3 months
Employee count = 1 to 10
Company stage = Bootstrapped / Seed
```

The lead may be a lower-priority HOT lead, but it is still HOT.

Therefore:

```text
Lead temperature = deterministic rule
Lead score = internal priority ranking
```

---

# 2. Required Final Output Schema

Every completed ESOP diagnostic should return this object:

```ts
{
  track: "existing_esop" | "planning_esop" | "no_esop" | "unsure_esop",
  result_code: string,
  lead_temperature: "hot" | "warm" | "warm_low" | "cold",
  lead_temperature_ui: "hot" | "warm" | "cold",
  lead_score: number,
  report_key:
    | "esop_compliance_governance"
    | "esop_structuring_dilution"
    | "esop_communication_legal"
    | "esop_starter",
  cta_mode:
    | "report_sent_plus_hot_call_link"
    | "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy:
    | "show_hot_booking_link_no_redirect"
    | "hide_booking_link",
  report_booking_prompt_policy:
    | "include_booking_prompt_in_report"
    | "no_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only",
  crm_tags: string[],
  answers: Record<string, string>
}
```

Important:

```text
Every lead gets the assigned report/results sent or made available immediately.
No lead should be blocked from receiving the report until they book a call.
Only HOT leads see a booking prompt on the results page.
The booking prompt must be a clickable link only, not an automatic redirect to Cal.com.
Warm leads do not see a booking prompt on the results page; the report itself may prompt them to book.
Cold leads do not see a booking prompt on the results page or inside the report.
```

## 2.1 Important note on `warm_low`

`warm_low` is an internal classification only.

For the user interface, `warm_low` should display as `warm`.

Reason:

```text
Planning ESOP + no one asking + far or uncertain timing
```

is not as urgent as a true warm lead, but it is also not as cold as:

```text
No ESOP + no one asking + far or uncertain timing
```

Therefore:

```text
lead_temperature = "warm_low"
lead_temperature_ui = "warm"
```

---

# 3. Canonical Answer Values

Use canonical values in code. Do not rely on display copy.

## Q1 — Objective

Question:

```text
What do you want to achieve?
```

Relevant ESOP-triggering options:

| Display Option | Canonical Value | Next Step |
|---|---:|---|
| Retain talent with equity or incentives | `retain_talent` | Enter ESOP Track |
| Need ESOP / employee option support | `need_esop_support` | Enter ESOP Track |
| Understand ESOP compliance or valuation requirements | `esop_compliance` | Enter ESOP Track |

If the current product has other IA / fundraising / brand valuation tracks, those should be routed separately. This file only defines the ESOP track.

---

## Q2 — ESOP Status

Question:

```text
Do you currently have an ESOP or employee share option plan?
```

| Display Option | Canonical Value | Track | Next Step |
|---|---:|---|---|
| Yes, we already have one | `yes_existing` | `existing_esop` | `Q3A_FORMAL_VALUATION` |
| No, but we are planning to set one up | `planning` | `planning_esop` | `Q3BC_ANYONE_ASKING` |
| No, we do not have one yet | `no` | `no_esop` | `Q3BC_ANYONE_ASKING` |
| Not sure | `not_sure` | `unsure_esop` | `Q3BC_ANYONE_ASKING` |

Important:

```text
Q2 = not_sure should not be thrown away or treated invisibly as no.
```

It should route through the same questions as Branch C, but the output track should remain `unsure_esop` so the CRM captures uncertainty as a useful sales signal.

---

# 4. Universal Context Questions

These questions are asked to everyone after Q2.

They do not determine lead temperature directly.

They are used for:

1. CRM enrichment
2. sales-call context
3. internal lead scoring
4. report personalization if needed later

## Q_CONTEXT_STAGE

Question:

```text
What stage is your company currently at?
```

| Display Option | Canonical Value | Score Modifier |
|---|---:|---:|
| Bootstrapped / Seed | `bootstrapped_seed` | +5 |
| Series A or B | `series_a_b` | +10 |
| Growth / Scale-up | `growth_scaleup` | +15 |
| Mature / Profitable SME | `mature_profitable_sme` | +10 |

## Q_CONTEXT_EMPLOYEES

Question:

```text
Roughly how many employees do you have?
```

| Display Option | Canonical Value | Score Modifier |
|---|---:|---:|
| 1 to 10 | `1_10` | +2 |
| 11 to 50 | `11_50` | +8 |
| 51 to 200 | `51_200` | +15 |
| More than 200 | `more_than_200` | +20 |

---

# 5. Branch A — Existing ESOP

Branch A applies when:

```text
Q2_ESOP_STATUS = yes_existing
```

This is the highest-intent branch because the company already has an ESOP.

All Branch A users should receive or be assigned:

```text
report_key = esop_compliance_governance
```

The report is sent immediately for every Branch A user. The only question is whether the results page also shows the HOT-only booking prompt.

---

## 5.1 Q3A_FORMAL_VALUATION

Question:

```text
Have you completed a formal ESOP valuation before?
```

| Display Option | Canonical Value | Classification Effect | Next Step |
|---|---:|---|---|
| Yes | `yes` | Continue assessment | `Q4A_PROVIDER_SATISFACTION` |
| No | `no` | Hard HOT trigger | `Q6A_NEXT_GRANT_REVIEW` |
| Not sure | `not_sure` | Hard HOT trigger | `Q6A_NEXT_GRANT_REVIEW` |

Important:

`no` and `not_sure` should immediately lock:

```text
lead_temperature = hot
result_code = ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT
report_key = esop_compliance_governance
cta_mode = report_sent_plus_hot_call_link
```

However, do not necessarily end the flow instantly.

The system should still ask `Q6A_NEXT_GRANT_REVIEW` before showing the result so sales has timing context.

The timing answer may increase or decrease internal score, but it must not override HOT.

---

## 5.2 Q4A_PROVIDER_SATISFACTION

Question:

```text
Are you satisfied with your current ESOP valuation or provider?
```

| Display Option | Canonical Value | Classification Effect | Next Step |
|---|---:|---|---|
| Yes, satisfied | `satisfied` | Likely WARM | `Q5A_PRICE_SENSITIVITY` |
| No, not satisfied | `not_satisfied` | HOT trigger | `Q5B_DISSATISFACTION_REASON` |
| Not sure | `not_sure` | Treat as dissatisfaction | `Q5B_DISSATISFACTION_REASON` |

Important:

```text
Q4A = not_sure should be treated as not_satisfied.
```

Reason:

If the user cannot confidently say their valuation or provider is satisfactory, there is enough uncertainty to create a provider-review opportunity.

---

## 5.3 Q5A_PRICE_SENSITIVITY

Asked only if:

```text
Q3A_FORMAL_VALUATION = yes
Q4A_PROVIDER_SATISFACTION = satisfied
```

Question:

```text
Would price be a deciding factor in switching provider?
```

| Display Option | Canonical Value | Classification Effect | Next Step |
|---|---:|---|---|
| Yes, price matters | `price_matters` | Add score modifier only | `Q6A_NEXT_GRANT_REVIEW` |
| No, price is not the main factor | `price_not_main_factor` | Add score modifier only | `Q6A_NEXT_GRANT_REVIEW` |
| Maybe, if quality and credibility are strong | `maybe_if_quality_strong` | Add score modifier only | `Q6A_NEXT_GRANT_REVIEW` |

This question must not turn a satisfied provider lead into HOT by itself.

It only affects sales messaging and score.

---

## 5.4 Q5B_DISSATISFACTION_REASON

Asked only if:

```text
Q3A_FORMAL_VALUATION = yes
Q4A_PROVIDER_SATISFACTION = not_satisfied OR not_sure
```

Question:

```text
What are you dissatisfied with?
```

| Display Option | Canonical Value | Classification Effect | Score Modifier | Next Step |
|---|---:|---|---:|---|
| Price is too high | `price_too_high` | HOT | +5 | `Q6A_NEXT_GRANT_REVIEW` |
| Report quality is weak | `weak_report_quality` | HOT | +10 | `Q6A_NEXT_GRANT_REVIEW` |
| Hard to explain to employees, board, or investors | `hard_to_explain` | HOT | +10 | `Q6A_NEXT_GRANT_REVIEW` |
| Process is slow or painful | `slow_or_painful_process` | HOT | +8 | `Q6A_NEXT_GRANT_REVIEW` |
| Provider does not understand startups or ESOPs | `provider_not_esop_specialist` | HOT | +10 | `Q6A_NEXT_GRANT_REVIEW` |
| Other | `other` | HOT | +5 | `Q6A_NEXT_GRANT_REVIEW` |

Any dissatisfaction reason keeps the result HOT.

Timing cannot reduce this to WARM.

---

## 5.5 Q6A_NEXT_GRANT_REVIEW

Question:

```text
When is your next ESOP grant, refresh, valuation review, audit request, or board discussion?
```

| Display Option | Canonical Value | Score Modifier |
|---|---:|---:|
| Within 1 month | `within_1_month` | +15 |
| Within 1 to 3 months | `within_1_to_3_months` | +10 |
| More than 3 months | `more_than_3_months` | +3 |
| Not sure | `not_sure` | +0 |

This question should affect:

```text
lead_score
crm_tags
sales urgency copy
```

It should not change:

```text
lead_temperature
report_key
cta_mode
```

---

# 6. Branch A Outcome Rules

## A1 — Missing or uncertain formal valuation

Condition:

```text
track = existing_esop
Q3A_FORMAL_VALUATION IN [no, not_sure]
```

Output:

```ts
{
  result_code: "ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT",
  track: "existing_esop",
  lead_temperature: "hot",
  lead_temperature_ui: "hot",
  report_key: "esop_compliance_governance",
  cta_mode: "report_sent_plus_hot_call_link",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "show_hot_booking_link_no_redirect",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

The company already has an ESOP but has not confirmed a formal valuation. This is a governance, audit, compliance, and board-readiness issue.

## A2 — Formal valuation done, provider dissatisfied or uncertain

Condition:

```text
track = existing_esop
Q3A_FORMAL_VALUATION = yes
Q4A_PROVIDER_SATISFACTION IN [not_satisfied, not_sure]
```

Output:

```ts
{
  result_code: "ESOP_A2_PROVIDER_REVIEW_HOT",
  track: "existing_esop",
  lead_temperature: "hot",
  lead_temperature_ui: "hot",
  report_key: "esop_compliance_governance",
  cta_mode: "report_sent_plus_hot_call_link",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "show_hot_booking_link_no_redirect",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

The company already has an active provider or valuation process, but there is dissatisfaction or uncertainty. This is a replacement or review opportunity.

## A3 — Formal valuation done, satisfied provider

Condition:

```text
track = existing_esop
Q3A_FORMAL_VALUATION = yes
Q4A_PROVIDER_SATISFACTION = satisfied
```

Output:

```ts
{
  result_code: "ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM",
  track: "existing_esop",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: "esop_compliance_governance",
  cta_mode: "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "hide_booking_link",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

The company has an existing ESOP and has completed valuation before, but there is no urgent pain. The lead is still valuable because they already use ESOPs.

---

# 7. Branch A Exhaustive Coverage

Branch A has 68 possible answer-path combinations under this design.

## 7.1 Combination count

| Branch A Path | Combination Count | Lead |
|---|---:|---|
| Q3A = no/not_sure, then Q6A timing | 2 x 4 = 8 | HOT |
| Q3A = yes, Q4A = satisfied, Q5A price answer, Q6A timing | 1 x 1 x 3 x 4 = 12 | WARM |
| Q3A = yes, Q4A = not_satisfied/not_sure, Q5B reason, Q6A timing | 1 x 2 x 6 x 4 = 48 | HOT |
| Total | 68 | Fully covered |

## 7.2 Aggregated Branch A mapping

| Formal Valuation | Provider Satisfaction | Price Sensitivity | Dissatisfaction Reason | Timing | Lead | Report | CTA | Delivery |
|---|---|---|---|---|---|---|---|---|
| No | N/A | N/A | N/A | Any | HOT | Compliance & Governance | Report sent + HOT booking link | Send report immediately |
| Not sure | N/A | N/A | N/A | Any | HOT | Compliance & Governance | Report sent + HOT booking link | Send report immediately |
| Yes | Satisfied | Any | N/A | Any | WARM | Compliance & Governance | Download report only | Send report immediately |
| Yes | Not satisfied | N/A | Any | Any | HOT | Compliance & Governance | Report sent + HOT booking link | Send report immediately |
| Yes | Not sure | N/A | Any | Any | HOT | Compliance & Governance | Report sent + HOT booking link | Send report immediately |

---

# 8. Branch B — Planning ESOP

Branch B applies when:

```text
Q2_ESOP_STATUS = planning
```

This branch is commercially stronger than Branch C because the respondent already has intent.

Branch B and Branch C may use the same questions, but they should not always use the same classification rules.

Planning an ESOP is a stronger buying signal than simply not having one.

---

## 8.1 Q3BC_ANYONE_ASKING

Question:

```text
Is anyone currently asking about equity, options, or ESOP?
```

Helper text:

```text
This could include investors asking about your cap table, auditors requesting support, board members asking about incentive plans, employees asking about equity, or candidates asking whether they can participate in an option plan.
```

| Display Option | Canonical Value | Pressure Group | Next Step |
|---|---:|---|---|
| Yes, actively | `yes_actively` | `active_pressure` | `Q4BC_MAIN_CONCERN` |
| Not directly, but we expect it to come up soon | `expected_soon` | `expected_pressure` | `Q4BC_MAIN_CONCERN` |
| No, not yet | `no_not_yet` | `no_pressure` | `Q4BC_MAIN_CONCERN` |
| Not sure | `not_sure` | `uncertain_pressure` | `Q4BC_MAIN_CONCERN` |

Important:

Add `Not sure` as an explicit option. Do not force uncertain users into `No` because uncertainty itself is useful CRM data.

---

## 8.2 Q4BC_MAIN_CONCERN

Question:

```text
What is your main concern about setting up or using ESOPs?
```

| Display Option | Canonical Value | Report Key |
|---|---:|---|
| How much equity to allocate | `allocation` | `esop_structuring_dilution` |
| How to value the company or options | `valuation` | `esop_structuring_dilution` |
| Dilution | `dilution` | `esop_structuring_dilution` |
| Legal, tax, or compliance requirements | `legal_tax_compliance` | `esop_communication_legal` |
| Explaining ESOP to employees | `employee_communication` | `esop_communication_legal` |
| Not sure where to start | `not_sure_where_to_start` | `esop_starter` |

Important:

Report assignment should be based on the user's stated concern, not primarily on lead temperature.

Therefore, a COLD lead who selects `dilution` should still receive:

```text
esop_structuring_dilution
```

not automatically:

```text
esop_starter
```

The Starter Guide is the default only when the user's main concern is vague or early-stage.

---

## 8.3 Q5BC_TIMING

Question:

```text
When do you expect to make a decision, respond, or issue options?
```

| Display Option | Canonical Value | Timing Group | Score Modifier |
|---|---:|---|---:|
| Within 1 month | `within_1_month` | `near_term` | +15 |
| Within 1 to 3 months | `within_1_to_3_months` | `near_term` | +10 |
| More than 3 months | `more_than_3_months` | `far_or_uncertain` | +3 |
| Not sure | `not_sure` | `far_or_uncertain` | +0 |

---

# 9. Branch B Outcome Rules

## B1 — Planning ESOP, pressure exists, near-term timing

Condition:

```text
track = planning_esop
Q3BC_ANYONE_ASKING IN [yes_actively, expected_soon]
Q5BC_TIMING IN [within_1_month, within_1_to_3_months]
```

Output:

```ts
{
  result_code: "ESOP_B1_PLANNING_PRESSURE_NEAR_HOT",
  track: "planning_esop",
  lead_temperature: "hot",
  lead_temperature_ui: "hot",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "report_sent_plus_hot_call_link",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "show_hot_booking_link_no_redirect",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

The company is planning ESOP, someone is asking or expected to ask, and timing is near-term. This is a live commercial need.

## B2 — Planning ESOP, pressure exists, far or uncertain timing

Condition:

```text
track = planning_esop
Q3BC_ANYONE_ASKING IN [yes_actively, expected_soon]
Q5BC_TIMING IN [more_than_3_months, not_sure]
```

Output:

```ts
{
  result_code: "ESOP_B2_PLANNING_PRESSURE_FAR_WARM",
  track: "planning_esop",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "hide_booking_link",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

There is a real pressure point, but timing is not urgent enough to show a booking prompt on the results page.

## B3 — Planning ESOP, no clear pressure, near-term timing

Condition:

```text
track = planning_esop
Q3BC_ANYONE_ASKING IN [no_not_yet, not_sure]
Q5BC_TIMING IN [within_1_month, within_1_to_3_months]
```

Output:

```ts
{
  result_code: "ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM",
  track: "planning_esop",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "hide_booking_link",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

There is no external pressure yet, but the company is planning to act soon. This is a good nurture/conversion lead.

## B4 — Planning ESOP, no clear pressure, far or uncertain timing

Condition:

```text
track = planning_esop
Q3BC_ANYONE_ASKING IN [no_not_yet, not_sure]
Q5BC_TIMING IN [more_than_3_months, not_sure]
```

Output:

```ts
{
  result_code: "ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW",
  track: "planning_esop",
  lead_temperature: "warm_low",
  lead_temperature_ui: "warm",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "hide_booking_link",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

This should not be classified as cold because the user has explicitly said they are planning an ESOP. However, it is a lower-priority warm lead.

---

# 10. Branch B Exhaustive Coverage

Branch B has 96 possible answer-path combinations.

## 10.1 Combination count

| Branch B Path | Combination Count | Lead |
|---|---:|---|
| Pressure yes/expected + near-term timing + any concern | 2 x 2 x 6 = 24 | HOT |
| Pressure yes/expected + far/uncertain timing + any concern | 2 x 2 x 6 = 24 | WARM |
| No/uncertain pressure + near-term timing + any concern | 2 x 2 x 6 = 24 | WARM |
| No/uncertain pressure + far/uncertain timing + any concern | 2 x 2 x 6 = 24 | WARM_LOW |
| Total | 96 | Fully covered |

## 10.2 Aggregated Branch B mapping

| Anyone Asking? | Timing | Concern | Lead | Report | CTA | Delivery |
|---|---|---|---|---|---|---|
| Yes actively | Within 1 month | Any | HOT | Based on concern | Report sent + HOT booking link | Send report immediately |
| Yes actively | Within 1 to 3 months | Any | HOT | Based on concern | Report sent + HOT booking link | Send report immediately |
| Yes actively | More than 3 months | Any | WARM | Based on concern | Download report only | Send report immediately |
| Yes actively | Not sure | Any | WARM | Based on concern | Download report only | Send report immediately |
| Expected soon | Within 1 month | Any | HOT | Based on concern | Report sent + HOT booking link | Send report immediately |
| Expected soon | Within 1 to 3 months | Any | HOT | Based on concern | Report sent + HOT booking link | Send report immediately |
| Expected soon | More than 3 months | Any | WARM | Based on concern | Download report only | Send report immediately |
| Expected soon | Not sure | Any | WARM | Based on concern | Download report only | Send report immediately |
| No, not yet | Within 1 month | Any | WARM | Based on concern | Download report only | Send report immediately |
| No, not yet | Within 1 to 3 months | Any | WARM | Based on concern | Download report only | Send report immediately |
| No, not yet | More than 3 months | Any | WARM_LOW | Based on concern | Download report only | Send report immediately |
| No, not yet | Not sure | Any | WARM_LOW | Based on concern | Download report only | Send report immediately |
| Not sure | Within 1 month | Any | WARM | Based on concern | Download report only | Send report immediately |
| Not sure | Within 1 to 3 months | Any | WARM | Based on concern | Download report only | Send report immediately |
| Not sure | More than 3 months | Any | WARM_LOW | Based on concern | Download report only | Send report immediately |
| Not sure | Not sure | Any | WARM_LOW | Based on concern | Download report only | Send report immediately |

---

# 11. Branch C — No ESOP

Branch C applies when:

```text
Q2_ESOP_STATUS = no
```

This branch is more educational than Branch B unless there is pressure or near-term timing.

The same questions are used as Branch B, but the classification rules differ in one key area:

```text
No ESOP + no pressure + far/uncertain timing = COLD
```

---

# 12. Branch C Outcome Rules

## C1 — No ESOP, pressure exists, near-term timing

Condition:

```text
track = no_esop
Q3BC_ANYONE_ASKING IN [yes_actively, expected_soon]
Q5BC_TIMING IN [within_1_month, within_1_to_3_months]
```

Output:

```ts
{
  result_code: "ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT",
  track: "no_esop",
  lead_temperature: "hot",
  lead_temperature_ui: "hot",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "report_sent_plus_hot_call_link",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "show_hot_booking_link_no_redirect",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

The company does not have an ESOP, but someone is asking and the timing is near-term. This creates an immediate advisory need.

## C2 — No ESOP, pressure exists, far or uncertain timing

Condition:

```text
track = no_esop
Q3BC_ANYONE_ASKING IN [yes_actively, expected_soon]
Q5BC_TIMING IN [more_than_3_months, not_sure]
```

Output:

```ts
{
  result_code: "ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM",
  track: "no_esop",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "hide_booking_link",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

There is a real pressure point, but the decision is not immediate.

## C3 — No ESOP, no clear pressure, near-term timing

Condition:

```text
track = no_esop
Q3BC_ANYONE_ASKING IN [no_not_yet, not_sure]
Q5BC_TIMING IN [within_1_month, within_1_to_3_months]
```

Output:

```ts
{
  result_code: "ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM",
  track: "no_esop",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "hide_booking_link",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

No external pressure exists, but the user expects to act soon. This is enough to classify as warm.

## C4 — No ESOP, no clear pressure, far or uncertain timing

Condition:

```text
track = no_esop
Q3BC_ANYONE_ASKING IN [no_not_yet, not_sure]
Q5BC_TIMING IN [more_than_3_months, not_sure]
```

Output:

```ts
{
  result_code: "ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD",
  track: "no_esop",
  lead_temperature: "cold",
  lead_temperature_ui: "cold",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "hide_booking_link",
  report_booking_prompt_policy: "no_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

Reason:

There is no ESOP, no clear pressure, and no near-term timing. This is educational demand only.

---

# 13. Branch C Exhaustive Coverage

Branch C has 96 possible answer-path combinations.

## 13.1 Combination count

| Branch C Path | Combination Count | Lead |
|---|---:|---|
| Pressure yes/expected + near-term timing + any concern | 2 x 2 x 6 = 24 | HOT |
| Pressure yes/expected + far/uncertain timing + any concern | 2 x 2 x 6 = 24 | WARM |
| No/uncertain pressure + near-term timing + any concern | 2 x 2 x 6 = 24 | WARM |
| No/uncertain pressure + far/uncertain timing + any concern | 2 x 2 x 6 = 24 | COLD |
| Total | 96 | Fully covered |

## 13.2 Aggregated Branch C mapping

| Anyone Asking? | Timing | Concern | Lead | Report | CTA | Delivery |
|---|---|---|---|---|---|---|
| Yes actively | Within 1 month | Any | HOT | Based on concern | Report sent + HOT booking link | Send report immediately |
| Yes actively | Within 1 to 3 months | Any | HOT | Based on concern | Report sent + HOT booking link | Send report immediately |
| Yes actively | More than 3 months | Any | WARM | Based on concern | Download report only | Send report immediately |
| Yes actively | Not sure | Any | WARM | Based on concern | Download report only | Send report immediately |
| Expected soon | Within 1 month | Any | HOT | Based on concern | Report sent + HOT booking link | Send report immediately |
| Expected soon | Within 1 to 3 months | Any | HOT | Based on concern | Report sent + HOT booking link | Send report immediately |
| Expected soon | More than 3 months | Any | WARM | Based on concern | Download report only | Send report immediately |
| Expected soon | Not sure | Any | WARM | Based on concern | Download report only | Send report immediately |
| No, not yet | Within 1 month | Any | WARM | Based on concern | Download report only | Send report immediately |
| No, not yet | Within 1 to 3 months | Any | WARM | Based on concern | Download report only | Send report immediately |
| No, not yet | More than 3 months | Any | COLD | Based on concern | Download report only | Send report/results immediately |
| No, not yet | Not sure | Any | COLD | Based on concern | Download report only | Send report/results immediately |
| Not sure | Within 1 month | Any | WARM | Based on concern | Download report only | Send report immediately |
| Not sure | Within 1 to 3 months | Any | WARM | Based on concern | Download report only | Send report immediately |
| Not sure | More than 3 months | Any | COLD | Based on concern | Download report only | Send report/results immediately |
| Not sure | Not sure | Any | COLD | Based on concern | Download report only | Send report/results immediately |

---

# 14. Branch U — Unsure Whether They Have ESOP

Branch U applies when:

```text
Q2_ESOP_STATUS = not_sure
```

This branch uses the same questions and lead rules as Branch C, but keeps a separate track value:

```text
track = unsure_esop
```

This is important because uncertainty is a useful sales and education signal.

For example, a user who is not sure whether they have an ESOP may have:

1. founder share promises but no formal plan
2. phantom equity
3. advisor shares
4. informal option promises
5. legacy option documents but no valuation support
6. HR incentives confused with actual equity

The system should not silently classify this as `no_esop`.

---

# 15. Branch U Outcome Rules

## U1 — Unsure ESOP, pressure exists, near-term timing

Condition:

```text
track = unsure_esop
Q3BC_ANYONE_ASKING IN [yes_actively, expected_soon]
Q5BC_TIMING IN [within_1_month, within_1_to_3_months]
```

Output:

```ts
{
  result_code: "ESOP_U1_UNSURE_PRESSURE_NEAR_HOT",
  track: "unsure_esop",
  lead_temperature: "hot",
  lead_temperature_ui: "hot",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "report_sent_plus_hot_call_link",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "show_hot_booking_link_no_redirect",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

## U2 — Unsure ESOP, pressure exists, far or uncertain timing

Condition:

```text
track = unsure_esop
Q3BC_ANYONE_ASKING IN [yes_actively, expected_soon]
Q5BC_TIMING IN [more_than_3_months, not_sure]
```

Output:

```ts
{
  result_code: "ESOP_U2_UNSURE_PRESSURE_FAR_WARM",
  track: "unsure_esop",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "hide_booking_link",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

## U3 — Unsure ESOP, no clear pressure, near-term timing

Condition:

```text
track = unsure_esop
Q3BC_ANYONE_ASKING IN [no_not_yet, not_sure]
Q5BC_TIMING IN [within_1_month, within_1_to_3_months]
```

Output:

```ts
{
  result_code: "ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM",
  track: "unsure_esop",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "hide_booking_link",
  report_booking_prompt_policy: "include_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

## U4 — Unsure ESOP, no clear pressure, far or uncertain timing

Condition:

```text
track = unsure_esop
Q3BC_ANYONE_ASKING IN [no_not_yet, not_sure]
Q5BC_TIMING IN [more_than_3_months, not_sure]
```

Output:

```ts
{
  result_code: "ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD",
  track: "unsure_esop",
  lead_temperature: "cold",
  lead_temperature_ui: "cold",
  report_key: assignReportFromConcern(Q4BC_MAIN_CONCERN),
  cta_mode: "download_report_only",
  delivery_policy: "send_report_immediately",
  result_page_booking_policy: "hide_booking_link",
  report_booking_prompt_policy: "no_booking_prompt_in_report",
  calendar_redirect_policy: "never_auto_redirect_open_link_only"
}
```

---

# 16. Branch U Exhaustive Coverage

Branch U has 96 possible answer-path combinations.

## 16.1 Combination count

| Branch U Path | Combination Count | Lead |
|---|---:|---|
| Pressure yes/expected + near-term timing + any concern | 2 x 2 x 6 = 24 | HOT |
| Pressure yes/expected + far/uncertain timing + any concern | 2 x 2 x 6 = 24 | WARM |
| No/uncertain pressure + near-term timing + any concern | 2 x 2 x 6 = 24 | WARM |
| No/uncertain pressure + far/uncertain timing + any concern | 2 x 2 x 6 = 24 | COLD |
| Total | 96 | Fully covered |

---

# 17. Report Assignment Rules

Report assignment must be separated from lead temperature.

## 17.1 Branch A report rule

Condition:

```text
track = existing_esop
```

Report:

```text
esop_compliance_governance
```

Display name:

```text
ESOP Compliance & Governance Guide
```

Reason:

Any existing ESOP user needs governance, valuation, audit, board, and provider-comparison education.

## 17.2 Branch B/C/U report rule

Condition:

```text
track IN [planning_esop, no_esop, unsure_esop]
```

Map by `Q4BC_MAIN_CONCERN`.

| Concern Value | Report Key | Display Name |
|---|---|---|
| `allocation` | `esop_structuring_dilution` | ESOP Structuring & Dilution Guide |
| `valuation` | `esop_structuring_dilution` | ESOP Structuring & Dilution Guide |
| `dilution` | `esop_structuring_dilution` | ESOP Structuring & Dilution Guide |
| `legal_tax_compliance` | `esop_communication_legal` | ESOP Communication & Legal Guide |
| `employee_communication` | `esop_communication_legal` | ESOP Communication & Legal Guide |
| `not_sure_where_to_start` | `esop_starter` | ESOP Starter Guide |

## 17.3 Report assignment edge cases

| Scenario | Correct Report |
|---|---|
| COLD lead, but selected dilution | ESOP Structuring & Dilution Guide |
| COLD lead, but selected valuation | ESOP Structuring & Dilution Guide |
| COLD lead, but selected legal/tax/compliance | ESOP Communication & Legal Guide |
| WARM lead, selected not sure where to start | ESOP Starter Guide |
| HOT lead, selected employee communication | ESOP Communication & Legal Guide, sent immediately with a HOT-only result-page booking prompt |
| Existing ESOP, any provider/timing answer | ESOP Compliance & Governance Guide |

Important:

Do not use this rule:

```text
Cold = Starter Guide
```

Use this rule instead:

```text
Concern = Report
Lead temperature = CTA and delivery policy
```

---

# 18. Result Page CTA Mapping Rules

CTA is determined by lead temperature, but the revised rule is report-first for everyone.

There is no longer any call-first or report-withheld flow.

| Lead Temperature | UI Temperature | CTA Mode | Results Page Report Message | Results Page Booking Prompt | Calendar Behavior |
|---|---|---|---|---|---|
| `hot` | Hot | `report_sent_plus_hot_call_link` | Your report has been sent / download your report | Show strong booking prompt | User must click booking link manually; never auto-redirect |
| `warm` | Warm | `download_report_only` | Download your ESOP report / your report has been sent | Do not show booking prompt | No calendar link on results page |
| `warm_low` | Warm | `download_report_only` | Download your ESOP report / your report has been sent | Do not show booking prompt | No calendar link on results page |
| `cold` | Cold | `download_report_only` | Download your ESOP report / your results have been sent | Do not show booking prompt | No calendar link on results page |

Important:

```text
The result page must not redirect anyone automatically to Cal.com or any booking page.
HOT users may see a booking link, but they must choose to click it.
WARM and WARM_LOW users should not see a booking CTA on the results page.
COLD users should not see any booking CTA on the results page.
```

## 18.1 Recommended result-page copy by lead temperature

### HOT result page

```text
Your ESOP report has been sent.

Based on your answers, this looks like a time-sensitive or governance-sensitive ESOP matter. We strongly encourage you to book a short call so we can walk through what applies to your company before your next grant, audit, board discussion, or employee communication.

[Book a call]
```

Rules:

```text
Show the report/download confirmation.
Show the booking prompt.
Use a clickable booking link only.
Do not auto-redirect to Cal.com.
Do not make booking mandatory to receive the report.
```

### WARM and WARM_LOW result page

```text
Your ESOP report is ready.

We have sent the report to your email. You can use it to understand the key ESOP structuring, valuation, communication, or compliance considerations relevant to your answers.

[Download report]
```

Rules:

```text
Show report/download confirmation.
Do not show a booking button or calendar link on the results page.
If you want to invite warm leads to book a call, place that prompt inside the PDF/report or follow-up nurture email, not on the result page.
```

### COLD result page

```text
Your ESOP results have been sent.

We have sent the relevant report to your email so you can review the key considerations at your own pace.

[Download report]
```

Rules:

```text
Show report/results confirmation.
Do not show a booking button or calendar link.
Do not include a booking prompt inside the report.
Do not notify sales by default.
```

---

# 19. Delivery and Booking Prompt Policy Rules

Delivery policy determines whether the assigned report is sent immediately. Under the revised outcome flow, all completed ESOP-path users receive the assigned report/results immediately.

| Lead Temperature | Report Assigned? | Report Sent Immediately? | Delivery Policy | Result Page Booking Policy | Report Booking Prompt Policy |
|---|---|---|---|---|---|
| Hot | Yes | Yes | `send_report_immediately` | `show_hot_booking_link_no_redirect` | `include_booking_prompt_in_report` |
| Warm | Yes | Yes | `send_report_immediately` | `hide_booking_link` | `include_booking_prompt_in_report` |
| Warm Low | Yes | Yes | `send_report_immediately` | `hide_booking_link` | `include_booking_prompt_in_report` |
| Cold | Yes | Yes | `send_report_immediately` | `hide_booking_link` | `no_booking_prompt_in_report` |

## 19.1 Why HOT still receives the report immediately

HOT leads should still have a `report_key` and receive the assigned report immediately because:

1. the user was promised a diagnostic output
2. the report improves trust before the call
3. the CRM still needs to know which asset is relevant
4. sales can use the report type to personalize follow-up
5. analytics should show which content category creates hot leads

The commercial difference is not whether the report is sent. The difference is whether the result page includes a booking prompt.

For HOT leads, the user-facing result page should say:

```text
Your report has been sent, but based on your answers, we strongly encourage you to book a short call.
```

The booking CTA must be a normal clickable link. The application must not automatically redirect the user to Cal.com.

## 19.2 Warm lead booking prompt rule

Warm and warm-low leads should receive the assigned report immediately and should not see a booking CTA on the results page.

If a booking prompt is used, it belongs inside the PDF/report itself or in a later nurture email.

## 19.3 Cold lead booking prompt rule

Cold leads should receive their report/results immediately and should not receive any booking prompt on the results page or inside the PDF/report.

# 20. Internal Lead Scoring

Lead scoring ranks leads inside each temperature bucket.

It should not determine the primary classification.

## 20.1 Base score

| Lead Temperature | Base Score |
|---|---:|
| Hot | 70 |
| Warm | 40 |
| Warm Low | 30 |
| Cold | 10 |

## 20.2 Company stage modifier

| Company Stage | Modifier |
|---|---:|
| Bootstrapped / Seed | +5 |
| Series A or B | +10 |
| Growth / Scale-up | +15 |
| Mature / Profitable SME | +10 |

## 20.3 Employee count modifier

| Employee Count | Modifier |
|---|---:|
| 1 to 10 | +2 |
| 11 to 50 | +8 |
| 51 to 200 | +15 |
| More than 200 | +20 |

## 20.4 Timing modifier

| Timing | Modifier |
|---|---:|
| Within 1 month | +15 |
| Within 1 to 3 months | +10 |
| More than 3 months | +3 |
| Not sure | +0 |

## 20.5 Pressure modifier

Only applies to Branch B/C/U.

| Anyone Asking? | Modifier |
|---|---:|
| Yes, actively | +15 |
| Expected soon | +8 |
| No, not yet | +0 |
| Not sure | +0 |

## 20.6 Provider issue modifier

Only applies to Branch A where provider dissatisfaction exists.

| Dissatisfaction Reason | Modifier |
|---|---:|
| Price too high | +5 |
| Weak report quality | +10 |
| Hard to explain to employees, board, or investors | +10 |
| Slow or painful process | +8 |
| Provider does not understand startups or ESOPs | +10 |
| Other | +5 |

## 20.7 Price sensitivity modifier

Only applies to Branch A where provider is satisfied.

| Price Sensitivity | Modifier |
|---|---:|
| Price matters | +3 |
| Price not main factor | +0 |
| Maybe, if quality and credibility are strong | +5 |

## 20.8 Lead score formula

```ts
lead_score = Math.min(
  100,
  baseScore
  + stageModifier
  + employeeModifier
  + timingModifier
  + pressureModifier
  + providerIssueModifier
  + priceSensitivityModifier
)
```

## 20.9 Score examples

### Example 1 — Strong HOT

```text
Existing ESOP
No formal valuation
Growth / Scale-up
51 to 200 employees
Next grant within 1 month
```

Calculation:

```text
70 + 15 + 15 + 15 = 115, capped at 100
```

Output:

```text
lead_temperature = hot
lead_score = 100
```

### Example 2 — Lower-priority HOT

```text
Existing ESOP
No formal valuation
Bootstrapped / Seed
1 to 10 employees
Next review not sure
```

Calculation:

```text
70 + 5 + 2 + 0 = 77
```

Output:

```text
lead_temperature = hot
lead_score = 77
```

### Example 3 — Strong WARM

```text
Planning ESOP
No one asking yet
Decision within 1 month
Series A or B
51 to 200 employees
```

Calculation:

```text
40 + 10 + 15 + 15 = 80
```

Output:

```text
lead_temperature = warm
lead_score = 80
```

### Example 4 — True COLD

```text
No ESOP
No one asking
Timing not sure
Bootstrapped / Seed
1 to 10 employees
```

Calculation:

```text
10 + 5 + 2 = 17
```

Output:

```text
lead_temperature = cold
lead_score = 17
```

---

# 21. Full Logic Pseudocode

## 21.1 Main function

```ts
function calculateEsopResult(answers) {
  const track = getTrack(answers.q2_esop_status);

  let leadTemperature;
  let resultCode;

  if (track === "existing_esop") {
    ({ leadTemperature, resultCode } = classifyExistingEsop(answers));
  }

  if (track === "planning_esop") {
    ({ leadTemperature, resultCode } = classifyPlanningEsop(answers));
  }

  if (track === "no_esop") {
    ({ leadTemperature, resultCode } = classifyNoEsop(answers));
  }

  if (track === "unsure_esop") {
    ({ leadTemperature, resultCode } = classifyUnsureEsop(answers));
  }

  const reportKey = assignReportKey(track, answers);
  const ctaMode = assignCtaMode(leadTemperature);
  const deliveryPolicy = assignDeliveryPolicy(leadTemperature);
  const resultPageBookingPolicy = assignResultPageBookingPolicy(leadTemperature);
  const reportBookingPromptPolicy = assignReportBookingPromptPolicy(leadTemperature);
  const calendarRedirectPolicy = "never_auto_redirect_open_link_only";
  const leadScore = calculateLeadScore(leadTemperature, answers);
  const crmTags = buildCrmTags(track, resultCode, leadTemperature, reportKey, answers);

  return {
    track,
    result_code: resultCode,
    lead_temperature: leadTemperature,
    lead_temperature_ui: leadTemperature === "warm_low" ? "warm" : leadTemperature,
    lead_score: leadScore,
    report_key: reportKey,
    cta_mode: ctaMode,
    delivery_policy: deliveryPolicy,
    result_page_booking_policy: resultPageBookingPolicy,
    report_booking_prompt_policy: reportBookingPromptPolicy,
    calendar_redirect_policy: calendarRedirectPolicy,
    crm_tags: crmTags,
    answers
  };
}
```

## 21.2 Track function

```ts
function getTrack(q2Status) {
  switch (q2Status) {
    case "yes_existing":
      return "existing_esop";
    case "planning":
      return "planning_esop";
    case "no":
      return "no_esop";
    case "not_sure":
      return "unsure_esop";
    default:
      return "unsure_esop";
  }
}
```

## 21.3 Existing ESOP classifier

```ts
function classifyExistingEsop(answers) {
  if (["no", "not_sure"].includes(answers.q3a_formal_valuation)) {
    return {
      leadTemperature: "hot",
      resultCode: "ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT"
    };
  }

  if (
    answers.q3a_formal_valuation === "yes" &&
    ["not_satisfied", "not_sure"].includes(answers.q4a_provider_satisfaction)
  ) {
    return {
      leadTemperature: "hot",
      resultCode: "ESOP_A2_PROVIDER_REVIEW_HOT"
    };
  }

  if (
    answers.q3a_formal_valuation === "yes" &&
    answers.q4a_provider_satisfaction === "satisfied"
  ) {
    return {
      leadTemperature: "warm",
      resultCode: "ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM"
    };
  }

  return {
    leadTemperature: "hot",
    resultCode: "ESOP_A0_EXISTING_ESOP_INCOMPLETE_OR_UNCLEAR_HOT"
  };
}
```

## 21.4 Planning ESOP classifier

```ts
function classifyPlanningEsop(answers) {
  const pressureExists = ["yes_actively", "expected_soon"].includes(answers.q3bc_anyone_asking);
  const nearTerm = ["within_1_month", "within_1_to_3_months"].includes(answers.q5bc_timing);

  if (pressureExists && nearTerm) {
    return {
      leadTemperature: "hot",
      resultCode: "ESOP_B1_PLANNING_PRESSURE_NEAR_HOT"
    };
  }

  if (pressureExists && !nearTerm) {
    return {
      leadTemperature: "warm",
      resultCode: "ESOP_B2_PLANNING_PRESSURE_FAR_WARM"
    };
  }

  if (!pressureExists && nearTerm) {
    return {
      leadTemperature: "warm",
      resultCode: "ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM"
    };
  }

  return {
    leadTemperature: "warm_low",
    resultCode: "ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW"
  };
}
```

## 21.5 No ESOP classifier

```ts
function classifyNoEsop(answers) {
  const pressureExists = ["yes_actively", "expected_soon"].includes(answers.q3bc_anyone_asking);
  const nearTerm = ["within_1_month", "within_1_to_3_months"].includes(answers.q5bc_timing);

  if (pressureExists && nearTerm) {
    return {
      leadTemperature: "hot",
      resultCode: "ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT"
    };
  }

  if (pressureExists && !nearTerm) {
    return {
      leadTemperature: "warm",
      resultCode: "ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM"
    };
  }

  if (!pressureExists && nearTerm) {
    return {
      leadTemperature: "warm",
      resultCode: "ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM"
    };
  }

  return {
    leadTemperature: "cold",
    resultCode: "ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD"
  };
}
```

## 21.6 Unsure ESOP classifier

```ts
function classifyUnsureEsop(answers) {
  const pressureExists = ["yes_actively", "expected_soon"].includes(answers.q3bc_anyone_asking);
  const nearTerm = ["within_1_month", "within_1_to_3_months"].includes(answers.q5bc_timing);

  if (pressureExists && nearTerm) {
    return {
      leadTemperature: "hot",
      resultCode: "ESOP_U1_UNSURE_PRESSURE_NEAR_HOT"
    };
  }

  if (pressureExists && !nearTerm) {
    return {
      leadTemperature: "warm",
      resultCode: "ESOP_U2_UNSURE_PRESSURE_FAR_WARM"
    };
  }

  if (!pressureExists && nearTerm) {
    return {
      leadTemperature: "warm",
      resultCode: "ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM"
    };
  }

  return {
    leadTemperature: "cold",
    resultCode: "ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD"
  };
}
```

## 21.7 Report assignment function

```ts
function assignReportKey(track, answers) {
  if (track === "existing_esop") {
    return "esop_compliance_governance";
  }

  switch (answers.q4bc_main_concern) {
    case "allocation":
    case "valuation":
    case "dilution":
      return "esop_structuring_dilution";

    case "legal_tax_compliance":
    case "employee_communication":
      return "esop_communication_legal";

    case "not_sure_where_to_start":
    default:
      return "esop_starter";
  }
}
```

## 21.8 CTA function

```ts
function assignCtaMode(leadTemperature) {
  if (leadTemperature === "hot") {
    return "report_sent_plus_hot_call_link";
  }

  return "download_report_only";
}
```

## 21.9 Delivery function

```ts
function assignDeliveryPolicy() {
  return "send_report_immediately";
}
```

## 21.10 Result-page booking policy function

```ts
function assignResultPageBookingPolicy(leadTemperature) {
  if (leadTemperature === "hot") {
    return "show_hot_booking_link_no_redirect";
  }

  return "hide_booking_link";
}
```

## 21.11 Report booking prompt policy function

```ts
function assignReportBookingPromptPolicy(leadTemperature) {
  if (["hot", "warm", "warm_low"].includes(leadTemperature)) {
    return "include_booking_prompt_in_report";
  }

  return "no_booking_prompt_in_report";
}
```

---

# 22. CRM Tags

Build tags from the final result object.

Recommended tag groups:

## 22.1 Track tags

```text
track_existing_esop
track_planning_esop
track_no_esop
track_unsure_esop
```

## 22.2 Temperature tags

```text
lead_hot
lead_warm
lead_warm_low
lead_cold
```

## 22.3 Report tags

```text
report_esop_compliance_governance
report_esop_structuring_dilution
report_esop_communication_legal
report_esop_starter
```

## 22.4 CTA tags

```text
cta_report_sent_plus_hot_call_link
cta_download_report_only
```

## 22.5 Trigger tags

```text
trigger_missing_formal_valuation
trigger_uncertain_formal_valuation
trigger_provider_dissatisfaction
trigger_provider_uncertainty
trigger_external_pressure
trigger_expected_pressure
trigger_near_term_timing
trigger_far_timing
trigger_uncertain_timing
trigger_no_pressure
```

## 22.6 Booking policy tags

```text
result_page_booking_hot_link
result_page_booking_hidden
report_booking_prompt_included
report_booking_prompt_excluded
calendar_no_auto_redirect
```

---

# 23. Zapier / Google Script Payload

Send the following structured payload after completion:

```json
{
  "email": "{{user_email}}",
  "name": "{{user_name}}",
  "company": "{{company_name}}",
  "referral_code": "{{referral_code}}",
  "track": "existing_esop",
  "result_code": "ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT",
  "lead_temperature": "hot",
  "lead_temperature_ui": "hot",
  "lead_score": 92,
  "report_key": "esop_compliance_governance",
  "cta_mode": "report_sent_plus_hot_call_link",
  "delivery_policy": "send_report_immediately",
  "result_page_booking_policy": "show_hot_booking_link_no_redirect",
  "report_booking_prompt_policy": "include_booking_prompt_in_report",
  "calendar_redirect_policy": "never_auto_redirect_open_link_only",
  "crm_tags": [
    "track_existing_esop",
    "lead_hot",
    "report_esop_compliance_governance",
    "cta_report_sent_plus_hot_call_link",
    "trigger_missing_formal_valuation"
  ],
  "answers": {
    "q2_esop_status": "yes_existing",
    "q_context_stage": "growth_scaleup",
    "q_context_employees": "51_200",
    "q3a_formal_valuation": "no",
    "q6a_next_grant_review": "within_1_to_3_months"
  }
}
```

---

# 24. Automation Rules

## 24.1 HOT automation

Condition:

```text
lead_temperature = hot
```

Action:

```text
1. Send the assigned PDF/report immediately using report_key.
2. Show a report-sent result page.
3. Display HOT-only copy: "Your report has been sent, but we strongly encourage you to book a call."
4. Show a clickable booking link or button.
5. Do not auto-redirect the user to Cal.com or any calendar page.
6. Store report_key in CRM.
7. Send internal notification to sales.
8. Add HOT tags and trigger-specific tags.
```

## 24.2 WARM automation

Condition:

```text
lead_temperature = warm OR warm_low
```

Action:

```text
1. Send the assigned PDF/report immediately using report_key.
2. Show a report-download or report-sent result page.
3. Do not show a booking CTA, booking button, or calendar link on the results page.
4. Include the booking prompt inside the PDF/report itself, not on the results page.
5. Add to nurture sequence.
6. If lead_score >= 70, notify sales for manual follow-up, but do not change the user's result-page CTA.
```

## 24.3 COLD automation

Condition:

```text
lead_temperature = cold
```

Action:

```text
1. Send the assigned PDF/report or results immediately using report_key.
2. Show a report/results-only result page.
3. Do not show a booking CTA, booking button, or calendar link on the results page.
4. Do not include a booking prompt inside the PDF/report.
5. Add to long-term education sequence if desired.
6. Do not notify sales by default.
```

---

# 25. Edge Case Handling

## 25.1 Missing answer

If a required answer is missing, apply a safe fallback.

| Missing Field | Fallback |
|---|---|
| Q2 ESOP status | `unsure_esop` |
| Q3A formal valuation | HOT if existing ESOP |
| Q4A provider satisfaction | HOT if formal valuation is yes but satisfaction missing |
| Q3BC anyone asking | `not_sure` |
| Q4BC main concern | `not_sure_where_to_start` |
| Q5BC timing | `not_sure` |
| Q6A timing | `not_sure` |

Principle:

```text
When the user is already in an existing ESOP branch, missing certainty should increase caution.
When the user is in planning/no/unsure branches, missing certainty should not create HOT unless pressure and timing are present.
```

## 25.2 User says they have an ESOP but does not know if valuation was done

Classification:

```text
HOT
```

Report:

```text
ESOP Compliance & Governance Guide
```

CTA:

```text
Report sent/download shown, with HOT-only booking link
```

Reason:

Uncertainty around formal valuation is itself the risk.

## 25.3 User is planning ESOP but nobody is asking and timing is unclear

Classification:

```text
WARM_LOW internally, WARM in UI
```

Report:

```text
Based on concern
```

CTA:

```text
Download report only on results page
```

Reason:

Planning intent makes them better than a cold education lead.

## 25.4 User has no ESOP, nobody is asking, timing is unclear

Classification:

```text
COLD
```

Report:

```text
Based on concern
```

CTA:

```text
Download report only on results page
```

Reason:

There is no present need, no pressure, and no near-term timeline.

## 25.5 User is cold but selects dilution

Classification:

```text
COLD
```

Report:

```text
ESOP Structuring & Dilution Guide
```

CTA:

```text
Download report only on results page
```

Reason:

Lead temperature should not override content relevance.

## 25.6 User is hot but selects not sure where to start

Classification:

```text
HOT
```

Report:

```text
ESOP Starter Guide
```

CTA:

```text
Report sent/download shown, with HOT-only booking link
```

Reason:

The user's pressure/timing makes the lead hot, but the content need is still beginner-level.

---

# 26. Total Exhaustive Coverage

Under this design, the ESOP assessment covers:

| Track | Combination Count | Classification Coverage |
|---|---:|---|
| Existing ESOP | 68 | Fully covered |
| Planning ESOP | 96 | Fully covered |
| No ESOP | 96 | Fully covered |
| Unsure ESOP | 96 | Fully covered |
| Total | 356 | Fully covered |

Every answer path returns:

```text
track
result_code
lead_temperature
lead_temperature_ui
lead_score
report_key
cta_mode
delivery_policy
result_page_booking_policy
report_booking_prompt_policy
calendar_redirect_policy
crm_tags
answers
```

No completed ESOP-path user should end without a classified result.

---

# 27. Final Implementation Notes

## 27.1 Files likely requiring updates

| File | Required Change |
|---|---|
| `src/content/questions.ts` | Replace linear score-only questions with node-based questions and canonical answer values |
| `src/lib/routing.ts` | Implement state machine routing by `nextQuestion` |
| `src/lib/scoring.ts` | Replace primary point classification with deterministic result functions and secondary score calculation |
| `src/content/outcomes.ts` | Add result codes, CTA modes, report keys, and UI copy variants |
| `src/app/scorecard/result/page.tsx` | Render result page based on `cta_mode` and `delivery_policy` |
| Zapier / Google Script | Use `report_key` and `delivery_policy` to determine whether to send PDF immediately |
| CRM / Sheets | Store `track`, `result_code`, `lead_temperature`, `lead_score`, `report_key`, `cta_mode`, `delivery_policy`, `result_page_booking_policy`, `report_booking_prompt_policy`, `calendar_redirect_policy`, and `crm_tags` |

## 27.2 Implementation principle

Do not write code that says:

```text
score >= X means HOT
```

Instead write code that says:

```text
rule outcome = HOT
score = priority inside HOT
```

## 27.3 Testing requirement

Before launch, test at least one case for each result code:

```text
ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT
ESOP_A2_PROVIDER_REVIEW_HOT
ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM
ESOP_B1_PLANNING_PRESSURE_NEAR_HOT
ESOP_B2_PLANNING_PRESSURE_FAR_WARM
ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM
ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW
ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT
ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM
ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM
ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD
ESOP_U1_UNSURE_PRESSURE_NEAR_HOT
ESOP_U2_UNSURE_PRESSURE_FAR_WARM
ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM
ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD
```

Then test the following report edge cases:

```text
Cold + dilution = Structuring & Dilution Guide
Cold + legal/tax = Communication & Legal Guide
Warm + not sure where to start = Starter Guide
Hot + employee communication = Communication & Legal Guide, sent immediately with HOT-only booking prompt on results page
Existing ESOP + any answer = Compliance & Governance Guide
```

---

# 28. Final Rule Summary

The entire system can be summarized as:

```text
Existing ESOP + no/uncertain formal valuation = HOT
Existing ESOP + dissatisfied/uncertain provider = HOT
Existing ESOP + satisfied provider = WARM
Planning ESOP + pressure + near timing = HOT
Planning ESOP + pressure + far/uncertain timing = WARM
Planning ESOP + no pressure + near timing = WARM
Planning ESOP + no pressure + far/uncertain timing = WARM_LOW
No ESOP + pressure + near timing = HOT
No ESOP + pressure + far/uncertain timing = WARM
No ESOP + no pressure + near timing = WARM
No ESOP + no pressure + far/uncertain timing = COLD
Unsure ESOP follows No ESOP classification rules but keeps `track = unsure_esop`
Concern determines report
All leads receive the assigned report/results immediately
Lead temperature determines result-page CTA
HOT leads see report-sent confirmation plus a manual booking link on the results page
WARM and WARM_LOW leads see report download only on the results page, with booking prompt only inside the report
COLD leads see report/results only and receive no booking prompt
No user is automatically redirected to Cal.com
Score ranks priority inside each class
```
