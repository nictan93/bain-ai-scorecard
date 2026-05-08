# Intangible Value Assessment Result Page Copy Rules

## Purpose

This file defines the result page copy for the Bain Squared Intangible Value Assessment.

The copy is intentionally grouped by the document the user receives and the lead temperature shown in the decision tree. It should not create a separate content variation for every result code, because that would create too many brittle variants and make the flow harder to maintain.

Use this structure:

```text
Report key decides the content theme.
Lead temperature decides the page CTA.
Result code is stored for tracking, not for unique page copy.
```

## Global rules

1. Use `Intangible Value` everywhere. Do not use `Business Value` or `BV`.
2. Every completed user receives a report.
3. Hot users see a clear message that the report has been sent, plus a strong call booking prompt.
4. Hot users must not be redirected automatically to a booking page.
5. Warm and warm low users receive the report, but do not see a booking CTA on the result page.
6. Cold users receive the report, but do not see a booking CTA on the result page.
7. `warm_low` is internal only. On the page, show it as warm.
8. Keep the tone conversational, direct, and calm.
9. Do not use em dashes in customer facing copy.
10. Do not over-explain valuation methodology on the result page. The report should do the deeper education.

## Result page grouping logic

| Result page group | Use when | Report key | Lead temperature | Booking CTA on page |
|---|---|---|---|---|
| Hot fundraising | Capital event, near-term, value gap present | `iv_fundraising_guide` | `hot` | Yes |
| Hot M&A or exit | Exit event, near-term, value gap present | `iv_mna_exit_guide` | `hot` | Yes |
| Hot stakeholder review | Stakeholder event, near-term, value gap present | `iv_intangible_asset_discovery_guide` | `hot` | Yes |
| Warm fundraising | Capital event, planned, weak, or no clear timing | `iv_fundraising_guide` | `warm` or `warm_low` | No |
| Warm M&A or exit | Exit event, planned, weak, or no clear timing | `iv_mna_exit_guide` | `warm` or `warm_low` | No |
| Warm stakeholder or discovery | Stakeholder, strategic review, or curious user with a value signal | `iv_intangible_asset_discovery_guide` | `warm` or `warm_low` | No |
| Warm starter | Strategic or curious user with early value awareness but no urgent trigger | `iv_starter_guide` | `warm` or `warm_low` | No |
| Cold starter | Curious or strategic user with weak signal and no clear pain | `iv_starter_guide` | `cold` | No |

# Copy blocks

## 1. Hot fundraising result page

Use when:

```text
report_key = iv_fundraising_guide
lead_temperature = hot
```

### Hero label

```text
YOUR RESULT
```

### Headline

```text
Your intangible value needs to be clear before investors see the numbers.
```

### Badge

```text
Urgent Review
```

### Main body

```text
You are entering a fundraising or investor discussion soon, and your answers suggest that important value drivers may not be fully visible in a standard revenue, profit, asset, or comparable company valuation.

This can include recurring revenue, long-term contracts, software, data, IP, customer relationships, brand strength, or operating systems that make the company more valuable than the headline numbers suggest.
```

### Why this matters title

```text
WHY THIS MATTERS
```

### Why this matters body

```text
If this evidence is not prepared before the conversation begins, investors may anchor the valuation around the easiest metric to defend, not the full value of the business.
```

### Recommended next step title

```text
RECOMMENDED NEXT STEP
```

### Recommended next step body

```text
Your Intangible Value report has been sent.

Because your fundraising or investor timeline appears to be near-term, we strongly recommend booking a short call. We can help you understand what evidence matters, what may be missing, and how to prepare before the next investor conversation.
```

### Button copy

```text
Book a call
```

### Button behavior

```text
Open booking link in the same tab or a new tab. Do not auto-redirect.
```

---

## 2. Hot M&A or exit result page

Use when:

```text
report_key = iv_mna_exit_guide
lead_temperature = hot
```

### Hero label

```text
YOUR RESULT
```

### Headline

```text
Your intangible value needs to be evidenced before an exit conversation begins.
```

### Badge

```text
Urgent Review
```

### Main body

```text
You may be approaching a sale, succession, restructuring, or ownership discussion, and your answers suggest that important value drivers may not be fully reflected in your current financials.

Buyers often focus on what they can verify quickly. If brand strength, customer relationships, long-term contracts, software, data, IP, or operating systems are not clearly documented, they may be discounted during negotiation.
```

### Why this matters title

```text
WHY THIS MATTERS
```

### Why this matters body

```text
In an exit or ownership event, value that is not evidenced usually becomes value that is negotiated away. The earlier you organize the evidence, the stronger your position becomes.
```

### Recommended next step title

```text
RECOMMENDED NEXT STEP
```

### Recommended next step body

```text
Your Intangible Value report has been sent.

Because your exit, succession, or restructuring timeline appears to be near-term, we strongly recommend booking a short call. We can help you understand what buyers or stakeholders may look for, and what you should prepare before the conversation begins.
```

### Button copy

```text
Book a call
```

### Button behavior

```text
Open booking link in the same tab or a new tab. Do not auto-redirect.
```

---

## 3. Hot stakeholder review result page

Use when:

```text
report_key = iv_intangible_asset_discovery_guide
lead_temperature = hot
```

### Hero label

```text
YOUR RESULT
```

### Headline

```text
Your intangible value needs a clearer evidence story for stakeholders.
```

### Badge

```text
Urgent Review
```

### Main body

```text
You may need to explain your company value to a board, bank, auditor, partner, investor, or other stakeholder soon. Your answers suggest that some important value drivers may not yet be clearly documented or easy to explain.

This does not mean the value is not real. It means the evidence needs to be organized in a way that a third party can understand and rely on.
```

### Why this matters title

```text
WHY THIS MATTERS
```

### Why this matters body

```text
Stakeholders usually respond better to structured evidence than broad claims about potential. A clear intangible asset map helps turn hidden value into a more credible valuation discussion.
```

### Recommended next step title

```text
RECOMMENDED NEXT STEP
```

### Recommended next step body

```text
Your Intangible Value report has been sent.

Because your stakeholder discussion appears to be near-term, we strongly recommend booking a short call. We can help you identify what evidence matters, what is missing, and how to present the value in a more structured way.
```

### Button copy

```text
Book a call
```

### Button behavior

```text
Open booking link in the same tab or a new tab. Do not auto-redirect.
```

---

## 4. Warm fundraising result page

Use when:

```text
report_key = iv_fundraising_guide
lead_temperature = warm or warm_low
```

### Hero label

```text
YOUR RESULT
```

### Headline

```text
It is time to start preparing your intangible value story before fundraising.
```

### Badge

```text
Planning Window
```

### Main body

```text
You are thinking about fundraising, bringing in investors, or strengthening your investor narrative. Your answers suggest that some of your company value may sit outside standard financial metrics.

This may include recurring revenue, customer relationships, long-term contracts, brand, software, data, IP, or operating systems. These assets are easier to explain when they are mapped before investor pressure begins.
```

### Why this matters title

```text
WHY THIS MATTERS
```

### Why this matters body

```text
Investors usually value what they can understand, compare, and verify. Preparing your intangible value evidence early gives you more control over the valuation narrative.
```

### Recommended next step title

```text
RECOMMENDED NEXT STEP
```

### Recommended next step body

```text
Your Intangible Value report has been sent.

Review the guide to understand what investors may look for, what evidence matters, and how to prepare before your next fundraising discussion.
```

### Button copy

```text
Report sent
```

### Button behavior

```text
No booking CTA. If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 5. Warm M&A or exit result page

Use when:

```text
report_key = iv_mna_exit_guide
lead_temperature = warm or warm_low
```

### Hero label

```text
YOUR RESULT
```

### Headline

```text
Start documenting the value buyers may not see in the accounts.
```

### Badge

```text
Planning Window
```

### Main body

```text
You may be planning for a sale, succession, restructuring, or ownership discussion in the future. Your answers suggest that some parts of your business value may not be fully visible through standard financials alone.

A buyer or incoming shareholder will usually ask what can be verified. The more clearly you document your intangible value, the easier it becomes to defend the value of the business.
```

### Why this matters title

```text
WHY THIS MATTERS
```

### Why this matters body

```text
Exit value is often shaped before formal negotiations begin. If your intangible assets are not prepared early, they may be treated as general upside instead of real enterprise value.
```

### Recommended next step title

```text
RECOMMENDED NEXT STEP
```

### Recommended next step body

```text
Your Intangible Value report has been sent.

Review the guide to understand how buyers think about intangible assets, what evidence strengthens your position, and what to prepare before an exit or ownership discussion.
```

### Button copy

```text
Report sent
```

### Button behavior

```text
No booking CTA. If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 6. Warm stakeholder or discovery result page

Use when:

```text
report_key = iv_intangible_asset_discovery_guide
lead_temperature = warm or warm_low
```

### Hero label

```text
YOUR RESULT
```

### Headline

```text
You have intangible value signals that are worth mapping properly.
```

### Badge

```text
Evidence Review
```

### Main body

```text
Your answers suggest that your business may have value drivers that are not fully captured by a simple profit, revenue, asset, or comparable company valuation.

This could include customer relationships, recurring revenue, long-term contracts, software, data, IP, brand, specialist knowledge, or operating systems. The next step is to understand which of these are real valuation assets and what evidence supports them.
```

### Why this matters title

```text
WHY THIS MATTERS
```

### Why this matters body

```text
Intangible value becomes more useful when it is structured. A clear asset map helps you understand what matters, what can be evidenced, and what still needs to be developed.
```

### Recommended next step title

```text
RECOMMENDED NEXT STEP
```

### Recommended next step body

```text
Your Intangible Value report has been sent.

Review the guide to understand where your intangible assets may sit, what evidence matters, and what to prepare before a valuation conversation.
```

### Button copy

```text
Report sent
```

### Button behavior

```text
No booking CTA. If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 7. Warm starter result page

Use when:

```text
report_key = iv_starter_guide
lead_temperature = warm or warm_low
```

### Hero label

```text
YOUR RESULT
```

### Headline

```text
You are starting to uncover where intangible value may sit in your business.
```

### Badge

```text
Education Stage
```

### Main body

```text
Your answers suggest that you are still exploring how intangible value applies to your company. You may not have an immediate valuation event, but it is still useful to understand what buyers, investors, and stakeholders may look for over time.

This is the right stage to learn the difference between standard financial value and the deeper value drivers that can develop as your company grows.
```

### Why this matters title

```text
WHY THIS MATTERS
```

### Why this matters body

```text
Many companies only start thinking about intangible value when a transaction is already underway. Learning the basics early helps you know what to track before the pressure begins.
```

### Recommended next step title

```text
RECOMMENDED NEXT STEP
```

### Recommended next step body

```text
Your Intangible Value report has been sent.

Review the starter guide to understand the basics of intangible value, what assets to look out for, and how to think about value as your company grows.
```

### Button copy

```text
Report sent
```

### Button behavior

```text
No booking CTA. If a disabled button is not ideal for UX, hide the button and show the confirmation text only.
```

---

## 8. Cold starter result page

Use when:

```text
report_key = iv_starter_guide
lead_temperature = cold
```

### Hero label

```text
YOUR RESULT
```

### Headline

```text
You are in the early stages of intangible value discovery.
```

### Badge

```text
Education Stage
```

### Main body

```text
Your answers suggest that you are currently exploring how intangible value works, but you do not appear to have an immediate valuation event or a clear evidence gap yet.

This does not mean your business lacks value. It simply means the relevant value drivers may need to be developed, tracked, or mapped more clearly over time.
```

### Why this matters title

```text
NO ACTION NEEDED YET
```

### Why this matters body

```text
Keep the guide for future planning. It will help you understand what business assets may be worth tracking and documenting as your company grows.
```

### Recommended next step title

```text
RECOMMENDED NEXT STEP
```

### Recommended next step body

```text
Your Intangible Value report has been sent.

Review the starter guide when you want to understand the difference between standard financial value and the intangible value that can build over time.
```

### Button copy

```text
Report sent
```

### Button behavior

```text
No booking CTA. No booking link. No direct call prompt.
```

# Implementation mapping

Use this mapping in the codebase to select the correct page copy.

```ts
function getIvResultPageCopyKey(result) {
  const temp = result.lead_temperature;
  const report = result.report_key;

  if (temp === "hot" && report === "iv_fundraising_guide") {
    return "hot_fundraising";
  }

  if (temp === "hot" && report === "iv_mna_exit_guide") {
    return "hot_mna_exit";
  }

  if (temp === "hot" && report === "iv_intangible_asset_discovery_guide") {
    return "hot_stakeholder_discovery";
  }

  if (["warm", "warm_low"].includes(temp) && report === "iv_fundraising_guide") {
    return "warm_fundraising";
  }

  if (["warm", "warm_low"].includes(temp) && report === "iv_mna_exit_guide") {
    return "warm_mna_exit";
  }

  if (["warm", "warm_low"].includes(temp) && report === "iv_intangible_asset_discovery_guide") {
    return "warm_stakeholder_discovery";
  }

  if (["warm", "warm_low"].includes(temp) && report === "iv_starter_guide") {
    return "warm_starter";
  }

  if (temp === "cold") {
    return "cold_starter";
  }

  return "cold_starter";
}
```

# UI behavior rules

## Hot page behavior

```text
Show the result explanation.
Show the report sent confirmation.
Show the booking CTA.
Do not auto-redirect.
Do not hide the report behind booking.
```

## Warm and warm low page behavior

```text
Show the result explanation.
Show the report sent confirmation.
Do not show a booking CTA.
Do not mention booking on the result page.
The PDF report may contain a soft call prompt.
```

## Cold page behavior

```text
Show the result explanation.
Show the report sent confirmation.
Do not show a booking CTA.
Do not mention booking on the result page.
Do not create urgency.
```

# Suggested form and confirmation copy

Use this only if the result page still collects the business email before the report is sent.

## Email field label

```text
Business email *
```

## Name field label

```text
Name (optional)
```

## Company field label

```text
Company (optional)
```

## Newsletter checkbox

```text
I would like to receive newsletters from Bain Squared.
```

## Privacy note

```text
Your email is used to send your report and track requested follow-up. We do not send marketing newsletters unless you opt in.
```

## Generic submit button for all non-hot users

```text
Send my report
```

## Generic submit button for hot users before confirmation

```text
Send my report
```

## Confirmation after successful submission

```text
Your report has been sent to your email.
```

## Hot confirmation after successful submission

```text
Your report has been sent to your email. Because your answers suggest a near-term valuation issue, we strongly recommend booking a short call.
```
