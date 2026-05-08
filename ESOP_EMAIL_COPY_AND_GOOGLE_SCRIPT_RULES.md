# ESOP Assessment Email Copy and Google Apps Script Rules

## Purpose

This file defines the email copy and delivery rules for the Bain Squared ESOP Valuation Assessment.

The email should be sent through Google Apps Script after the user submits their email address on the result page.

The main rule is simple:

```text
All users receive their assigned report.
HOT users receive a direct booking link.
WARM and WARM_LOW users receive the report without a result page booking link.
COLD users receive the report with no booking prompt at all.
```

For the immediate delivery email, use this stricter rule:

```text
Only HOT emails include a booking button or booking link.
WARM and WARM_LOW emails do not include a booking link in the email. Their PDF report may contain the booking prompt.
COLD emails do not include a booking link in the email or inside the PDF report.
```

## Inputs required by Google Apps Script

The script should receive these fields from the assessment payload.

```json
{
  "email": "{{user_email}}",
  "name": "{{user_name}}",
  "company": "{{company_name}}",
  "track": "{{track}}",
  "result_code": "{{result_code}}",
  "lead_temperature": "{{lead_temperature}}",
  "lead_temperature_ui": "{{lead_temperature_ui}}",
  "report_key": "{{report_key}}",
  "report_title": "{{report_title}}",
  "result_page_booking_policy": "{{result_page_booking_policy}}",
  "report_booking_prompt_policy": "{{report_booking_prompt_policy}}",
  "booking_link": "{{booking_link}}",
  "answers": {
    "q3a_formal_valuation": "{{q3a_formal_valuation}}"
  }
}
```

## Report attachment rules

| report_key | File to attach | Display title |
|---|---|---|
| `esop_compliance_governance` | `ESOP_Compliance_and_Governance_Guide.pdf` | ESOP Compliance and Governance Guide |
| `esop_structuring_dilution` | `ESOP_Structuring_and_Dilution_Guide.pdf` | ESOP Structuring and Dilution Guide |
| `esop_communication_legal` | `ESOP_Communication_and_Legal_Guide.pdf` | ESOP Communication and Legal Guide |
| `esop_starter` | `ESOP_Starter_Guide.pdf` | ESOP Starter Guide |

## 10% offer rule

Only include the 10% offer block when the respondent has completed an ESOP valuation before.

Use this condition:

```text
track = existing_esop
q3a_formal_valuation = yes
```

Equivalent result codes:

```text
ESOP_A2_PROVIDER_REVIEW_HOT
ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM
```

Do not include the offer for users who have not completed a formal valuation or are not sure whether they have done one.

## Booking link rule

### Include booking link

Only include the booking link when:

```text
lead_temperature = hot
```

### Exclude booking link

Do not include the booking link when:

```text
lead_temperature = warm
lead_temperature = warm_low
lead_temperature = cold
```

### Cold rule

Cold emails must not contain:

```text
1. Schedule a call link
2. Book a call button
3. Discovery call wording
4. Any soft prompt to speak with Bain Squared
```

## Greeting rule

If name exists, use:

```text
Hello {{first_name}},
```

If name does not exist, use:

```text
Hello,
```

## Signature

Use this signature for all emails.

```text
Best regards,

Vanessa
Bain Squared Valuation Advisory
assessment@bainsquared.com
```

# Subject lines by result code

| result_code | Subject line |
|---|---|
| `ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT` | Your ESOP compliance report is ready |
| `ESOP_A2_PROVIDER_REVIEW_HOT` | Your ESOP provider review report is ready |
| `ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM` | Your ESOP optimization report is ready |
| `ESOP_B1_PLANNING_PRESSURE_NEAR_HOT` | Your ESOP planning report is ready |
| `ESOP_B2_PLANNING_PRESSURE_FAR_WARM` | Your ESOP readiness report is ready |
| `ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM` | Your ESOP readiness report is ready |
| `ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW` | Your ESOP starter report is ready |
| `ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT` | Your ESOP planning report is ready |
| `ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM` | Your ESOP readiness report is ready |
| `ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM` | Your ESOP readiness report is ready |
| `ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD` | Your ESOP guide is ready |
| `ESOP_U1_UNSURE_PRESSURE_NEAR_HOT` | Your ESOP planning report is ready |
| `ESOP_U2_UNSURE_PRESSURE_FAR_WARM` | Your ESOP readiness report is ready |
| `ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM` | Your ESOP readiness report is ready |
| `ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD` | Your ESOP guide is ready |

# Assessment sentence by result code

Use this as the sentence after "Based on your answers,".

| result_code | Assessment sentence |
|---|---|
| `ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT` | your existing ESOP appears to have an immediate valuation and governance gap. |
| `ESOP_A2_PROVIDER_REVIEW_HOT` | your current ESOP valuation process should be reviewed before your next grant, audit, board discussion, or investor review. |
| `ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM` | your current ESOP valuation process is worth benchmarking before your next refresh. |
| `ESOP_B1_PLANNING_PRESSURE_NEAR_HOT` | your ESOP plan is entering a near term decision window. |
| `ESOP_B2_PLANNING_PRESSURE_FAR_WARM` | your ESOP plan is worth preparing before the pressure becomes more formal. |
| `ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM` | your ESOP planning window is open, even if nobody is forcing the conversation yet. |
| `ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW` | your ESOP thinking is still early, but it is worth structuring before informal promises begin. |
| `ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT` | your ESOP question is becoming time sensitive. |
| `ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM` | your ESOP question is likely to come up soon. |
| `ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM` | your ESOP decision window is starting to open. |
| `ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD` | your ESOP need is still early. |
| `ESOP_U1_UNSURE_PRESSURE_NEAR_HOT` | your ESOP position needs to be clarified soon. |
| `ESOP_U2_UNSURE_PRESSURE_FAR_WARM` | your ESOP position is worth clarifying before the question becomes formal. |
| `ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM` | your ESOP position is worth clarifying before you make a decision. |
| `ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD` | your ESOP need is still early, but it is useful to understand the basics. |

# Master email templates

## EMAIL 01. HOT delivery email

### Use when

```text
lead_temperature = hot
```

### Subject

```text
{{subject_line}}
```

### Body

```text
Hello {{first_name}},

Thank you for completing the Bain Squared Valuation Assessment.

Based on your answers, {{assessment_sentence}}

I have attached your {{report_title}}. It gives you a clear baseline before you make or explain your next ESOP decision.

Because your answers point to a near term or governance sensitive issue, I recommend booking a short call so we can understand your timeline, current documents, and what needs to be prepared before your next grant, audit, board discussion, investor review, or employee conversation.

{{offer_block_if_eligible}}

Button:
Book a discovery call

Best regards,

Vanessa
Bain Squared Valuation Advisory
assessment@bainsquared.com
```

### Booking button URL

```text
{{booking_link}}
```

### Notes

```text
Attach the assigned report.
Include the booking button.
Do not auto redirect from the result page.
```

## EMAIL 02. WARM and WARM_LOW delivery email

### Use when

```text
lead_temperature = warm
lead_temperature = warm_low
```

### Subject

```text
{{subject_line}}
```

### Body

```text
Hello {{first_name}},

Thank you for completing the Bain Squared Valuation Assessment.

Based on your answers, {{assessment_sentence}}

I have attached your {{report_title}}. It is meant to help you understand the key questions around ESOP structure, valuation, communication, and compliance before your next decision.

{{warm_support_sentence}}

{{offer_block_if_eligible}}

Best regards,

Vanessa
Bain Squared Valuation Advisory
assessment@bainsquared.com
```

### Booking button URL

```text
Do not include a booking button or booking link in this email.
```

### Notes

```text
Attach the assigned report.
No booking link in the immediate email.
The PDF report may include a booking prompt if report_booking_prompt_policy = include_booking_prompt_in_report.
```

## EMAIL 03. COLD delivery email

### Use when

```text
lead_temperature = cold
```

### Subject

```text
{{subject_line}}
```

### Body

```text
Hello {{first_name}},

Thank you for completing the Bain Squared Valuation Assessment.

Based on your answers, {{assessment_sentence}}

I have attached your {{report_title}} so you can review the basics at your own pace.

There does not appear to be an immediate ESOP valuation or advisory need based on your responses, but the report should help you understand what to watch for as your company grows.

Best regards,

Vanessa
Bain Squared Valuation Advisory
assessment@bainsquared.com
```

### Booking button URL

```text
Do not include a booking button or booking link in this email.
```

### Notes

```text
Attach the assigned report.
Do not include booking language.
Do not include the 10% offer.
Do not notify sales by default.
```

# Dynamic warm support sentence

Use one of these based on track.

## Existing ESOP, satisfied provider

```text
You may not need to change provider today, but a light benchmark before your next renewal can help you understand whether your current process remains competitive on price, quality, speed, and defensibility.
```

## Planning ESOP

```text
Use the report as a preparation checklist before your ESOP becomes a live implementation project.
```

## No ESOP

```text
Use the report to understand what decisions normally matter before you commit to an ESOP structure or option grant.
```

## Unsure ESOP

```text
Use the report to clarify what may already exist, what may only be informal, and what should be checked before you answer any ESOP or equity question formally.
```

# Offer block

Use this block only when the offer rule is met.

```text
Because you have completed an ESOP valuation before, your company is eligible for a 10% invoice review offer.

Send us your most recent ESOP valuation invoice before your next refresh and we will apply 10% off your next ESOP valuation report with Bain Squared.
```

# HTML copy blocks for Google Apps Script

Use these as clean copy blocks if sending HTML email.

## HOT HTML block

```html
<p>Hello {{first_name}},</p>

<p>Thank you for completing the Bain Squared Valuation Assessment.</p>

<p>Based on your answers, <strong>{{assessment_sentence}}</strong></p>

<p>I have attached your <em>{{report_title}}</em>. It gives you a clear baseline before you make or explain your next ESOP decision.</p>

<p>Because your answers point to a near term or governance sensitive issue, I recommend booking a short call so we can understand your timeline, current documents, and what needs to be prepared before your next grant, audit, board discussion, investor review, or employee conversation.</p>

{{offer_block_html_if_eligible}}

<p>
  <a href="{{booking_link}}" style="display:inline-block;background:#073f31;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:4px;font-weight:600;">
    Book a discovery call
  </a>
</p>

<hr style="border:none;border-top:1px solid #dddddd;margin:28px 0;">

<p>Best regards,</p>

<p>
  <strong>Vanessa</strong><br>
  Bain Squared Valuation Advisory<br>
  <a href="mailto:assessment@bainsquared.com">assessment@bainsquared.com</a>
</p>
```

## WARM HTML block

```html
<p>Hello {{first_name}},</p>

<p>Thank you for completing the Bain Squared Valuation Assessment.</p>

<p>Based on your answers, <strong>{{assessment_sentence}}</strong></p>

<p>I have attached your <em>{{report_title}}</em>. It is meant to help you understand the key questions around ESOP structure, valuation, communication, and compliance before your next decision.</p>

<p>{{warm_support_sentence}}</p>

{{offer_block_html_if_eligible}}

<hr style="border:none;border-top:1px solid #dddddd;margin:28px 0;">

<p>Best regards,</p>

<p>
  <strong>Vanessa</strong><br>
  Bain Squared Valuation Advisory<br>
  <a href="mailto:assessment@bainsquared.com">assessment@bainsquared.com</a>
</p>
```

## COLD HTML block

```html
<p>Hello {{first_name}},</p>

<p>Thank you for completing the Bain Squared Valuation Assessment.</p>

<p>Based on your answers, <strong>{{assessment_sentence}}</strong></p>

<p>I have attached your <em>{{report_title}}</em> so you can review the basics at your own pace.</p>

<p>There does not appear to be an immediate ESOP valuation or advisory need based on your responses, but the report should help you understand what to watch for as your company grows.</p>

<hr style="border:none;border-top:1px solid #dddddd;margin:28px 0;">

<p>Best regards,</p>

<p>
  <strong>Vanessa</strong><br>
  Bain Squared Valuation Advisory<br>
  <a href="mailto:assessment@bainsquared.com">assessment@bainsquared.com</a>
</p>
```

## Offer HTML block

```html
<div style="background:#eaf4ef;border:1px solid #c8ded5;padding:16px;margin:20px 0;">
  <p style="margin:0 0 8px 0;"><strong>Your company is eligible for a 10% invoice review offer.</strong></p>
  <p style="margin:0;">Send us your most recent ESOP valuation invoice before your next refresh and we will apply 10% off your next ESOP valuation report with Bain Squared.</p>
</div>
```

# Google Apps Script routing logic

Use this logic in the script.

```javascript
function getEmailTemplateType(leadTemperature) {
  if (leadTemperature === "hot") return "HOT";
  if (leadTemperature === "warm" || leadTemperature === "warm_low") return "WARM";
  return "COLD";
}

function shouldIncludeBookingLink(payload) {
  return payload.lead_temperature === "hot";
}

function shouldIncludeOffer(payload) {
  return (
    payload.track === "existing_esop" &&
    payload.answers &&
    payload.answers.q3a_formal_valuation === "yes"
  );
}

function shouldNotifySales(payload) {
  if (payload.lead_temperature === "hot") return true;
  if ((payload.lead_temperature === "warm" || payload.lead_temperature === "warm_low") && payload.lead_score >= 70) return true;
  return false;
}
```

# Final implementation checklist

Before launch, test these cases.

```text
A1 hot missing valuation sends Compliance and Governance Guide, includes booking link, excludes 10% offer.
A2 hot provider review sends Compliance and Governance Guide, includes booking link, includes 10% offer.
A3 warm satisfied provider sends Compliance and Governance Guide, excludes booking link, includes 10% offer.
B1 hot planning pressure near sends concern based report, includes booking link, excludes 10% offer.
B2 to B4 warm planning cases send concern based report, exclude booking link, exclude 10% offer.
C1 and U1 hot pressure near send concern based report, include booking link, exclude 10% offer.
C2, C3, U2, and U3 warm cases send concern based report, exclude booking link, exclude 10% offer.
C4 and U4 cold cases send concern based report, exclude booking link, exclude 10% offer, and use no sales prompt.
Cold plus dilution still sends ESOP Structuring and Dilution Guide.
Cold plus legal, tax, or compliance still sends ESOP Communication and Legal Guide.
Warm plus not sure where to start still sends ESOP Starter Guide.
```
