# Intangible Value Assessment Email Copy and Google Apps Script Rules

## Purpose

This file defines the email content and routing rules for the Bain Squared Intangible Value Assessment.

These emails are sent after the user completes the assessment and submits their email. The Google Apps Script should use the final result object from the decision tree, especially:

```text
lead_temperature
lead_temperature_ui
report_key
cta_mode
delivery_policy
result_code
lead_score
```

The email should not create a separate message for every result code. Use the report key for the content theme and the lead temperature for the CTA rule.

## Global email rules

1. Every user receives the assigned PDF immediately.
2. Hot users receive the assigned PDF and a clear booking button in the email.
3. Warm and warm low users receive the assigned PDF. Do not include a prominent booking button in the email by default. The soft call prompt should sit inside the PDF report.
4. Cold users receive the assigned PDF only. Do not include a booking link, booking button, or direct call prompt.
5. `warm_low` is internal only. Email copy should treat it as warm.
6. Do not use `Business Value` or `BV` in customer facing email copy.
7. Use `Intangible Value` consistently.
8. Do not use em dashes in customer facing copy.
9. The email should feel personal and useful, not automated or sales-heavy.
10. The sender should be Bain Squared Valuation Advisory.

# Report attachment mapping

| Report key | Attachment title | Suggested PDF filename |
|---|---|---|
| `iv_fundraising_guide` | The Fundraising Valuation Guide | `Bain_Squared_Fundraising_Valuation_Guide.pdf` |
| `iv_mna_exit_guide` | The M&A and Exit Valuation Guide | `Bain_Squared_MA_Exit_Valuation_Guide.pdf` |
| `iv_intangible_asset_discovery_guide` | The Intangible Asset Discovery Guide | `Bain_Squared_Intangible_Asset_Discovery_Guide.pdf` |
| `iv_starter_guide` | The Intangible Value Starter Guide | `Bain_Squared_Intangible_Value_Starter_Guide.pdf` |

# CTA rules

| Lead temperature | Email CTA | Booking link allowed | Notes |
|---|---|---|---|
| `hot` | Yes, show a button | Yes | Use a clear booking CTA because the result is near-term and commercially urgent. |
| `warm` | No prominent button by default | No by default | The report can include the soft prompt. Keep the email focused on delivery. |
| `warm_low` | No prominent button by default | No by default | Treat as warm in user-facing copy. |
| `cold` | No | No | Send the guide only. Do not create urgency. |

# Subject line rules

Use one of the subject lines below.

| Report key | Hot subject | Warm subject | Cold subject |
|---|---|---|---|
| `iv_fundraising_guide` | `Your Intangible Value report is ready, and your fundraising timeline looks important` | `Your Fundraising Valuation Guide from Bain Squared` | Not expected |
| `iv_mna_exit_guide` | `Your Intangible Value report is ready, and your exit timeline looks important` | `Your M&A and Exit Valuation Guide from Bain Squared` | Not expected |
| `iv_intangible_asset_discovery_guide` | `Your Intangible Value report is ready, and your stakeholder timeline looks important` | `Your Intangible Asset Discovery Guide from Bain Squared` | Not expected |
| `iv_starter_guide` | Not expected | `Your Intangible Value Starter Guide from Bain Squared` | `Your Intangible Value Starter Guide from Bain Squared` |

Fallback subject:

```text
Your Intangible Value report from Bain Squared
```

# Shared signature

Use this signature for every email.

```html
<p>Best regards,</p>
<p><strong>Vanessa</strong><br>
Bain Squared Valuation Advisory<br>
<a href="mailto:assessment@bainsquared.com">assessment@bainsquared.com</a></p>
```

# Email templates

## 1. Hot fundraising email

Use when:

```text
report_key = iv_fundraising_guide
lead_temperature = hot
```

### Subject

```text
Your Intangible Value report is ready, and your fundraising timeline looks important
```

### HTML body

```html
<p>Hello,</p>

<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>

<p>Based on your answers, <strong>your fundraising or investor timeline may require a clearer intangible value story.</strong></p>

<p>I have attached your guide, <em>The Fundraising Valuation Guide</em>, to help you understand what investors may look for when assessing value beyond standard revenue, profit, asset, or comparable company metrics.</p>

<p>Because your answers suggest a near-term valuation discussion, we strongly recommend booking a short call. We can help you understand what evidence matters, what may be missing, and how to prepare before the next investor conversation.</p>

<p><a href="{{BOOKING_URL}}" style="background:#0f4a38;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:6px;display:inline-block;font-weight:600;">Book a call</a></p>

<hr>
```

---

## 2. Hot M&A or exit email

Use when:

```text
report_key = iv_mna_exit_guide
lead_temperature = hot
```

### Subject

```text
Your Intangible Value report is ready, and your exit timeline looks important
```

### HTML body

```html
<p>Hello,</p>

<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>

<p>Based on your answers, <strong>your exit, succession, or restructuring timeline may require stronger evidence of intangible value.</strong></p>

<p>I have attached your guide, <em>The M&A and Exit Valuation Guide</em>, to help you understand what buyers, shareholders, and stakeholders may look for when assessing the value of your business.</p>

<p>Because your answers suggest a near-term valuation discussion, we strongly recommend booking a short call. We can help you understand what evidence matters, what may be missing, and how to prepare before the conversation begins.</p>

<p><a href="{{BOOKING_URL}}" style="background:#0f4a38;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:6px;display:inline-block;font-weight:600;">Book a call</a></p>

<hr>
```

---

## 3. Hot stakeholder or discovery email

Use when:

```text
report_key = iv_intangible_asset_discovery_guide
lead_temperature = hot
```

### Subject

```text
Your Intangible Value report is ready, and your stakeholder timeline looks important
```

### HTML body

```html
<p>Hello,</p>

<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>

<p>Based on your answers, <strong>you may need a clearer evidence story for a board, bank, auditor, partner, investor, or stakeholder discussion.</strong></p>

<p>I have attached your guide, <em>The Intangible Asset Discovery Guide</em>, to help you identify which assets may matter, what evidence supports them, and how to explain intangible value more clearly.</p>

<p>Because your answers suggest a near-term stakeholder discussion, we strongly recommend booking a short call. We can help you understand what evidence matters, what may be missing, and how to present the value in a structured way.</p>

<p><a href="{{BOOKING_URL}}" style="background:#0f4a38;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:6px;display:inline-block;font-weight:600;">Book a call</a></p>

<hr>
```

---

## 4. Warm fundraising email

Use when:

```text
report_key = iv_fundraising_guide
lead_temperature = warm or warm_low
```

### Subject

```text
Your Fundraising Valuation Guide from Bain Squared
```

### HTML body

```html
<p>Hello,</p>

<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>

<p>Based on your answers, <strong>it is time to start preparing how your intangible value should be explained before a fundraising or investor discussion.</strong></p>

<p>I have attached your guide, <em>The Fundraising Valuation Guide</em>, to help you understand what investors may look for when assessing value beyond standard revenue, profit, asset, or comparable company metrics.</p>

<p>Use the guide to start identifying which assets are worth documenting, what evidence may matter, and where your valuation story may need to be strengthened before investor pressure begins.</p>

<hr>
```

---

## 5. Warm M&A or exit email

Use when:

```text
report_key = iv_mna_exit_guide
lead_temperature = warm or warm_low
```

### Subject

```text
Your M&A and Exit Valuation Guide from Bain Squared
```

### HTML body

```html
<p>Hello,</p>

<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>

<p>Based on your answers, <strong>it is worth starting to document the intangible value that buyers or stakeholders may not see in the accounts.</strong></p>

<p>I have attached your guide, <em>The M&A and Exit Valuation Guide</em>, to help you understand how buyers, shareholders, and stakeholders may think about value beyond standard financial metrics.</p>

<p>Use the guide to identify which assets may need stronger evidence before a sale, succession, restructuring, or ownership discussion begins.</p>

<hr>
```

---

## 6. Warm stakeholder or discovery email

Use when:

```text
report_key = iv_intangible_asset_discovery_guide
lead_temperature = warm or warm_low
```

### Subject

```text
Your Intangible Asset Discovery Guide from Bain Squared
```

### HTML body

```html
<p>Hello,</p>

<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>

<p>Based on your answers, <strong>your business may have intangible value signals that are worth mapping more clearly.</strong></p>

<p>I have attached your guide, <em>The Intangible Asset Discovery Guide</em>, to help you identify which assets may matter, what evidence supports them, and how to think about intangible value in a more structured way.</p>

<p>Use the guide to understand where your intangible assets may sit and what to prepare before a valuation conversation, stakeholder discussion, or internal review.</p>

<hr>
```

---

## 7. Warm starter email

Use when:

```text
report_key = iv_starter_guide
lead_temperature = warm or warm_low
```

### Subject

```text
Your Intangible Value Starter Guide from Bain Squared
```

### HTML body

```html
<p>Hello,</p>

<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>

<p>Based on your answers, <strong>you are starting to uncover where intangible value may sit in your business.</strong></p>

<p>I have attached your guide, <em>The Intangible Value Starter Guide</em>, to help you understand the difference between standard financial value and the deeper value drivers that can develop as your company grows.</p>

<p>Keep the guide for future planning. It will help you identify which business assets may be worth tracking and documenting over time.</p>

<hr>
```

---

## 8. Cold starter email

Use when:

```text
report_key = iv_starter_guide
lead_temperature = cold
```

### Subject

```text
Your Intangible Value Starter Guide from Bain Squared
```

### HTML body

```html
<p>Hello,</p>

<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>

<p>Based on your answers, <strong>you are in the early stages of intangible value discovery.</strong></p>

<p>I have attached your guide, <em>The Intangible Value Starter Guide</em>. Keep this for future planning. It will help you understand the difference between standard financial value and the intangible value that can build as your company grows.</p>

<p>No immediate action is needed. Use the guide when you want to start identifying which business assets may be worth tracking and documenting over time.</p>

<hr>
```

# Google Apps Script routing rules

Use this logic to choose the subject, email body, and attachment.

```js
function getIvEmailTemplateKey(result) {
  const temp = result.lead_temperature;
  const report = result.report_key;

  if (temp === 'hot' && report === 'iv_fundraising_guide') {
    return 'hot_fundraising';
  }

  if (temp === 'hot' && report === 'iv_mna_exit_guide') {
    return 'hot_mna_exit';
  }

  if (temp === 'hot' && report === 'iv_intangible_asset_discovery_guide') {
    return 'hot_discovery';
  }

  if ((temp === 'warm' || temp === 'warm_low') && report === 'iv_fundraising_guide') {
    return 'warm_fundraising';
  }

  if ((temp === 'warm' || temp === 'warm_low') && report === 'iv_mna_exit_guide') {
    return 'warm_mna_exit';
  }

  if ((temp === 'warm' || temp === 'warm_low') && report === 'iv_intangible_asset_discovery_guide') {
    return 'warm_discovery';
  }

  if ((temp === 'warm' || temp === 'warm_low') && report === 'iv_starter_guide') {
    return 'warm_starter';
  }

  if (temp === 'cold') {
    return 'cold_starter';
  }

  return 'cold_starter';
}
```

# Attachment routing rules

```js
function getIvAttachmentFileName(reportKey) {
  const files = {
    iv_fundraising_guide: 'Bain_Squared_Fundraising_Valuation_Guide.pdf',
    iv_mna_exit_guide: 'Bain_Squared_MA_Exit_Valuation_Guide.pdf',
    iv_intangible_asset_discovery_guide: 'Bain_Squared_Intangible_Asset_Discovery_Guide.pdf',
    iv_starter_guide: 'Bain_Squared_Intangible_Value_Starter_Guide.pdf'
  };

  return files[reportKey] || files.iv_starter_guide;
}
```

# Booking link rule

```js
function shouldIncludeBookingLink(result) {
  return result.lead_temperature === 'hot';
}
```

Important:

```text
Do not include a booking link for cold leads.
Do not include a booking link for warm or warm low leads unless this is deliberately changed later.
Do not include a hidden booking link in the cold email footer.
```

# Recommended send flow

```js
function sendIvAssessmentEmail(result) {
  const templateKey = getIvEmailTemplateKey(result);
  const attachmentFileName = getIvAttachmentFileName(result.report_key);
  const includeBookingLink = shouldIncludeBookingLink(result);

  // 1. Look up the selected subject and HTML body from the template map.
  // 2. Replace {{BOOKING_URL}} only when includeBookingLink is true.
  // 3. Attach the PDF based on report_key.
  // 4. Send to result.email.
  // 5. If result.lead_temperature is hot, notify sales internally.
  // 6. If result.lead_temperature is warm or warm_low and lead_score is 75 or above, optionally notify sales for manual review.
  // 7. If result.lead_temperature is cold, do not notify sales by default.
}
```

# Internal notification rules

| Lead temperature | Internal notification |
|---|---|
| `hot` | Yes, notify sales immediately |
| `warm` | Only if `lead_score >= 75` |
| `warm_low` | Only if `lead_score >= 75` |
| `cold` | No |

# Plain text fallback

Use this if HTML email rendering fails.

## Hot fallback

```text
Hello,

Thank you for completing the Bain Squared Intangible Value Assessment.

Your Intangible Value report is attached.

Based on your answers, this may be a near-term valuation issue. We strongly recommend booking a short call so we can help you understand what evidence matters, what may be missing, and how to prepare before the next discussion.

Book a call: {{BOOKING_URL}}

Best regards,
Vanessa
Bain Squared Valuation Advisory
assessment@bainsquared.com
```

## Warm fallback

```text
Hello,

Thank you for completing the Bain Squared Intangible Value Assessment.

Your Intangible Value report is attached.

Use the guide to understand where your intangible assets may sit, what evidence matters, and what to prepare before a valuation conversation.

Best regards,
Vanessa
Bain Squared Valuation Advisory
assessment@bainsquared.com
```

## Cold fallback

```text
Hello,

Thank you for completing the Bain Squared Intangible Value Assessment.

Your Intangible Value Starter Guide is attached.

No immediate action is needed. Keep the guide for future planning and use it when you want to understand what intangible value may look like as your company grows.

Best regards,
Vanessa
Bain Squared Valuation Advisory
assessment@bainsquared.com
```

# QA checklist

Before deploying the Google Apps Script, confirm the following:

```text
[ ] Every result sends one PDF attachment.
[ ] Attachment selection is based on report_key, not lead temperature.
[ ] Hot email includes a booking button.
[ ] Hot email does not withhold the report.
[ ] Warm and warm low email sends the report without a prominent booking button.
[ ] Cold email has no booking button, no booking link, and no direct call prompt.
[ ] Subject line is selected by report_key and lead temperature.
[ ] warm_low is never shown to the user as warm low.
[ ] All customer facing copy says Intangible Value, not Business Value.
[ ] No customer facing copy uses em dashes.
[ ] Hot leads trigger internal notification.
[ ] Warm leads only trigger internal notification if lead_score is 75 or above.
[ ] Cold leads do not trigger internal notification by default.
```
