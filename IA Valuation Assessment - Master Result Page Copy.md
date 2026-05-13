# IA Valuation Assessment - Master Result Page Copy

> **Status:** Master file.
>
> **Companion file:** `IA_Valuation_Decision_Tree_Mapping.md`

## Purpose

This file defines the result page copy for the Bain Squared IA Valuation Assessment. The copy is grouped by commercial meaning. The decision tree classifies each respondent into a `result_code`, which maps to one of 21 result page variants (13 for ESOP, 8 for Intangible Value).

---

# 1. Global Rules

1. Every completed respondent receives a report after a valid business email is submitted.
2. Hot users see a clear confirmation that the report has been sent, plus a strong booking prompt.
3. Hot users must not be automatically redirected to a booking page.
4. Warm and warm_low users receive the report. They must not see a booking CTA on the result page.
5. Cold users receive the report. They must not see a booking CTA on the result page.
6. The report must not be hidden behind a booking action.
7. Tone is conversational, direct, calm, and founder-friendly.
8. Customer-facing copy must not use em dashes as sentence punctuation.
9. Customer-facing copy must not shame or insult the user.
10. The page must not imply that every business needs Bain Squared.

---

# 2. Result Page Variants (ESOP Track)

## 2.1 IA_RP01 - Existing ESOP with missing or uncertain formal valuation (Hot)

### Applies to

```text
ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT
```

### Lead temperature

```text
Internal: hot
User-facing: High fit
```

### Report

```text
ESOP Compliance and Governance Guide
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your ESOP valuation needs to be done.

Badge:
Urgent Review

Intro:
You already have an ESOP in place, but your answers suggest you have not completed a formal third-party valuation, or you cannot easily confirm that one exists.

This is a common but serious gap. When options are issued without a defensible valuation, the company takes on compliance, tax, and governance risks that only surface later during an audit, fundraising round, or sale.

Callout title:
Valuations are harder to fix retroactively.
Callout body:
If auditors, investors, or tax authorities challenge the strike price of your options, an informal or missing valuation offers no protection. It is significantly easier and cheaper to formalise the valuation now than to unwind the tax consequences later.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP Compliance and Governance Guide, then speak with us directly.

Recommended next step body:
We will send the ESOP Compliance and Governance Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.

Form button:
Send my report

After submit:
Your report has been sent. Based on your answers, we strongly recommend booking a short call before your next board meeting, audit, or funding round to discuss how to formalise your valuation.

Booking button:
Book a discovery call
```

### Kickers

```text
audit_kicker
```

### Button behaviour

```text
Show booking button only after the report submission confirmation.
Open booking link in the same tab or a new tab.
Do not auto-redirect.
```

---

## 2.2 IA_RP02 - Existing ESOP with provider dissatisfaction or uncertainty (Hot)

### Applies to

```text
ESOP_A2_PROVIDER_REVIEW_HOT
```

### Lead temperature

```text
Internal: hot
User-facing: High fit
```

### Report

```text
ESOP Compliance and Governance Guide
```

### Invoice review offer

```text
Show.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your ESOP valuation can be done better.

Badge:
Provider Review

Intro:
You already have an ESOP and a formal valuation, but your answers suggest you are not fully satisfied with your current provider, or you have not reviewed them recently.

This is a good time to review the relationship. As your company grows, your valuation needs become more complex. If your provider is slow, expensive, or produces reports that are hard to defend, it creates friction with your board and auditors.

Callout title:
Do not settle for a weak report.
Callout body:
A good ESOP valuation is not just a compliance check box. It should be delivered quickly, priced fairly, and structured so that your board and auditors can rely on it without endless follow-up questions.

Eligibility block title:
Your company is eligible for our invoice review.

Eligibility block body:
Send us your most recent ESOP valuation invoice and get 10% off your next ESOP valuation report with Bain Squared. You do not need to be unhappy with your current provider to use this. The review is also useful for benchmarking price, quality, speed, and defensibility before your next renewal.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP Compliance and Governance Guide, then speak with us directly.

Recommended next step body:
We will send the ESOP Compliance and Governance Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.

Form button:
Send my report

After submit:
Your report has been sent. Based on your answers, we strongly recommend booking a short call to benchmark your current provider before your next valuation refresh.

Booking button:
Book a discovery call
```

### Kickers

```text
audit_kicker
```

### Button behaviour

```text
Show booking button only after the report submission confirmation.
Open booking link in the same tab or a new tab.
Do not auto-redirect.
```

---

## 2.3 IA_RP03 - Existing ESOP with satisfied provider (Warm)

### Applies to

```text
ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM
```

### Lead temperature

```text
Internal: warm
User-facing: Potential fit
```

### Report

```text
ESOP Compliance and Governance Guide
```

### Invoice review offer

```text
Show.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your ESOP process appears ok, but it is still worth comparing.

Badge:
Scheduled Review

Intro:
Your answers suggest that your current ESOP valuation process is not urgent today. That is a good position to be in.

Even so, ESOPs need regular review as grants accumulate, valuations refresh, dilution evolves, and employee communication becomes more complex. Knowing what a more competitive option looks like is useful before the next renewal cycle, especially if your team or board are likely to ask harder questions later.

Callout title:
Good providers should still be reviewed.

Callout body:
A quick review gives you a clearer view of whether the current report quality, pricing, turnaround time, and ESOP-specific support remain competitive. Even when you are happy with your provider, knowing the alternative makes the next renewal an easier decision.

Eligibility block title:
Your company is eligible for our invoice review.

Eligibility block body:
Send us your most recent ESOP valuation invoice and get 10% off your next ESOP valuation report with Bain Squared. You do not need to be unhappy with your current provider to use this. The review is useful for benchmarking price, quality, speed, and defensibility before your next renewal.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP Compliance and Governance Guide.

Recommended next step body:
We will send the ESOP Compliance and Governance Guide to your inbox. Use it to review how modern ESOP valuation providers are improving process clarity, report quality, and commercial usefulness.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and review it before your next ESOP refresh or provider renewal.

Booking button:
No booking button.
```

### Kickers

```text
audit_kicker
```

### Button behaviour

```text
No booking CTA.
If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 2.4 IA_RP04 - Planning ESOP with stakeholder pressure and near-term timing (Hot)

### Applies to

```text
ESOP_B1_PLANNING_PRESSURE_NEAR_HOT
```

### Lead temperature

```text
Internal: hot
User-facing: High fit
```

### Report

```text
Concern-driven (esop_structuring_dilution, esop_communication_legal, or esop_starter)
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
You need to plan ahead for your ESOP plan.

Badge:
Urgent review

Intro:
You are planning an ESOP, and someone is already asking about equity, options, or incentive structure. Your timing also suggests this is no longer a theoretical planning topic.

The decisions you make now will shape dilution, grant size, valuation support, employee expectations, and how the plan is later explained to the board, employees, or investors.

Callout title:
Decisions compound quickly.

Callout body:
Once employees, candidates, investors, or board members start discussing equity, every number becomes an anchor. It is better to set the plan with structure, valuation logic, and communication discipline before expectations harden.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP planning report, then speak with us directly.

Recommended next step body:
We will send the {{report_title}} to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.

Form button:
Send my report

After submit:
Your report has been sent. Based on your timing, we strongly recommend a short call before you finalise the ESOP structure or respond to the people asking about it.

Booking button:
Book a discovery call
```

### Kickers

```text
dilution_kicker
audit_kicker
```

### Button behaviour

```text
Show booking button only after the report submission confirmation.
Open booking link in the same tab or a new tab.
Do not auto-redirect.
```

---

## 2.5 IA_RP05 - Planning ESOP with stakeholder pressure and later or uncertain timing (Warm)

### Applies to

```text
ESOP_B2_PLANNING_PRESSURE_FAR_WARM
```

### Lead temperature

```text
Internal: warm
User-facing: Potential fit
```

### Report

```text
Concern-driven
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
You need to plan ahead for your ESOP plan.

Badge:
Preparation

Intro:
You are planning an ESOP, and equity questions are already starting to appear or are expected soon. The timing may not be immediate, but the topic is now on the company agenda.

This is the right moment to prepare the structure, valuation logic, and employee communication before the process becomes rushed.

Callout title:
Use this time to your advantage

Callout body:
The best ESOP decisions are usually made before the deadline arrives. When there is still time, you can compare structures, think through dilution, prepare valuation support, and avoid reactive commitments.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP readiness report.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to understand the decisions you should prepare before the next investor, board, employee, candidate, or auditor conversation.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and use it to prepare before the pressure becomes more immediate.

Booking button:
No booking button.
```

### Kickers

```text
dilution_kicker
```

### Button behaviour

```text
No booking CTA.
If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 2.6 IA_RP06 - Planning ESOP with no stakeholder pressure (Warm / Warm Low)

### Applies to

```text
ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM
ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW
```

### Lead temperature

```text
Internal: warm or warm_low
User-facing: Potential fit
```

### Report

```text
Concern-driven
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
You are early in the ESOP process.

Badge:
Early Planning

Intro:
Your answers suggest you are exploring ESOP design before external pressure arrives. That is a useful place to start.

At this stage, the goal is not to rush into a valuation or legal process. The goal is to understand what decisions will matter later, especially around allocation, dilution, valuation support, and employee communication.

Callout title:
Design it as early as you can.

Callout body:
Once equity expectations are discussed informally, they become harder to reset. Building the plan early gives you more control over dilution, grant logic, valuation support, and employee communication.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP planning starter report.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to understand what to prepare before the ESOP becomes an active project.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and review it at your own pace.

Booking button:
No booking button.
```

### Kickers

```text
dilution_kicker
```

### Button behaviour

```text
No booking CTA.
If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 2.7 IA_RP07 - No ESOP with stakeholder pressure and near-term timing (Hot)

### Applies to

```text
ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT
```

### Lead temperature

```text
Internal: hot
User-facing: High fit
```

### Report

```text
Concern-driven
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
You may need ESOP support soon.

Badge:
Urgent Review

Intro:
You do not have an ESOP yet, but your answers suggest that investors, employees, auditors, or board members may soon ask questions that require a clearer position.

That means the company needs a clear answer before expectations harden, documents are prepared in a rush, or informal promises become difficult to unwind later.

Callout title:
Do not answer from memory.

Callout body:
When equity questions become active, vague answers can create real issues. The company should know what exists, what has been promised, what needs to be valued, and what can be explained clearly before the next conversation.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP report, then speak with us directly.

Recommended next step body:
We will send the {{report_title}} to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.

Form button:
Send my report

After submit:
Your report has been sent. Based on your answers, we strongly recommend a short call before you respond to the ESOP, equity, or option question in front of you.

Booking button:
Book a discovery call
```

### Kickers

```text
dilution_kicker
audit_kicker
```

### Button behaviour

```text
Show booking button only after the report submission confirmation.
Open booking link in the same tab or a new tab.
Do not auto-redirect.
```

---

## 2.8 IA_RP08 - No ESOP with stakeholder pressure and later or uncertain timing (Warm)

### Applies to

```text
ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM
```

### Lead temperature

```text
Internal: warm
User-facing: Potential fit
```

### Report

```text
Concern-driven
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
You need to plan ahead for your ESOP plan.

Badge:
Preparation

Intro:
You do not have an ESOP today, but your answers suggest the topic is likely to come up soon. Stakeholder questions are not yet acute, but they are forming.

This is a good time to understand the key structuring, valuation, legal, tax, and communication issues before someone asks for a definitive answer.

Callout title:
Prepare soon.

Callout body:
The earlier you understand the ESOP decision points, the easier it is to avoid rushed promises, unclear dilution, weak valuation support, or employee communication problems later.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP readiness report.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to prepare for the next investor, board, employee, candidate, or auditor conversation.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and review it before the ESOP question becomes more formal.

Booking button:
No booking button.
```

### Kickers

```text
dilution_kicker
```

### Button behaviour

```text
No booking CTA.
If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 2.9 IA_RP09 - No ESOP with no stakeholder pressure but near-term timing (Warm)

### Applies to

```text
ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM
```

### Lead temperature

```text
Internal: warm
User-facing: Potential fit
```

### Report

```text
Concern-driven
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
You are close to making an ESOP decision.

Badge:
Strategic Review

Intro:
There may not be active pressure from employees, investors, auditors, or the board yet, but your timing suggests an ESOP decision is getting closer.

That makes this a useful moment to understand the structure before you commit to any allocation, valuation approach, employee message, or legal setup.

Callout title:
Clarity before commitment.

Callout body:
ESOP decisions are easier to make when you separate the big questions early. How much equity should be allocated, how should it be valued, who should receive grants, and how should the plan be explained to the team.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP readiness report.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to clarify the key decisions before you move into implementation.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and use it to prepare before making a formal ESOP decision.

Booking button:
No booking button.
```

### Kickers

```text
dilution_kicker
```

### Button behaviour

```text
No booking CTA.
If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 2.10 IA_RP10 - No ESOP with no stakeholder pressure and later or uncertain timing (Cold)

### Applies to

```text
ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD
```

### Lead temperature

```text
Internal: cold
User-facing: Education track
```

### Report

```text
ESOP Starter Guide
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your company may not need ESOP yet.

Badge:
Educational

Intro:
Based on your answers, there does not appear to be an immediate ESOP need. That is perfectly fine.

This is the right stage to understand the basics before the company makes any commitments around equity, options, valuation, dilution, or employee communication.

Callout title:
Learn the basics before building the plan.

Callout body:
The goal for now is simple. Understand what an ESOP is, what decisions usually matter, and what signals would turn this from a learning topic into a real company priority.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP Starter Guide.

Recommended next step body:
We will send the ESOP Starter Guide to your inbox so you can review the key considerations at your own pace, recognise when ESOP support starts to matter, and understand what to prepare before that day arrives.

Form button:
Send my report

After submit:
Your results have been sent. Please check your inbox and review the report when useful.

Booking button:
No booking button.
```

### Kickers

```text
None.
```

### Button behaviour

```text
No booking CTA.
No booking link.
No direct call prompt.
```

---

## 2.11 IA_RP11 - Unsure ESOP with stakeholder pressure and near-term timing (Hot)

### Applies to

```text
ESOP_U1_UNSURE_PRESSURE_NEAR_HOT
```

### Lead temperature

```text
Internal: hot
User-facing: High fit
```

### Report

```text
ESOP Compliance and Governance Guide
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
You need to act fast to get clarity on what to do with your ESOP.

Badge:
Urgent Review

Intro:
Your answers suggest that you are not fully sure where your ESOP position stands today, but stakeholder pressure is already active and your timing is near.

That combination makes a clear position the highest priority. The company needs to know what already exists, what may have been promised informally, what has been documented, and what counts as defensible before the next conversation.

Callout title:
Clarify before answering.

Callout body:
When ESOP-related questions arrive, the worst answer is a vague one. Even a partial or incomplete ESOP position can usually be explained calmly, as long as someone in the company understands what is in place and what is not.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP Compliance and Governance Guide, then speak with us directly.

Recommended next step body:
We will send the ESOP Compliance and Governance Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.

Form button:
Send my report

After submit:
Your report has been sent. Based on your answers, we strongly recommend a short call before you respond to the next equity, options, or ESOP question.

Booking button:
Book a discovery call
```

### Kickers

```text
audit_kicker
```

### Button behaviour

```text
Show booking button only after the report submission confirmation.
Open booking link in the same tab or a new tab.
Do not auto-redirect.
```

---

## 2.12 IA_RP12 - Unsure ESOP with warm classification (Warm)

### Applies to

```text
ESOP_U2_UNSURE_PRESSURE_FAR_WARM
ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM
```

### Lead temperature

```text
Internal: warm
User-facing: Potential fit
```

### Report

```text
For ESOP_U2: ESOP Compliance and Governance Guide
For ESOP_U3: ESOP Starter Guide
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Start by clarifying what your ESOP should do.

Badge:
Strategic Review

Intro:
Your answers suggest that you are not fully sure where your ESOP position stands today. The pressure may not be acute yet, but the question is becoming relevant enough to warrant a clear answer.

The most useful next step is to confirm what has been issued, drafted, or promised, so that any future ESOP decision starts from a known baseline rather than a guess.

Callout title:
Clarity before commitment.

Callout body:
Most ESOP confusion is not malicious. It usually starts with informal promises, draft documents, or partial setups that were never fully reconciled. The earlier the company understands what is actually in place, the easier every later decision becomes.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP report.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to understand what an ESOP position usually involves, how to confirm where your company stands, and what to prepare for the next stakeholder conversation.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and use it to clarify the current ESOP position before further action.

Booking button:
No booking button.
```

### Kickers

```text
audit_kicker
```

### Button behaviour

```text
No booking CTA.
If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 2.13 IA_RP13 - Unsure ESOP with no stakeholder pressure and later or uncertain timing (Cold)

### Applies to

```text
ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD
```

### Lead temperature

```text
Internal: cold
User-facing: Education track
```

### Report

```text
ESOP Starter Guide
```

### Invoice review offer

```text
Hide.
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Start by understanding whether an ESOP is relevant for your company.

Badge:
Educational

Intro:
Your answers suggest you are still figuring out whether ESOPs matter for your company. There is no immediate pressure to act.

The most useful next step is to understand the basic structure, the typical tradeoffs, and the signals that would turn an ESOP from a learning topic into an actual priority.

Callout title:
Learn what triggers an ESOP decision.

Callout body:
Many companies do not need an ESOP at all. Others need one earlier than they realise. The starter guide explains the situations where an ESOP usually becomes relevant, so you can recognise the trigger when it arrives.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP Starter Guide.

Recommended next step body:
We will send the ESOP Starter Guide to your inbox so you can review the key considerations at your own pace, recognise when ESOP support starts to matter, and understand what to prepare before that day arrives.

Form button:
Send my report

After submit:
Your results have been sent. Please check your inbox and review the report when useful.

Booking button:
No booking button.
```

### Kickers

```text
None.
```

### Button behaviour

```text
No booking CTA.
No booking link.
No direct call prompt.
```

---

# 3. Result Page Variants (Intangible Value Track)

## 3.1 IA_RP14 - Hot Fundraising

### Applies to

```text
IV_CAPITAL_NEAR_VALUE_GAP_HOT
```

### Lead temperature

```text
Internal: hot
User-facing: High fit
```

### Report

```text
Intangible Value Fundraising Guide
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your business intangible value needs a clearer evidence story for investors.

Badge:
Urgent Review

Intro:
You are preparing for a fundraising round or bringing in new investors soon. Your answers suggest that some important value drivers may not yet be clearly documented or easy to explain to a third party.

This does not mean the value is not real. It usually means the evidence behind it needs to be organised in a way an investor can understand and rely on during their due diligence.

Callout title:
Investors anchor on what they can verify.
Callout body:
If intangible value is not explained clearly, investors usually fall back on the simplest metrics they can verify, like revenue or profit multiples. The job is not to inflate value. The job is to make hidden value visible and defensible before the conversation starts.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your Intangible Value Fundraising Guide, then speak with us directly.

Recommended next step body:
We will send the Intangible Value Fundraising Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.

Form button:
Send my report

After submit:
Your report has been sent. Based on your answers, we strongly recommend booking a short call before your next investor conversation, data room review, or valuation discussion.

Booking button:
Book a discovery call
```

### Kickers

```text
investor_anchor_kicker
evidence_story_kicker
```

### Button behaviour

```text
Show booking button only after the report submission confirmation.
Open booking link in the same tab or a new tab.
Do not auto-redirect.
```

---

## 3.2 IA_RP15 - Hot M&A or Exit

### Applies to

```text
IV_EXIT_NEAR_VALUE_GAP_HOT
```

### Lead temperature

```text
Internal: hot
User-facing: High fit
```

### Report

```text
Intangible Value M&A and Exit Guide
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your business intangible value needs a clearer evidence story for buyers.

Badge:
Urgent Review

Intro:
You are considering a sale, succession, or restructuring soon. Your answers suggest that some important value drivers may not yet be clearly documented or easy to explain to a buyer.

This does not mean the value is not real. It usually means the evidence behind it needs to be organised in a way a buyer can rely on during due diligence.

Callout title:
Buyers discount what they cannot verify.
Callout body:
In a negotiation, value that cannot be evidenced is usually treated as risk. Strong contracts, customer relationships, systems, data, brand, software, and IP need a clear evidence story before buyers will give them full weight in a transaction.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your Intangible Value M&A and Exit Guide, then speak with us directly.

Recommended next step body:
We will send the Intangible Value M&A and Exit Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.

Form button:
Send my report

After submit:
Your report has been sent. Based on your answers, we strongly recommend booking a short call before your next exit discussion, due diligence review, or buyer conversation.

Booking button:
Book a discovery call
```

### Kickers

```text
buyer_discount_kicker
evidence_story_kicker
```

### Button behaviour

```text
Show booking button only after the report submission confirmation.
Open booking link in the same tab or a new tab.
Do not auto-redirect.
```

---

## 3.3 IA_RP16 - Hot Stakeholder Review

### Applies to

```text
IV_STAKEHOLDER_NEAR_VALUE_GAP_HOT
```

### Lead temperature

```text
Internal: hot
User-facing: High fit
```

### Report

```text
Intangible Asset Discovery Guide
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your business intangible value needs a clearer evidence story for stakeholders.

Badge:
Urgent Review

Intro:
You may need to explain company value to a board, bank, auditor, partner, investor, or other stakeholder soon. Your answers suggest that some important value drivers may not yet be clearly documented or easy to explain to a third party.

This does not mean the value is not real. It usually means the evidence behind it needs to be organised in a way an outsider can understand and rely on.

Callout title:
Stakeholders trust structured evidence more than confident claims.
Callout body:
Boards, banks, auditors, and partners are usually persuaded by structure, not enthusiasm. A clear intangible asset map turns hidden value into a credible answer when the harder questions arrive.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your Intangible Asset Discovery Guide.

Recommended next step body:
We will send the Intangible Asset Discovery Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.

Form button:
Send my report

After submit:
Your report has been sent. Based on your answers, we strongly recommend booking a short call before your next board meeting, bank review, audit cycle, partner discussion, or stakeholder update.

Booking button:
Book a discovery call
```

### Kickers

```text
investor_anchor_kicker
evidence_story_kicker
```

### Button behaviour

```text
Show booking button only after the report submission confirmation.
Open booking link in the same tab or a new tab.
Do not auto-redirect.
```

---

## 3.4 IA_RP17 - Warm Fundraising

### Applies to

```text
IV_CAPITAL_NEAR_WEAK_SIGNAL_WARM
IV_CAPITAL_PLANNED_WARM
IV_CAPITAL_NO_TIMELINE_VALUE_GAP_WARM
IV_CAPITAL_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW
```

### Lead temperature

```text
Internal: warm or warm_low
User-facing: Potential fit
```

### Report

```text
Intangible Value Fundraising Guide
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your business intangible value may matter in a future fundraising discussion.

Badge:
High Urgency

Intro:
You are thinking about fundraising, bringing in investors, or strengthening your investor narrative. Your answers suggest that some of your company value may sit outside standard financial metrics, even if the timing is not urgent yet.

This may include recurring revenue, customer relationships, long-term contracts, brand, software, data, IP, or operating systems. These assets are easier to explain when they are mapped before investor pressure begins.

Callout title:
Prepare the evidence before the conversation needs it.
Callout body:
Investors are easier to convince when intangibles are mapped, documented, and explained on your terms. Preparing earlier gives you more control over the valuation narrative when fundraising actually starts.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your Intangible Value Fundraising Guide.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to understand what investors usually look for, what evidence matters, and how to prepare your intangible value story before the next fundraising discussion.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and review it before your next investor, capital, or fundraising conversation.

Booking button:
No booking button.
```

### Kickers

```text
investor_anchor_kicker
```

### Button behaviour

```text
No booking CTA.
If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 3.5 IA_RP18 - Warm M&A or Exit

### Applies to

```text
IV_EXIT_NEAR_WEAK_SIGNAL_WARM
IV_EXIT_PLANNED_WARM
IV_EXIT_NO_TIMELINE_VALUE_GAP_WARM
IV_EXIT_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW
```

### Lead temperature

```text
Internal: warm or warm_low
User-facing: Potential fit
```

### Report

```text
Intangible Value M&A and Exit Guide
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your business intangible value may matter in a future sale, succession, or ownership discussion.

Badge:
High Urgency

Intro:
Your answers suggest that buyers or stakeholders may eventually ask for clearer evidence of value beyond the financial statements. The timing may not be urgent yet, but the preparation usually pays off later.

A buyer or incoming shareholder will usually focus on what can be verified. The more clearly intangible value is documented, the easier it becomes to defend the value of the business when the conversation does happen.

Callout title:
The earlier you organise the evidence, the stronger your position.
Callout body:
Exit value is shaped long before formal negotiations. If brand, contracts, customer relationships, software, data, or IP are clearly documented, they are far more likely to be treated as enterprise value rather than vague upside.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your Intangible Value M&A and Exit Guide.

Recommended next step body:
We will send the {{report_title}} to your inbox. The guide will help you understand how buyers think about intangible assets, what evidence strengthens your position, and what to prepare before an exit or ownership discussion.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and review it before your next sale, succession, restructuring, or ownership conversation.

Booking button:
No booking button.
```

### Kickers

```text
buyer_discount_kicker
```

### Button behaviour

```text
No booking CTA.
If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 3.6 IA_RP19 - Warm Stakeholder or Discovery

### Applies to

```text
IV_STAKEHOLDER_NEAR_WEAK_SIGNAL_WARM
IV_STAKEHOLDER_PLANNED_VALUE_GAP_WARM
IV_STAKEHOLDER_PLANNED_WEAK_SIGNAL_WARM_LOW
IV_STAKEHOLDER_NO_TIMELINE_VALUE_GAP_WARM
IV_STAKEHOLDER_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW
IV_STRATEGIC_NEAR_VALUE_GAP_WARM
IV_STRATEGIC_PLANNED_VALUE_REVIEW_WARM
IV_STRATEGIC_NO_TIMELINE_VALUE_GAP_WARM_LOW
IV_STRATEGIC_MODERATE_SIGNAL_WARM_LOW
IV_CURIOSITY_VALUE_SIGNAL_WARM_LOW
IV_CURIOSITY_NEAR_MODERATE_SIGNAL_WARM_LOW
```

### Lead temperature

```text
Internal: warm or warm_low
User-facing: Potential fit
```

### Report

```text
Intangible Asset Discovery Guide
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your business may have intangible value that is worth mapping properly.

Badge:
Discovery

Intro:
Your answers suggest that the business may have value drivers that are not fully captured by ordinary profit, revenue, asset, or comparable company valuation. This may include customer relationships, recurring revenue, long-term contracts, software, data, IP, brand, specialist knowledge, or operating systems.

The next step is usually to understand which of these are real valuation assets, what evidence already supports them, and what still needs to be developed.

Callout title:
Intangible value becomes useful when it is structured.
Callout body:
A clear asset map helps you understand what matters, what can already be evidenced, and what still needs work. This turns a soft sense of value into something specific you can show, defend, and build on as the business grows.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your Intangible Asset Discovery Guide.

Recommended next step body:
We will send the {{report_title}} to your inbox. The guide will help you understand where your intangible assets may sit, what evidence matters, and what to prepare before a board, bank, auditor, partner, or valuation conversation.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and review it at your own pace.

Booking button:
No booking button.
```

### Kickers

```text
evidence_story_kicker
```

### Button behaviour

```text
No booking CTA.
If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 3.7 IA_RP20 - Warm Starter

### Applies to

```text
IV_STRATEGIC_NEAR_WEAK_SIGNAL_WARM_LOW
```

### Lead temperature

```text
Internal: warm_low
User-facing: Potential fit
```

### Report

```text
Intangible Value Starter Guide
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
You are early in the intangible value discovery process.

Badge:
Starter Review

Intro:
Your answers suggest that intangible value may be relevant to your business, but the signal is still early. There may not be a strong asset signal, clear documentation, or specific concern yet, and that is a perfectly normal place to start.

The useful next step is to learn what to look for, which categories of intangible value most often matter, and what evidence usually supports them as the business grows.

Callout title:
Learning the basics now makes future events easier.
Callout body:
Many companies only start thinking about intangible value when a fundraising round, sale conversation, or board review is already underway. Understanding the categories early helps you know what to track before the pressure begins.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your Intangible Value Starter Guide.

Recommended next step body:
We will send the Intangible Value Starter Guide to your inbox. The guide will help you understand the basics of intangible value, what assets to look out for, and how to think about value as the company grows.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and review it when useful.

Booking button:
No booking button.
```

### Kickers

```text
None.
```

### Button behaviour

```text
No booking CTA.
No direct call prompt.
```

---

## 3.8 IA_RP21 - Cold Starter

### Applies to

```text
IV_STRATEGIC_WEAK_SIGNAL_COLD
IV_CURIOSITY_WEAK_SIGNAL_COLD
```

### Lead temperature

```text
Internal: cold
User-facing: Education track
```

### Report

```text
Intangible Value Starter Guide
```

### Page copy

```text
Hero label:
YOUR RESULT

Title:
Your intangible value signal appears early or unclear.

Badge:
Education

Intro:
Based on your answers, there may not be a strong near-term intangible value issue yet. There is no specific event, the asset signal is still early, and there is no clear evidence gap.

That is perfectly fine. It does not mean your business lacks value. It usually means the relevant value drivers may need to be developed, tracked, or mapped more clearly over time.

Callout title:
Keep the guide for when the timing is right.
Callout body:
Intangible value becomes more important when fundraising, exit discussions, board scrutiny, or large customer or partner relationships start to depend on a clearer story. The starter guide helps you know what to watch for as that point approaches.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your Intangible Value Starter Guide.

Recommended next step body:
We will send the Intangible Value Starter Guide to your inbox. The guide will help you understand the difference between standard financial value and the intangible value that can build over time, and what signals to watch for.

Form button:
Send my report

After submit:
Your report has been sent. Please check your inbox and review it when useful.

Booking button:
No booking button.
```

### Kickers

```text
None.
```

### Button behaviour

```text
No booking CTA.
No booking link.
No direct call prompt.
```

---

# 4. QA Checklist

```text
[ ] Every result code maps to exactly one page copy variant.
[ ] Hot users see a booking CTA only after report submission.
[ ] Warm and warm_low users do not see a booking CTA on the result page.
[ ] Cold users do not see a booking CTA, urgency language, or a direct call prompt.
[ ] warm_low is never shown to the user.
[ ] The copy distinguishes ESOP scenarios from broader Intangible Value scenarios perfectly based on the unified entry point.
```
