# ESOP Assessment Result Page Copy and Scenario Mapping

## Purpose

This file defines the recommended result page copy for the Bain Squared ESOP Valuation Assessment.

It is designed to avoid creating one copy version for every answer path. The ESOP decision tree has many possible answer combinations, but the user should only see one of the grouped result page scenarios below.

The copy is grouped by commercial meaning, not by every technical branch.

## Core recommendation

Use one result page copy variant per scenario group.

Do not create hundreds of result page versions. The decision tree should classify the user into a result code, then map that result code to one of the copy variants below.

## Important offer rule

Only show the 10% off offer when the respondent has completed an ESOP valuation before.

Show the offer when:

```text
track = existing_esop
q3a_formal_valuation = yes
```

This means the offer should appear for:

```text
ESOP_A2_PROVIDER_REVIEW_HOT
ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM
```

Do not show the offer for:

```text
ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT
```

Reason:

The 10% offer is mainly a provider conversion offer. It is strongest for companies that already have a current or previous valuation provider and can share an invoice for benchmarking. If the user has never done a formal valuation, showing a discount against an existing provider creates the wrong mental frame.

## Universal page rules

### HOT result pages

HOT users should see:

```text
1. Their report is available or will be sent.
2. A strong recommendation to book a call.
3. A manual booking link only after the email submission step.
4. No automatic redirect to any calendar page.
```

### WARM and WARM_LOW result pages

WARM and WARM_LOW users should see:

```text
1. Their report is available or will be sent.
2. No booking link on the result page.
3. Any booking prompt belongs inside the PDF report or a later nurture email.
```

### COLD result pages

COLD users should see:

```text
1. Their report or results are available or will be sent.
2. No booking link on the result page.
3. No booking prompt inside the PDF report.
```

## Report title tokens

Use these report titles in the copy.

| report_key | Display title |
|---|---|
| `esop_compliance_governance` | ESOP Compliance and Governance Guide |
| `esop_structuring_dilution` | ESOP Structuring and Dilution Guide |
| `esop_communication_legal` | ESOP Communication and Legal Guide |
| `esop_starter` | ESOP Starter Guide |

## Universal form copy

Use this form copy across all result pages.

```text
Business email *
your@company.com

Name
Optional

Company
Optional

I would like to receive newsletters from Bain Squared.
```

## Universal post submission states

### HOT post submission

```text
Your report has been sent.

Based on your answers, we strongly recommend booking a short call before your next ESOP decision, grant, audit, board discussion, investor review, or employee conversation.

Button: Book a discovery call
```

### WARM and WARM_LOW post submission

```text
Your report has been sent.

Please check your inbox. The report will help you understand the main ESOP issues raised by your answers.

No booking button.
```

### COLD post submission

```text
Your results have been sent.

Please check your inbox and review the report at your own pace.

No booking button.
```

# Result page copy variants

## RP01. Existing ESOP with missing or uncertain formal valuation

### Applies to

```text
ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT
```

### Temperature

```text
hot
```

### Report

```text
ESOP Compliance and Governance Guide
```

### 10% offer

```text
Hide offer.
```

### Page copy

```text
Title:
Your existing ESOP has a valuation gap

Badge:
Urgent governance review

Intro:
You already have an ESOP in place, but your answers suggest that a formal valuation has not been completed or cannot be confirmed. That is the part to fix first.

Without a defensible valuation, option pricing, employee grants, audit support, board review, and future investor discussions become harder to explain.

Even if nobody has raised the issue yet, uncertainty around valuation support can become a problem the moment your next grant, audit request, board discussion, or fundraising process arrives.

Callout title:
Fix the baseline first

Callout body:
An ESOP is only as credible as the valuation support behind it. If the company has already issued options, or is planning to issue more, the priority is to establish a clean and defensible valuation baseline before the gap becomes harder to fix.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get the report, then speak with us directly.

Recommended next step body:
We will send the ESOP Compliance and Governance Guide to your inbox. Because your answers point to a governance sensitive issue, we strongly recommend booking a short call after the report is sent.

Form button:
Send my report

After submit:
Your report has been sent. Based on your answers, we strongly recommend a short call before your next ESOP grant, audit request, board discussion, investor review, or employee communication.

Booking button:
Book a discovery call
```

## RP02. Existing ESOP with provider dissatisfaction or uncertainty

### Applies to

```text
ESOP_A2_PROVIDER_REVIEW_HOT
```

### Temperature

```text
hot
```

### Report

```text
ESOP Compliance and Governance Guide
```

### 10% offer

```text
Show offer.
```

### Page copy

```text
Title:
Your ESOP valuation provider deserves a second look

Badge:
Provider review window

Intro:
You already have a formal ESOP valuation process, but your answers suggest that something about the current experience is not working as well as it should.

It may be price, report quality, speed, explainability, or confidence in how the provider handles ESOP specific questions. This is not just a vendor issue. It affects whether your next valuation report can stand up to employee questions, board review, investor due diligence, and audit scrutiny.

Callout title:
A better benchmark changes the conversation

Callout body:
Before renewing, refreshing, or defending your current valuation process, it is worth knowing what a more responsive, ESOP focused, and commercially useful report could look like.

Eligibility block title:
Your company is eligible

Eligibility block body:
Send us your most recent ESOP valuation invoice and get 10% off your next ESOP valuation report with Bain Squared. Even if you are not ready to switch today, you can use the review to benchmark price, quality, speed, and defensibility.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your provider review report.

Recommended next step body:
We will send the ESOP Compliance and Governance Guide to your inbox. Because your answers show a current provider or valuation process worth reviewing, we recommend booking a short call after the report is sent.

Form button:
Send my report

After submit:
Your report has been sent. Your answers suggest that your current ESOP valuation process is worth reviewing before the next refresh, grant, audit, or board discussion.

Booking button:
Book a discovery call
```

## RP03. Existing ESOP with satisfied provider

### Applies to

```text
ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM
```

### Temperature

```text
warm
```

### Report

```text
ESOP Compliance and Governance Guide
```

### 10% offer

```text
Show offer.
```

### Page copy

```text
Title:
Your current ESOP valuation process is worth benchmarking

Badge:
Optimization window

Intro:
You already have an ESOP valuation process in place, and you appear to be satisfied with it. That is a good position to be in.

The next question is whether the process is giving you the best mix of clarity, defensibility, speed, and commercial usefulness as your company grows and each grant cycle becomes more complex.

Even if there is no urgent reason to switch providers today, it is still worth knowing what a more competitive option looks like before your next refresh.

Callout title:
Benchmark before your next renewal

Callout body:
Good providers should still be benchmarked. A quick review gives you a clearer view of whether your current report quality, pricing, turnaround time, and ESOP specific support remain competitive.

Eligibility block title:
Your company is eligible

Eligibility block body:
Send us your most recent ESOP valuation invoice and get 10% off your next ESOP valuation report with Bain Squared. You do not need to be unhappy with your current provider to know whether there is a better option.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP optimization report.

Recommended next step body:
We will send the ESOP Compliance and Governance Guide to your inbox. Use it to review how modern ESOP valuation providers are improving process clarity, report quality, and commercial usefulness.

Form button:
Get my ESOP report

After submit:
Your report has been sent. Please check your inbox and review it before your next ESOP refresh or provider renewal.

Booking button:
No booking button.
```

## RP04. Planning ESOP with pressure and near term timing

### Applies to

```text
ESOP_B1_PLANNING_PRESSURE_NEAR_HOT
```

### Temperature

```text
hot
```

### Report

```text
Use assigned report based on concern.
```

### 10% offer

```text
Hide offer.
```

### Page copy

```text
Title:
Your ESOP plan is entering decision territory

Badge:
Near term planning window

Intro:
You are planning to set up an ESOP, and someone is already asking about equity, options, or incentive structure. Your timing also suggests that this is no longer a theoretical planning topic.

The decisions you make now will shape dilution, grant size, valuation support, employee expectations, and how the plan is explained to the board or investors later.

Callout title:
Decisions compound quickly

Callout body:
Once employees, candidates, investors, or board members start discussing equity, every number becomes an anchor. It is better to set the plan with structure, valuation logic, and communication discipline before expectations harden.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP planning report, then speak with us.

Recommended next step body:
We will send the {{report_title}} to your inbox. Because your answers show active or expected pressure with near term timing, we strongly recommend booking a short call after the report is sent.

Form button:
Send my report

After submit:
Your report has been sent. Based on your timing, we strongly recommend a short call before you finalize the ESOP structure or respond to the people asking about it.

Booking button:
Book a discovery call
```

## RP05. Planning ESOP with pressure but later or uncertain timing

### Applies to

```text
ESOP_B2_PLANNING_PRESSURE_FAR_WARM
```

### Temperature

```text
warm
```

### Report

```text
Use assigned report based on concern.
```

### 10% offer

```text
Hide offer.
```

### Page copy

```text
Title:
Your ESOP plan is forming before the pressure peaks

Badge:
Preparation window

Intro:
You are planning to set up an ESOP, and equity questions are already starting to appear or are expected soon. The timing may not be immediate, but the topic is now on the company agenda.

This is the right moment to prepare the structure, valuation logic, and employee communication before the process becomes rushed.

Callout title:
Use the quiet period well

Callout body:
The best ESOP decisions are usually made before the deadline arrives. When there is still time, you can compare structures, think through dilution, prepare valuation support, and avoid reactive commitments.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP readiness report.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to understand the decisions you should prepare before the next investor, board, employee, candidate, or auditor conversation.

Form button:
Get my ESOP report

After submit:
Your report has been sent. Please check your inbox and use it to prepare before the pressure becomes more immediate.

Booking button:
No booking button.
```

## RP06. Planning ESOP with no clear pressure but near term timing

### Applies to

```text
ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM
```

### Temperature

```text
warm
```

### Report

```text
Use assigned report based on concern.
```

### 10% offer

```text
Hide offer.
```

### Page copy

```text
Title:
Your ESOP planning window is open

Badge:
Build before launch

Intro:
You are planning to act soon, even though nobody appears to be forcing the conversation yet. That gives you a useful advantage.

You can still shape the ESOP before employees, candidates, investors, or board members start anchoring around specific numbers.

Callout title:
Design it before people price it

Callout body:
Once equity expectations are discussed informally, they become harder to reset. Building the plan early gives you more control over dilution, grant logic, valuation support, and employee communication.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP readiness report.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to clarify what should be decided before you move from planning to implementation.

Form button:
Get my ESOP report

After submit:
Your report has been sent. Please check your inbox and use it to prepare before you launch the ESOP process.

Booking button:
No booking button.
```

## RP07. Planning ESOP with no clear pressure and later or uncertain timing

### Applies to

```text
ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW
```

### Temperature

```text
warm_low internally, warm in the user interface
```

### Report

```text
Use assigned report based on concern.
```

### 10% offer

```text
Hide offer.
```

### Page copy

```text
Title:
Your ESOP thinking is early, but worth structuring

Badge:
Early planning

Intro:
You are not under immediate pressure yet, but you are already thinking about ESOPs. That is a useful place to start.

At this stage, the goal is not to rush into a valuation or legal process. The goal is to understand what decisions will matter later, especially around allocation, dilution, valuation support, and employee communication.

Callout title:
Start with the shape of the plan

Callout body:
Early ESOP planning should help you avoid messy promises later. A simple structure today can prevent confusion when hiring, retention, fundraising, or board discussions become more serious.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP starter report.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to understand what to prepare before the ESOP becomes an active project.

Form button:
Get my ESOP report

After submit:
Your report has been sent. Please check your inbox and review it at your own pace.

Booking button:
No booking button.
```

## RP08. No ESOP or unsure ESOP with pressure and near term timing

### Applies to

```text
ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT
ESOP_U1_UNSURE_PRESSURE_NEAR_HOT
```

### Temperature

```text
hot
```

### Report

```text
Use assigned report based on concern.
```

### 10% offer

```text
Hide offer.
```

### Page copy

```text
Title:
Your ESOP question is becoming urgent

Badge:
Active pressure

Intro:
You may not have a formal ESOP today, or you may not be fully sure what is already in place. But someone is asking about equity, options, or incentives, and your timing is near.

That means the company needs a clear answer before expectations harden, documents are prepared in a rush, or informal promises become difficult to unwind.

Callout title:
Do not answer from memory

Callout body:
When equity questions become active, vague answers can create real issues. The company should know what exists, what has been promised, what needs to be valued, and what can be explained clearly before the next conversation.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your report, then speak with us directly.

Recommended next step body:
We will send the {{report_title}} to your inbox. Because your answers show active pressure with near term timing, we strongly recommend booking a short call after the report is sent.

Form button:
Send my report

After submit:
Your report has been sent. Based on your answers, we strongly recommend a short call before you respond to the ESOP, equity, or option question in front of you.

Booking button:
Book a discovery call
```

## RP09. No ESOP or unsure ESOP with pressure but later or uncertain timing

### Applies to

```text
ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM
ESOP_U2_UNSURE_PRESSURE_FAR_WARM
```

### Temperature

```text
warm
```

### Report

```text
Use assigned report based on concern.
```

### 10% offer

```text
Hide offer.
```

### Page copy

```text
Title:
Your ESOP question is on the horizon

Badge:
Prepare before it lands

Intro:
You may not have a formal ESOP today, or you may not be fully sure what is already in place. Still, the topic is likely to come up soon.

This is a good time to understand the key structuring, valuation, legal, tax, and communication issues before someone asks for a definitive answer.

Callout title:
Prepare before the ask becomes formal

Callout body:
The earlier you understand the ESOP decision points, the easier it is to avoid rushed promises, unclear dilution, weak valuation support, or employee communication problems later.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP readiness report.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to prepare for the next investor, board, employee, candidate, or auditor conversation.

Form button:
Get my ESOP report

After submit:
Your report has been sent. Please check your inbox and review it before the ESOP question becomes more formal.

Booking button:
No booking button.
```

## RP10. No ESOP or unsure ESOP with no clear pressure but near term timing

### Applies to

```text
ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM
ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM
```

### Temperature

```text
warm
```

### Report

```text
Use assigned report based on concern.
```

### 10% offer

```text
Hide offer.
```

### Page copy

```text
Title:
You are close to making an ESOP decision

Badge:
Decision window

Intro:
There may not be active pressure from employees, investors, auditors, or the board yet, but your timing suggests that an ESOP decision is getting closer.

That makes this a useful moment to understand the structure before you commit to any allocation, valuation approach, employee message, or legal setup.

Callout title:
Clarity before commitment

Callout body:
ESOP decisions are easier to make when you separate the big questions early. How much equity should be allocated, how should it be valued, who should receive grants, and how should the plan be explained.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP readiness report.

Recommended next step body:
We will send the {{report_title}} to your inbox. Use it to clarify the key decisions before you move into implementation.

Form button:
Get my ESOP report

After submit:
Your report has been sent. Please check your inbox and use it to prepare before making a formal ESOP decision.

Booking button:
No booking button.
```

## RP11. No ESOP or unsure ESOP with no clear pressure and later or uncertain timing

### Applies to

```text
ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD
ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD
```

### Temperature

```text
cold
```

### Report

```text
Use assigned report based on concern.
```

### 10% offer

```text
Hide offer.
```

### Page copy

```text
Title:
Your ESOP need is still early

Badge:
Education track

Intro:
Based on your answers, there does not appear to be an immediate ESOP valuation or advisory need. That is not a problem.

This is the right stage to understand the basics before the company makes any commitments around equity, options, valuation, dilution, or employee communication.

Callout title:
Learn the basics before building the plan

Callout body:
The goal for now is simple. Understand what an ESOP is, what decisions usually matter, and what signals would turn this from a learning topic into a real company priority.

Recommended next step overline:
Recommended next step

Recommended next step heading:
Get your ESOP guide.

Recommended next step body:
We will send the {{report_title}} to your inbox so you can review the key considerations at your own pace.

Form button:
Get my ESOP report

After submit:
Your results have been sent. Please check your inbox and review the report when useful.

Booking button:
No booking button.
```

# Result code to result page copy mapping

| result_code | Result page copy variant |
|---|---|
| `ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT` | RP01 |
| `ESOP_A2_PROVIDER_REVIEW_HOT` | RP02 |
| `ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM` | RP03 |
| `ESOP_B1_PLANNING_PRESSURE_NEAR_HOT` | RP04 |
| `ESOP_B2_PLANNING_PRESSURE_FAR_WARM` | RP05 |
| `ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM` | RP06 |
| `ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW` | RP07 |
| `ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT` | RP08 |
| `ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM` | RP09 |
| `ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM` | RP10 |
| `ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD` | RP11 |
| `ESOP_U1_UNSURE_PRESSURE_NEAR_HOT` | RP08 |
| `ESOP_U2_UNSURE_PRESSURE_FAR_WARM` | RP09 |
| `ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM` | RP10 |
| `ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD` | RP11 |

# Developer notes

## Required tokens

The front end should support these tokens.

```text
{{report_title}}
{{booking_link}}
```

## Optional tokens

These can be added later.

```text
{{company_name}}
{{main_concern_label}}
{{timing_label}}
```

## Booking link rendering

Only render `{{booking_link}}` when:

```text
result_page_booking_policy = show_hot_booking_link_no_redirect
```

Never render the booking link when:

```text
result_page_booking_policy = hide_booking_link
```

## Offer rendering

Only render the 10% offer block when:

```text
track = existing_esop
q3a_formal_valuation = yes
```

or when the result code is:

```text
ESOP_A2_PROVIDER_REVIEW_HOT
ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM
```

## Final rule

The result page should feel like a useful diagnostic, not a sales trap. Every user gets a report. Only HOT users are asked to book a call on the page. WARM users are nurtured through the report. COLD users are educated without a sales prompt.
