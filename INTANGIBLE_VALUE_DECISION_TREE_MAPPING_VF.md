# Intangible Value Decision Tree — Revised Master Mapping v1

## Purpose

This file defines the revised Intangible Value assessment logic for Bain Squared's Intangible Asset diagnostic flow.

The goal is to classify every respondent into the correct commercial outcome while preserving a credible assessment experience. The logic follows the same hybrid architecture used in the revised ESOP mapping file, but it has been adapted to the Intangible Value question set.

The system must produce the following outputs for every completed Intangible Value-path respondent:

1. `track`
2. `event_group`
3. `result_code`
4. `lead_temperature`
5. `lead_temperature_ui`
6. `lead_score`
7. `asset_signal_group`
8. `documentation_group`
9. `pain_group`
10. `report_key`
11. `cta_mode`
12. `delivery_policy`
13. `crm_tags`
14. `answers`

The core design principle is:

```text
Question routing is handled by a branching state machine.
Lead classification is handled by deterministic business rules.
Report assignment is handled by event / concern mapping.
CTA assignment is handled by lead temperature.
Delivery is report-first for every lead.
Internal prioritization is handled by scoring.
```

Do not collapse these into one result bucket.

---

# 1. Important Changes From the Previous File

## 1.1 Naming change

All references to the old track name should be replaced with:

```text
Intangible Value
```

Use `iv` in code-level keys.

Do not use the old abbreviation or old track name in new code, output keys, CRM tags, PDF keys, result codes, or result-page copy.

## 1.2 Revised outcome flow

The prior flow treated hot leads as call-first and sometimes held the report behind a booking step.

That is no longer the desired flow.

The revised flow is:

| Lead Temperature | Result Page Behavior | Report Delivery | Booking Prompt |
|---|---|---|---|
| Hot | Tell user the report has been sent, then strongly encourage booking a call | Send immediately | Show booking link on result page; do not auto-redirect |
| Warm | Tell user the report has been sent / allow report download | Send immediately | No booking prompt on result page; include soft prompt inside the report |
| Warm Low | Same as Warm in the UI | Send immediately | No booking prompt on result page; include soft prompt inside the report |
| Cold | Tell user the report has been sent / allow report download | Send immediately | No booking prompt on result page and no call prompt required inside the report |

Important:

```text
Every lead gets a report.
Hot leads do not get redirected to a calendar.
Hot leads see a booking link they can click.
Warm leads do not see a booking CTA on the result page.
Cold leads do not see a booking CTA.
```

---

# 2. Core Architecture

## 2.1 What the user experiences

The user experiences a short guided diagnostic about whether their company has intangible assets that are not fully reflected in a normal revenue, profit, asset, or comparable-company valuation method.

The experience should feel educational, not like a hard sales qualification flow.

## 2.2 What the system actually does

The system should evaluate the user's answers in this order:

```text
1. Confirm the user has entered the Intangible Value track.
2. Capture company context.
3. Capture current valuation method.
4. Capture perceived valuation gap.
5. Capture potential intangible asset signals.
6. Capture available documentation / evidence.
7. Capture commercial reason for wanting a stronger valuation.
8. Capture timing / urgency.
9. Capture primary valuation concern.
10. Derive asset signal group.
11. Derive documentation group.
12. Derive event group.
13. Derive pain group.
14. Apply deterministic classification rules.
15. Assign report key.
16. Assign CTA mode.
17. Assign delivery policy.
18. Calculate internal lead score.
19. Send structured payload to CRM / Zapier / Google Script.
```

## 2.3 Why this must not be pure point scoring

Point scoring should not be used as the primary classifier because certain answer combinations create hard business outcomes.

Example:

```text
Fundraising now + strong intangible asset signal + weak documentation = HOT
```

This should remain HOT even if:

```text
Company stage = Bootstrapped / Seed
Employee count = 1 to 10
Current valuation method = I do not know
```

The lead may be a lower-priority HOT lead, but it is still HOT.

Therefore:

```text
Lead temperature = deterministic rule
Lead score = internal priority ranking
```

---

# 3. Required Final Output Schema

Every completed Intangible Value diagnostic should return this object:

```ts
{
  track: "intangible_value",
  event_group:
    | "capital_event"
    | "exit_event"
    | "stakeholder_event"
    | "strategic_review"
    | "curiosity",
  result_code: string,
  lead_temperature: "hot" | "warm" | "warm_low" | "cold",
  lead_temperature_ui: "hot" | "warm" | "cold",
  lead_score: number,
  asset_signal_group:
    | "strong_asset_signal"
    | "moderate_asset_signal"
    | "weak_or_uncertain_asset_signal",
  documentation_group:
    | "strong_evidence"
    | "partial_evidence"
    | "weak_or_missing_evidence",
  pain_group:
    | "strong_pain"
    | "moderate_pain"
    | "low_or_no_pain",
  report_key:
    | "iv_fundraising_guide"
    | "iv_mna_exit_guide"
    | "iv_intangible_asset_discovery_guide"
    | "iv_starter_guide",
  cta_mode:
    | "report_sent_plus_call_link"
    | "report_sent_only"
    | "report_sent_only_no_call",
  delivery_policy:
    | "send_report_immediately_with_hot_call_prompt"
    | "send_report_immediately_report_contains_call_cta"
    | "send_report_only",
  crm_tags: string[],
  answers: Record<string, string | string[]>
}
```

## 3.1 Important note on `warm_low`

`warm_low` is an internal classification only.

For the user interface, `warm_low` should display as:

```text
warm
```

Reason:

```text
A user may not have a near-term commercial event, but may still show enough asset signal or strategic curiosity to justify nurture.
```

Therefore:

```text
lead_temperature = "warm_low"
lead_temperature_ui = "warm"
```

---

# 4. Entry Point

## Q1 — Objective

Question:

```text
What do you want to achieve?
```

Relevant Intangible Value-triggering options:

| Display Option | Canonical Value | Next Step |
|---|---:|---|
| Raising funds | `raising_funds` | Enter Intangible Value Track |
| Selling / Restructuring | `selling_restructuring` | Enter Intangible Value Track |
| Think company is worth more | `think_company_worth_more` | Enter Intangible Value Track |
| Check hidden value | `check_hidden_value` | Enter Intangible Value Track |

If the current product has other tracks, those should be routed separately. This file only defines the Intangible Value track.

---

# 5. Universal Context Questions

These questions are asked to everyone after the entry question.

They do not determine lead temperature directly.

They are used for:

1. CRM enrichment
2. sales-call context
3. internal lead scoring
4. report personalization
5. segmentation analytics

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

# 6. Intangible Value Track Questions

## Q1_IV_VALUATION_METHOD

Question:

```text
How is your company usually valued today?
```

| Display Option | Canonical Value | Signal Use |
|---|---:|---|
| Profit multiple | `profit_multiple` | Indicates reliance on income-statement value only |
| Revenue multiple | `revenue_multiple` | Indicates reliance on growth / scale metric only |
| Asset value | `asset_value` | Indicates likely under-recognition of intangible assets |
| Comparable companies | `comparable_companies` | Indicates benchmark-based valuation risk |
| Investor negotiation | `investor_negotiation` | Indicates narrative-control risk |
| I do not know | `do_not_know` | Indicates education / advisory need |

This question should not determine lead temperature by itself.

It affects:

```text
lead_score
crm_tags
result-page personalization
report personalization
```

## Q2_IV_VALUE_GAP_BELIEF

Question:

```text
Do you feel this valuation method misses important parts of your company?
```

| Display Option | Canonical Value | Gap Belief Group |
|---|---:|---|
| Yes, definitely | `yes_definitely` | `strong_gap_belief` |
| Maybe | `maybe` | `moderate_gap_belief` |
| Not sure | `not_sure` | `moderate_gap_belief` |
| No | `no` | `no_gap_belief` |

Important:

```text
Q2 = No should not automatically make the lead cold.
```

A founder may believe the current valuation is fair but still later select strong intangible assets, a near-term fundraising event, or weak documentation.

## Q3_IV_UNCAPTURED_ASSETS

Question:

```text
What do you think your current valuation does not fully capture?
```

This is a multi-select question.

| Display Option | Canonical Value | Asset Category |
|---|---:|---|
| Brand or reputation | `brand_reputation` | `supporting_asset` |
| Customer relationships | `customer_relationships` | `supporting_asset` |
| Repeat customers or recurring revenue | `recurring_revenue` | `anchor_asset` |
| Long-term contracts | `long_term_contracts` | `anchor_asset` |
| Software, platform, app, or internal technology | `software_platform_internal_tech` | `anchor_asset` |
| Data or customer database | `data_customer_database` | `anchor_asset` |
| IP, trademarks, patents, designs, or know-how | `ip_trademarks_patents_designs_knowhow` | `anchor_asset` |
| Operating systems, processes, or playbooks | `operating_systems_processes_playbooks` | `supporting_asset` |
| Technical team or specialist knowledge | `technical_team_specialist_knowledge` | `supporting_asset` |
| None of the above | `none_of_the_above` | `weak_or_uncertain_asset_signal` |
| I am not sure | `not_sure` | `weak_or_uncertain_asset_signal` |

Validation rule:

```text
none_of_the_above and not_sure should be exclusive selections.
```

If the user selects either of those together with other assets, the system should either prevent the combination in the UI or discard the exclusive option and preserve the selected assets.

## Q4_IV_DOCUMENTATION

Question:

```text
Do you have any documentation, contracts, data, or reports that relate to these assets?
```

| Display Option | Canonical Value | Documentation Group | Score Modifier |
|---|---:|---|---:|
| Yes, clearly | `yes_clearly` | `strong_evidence` | +0 |
| Somewhat | `somewhat` | `partial_evidence` | +4 |
| Not really | `not_really` | `weak_or_missing_evidence` | +8 |
| No | `no` | `weak_or_missing_evidence` | +8 |
| I am not sure | `not_sure` | `weak_or_missing_evidence` | +8 |

Important:

```text
Weak documentation does not create HOT by itself.
```

It becomes commercially important when paired with:

```text
near-term timing
external event
strong asset signal
strong pain
```

## Q5_IV_REASON

Question:

```text
Why do you want a stronger valuation?
```

| Display Option | Canonical Value | Event Group | Report Bias |
|---|---:|---|---|
| We are raising funds | `raising_funds` | `capital_event` | `iv_fundraising_guide` |
| We may sell the company | `may_sell_company` | `exit_event` | `iv_mna_exit_guide` |
| We are bringing in investors or shareholders | `bringing_investors_shareholders` | `capital_event` | `iv_fundraising_guide` |
| We are planning succession or restructuring | `succession_restructuring` | `exit_event` | `iv_mna_exit_guide` |
| We need to explain our value to the board, bank, auditor, or partners | `board_bank_auditor_partners` | `stakeholder_event` | `iv_intangible_asset_discovery_guide` |
| We want to understand what the company is really worth | `understand_true_worth` | `strategic_review` | Conditional |
| No specific reason. Just curious. | `just_curious` | `curiosity` | Conditional |

## Q6_IV_TIMING

Question:

```text
When might you need to defend your valuation?
```

| Display Option | Canonical Value | Timing Group | Score Modifier |
|---|---:|---|---:|
| Now | `now` | `near_term` | +15 |
| Within 3 months | `within_3_months` | `near_term` | +10 |
| Within 6 months | `within_6_months` | `planned` | +6 |
| Within 12 months | `within_12_months` | `planned` | +3 |
| No clear timeline yet | `no_clear_timeline` | `no_timeline` | +0 |

## Q7_IV_PRIMARY_CONCERN

Question:

```text
What is your biggest concern about your company's valuation?
```

| Display Option | Canonical Value | Pain Group |
|---|---:|---|
| Investors may not understand the true value of the company | `investors_misunderstand` | `strong_pain` |
| Buyers may value us too cheaply | `buyers_value_too_cheaply` | `strong_pain` |
| Our brand, software, data, IP, or customer base is not reflected properly | `assets_not_reflected` | `strong_pain` |
| We do not know how to prove the company is worth more | `cannot_prove_value` | `strong_pain` |
| We are being valued only on profit or revenue | `valued_only_on_profit_or_revenue` | `strong_pain` |
| We are not concerned. Just exploring. | `not_concerned_exploring` | `low_or_no_pain` |

---

# 7. Derived Signal Definitions

The assessment should classify the user using derived groups, not only raw answers.

## 7.1 Asset signal group

### Strong Asset Signal

Condition:

```text
Q3_IV_UNCAPTURED_ASSETS includes at least one anchor asset
OR
Q3_IV_UNCAPTURED_ASSETS includes at least 3 supporting assets
```

Anchor assets:

```text
recurring_revenue
long_term_contracts
software_platform_internal_tech
data_customer_database
ip_trademarks_patents_designs_knowhow
```

Supporting assets:

```text
brand_reputation
customer_relationships
operating_systems_processes_playbooks
technical_team_specialist_knowledge
```

Output:

```text
asset_signal_group = strong_asset_signal
```

Reason:

These are either directly documentable intangible assets or a combination of multiple softer value drivers that may justify a formal Intangible Value review.

### Moderate Asset Signal

Condition:

```text
Q3_IV_UNCAPTURED_ASSETS includes 1 or 2 supporting assets only
AND does not include any anchor asset
```

Output:

```text
asset_signal_group = moderate_asset_signal
```

Reason:

The user may have an Intangible Value story, but it is not yet specific enough to create a hard commercial trigger.

### Weak or Uncertain Asset Signal

Condition:

```text
Q3_IV_UNCAPTURED_ASSETS = none_of_the_above
OR
Q3_IV_UNCAPTURED_ASSETS = not_sure
OR
Q3_IV_UNCAPTURED_ASSETS is missing
```

Output:

```text
asset_signal_group = weak_or_uncertain_asset_signal
```

Reason:

The user has not yet identified a clear intangible asset category.

## 7.2 Documentation group

| Q4 Answer | Documentation Group |
|---|---|
| `yes_clearly` | `strong_evidence` |
| `somewhat` | `partial_evidence` |
| `not_really` | `weak_or_missing_evidence` |
| `no` | `weak_or_missing_evidence` |
| `not_sure` | `weak_or_missing_evidence` |

## 7.3 Pain group

### Strong Pain

Condition:

```text
Q2_IV_VALUE_GAP_BELIEF = yes_definitely
OR
Q7_IV_PRIMARY_CONCERN IN [
  investors_misunderstand,
  buyers_value_too_cheaply,
  assets_not_reflected,
  cannot_prove_value,
  valued_only_on_profit_or_revenue
]
```

Output:

```text
pain_group = strong_pain
```

### Moderate Pain

Condition:

```text
Q2_IV_VALUE_GAP_BELIEF IN [maybe, not_sure]
AND
Q7_IV_PRIMARY_CONCERN = not_concerned_exploring
```

Output:

```text
pain_group = moderate_pain
```

### Low or No Pain

Condition:

```text
Q2_IV_VALUE_GAP_BELIEF = no
AND
Q7_IV_PRIMARY_CONCERN = not_concerned_exploring
```

Output:

```text
pain_group = low_or_no_pain
```

## 7.4 Value gap test

Use this internal helper:

```ts
strongValueGap =
  asset_signal_group === "strong_asset_signal" ||
  pain_group === "strong_pain" ||
  (
    documentation_group === "weak_or_missing_evidence" &&
    asset_signal_group !== "weak_or_uncertain_asset_signal"
  );
```

Use this weaker helper for nurture classification:

```ts
moderateValueGap =
  asset_signal_group === "moderate_asset_signal" ||
  pain_group === "moderate_pain" ||
  documentation_group === "partial_evidence" ||
  documentation_group === "weak_or_missing_evidence";
```

---

# 8. Event Groups

Event group is based on `Q5_IV_REASON`.

| Q5 Answer | Event Group |
|---|---|
| `raising_funds` | `capital_event` |
| `bringing_investors_shareholders` | `capital_event` |
| `may_sell_company` | `exit_event` |
| `succession_restructuring` | `exit_event` |
| `board_bank_auditor_partners` | `stakeholder_event` |
| `understand_true_worth` | `strategic_review` |
| `just_curious` | `curiosity` |

Priority logic:

```text
capital_event and exit_event are highest commercial intent.
stakeholder_event is high intent when near-term and evidence-related.
strategic_review is medium intent unless paired with strong signals.
curiosity is educational unless strong signals or pain appear.
```

---

# 9. Lead Temperature Rules

## 9.1 Capital Event Rules

Applies when:

```text
event_group = capital_event
```

This includes:

```text
raising_funds
bringing_investors_shareholders
```

### IV_CAPITAL_1 — Capital event, near-term, value gap present

Condition:

```text
event_group = capital_event
Q6_IV_TIMING IN [now, within_3_months]
strongValueGap = true
```

Output:

```ts
{
  result_code: "IV_CAPITAL_NEAR_VALUE_GAP_HOT",
  track: "intangible_value",
  event_group: "capital_event",
  lead_temperature: "hot",
  lead_temperature_ui: "hot",
  report_key: "iv_fundraising_guide",
  cta_mode: "report_sent_plus_call_link",
  delivery_policy: "send_report_immediately_with_hot_call_prompt"
}
```

Reason:

The user has a live capital event and a clear reason why their valuation story may be incomplete. This is a near-term advisory opportunity.

### IV_CAPITAL_2 — Capital event, near-term, weak value signal

Condition:

```text
event_group = capital_event
Q6_IV_TIMING IN [now, within_3_months]
strongValueGap = false
```

Output:

```ts
{
  result_code: "IV_CAPITAL_NEAR_WEAK_SIGNAL_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: "iv_fundraising_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

Reason:

There is a capital event, but the user has not yet shown enough asset, pain, or evidence gap to force a hot result.

### IV_CAPITAL_3 — Capital event, planned timing

Condition:

```text
event_group = capital_event
Q6_IV_TIMING IN [within_6_months, within_12_months]
```

Output:

```ts
{
  result_code: "IV_CAPITAL_PLANNED_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: "iv_fundraising_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

Reason:

The event is commercially relevant, but not urgent enough to prompt booking on the result page.

### IV_CAPITAL_4 — Capital event, no timeline, value gap present

Condition:

```text
event_group = capital_event
Q6_IV_TIMING = no_clear_timeline
strongValueGap = true
```

Output:

```ts
{
  result_code: "IV_CAPITAL_NO_TIMELINE_VALUE_GAP_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: "iv_fundraising_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_CAPITAL_5 — Capital event, no timeline, weak value signal

Condition:

```text
event_group = capital_event
Q6_IV_TIMING = no_clear_timeline
strongValueGap = false
```

Output:

```ts
{
  result_code: "IV_CAPITAL_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW",
  lead_temperature: "warm_low",
  lead_temperature_ui: "warm",
  report_key: "iv_fundraising_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

Reason:

The user selected a capital-related reason, so this should not be treated as cold, but there is no timeline and no strong value signal.

---

## 9.2 Exit Event Rules

Applies when:

```text
event_group = exit_event
```

This includes:

```text
may_sell_company
succession_restructuring
```

### IV_EXIT_1 — Exit event, near-term, value gap present

Condition:

```text
event_group = exit_event
Q6_IV_TIMING IN [now, within_3_months]
strongValueGap = true
```

Output:

```ts
{
  result_code: "IV_EXIT_NEAR_VALUE_GAP_HOT",
  lead_temperature: "hot",
  lead_temperature_ui: "hot",
  report_key: "iv_mna_exit_guide",
  cta_mode: "report_sent_plus_call_link",
  delivery_policy: "send_report_immediately_with_hot_call_prompt"
}
```

Reason:

A near-term sale, restructuring, succession, or ownership event creates risk if intangible assets are not documented before valuation discussions begin.

### IV_EXIT_2 — Exit event, near-term, weak value signal

Condition:

```text
event_group = exit_event
Q6_IV_TIMING IN [now, within_3_months]
strongValueGap = false
```

Output:

```ts
{
  result_code: "IV_EXIT_NEAR_WEAK_SIGNAL_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: "iv_mna_exit_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_EXIT_3 — Exit event, planned timing

Condition:

```text
event_group = exit_event
Q6_IV_TIMING IN [within_6_months, within_12_months]
```

Output:

```ts
{
  result_code: "IV_EXIT_PLANNED_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: "iv_mna_exit_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_EXIT_4 — Exit event, no timeline, value gap present

Condition:

```text
event_group = exit_event
Q6_IV_TIMING = no_clear_timeline
strongValueGap = true
```

Output:

```ts
{
  result_code: "IV_EXIT_NO_TIMELINE_VALUE_GAP_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: "iv_mna_exit_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_EXIT_5 — Exit event, no timeline, weak value signal

Condition:

```text
event_group = exit_event
Q6_IV_TIMING = no_clear_timeline
strongValueGap = false
```

Output:

```ts
{
  result_code: "IV_EXIT_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW",
  lead_temperature: "warm_low",
  lead_temperature_ui: "warm",
  report_key: "iv_mna_exit_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

---

## 9.3 Stakeholder Event Rules

Applies when:

```text
event_group = stakeholder_event
```

This includes:

```text
board_bank_auditor_partners
```

### IV_STAKEHOLDER_1 — Stakeholder event, near-term, value gap present

Condition:

```text
event_group = stakeholder_event
Q6_IV_TIMING IN [now, within_3_months]
strongValueGap = true
```

Output:

```ts
{
  result_code: "IV_STAKEHOLDER_NEAR_VALUE_GAP_HOT",
  lead_temperature: "hot",
  lead_temperature_ui: "hot",
  report_key: "iv_intangible_asset_discovery_guide",
  cta_mode: "report_sent_plus_call_link",
  delivery_policy: "send_report_immediately_with_hot_call_prompt"
}
```

Reason:

If a board, bank, auditor, partner, or other stakeholder needs a value explanation soon, weak evidence or unstructured intangible assets create a live commercial risk.

### IV_STAKEHOLDER_2 — Stakeholder event, near-term, weak value signal

Condition:

```text
event_group = stakeholder_event
Q6_IV_TIMING IN [now, within_3_months]
strongValueGap = false
```

Output:

```ts
{
  result_code: "IV_STAKEHOLDER_NEAR_WEAK_SIGNAL_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: "iv_intangible_asset_discovery_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_STAKEHOLDER_3 — Stakeholder event, planned timing, value gap present

Condition:

```text
event_group = stakeholder_event
Q6_IV_TIMING IN [within_6_months, within_12_months]
strongValueGap = true
```

Output:

```ts
{
  result_code: "IV_STAKEHOLDER_PLANNED_VALUE_GAP_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: "iv_intangible_asset_discovery_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_STAKEHOLDER_4 — Stakeholder event, planned timing, weak value signal

Condition:

```text
event_group = stakeholder_event
Q6_IV_TIMING IN [within_6_months, within_12_months]
strongValueGap = false
```

Output:

```ts
{
  result_code: "IV_STAKEHOLDER_PLANNED_WEAK_SIGNAL_WARM_LOW",
  lead_temperature: "warm_low",
  lead_temperature_ui: "warm",
  report_key: "iv_intangible_asset_discovery_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_STAKEHOLDER_5 — Stakeholder event, no timeline, value gap present

Condition:

```text
event_group = stakeholder_event
Q6_IV_TIMING = no_clear_timeline
strongValueGap = true
```

Output:

```ts
{
  result_code: "IV_STAKEHOLDER_NO_TIMELINE_VALUE_GAP_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: "iv_intangible_asset_discovery_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_STAKEHOLDER_6 — Stakeholder event, no timeline, weak value signal

Condition:

```text
event_group = stakeholder_event
Q6_IV_TIMING = no_clear_timeline
strongValueGap = false
```

Output:

```ts
{
  result_code: "IV_STAKEHOLDER_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW",
  lead_temperature: "warm_low",
  lead_temperature_ui: "warm",
  report_key: "iv_intangible_asset_discovery_guide",
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

---

## 9.4 Strategic Review Rules

Applies when:

```text
event_group = strategic_review
```

This includes:

```text
understand_true_worth
```

### IV_STRATEGIC_1 — Strategic review, near-term, value gap present

Condition:

```text
event_group = strategic_review
Q6_IV_TIMING IN [now, within_3_months]
strongValueGap = true
```

Output:

```ts
{
  result_code: "IV_STRATEGIC_NEAR_VALUE_GAP_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: assignReportKey(answers),
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

Reason:

The user has a near-term internal review need, but no clear external stakeholder or transaction trigger.

### IV_STRATEGIC_2 — Strategic review, near-term, weak value signal

Condition:

```text
event_group = strategic_review
Q6_IV_TIMING IN [now, within_3_months]
strongValueGap = false
```

Output:

```ts
{
  result_code: "IV_STRATEGIC_NEAR_WEAK_SIGNAL_WARM_LOW",
  lead_temperature: "warm_low",
  lead_temperature_ui: "warm",
  report_key: assignReportKey(answers),
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_STRATEGIC_3 — Strategic review, planned timing, value review signal

Condition:

```text
event_group = strategic_review
Q6_IV_TIMING IN [within_6_months, within_12_months]
(strongValueGap = true OR moderateValueGap = true)
```

Output:

```ts
{
  result_code: "IV_STRATEGIC_PLANNED_VALUE_REVIEW_WARM",
  lead_temperature: "warm",
  lead_temperature_ui: "warm",
  report_key: assignReportKey(answers),
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_STRATEGIC_4 — Strategic review, no timeline, value gap present

Condition:

```text
event_group = strategic_review
Q6_IV_TIMING = no_clear_timeline
strongValueGap = true
```

Output:

```ts
{
  result_code: "IV_STRATEGIC_NO_TIMELINE_VALUE_GAP_WARM_LOW",
  lead_temperature: "warm_low",
  lead_temperature_ui: "warm",
  report_key: assignReportKey(answers),
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_STRATEGIC_5 — Strategic review, moderate signal only

Condition:

```text
event_group = strategic_review
strongValueGap = false
moderateValueGap = true
```

Output:

```ts
{
  result_code: "IV_STRATEGIC_MODERATE_SIGNAL_WARM_LOW",
  lead_temperature: "warm_low",
  lead_temperature_ui: "warm",
  report_key: assignReportKey(answers),
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_STRATEGIC_6 — Strategic review, weak signal

Condition:

```text
event_group = strategic_review
strongValueGap = false
moderateValueGap = false
```

Output:

```ts
{
  result_code: "IV_STRATEGIC_WEAK_SIGNAL_COLD",
  lead_temperature: "cold",
  lead_temperature_ui: "cold",
  report_key: "iv_starter_guide",
  cta_mode: "report_sent_only_no_call",
  delivery_policy: "send_report_only"
}
```

---

## 9.5 Curiosity Rules

Applies when:

```text
event_group = curiosity
```

This includes:

```text
just_curious
```

### IV_CURIOSITY_1 — Curious user, value signal present

Condition:

```text
event_group = curiosity
strongValueGap = true
```

Output:

```ts
{
  result_code: "IV_CURIOSITY_VALUE_SIGNAL_WARM_LOW",
  lead_temperature: "warm_low",
  lead_temperature_ui: "warm",
  report_key: assignReportKey(answers),
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

Reason:

The user does not have a commercial event, but they have surfaced enough value signal to justify nurture.

### IV_CURIOSITY_2 — Curious user, near-term timing, moderate signal

Condition:

```text
event_group = curiosity
Q6_IV_TIMING IN [now, within_3_months]
strongValueGap = false
moderateValueGap = true
```

Output:

```ts
{
  result_code: "IV_CURIOSITY_NEAR_MODERATE_SIGNAL_WARM_LOW",
  lead_temperature: "warm_low",
  lead_temperature_ui: "warm",
  report_key: assignReportKey(answers),
  cta_mode: "report_sent_only",
  delivery_policy: "send_report_immediately_report_contains_call_cta"
}
```

### IV_CURIOSITY_3 — Curious user, weak signal

Condition:

```text
event_group = curiosity
strongValueGap = false
NOT (Q6_IV_TIMING IN [now, within_3_months] AND moderateValueGap = true)
```

Output:

```ts
{
  result_code: "IV_CURIOSITY_WEAK_SIGNAL_COLD",
  lead_temperature: "cold",
  lead_temperature_ui: "cold",
  report_key: assignReportKey(answers),
  cta_mode: "report_sent_only_no_call",
  delivery_policy: "send_report_only"
}
```

---

# 10. Report Assignment Rules

Report assignment must be separated from lead temperature.

Do not use this rule:

```text
Cold = Starter Guide
```

Use this rule instead:

```text
Commercial reason + asset signal = report
Lead temperature = CTA and delivery policy
```

## 10.1 Report keys

| Report Title | Report Key | Primary Use |
|---|---|---|
| The Fundraising Valuation Guide | `iv_fundraising_guide` | Fundraising, investor entry, shareholder discussions |
| The M&A / Exit Valuation Guide | `iv_mna_exit_guide` | Sale, succession, restructuring, management buyout, ownership transfer |
| The Intangible Asset Discovery Guide | `iv_intangible_asset_discovery_guide` | Asset mapping, stakeholder explanation, documentation gaps, general value review |
| The Intangible Value Starter Guide | `iv_starter_guide` | Low-intent educational users with weak or uncertain asset signals |

## 10.2 Assignment rules

| Condition | Correct Report |
|---|---|
| Q5 = `raising_funds` | `iv_fundraising_guide` |
| Q5 = `bringing_investors_shareholders` | `iv_fundraising_guide` |
| Q5 = `may_sell_company` | `iv_mna_exit_guide` |
| Q5 = `succession_restructuring` | `iv_mna_exit_guide` |
| Q5 = `board_bank_auditor_partners` | `iv_intangible_asset_discovery_guide` |
| Q5 = `understand_true_worth` and asset signal is strong or moderate | `iv_intangible_asset_discovery_guide` |
| Q5 = `understand_true_worth` and strong pain exists | `iv_intangible_asset_discovery_guide` |
| Q5 = `understand_true_worth` and weak signal / no pain | `iv_starter_guide` |
| Q5 = `just_curious` and strong asset signal exists | `iv_intangible_asset_discovery_guide` |
| Q5 = `just_curious` and strong pain exists | `iv_intangible_asset_discovery_guide` |
| Q5 = `just_curious` and weak signal / no pain | `iv_starter_guide` |

## 10.3 Report assignment edge cases

| Scenario | Correct Report | Reason |
|---|---|---|
| Cold lead, but selected fundraising as reason | `iv_fundraising_guide` | The content should match the stated use case even if timing or signal is weak |
| Warm lead, selected sale or succession | `iv_mna_exit_guide` | Sale / succession context determines the document |
| Hot lead, selected board / bank / auditor explanation | `iv_intangible_asset_discovery_guide` | The user needs evidence framing, not a fundraising guide |
| Curious lead, selected strong asset signals | `iv_intangible_asset_discovery_guide` | The user is educational but asset-aware |
| Curious lead, selected no assets and no concern | `iv_starter_guide` | The user needs basic education |
| User selects `none_of_the_above` but Q7 = cannot prove value | `iv_intangible_asset_discovery_guide` | The stated pain creates an evidence-readiness need |

---

# 11. CTA Mapping Rules

CTA is determined by lead temperature.

This is the revised result-page policy.

| Lead Temperature | UI Temperature | CTA Mode | Result Page Primary Message | Result Page Booking Prompt |
|---|---|---|---|---|
| `hot` | Hot | `report_sent_plus_call_link` | Your report has been sent | Strong prompt to book a call by clicking a link |
| `warm` | Warm | `report_sent_only` | Your report has been sent | No booking prompt on result page |
| `warm_low` | Warm | `report_sent_only` | Your report has been sent | No booking prompt on result page |
| `cold` | Cold | `report_sent_only_no_call` | Your report has been sent | No booking prompt |

## 11.1 Hot result-page copy

Use this copy structure:

```text
Your Intangible Value report has been sent.

Based on your answers, this may be a near-term valuation issue rather than a purely educational review. We strongly encourage you to book a short call so we can help you understand what applies to your company.

Click below to book a call.
```

Important:

```text
Do not auto-redirect the user to a booking page.
Show a clickable link or button instead.
```

## 11.2 Warm result-page copy

Use this copy structure:

```text
Your Intangible Value report has been sent.

Review the guide to understand where your intangible assets may sit, what evidence matters, and what to prepare before a valuation conversation.
```

Important:

```text
Do not show a booking CTA on the result page.
The report itself may include a soft prompt to book a call.
```

## 11.3 Cold result-page copy

Use this copy structure:

```text
Your Intangible Value report has been sent.

The guide will help you understand the basics of intangible value and what to look out for as your company grows.
```

Important:

```text
Do not show a booking CTA on the result page.
Do not include a direct call prompt in the cold report unless this is later changed deliberately.
```

---

# 12. Delivery Policy Rules

Delivery policy determines what happens after completion.

| Lead Temperature | Report Assigned? | Report Sent Immediately? | Delivery Policy |
|---|---|---|---|
| Hot | Yes | Yes | `send_report_immediately_with_hot_call_prompt` |
| Warm | Yes | Yes | `send_report_immediately_report_contains_call_cta` |
| Warm Low | Yes | Yes | `send_report_immediately_report_contains_call_cta` |
| Cold | Yes | Yes | `send_report_only` |

## 12.1 Why HOT still sends the report immediately

The updated rule is report-first for everyone.

Hot leads should still receive the assigned report immediately because:

1. the user was promised a report
2. the report reinforces credibility before the call
3. CRM still needs to store the content category
4. sales can use the assigned report as a follow-up anchor
5. the booking CTA should be an encouragement, not a gate

---

# 13. Internal Lead Scoring

Lead scoring ranks leads inside each temperature bucket.

It should not determine the primary classification.

## 13.1 Base score

| Lead Temperature | Base Score |
|---|---:|
| Hot | 70 |
| Warm | 40 |
| Warm Low | 30 |
| Cold | 10 |

## 13.2 Company stage modifier

| Company Stage | Modifier |
|---|---:|
| Bootstrapped / Seed | +5 |
| Series A or B | +10 |
| Growth / Scale-up | +15 |
| Mature / Profitable SME | +10 |

## 13.3 Employee count modifier

| Employee Count | Modifier |
|---|---:|
| 1 to 10 | +2 |
| 11 to 50 | +8 |
| 51 to 200 | +15 |
| More than 200 | +20 |

## 13.4 Timing modifier

| Timing | Modifier |
|---|---:|
| Now | +15 |
| Within 3 months | +10 |
| Within 6 months | +6 |
| Within 12 months | +3 |
| No clear timeline yet | +0 |

## 13.5 Event modifier

| Event Group | Modifier |
|---|---:|
| Capital event | +15 |
| Exit event | +15 |
| Stakeholder event | +10 |
| Strategic review | +5 |
| Curiosity | +0 |

## 13.6 Asset signal modifier

| Asset Signal Group | Modifier |
|---|---:|
| Strong asset signal | +15 |
| Moderate asset signal | +7 |
| Weak or uncertain asset signal | +0 |

## 13.7 Documentation modifier

| Documentation Group | Modifier |
|---|---:|
| Strong evidence | +0 |
| Partial evidence | +4 |
| Weak or missing evidence | +8 |

## 13.8 Pain modifier

| Pain Group | Modifier |
|---|---:|
| Strong pain | +10 |
| Moderate pain | +5 |
| Low or no pain | +0 |

## 13.9 Valuation method modifier

| Valuation Method | Modifier |
|---|---:|
| Profit multiple | +3 |
| Revenue multiple | +3 |
| Asset value | +4 |
| Comparable companies | +2 |
| Investor negotiation | +5 |
| I do not know | +5 |

## 13.10 Lead score formula

```ts
lead_score = Math.min(
  100,
  baseScore
  + stageModifier
  + employeeModifier
  + timingModifier
  + eventModifier
  + assetSignalModifier
  + documentationModifier
  + painModifier
  + valuationMethodModifier
)
```

## 13.11 Score examples

### Example 1 — Strong HOT

```text
Raising funds
Timing = Now
Strong asset signal = Long-term contracts
Documentation = Not really
Pain = Investors may not understand value
Company stage = Growth / Scale-up
Employees = 51 to 200
```

Calculation:

```text
70 + 15 + 15 + 15 + 15 + 15 + 8 + 10 = 163, capped at 100
```

Output:

```text
lead_temperature = hot
lead_score = 100
```

### Example 2 — Lower-priority HOT

```text
Raising funds
Timing = Within 3 months
Strong asset signal = Recurring revenue
Documentation = Yes, clearly
Pain = Not concerned
Company stage = Bootstrapped / Seed
Employees = 1 to 10
```

Calculation:

```text
70 + 5 + 2 + 10 + 15 + 15 = 117, capped at 100
```

Output:

```text
lead_temperature = hot
lead_score = 100
```

This is still hot because the deterministic condition is capital event + near-term + strong asset signal.

### Example 3 — Warm lead

```text
Selling in 6 months
Moderate asset signal = Brand and customer relationships only
Documentation = Somewhat
Pain = Buyers may value us too cheaply
```

Output:

```text
lead_temperature = warm
report_key = iv_mna_exit_guide
```

### Example 4 — Warm Low lead

```text
Raising funds
No clear timeline
Weak asset signal
No pain
```

Output:

```text
lead_temperature = warm_low
lead_temperature_ui = warm
report_key = iv_fundraising_guide
```

### Example 5 — True Cold lead

```text
Just curious
No clear timeline
No assets selected
No valuation concern
No documentation gap that matters
```

Output:

```text
lead_temperature = cold
report_key = iv_starter_guide
```

---

# 14. Exhaustive Coverage

## 14.1 Raw answer state count

The full raw answer space is large because `Q3_IV_UNCAPTURED_ASSETS` is multi-select.

Valid Q3 states:

| Q3 State Type | Count |
|---|---:|
| Strong asset signal states | 501 |
| Moderate asset signal states | 10 |
| Weak or uncertain states | 2 |
| Total valid Q3 states | 513 |

Explanation:

```text
There are 9 actual asset options.
There are 2 exclusive non-asset options: none_of_the_above and not_sure.
Valid actual asset combinations = 2^9 - 1 = 511.
Weak / uncertain exclusive states = 2.
Total valid Q3 states = 513.
```

Total raw response states:

| Question | Option Count |
|---|---:|
| Q1 valuation method | 6 |
| Q2 value gap belief | 4 |
| Q3 asset selection states | 513 |
| Q4 documentation | 5 |
| Q5 reason | 7 |
| Q6 timing | 5 |
| Q7 concern | 6 |
| Total raw answer combinations | 12,927,600 |

Formula:

```text
6 x 4 x 513 x 5 x 7 x 5 x 6 = 12,927,600
```

All 12,927,600 valid raw response combinations are covered by the deterministic rules in this file.

## 14.2 Logical state count after signal grouping

For implementation, Q3 should be collapsed into three asset signal groups before classification.

| Derived Input | Group Count |
|---|---:|
| Q1 valuation method | 6 |
| Q2 value gap belief | 4 |
| Q3 asset signal group | 3 |
| Q4 documentation group | 5 |
| Q5 event group / reason | 7 |
| Q6 timing group | 5 |
| Q7 pain signal | 6 |
| Total logical combinations | 75,600 |

Formula:

```text
6 x 4 x 3 x 5 x 7 x 5 x 6 = 75,600
```

## 14.3 Logical outcome coverage

| Lead Temperature | Logical Combination Count |
|---|---:|
| Hot | 20,340 |
| Warm | 41,154 |
| Warm Low | 13,698 |
| Cold | 408 |
| Total | 75,600 |

## 14.4 Raw outcome coverage

When expanded back to the full multi-select answer space:

| Lead Temperature | Raw Combination Count |
|---|---:|
| Hot | 3,688,200 |
| Warm | 7,018,356 |
| Warm Low | 2,219,364 |
| Cold | 1,680 |
| Total | 12,927,600 |

## 14.5 Branch-level coverage by event group

### Logical combinations

| Event Group | Hot | Warm | Warm Low | Cold | Total |
|---|---:|---:|---:|---:|---:|
| Capital Event | 8,136 | 13,212 | 252 | 0 | 21,600 |
| Exit Event | 8,136 | 13,212 | 252 | 0 | 21,600 |
| Stakeholder Event | 4,068 | 6,354 | 378 | 0 | 10,800 |
| Strategic Review | 0 | 8,376 | 2,406 | 18 | 10,800 |
| Curiosity | 0 | 0 | 10,410 | 390 | 10,800 |
| Total | 20,340 | 41,154 | 13,698 | 408 | 75,600 |

### Raw combinations

| Event Group | Hot | Warm | Warm Low | Cold | Total |
|---|---:|---:|---:|---:|---:|
| Capital Event | 1,475,280 | 2,217,240 | 1,080 | 0 | 3,693,600 |
| Exit Event | 1,475,280 | 2,217,240 | 1,080 | 0 | 3,693,600 |
| Stakeholder Event | 737,640 | 1,107,540 | 1,620 | 0 | 1,846,800 |
| Strategic Review | 0 | 1,476,336 | 370,428 | 36 | 1,846,800 |
| Curiosity | 0 | 0 | 1,845,156 | 1,644 | 1,846,800 |
| Total | 3,688,200 | 7,018,356 | 2,219,364 | 1,680 | 12,927,600 |

---

# 15. Aggregated Outcome Matrix

## 15.1 Capital event matrix

| Timing | Value Gap | Lead | Report | Result Page | Delivery |
|---|---|---|---|---|---|
| Now / 3 months | Strong | Hot | Fundraising Guide | Report sent + call link | Send immediately |
| Now / 3 months | Weak | Warm | Fundraising Guide | Report sent only | Send immediately; call prompt in report |
| 6 / 12 months | Any | Warm | Fundraising Guide | Report sent only | Send immediately; call prompt in report |
| No timeline | Strong | Warm | Fundraising Guide | Report sent only | Send immediately; call prompt in report |
| No timeline | Weak | Warm Low | Fundraising Guide | Report sent only | Send immediately; call prompt in report |

## 15.2 Exit event matrix

| Timing | Value Gap | Lead | Report | Result Page | Delivery |
|---|---|---|---|---|---|
| Now / 3 months | Strong | Hot | M&A / Exit Guide | Report sent + call link | Send immediately |
| Now / 3 months | Weak | Warm | M&A / Exit Guide | Report sent only | Send immediately; call prompt in report |
| 6 / 12 months | Any | Warm | M&A / Exit Guide | Report sent only | Send immediately; call prompt in report |
| No timeline | Strong | Warm | M&A / Exit Guide | Report sent only | Send immediately; call prompt in report |
| No timeline | Weak | Warm Low | M&A / Exit Guide | Report sent only | Send immediately; call prompt in report |

## 15.3 Stakeholder event matrix

| Timing | Value Gap | Lead | Report | Result Page | Delivery |
|---|---|---|---|---|---|
| Now / 3 months | Strong | Hot | Intangible Asset Discovery Guide | Report sent + call link | Send immediately |
| Now / 3 months | Weak | Warm | Intangible Asset Discovery Guide | Report sent only | Send immediately; call prompt in report |
| 6 / 12 months | Strong | Warm | Intangible Asset Discovery Guide | Report sent only | Send immediately; call prompt in report |
| 6 / 12 months | Weak | Warm Low | Intangible Asset Discovery Guide | Report sent only | Send immediately; call prompt in report |
| No timeline | Strong | Warm | Intangible Asset Discovery Guide | Report sent only | Send immediately; call prompt in report |
| No timeline | Weak | Warm Low | Intangible Asset Discovery Guide | Report sent only | Send immediately; call prompt in report |

## 15.4 Strategic review matrix

| Timing | Value Signal | Lead | Report | Result Page | Delivery |
|---|---|---|---|---|---|
| Now / 3 months | Strong | Warm | Discovery or Starter by signal | Report sent only | Send immediately; call prompt in report |
| Now / 3 months | Weak | Warm Low | Discovery or Starter by signal | Report sent only | Send immediately; call prompt in report |
| 6 / 12 months | Strong or moderate | Warm | Discovery or Starter by signal | Report sent only | Send immediately; call prompt in report |
| No timeline | Strong | Warm Low | Discovery or Starter by signal | Report sent only | Send immediately; call prompt in report |
| Any | Weak and no pain | Cold | Starter Guide | Report sent only | Send only |

## 15.5 Curiosity matrix

| Timing | Value Signal | Lead | Report | Result Page | Delivery |
|---|---|---|---|---|---|
| Any | Strong | Warm Low | Discovery Guide | Report sent only | Send immediately; call prompt in report |
| Now / 3 months | Moderate | Warm Low | Discovery or Starter by signal | Report sent only | Send immediately; call prompt in report |
| Any | Weak | Cold | Starter Guide | Report sent only | Send only |

---

# 16. Full Logic Pseudocode

## 16.1 Main function

```ts
function calculateIntangibleValueResult(answers) {
  const track = "intangible_value";

  const assetSignalGroup = deriveAssetSignalGroup(answers.q3_iv_uncaptured_assets);
  const documentationGroup = deriveDocumentationGroup(answers.q4_iv_documentation);
  const painGroup = derivePainGroup(answers.q2_iv_value_gap_belief, answers.q7_iv_primary_concern);
  const eventGroup = deriveEventGroup(answers.q5_iv_reason);

  const strongValueGap = hasStrongValueGap(assetSignalGroup, documentationGroup, painGroup);
  const moderateValueGap = hasModerateValueGap(assetSignalGroup, documentationGroup, painGroup);

  const { leadTemperature, resultCode } = classifyIntangibleValue({
    eventGroup,
    timing: answers.q6_iv_timing,
    strongValueGap,
    moderateValueGap
  });

  const reportKey = assignReportKey(answers, assetSignalGroup, painGroup);
  const ctaMode = assignCtaMode(leadTemperature);
  const deliveryPolicy = assignDeliveryPolicy(leadTemperature);
  const leadScore = calculateLeadScore({
    leadTemperature,
    answers,
    eventGroup,
    assetSignalGroup,
    documentationGroup,
    painGroup
  });

  const crmTags = buildCrmTags({
    track,
    eventGroup,
    resultCode,
    leadTemperature,
    reportKey,
    assetSignalGroup,
    documentationGroup,
    painGroup,
    answers
  });

  return {
    track,
    event_group: eventGroup,
    result_code: resultCode,
    lead_temperature: leadTemperature,
    lead_temperature_ui: leadTemperature === "warm_low" ? "warm" : leadTemperature,
    lead_score: leadScore,
    asset_signal_group: assetSignalGroup,
    documentation_group: documentationGroup,
    pain_group: painGroup,
    report_key: reportKey,
    cta_mode: ctaMode,
    delivery_policy: deliveryPolicy,
    crm_tags: crmTags,
    answers
  };
}
```

## 16.2 Asset signal function

```ts
function deriveAssetSignalGroup(selectedAssets = []) {
  const anchorAssets = [
    "recurring_revenue",
    "long_term_contracts",
    "software_platform_internal_tech",
    "data_customer_database",
    "ip_trademarks_patents_designs_knowhow"
  ];

  const supportingAssets = [
    "brand_reputation",
    "customer_relationships",
    "operating_systems_processes_playbooks",
    "technical_team_specialist_knowledge"
  ];

  if (!Array.isArray(selectedAssets) || selectedAssets.length === 0) {
    return "weak_or_uncertain_asset_signal";
  }

  if (
    selectedAssets.includes("none_of_the_above") ||
    selectedAssets.includes("not_sure")
  ) {
    const realAssets = selectedAssets.filter(
      asset => asset !== "none_of_the_above" && asset !== "not_sure"
    );

    if (realAssets.length === 0) {
      return "weak_or_uncertain_asset_signal";
    }

    selectedAssets = realAssets;
  }

  const hasAnchorAsset = selectedAssets.some(asset => anchorAssets.includes(asset));

  if (hasAnchorAsset) {
    return "strong_asset_signal";
  }

  const supportingCount = selectedAssets.filter(asset => supportingAssets.includes(asset)).length;

  if (supportingCount >= 3) {
    return "strong_asset_signal";
  }

  if (supportingCount >= 1) {
    return "moderate_asset_signal";
  }

  return "weak_or_uncertain_asset_signal";
}
```

## 16.3 Documentation function

```ts
function deriveDocumentationGroup(q4Documentation) {
  switch (q4Documentation) {
    case "yes_clearly":
      return "strong_evidence";
    case "somewhat":
      return "partial_evidence";
    case "not_really":
    case "no":
    case "not_sure":
    default:
      return "weak_or_missing_evidence";
  }
}
```

## 16.4 Pain function

```ts
function derivePainGroup(q2ValueGapBelief, q7PrimaryConcern) {
  const strongConcern = [
    "investors_misunderstand",
    "buyers_value_too_cheaply",
    "assets_not_reflected",
    "cannot_prove_value",
    "valued_only_on_profit_or_revenue"
  ].includes(q7PrimaryConcern);

  if (q2ValueGapBelief === "yes_definitely" || strongConcern) {
    return "strong_pain";
  }

  if (["maybe", "not_sure"].includes(q2ValueGapBelief)) {
    return "moderate_pain";
  }

  return "low_or_no_pain";
}
```

## 16.5 Event group function

```ts
function deriveEventGroup(q5Reason) {
  switch (q5Reason) {
    case "raising_funds":
    case "bringing_investors_shareholders":
      return "capital_event";

    case "may_sell_company":
    case "succession_restructuring":
      return "exit_event";

    case "board_bank_auditor_partners":
      return "stakeholder_event";

    case "understand_true_worth":
      return "strategic_review";

    case "just_curious":
    default:
      return "curiosity";
  }
}
```

## 16.6 Value gap helper functions

```ts
function hasStrongValueGap(assetSignalGroup, documentationGroup, painGroup) {
  return (
    assetSignalGroup === "strong_asset_signal" ||
    painGroup === "strong_pain" ||
    (
      documentationGroup === "weak_or_missing_evidence" &&
      assetSignalGroup !== "weak_or_uncertain_asset_signal"
    )
  );
}

function hasModerateValueGap(assetSignalGroup, documentationGroup, painGroup) {
  return (
    assetSignalGroup === "moderate_asset_signal" ||
    painGroup === "moderate_pain" ||
    documentationGroup === "partial_evidence" ||
    documentationGroup === "weak_or_missing_evidence"
  );
}
```

## 16.7 Classifier

```ts
function classifyIntangibleValue({ eventGroup, timing, strongValueGap, moderateValueGap }) {
  const nearTerm = ["now", "within_3_months"].includes(timing);
  const planned = ["within_6_months", "within_12_months"].includes(timing);
  const noTimeline = timing === "no_clear_timeline";

  if (eventGroup === "capital_event") {
    if (nearTerm && strongValueGap) {
      return { leadTemperature: "hot", resultCode: "IV_CAPITAL_NEAR_VALUE_GAP_HOT" };
    }
    if (nearTerm) {
      return { leadTemperature: "warm", resultCode: "IV_CAPITAL_NEAR_WEAK_SIGNAL_WARM" };
    }
    if (planned) {
      return { leadTemperature: "warm", resultCode: "IV_CAPITAL_PLANNED_WARM" };
    }
    if (noTimeline && strongValueGap) {
      return { leadTemperature: "warm", resultCode: "IV_CAPITAL_NO_TIMELINE_VALUE_GAP_WARM" };
    }
    return { leadTemperature: "warm_low", resultCode: "IV_CAPITAL_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW" };
  }

  if (eventGroup === "exit_event") {
    if (nearTerm && strongValueGap) {
      return { leadTemperature: "hot", resultCode: "IV_EXIT_NEAR_VALUE_GAP_HOT" };
    }
    if (nearTerm) {
      return { leadTemperature: "warm", resultCode: "IV_EXIT_NEAR_WEAK_SIGNAL_WARM" };
    }
    if (planned) {
      return { leadTemperature: "warm", resultCode: "IV_EXIT_PLANNED_WARM" };
    }
    if (noTimeline && strongValueGap) {
      return { leadTemperature: "warm", resultCode: "IV_EXIT_NO_TIMELINE_VALUE_GAP_WARM" };
    }
    return { leadTemperature: "warm_low", resultCode: "IV_EXIT_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW" };
  }

  if (eventGroup === "stakeholder_event") {
    if (nearTerm && strongValueGap) {
      return { leadTemperature: "hot", resultCode: "IV_STAKEHOLDER_NEAR_VALUE_GAP_HOT" };
    }
    if (nearTerm) {
      return { leadTemperature: "warm", resultCode: "IV_STAKEHOLDER_NEAR_WEAK_SIGNAL_WARM" };
    }
    if (planned && strongValueGap) {
      return { leadTemperature: "warm", resultCode: "IV_STAKEHOLDER_PLANNED_VALUE_GAP_WARM" };
    }
    if (planned) {
      return { leadTemperature: "warm_low", resultCode: "IV_STAKEHOLDER_PLANNED_WEAK_SIGNAL_WARM_LOW" };
    }
    if (noTimeline && strongValueGap) {
      return { leadTemperature: "warm", resultCode: "IV_STAKEHOLDER_NO_TIMELINE_VALUE_GAP_WARM" };
    }
    return { leadTemperature: "warm_low", resultCode: "IV_STAKEHOLDER_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW" };
  }

  if (eventGroup === "strategic_review") {
    if (nearTerm && strongValueGap) {
      return { leadTemperature: "warm", resultCode: "IV_STRATEGIC_NEAR_VALUE_GAP_WARM" };
    }
    if (nearTerm) {
      return { leadTemperature: "warm_low", resultCode: "IV_STRATEGIC_NEAR_WEAK_SIGNAL_WARM_LOW" };
    }
    if (planned && (strongValueGap || moderateValueGap)) {
      return { leadTemperature: "warm", resultCode: "IV_STRATEGIC_PLANNED_VALUE_REVIEW_WARM" };
    }
    if (strongValueGap) {
      return { leadTemperature: "warm_low", resultCode: "IV_STRATEGIC_NO_TIMELINE_VALUE_GAP_WARM_LOW" };
    }
    if (moderateValueGap) {
      return { leadTemperature: "warm_low", resultCode: "IV_STRATEGIC_MODERATE_SIGNAL_WARM_LOW" };
    }
    return { leadTemperature: "cold", resultCode: "IV_STRATEGIC_WEAK_SIGNAL_COLD" };
  }

  if (eventGroup === "curiosity") {
    if (strongValueGap) {
      return { leadTemperature: "warm_low", resultCode: "IV_CURIOSITY_VALUE_SIGNAL_WARM_LOW" };
    }
    if (nearTerm && moderateValueGap) {
      return { leadTemperature: "warm_low", resultCode: "IV_CURIOSITY_NEAR_MODERATE_SIGNAL_WARM_LOW" };
    }
    return { leadTemperature: "cold", resultCode: "IV_CURIOSITY_WEAK_SIGNAL_COLD" };
  }

  return { leadTemperature: "cold", resultCode: "IV_FALLBACK_UNCLEAR_COLD" };
}
```

## 16.8 Report assignment function

```ts
function assignReportKey(answers, assetSignalGroup, painGroup) {
  switch (answers.q5_iv_reason) {
    case "raising_funds":
    case "bringing_investors_shareholders":
      return "iv_fundraising_guide";

    case "may_sell_company":
    case "succession_restructuring":
      return "iv_mna_exit_guide";

    case "board_bank_auditor_partners":
      return "iv_intangible_asset_discovery_guide";

    case "understand_true_worth":
      if (
        assetSignalGroup === "strong_asset_signal" ||
        assetSignalGroup === "moderate_asset_signal" ||
        painGroup === "strong_pain"
      ) {
        return "iv_intangible_asset_discovery_guide";
      }
      return "iv_starter_guide";

    case "just_curious":
    default:
      if (
        assetSignalGroup === "strong_asset_signal" ||
        painGroup === "strong_pain"
      ) {
        return "iv_intangible_asset_discovery_guide";
      }
      return "iv_starter_guide";
  }
}
```

## 16.9 CTA function

```ts
function assignCtaMode(leadTemperature) {
  if (leadTemperature === "hot") {
    return "report_sent_plus_call_link";
  }

  if (["warm", "warm_low"].includes(leadTemperature)) {
    return "report_sent_only";
  }

  return "report_sent_only_no_call";
}
```

## 16.10 Delivery function

```ts
function assignDeliveryPolicy(leadTemperature) {
  if (leadTemperature === "hot") {
    return "send_report_immediately_with_hot_call_prompt";
  }

  if (["warm", "warm_low"].includes(leadTemperature)) {
    return "send_report_immediately_report_contains_call_cta";
  }

  return "send_report_only";
}
```

---

# 17. CRM Tags

Build tags from the final result object.

## 17.1 Track tag

```text
track_intangible_value
```

## 17.2 Event group tags

```text
event_capital
event_exit
event_stakeholder
event_strategic_review
event_curiosity
```

## 17.3 Temperature tags

```text
lead_hot
lead_warm
lead_warm_low
lead_cold
```

## 17.4 Report tags

```text
report_iv_fundraising_guide
report_iv_mna_exit_guide
report_iv_intangible_asset_discovery_guide
report_iv_starter_guide
```

## 17.5 CTA tags

```text
cta_report_sent_plus_call_link
cta_report_sent_only
cta_report_sent_only_no_call
```

## 17.6 Signal tags

```text
asset_signal_strong
asset_signal_moderate
asset_signal_weak_or_uncertain
documentation_strong
documentation_partial
documentation_weak_or_missing
pain_strong
pain_moderate
pain_low_or_none
```

## 17.7 Trigger tags

```text
trigger_near_term_timing
trigger_planned_timing
trigger_no_timeline
trigger_capital_event
trigger_exit_event
trigger_stakeholder_event
trigger_strong_asset_signal
trigger_documentation_gap
trigger_strong_pain
trigger_unknown_valuation_method
trigger_investor_negotiation_valuation
```

---

# 18. Zapier / Google Script Payload

Send the following structured payload after completion:

```json
{
  "email": "{{user_email}}",
  "name": "{{user_name}}",
  "company": "{{company_name}}",
  "referral_code": "{{referral_code}}",
  "track": "intangible_value",
  "event_group": "capital_event",
  "result_code": "IV_CAPITAL_NEAR_VALUE_GAP_HOT",
  "lead_temperature": "hot",
  "lead_temperature_ui": "hot",
  "lead_score": 96,
  "asset_signal_group": "strong_asset_signal",
  "documentation_group": "weak_or_missing_evidence",
  "pain_group": "strong_pain",
  "report_key": "iv_fundraising_guide",
  "cta_mode": "report_sent_plus_call_link",
  "delivery_policy": "send_report_immediately_with_hot_call_prompt",
  "crm_tags": [
    "track_intangible_value",
    "event_capital",
    "lead_hot",
    "report_iv_fundraising_guide",
    "cta_report_sent_plus_call_link",
    "trigger_near_term_timing",
    "trigger_strong_asset_signal",
    "trigger_documentation_gap",
    "trigger_strong_pain"
  ],
  "answers": {
    "q_context_stage": "growth_scaleup",
    "q_context_employees": "51_200",
    "q1_iv_valuation_method": "profit_multiple",
    "q2_iv_value_gap_belief": "yes_definitely",
    "q3_iv_uncaptured_assets": [
      "recurring_revenue",
      "long_term_contracts"
    ],
    "q4_iv_documentation": "not_really",
    "q5_iv_reason": "raising_funds",
    "q6_iv_timing": "within_3_months",
    "q7_iv_primary_concern": "investors_misunderstand"
  }
}
```

---

# 19. Automation Rules

## 19.1 Hot automation

Condition:

```text
lead_temperature = hot
```

Action:

```text
1. Send assigned PDF immediately.
2. Show result page confirming the report has been sent.
3. Show strong call prompt with clickable booking link.
4. Do not auto-redirect to the booking page.
5. Add to CRM as hot.
6. Send internal notification to sales.
7. Add to short-cycle follow-up sequence.
```

## 19.2 Warm automation

Condition:

```text
lead_temperature = warm OR warm_low
```

Action:

```text
1. Send assigned PDF immediately.
2. Show report-sent result page.
3. Do not show booking CTA on the result page.
4. Include soft call prompt inside the PDF report.
5. Add to nurture sequence.
6. If lead_score >= 75, notify sales for manual follow-up.
```

## 19.3 Cold automation

Condition:

```text
lead_temperature = cold
```

Action:

```text
1. Send assigned PDF immediately.
2. Show report-sent result page.
3. Do not show booking CTA on the result page.
4. Do not include a direct call prompt in the cold report unless deliberately changed later.
5. Add to long-term education sequence.
6. Do not notify sales unless manually reviewed.
```

---

# 20. Edge Case Handling

## 20.1 Missing answer fallback

| Missing Field | Fallback |
|---|---|
| Q1 valuation method | `do_not_know` |
| Q2 value gap belief | `not_sure` |
| Q3 uncaptured assets | `not_sure` |
| Q4 documentation | `not_sure` |
| Q5 reason | `just_curious` |
| Q6 timing | `no_clear_timeline` |
| Q7 primary concern | `not_concerned_exploring` |

Principle:

```text
Missing answers should not create hot leads unless the event, timing, and value-gap conditions are clearly satisfied.
```

## 20.2 User selects no assets but has strong pain

Classification:

```text
Depends on Q5 and Q6.
```

Report:

```text
Use event-based report.
If curiosity / strategic review, use iv_intangible_asset_discovery_guide.
```

Reason:

A founder may not know how to identify intangible assets, but the concern itself may indicate a value-story problem.

## 20.3 User selects strong assets but has no documentation

Classification:

```text
Escalates when there is a near-term capital, exit, or stakeholder event.
```

Reason:

This is a classic Intangible Value advisory opportunity: value exists, but evidence is not ready.

## 20.4 User selects fundraising but no clear timeline

Classification:

```text
Warm if value gap exists.
Warm Low if value signal is weak.
```

Report:

```text
iv_fundraising_guide
```

Reason:

The commercial reason matters even if urgency is not yet confirmed.

## 20.5 User selects just curious but has recurring revenue, IP, or software

Classification:

```text
Warm Low
```

Report:

```text
iv_intangible_asset_discovery_guide
```

Reason:

There is no commercial event, but the asset signal is strong enough to educate and nurture.

## 20.6 User selects just curious, no assets, no pain, no timeline

Classification:

```text
Cold
```

Report:

```text
iv_starter_guide
```

Reason:

This is educational demand only.

## 20.7 User selects board / bank / auditor but no timeline

Classification:

```text
Warm if value gap exists.
Warm Low if value signal is weak.
```

Report:

```text
iv_intangible_asset_discovery_guide
```

Reason:

Stakeholder explanation is still a real use case, but urgency depends on timing and evidence gap.

## 20.8 User selects asset value as current valuation method

Classification:

```text
Do not classify as hot by itself.
```

Reason:

Asset-based valuation may miss intangible assets, but it only becomes commercially urgent when paired with an event, timing, asset signal, documentation gap, or pain.

---

# 21. QA Checklist for Implementation

Use this checklist before deploying the Intangible Value flow:

```text
[ ] All old track names and old abbreviations have been removed from code and copy.
[ ] All canonical values use q*_iv_* naming.
[ ] Q3 multi-select prevents none_of_the_above or not_sure from being selected with real assets.
[ ] Asset signal group is derived before lead classification.
[ ] Documentation group is derived before lead classification.
[ ] Pain group is derived before lead classification.
[ ] Event group is derived before lead classification.
[ ] Lead temperature is deterministic, not score-based.
[ ] Report assignment is not based only on lead temperature.
[ ] Hot leads receive the report immediately.
[ ] Hot result page shows a booking link but does not auto-redirect.
[ ] Warm result page does not show a booking CTA.
[ ] Warm report includes a soft booking prompt.
[ ] Cold result page does not show a booking CTA.
[ ] Cold report does not include a direct booking prompt unless deliberately changed later.
[ ] warm_low is stored internally but displayed as warm in the UI.
[ ] CRM payload stores raw answers and derived groups.
[ ] Internal sales notification only triggers for hot leads and high-score warm leads.
[ ] All report keys use iv_ prefixes.
[ ] All CRM tags use track_intangible_value and report_iv_* naming.
```

---

# 22. Implementation Notes and Judgment Calls

These are the assumptions applied in this revised mapping:

1. `data_customer_database` is treated as an anchor asset because structured customer data can be a material intangible asset if it is usable, maintained, and commercially relevant.
2. `board_bank_auditor_partners` is treated as a stakeholder event. It can become hot if the timing is near-term and a value gap exists.
3. Strategic review and curiosity do not become hot by themselves. They can become warm or warm low depending on asset signal, pain, and documentation gap.
4. The existing four-report structure is retained, but renamed under the Intangible Value convention.
5. Every lead receives the report immediately, including hot leads.
6. Booking is no longer a gate. It is only a result-page prompt for hot leads and an in-report prompt for warm leads.
