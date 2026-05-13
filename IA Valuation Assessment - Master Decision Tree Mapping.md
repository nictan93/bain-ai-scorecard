# IA Valuation Assessment - Master Decision Tree Mapping

> **Status:** Master file.
>
> **Companion file:** `IA_Valuation_Result_Page_Copy.md` (customer-facing copy and result page logic).

## Purpose

This file defines the canonical decision tree logic for Bain Squared's IA Valuation Assessment, covering both Employee Stock Ownership Plans (ESOP) and broader Intangible Value.

The assessment must not push every respondent toward a paid engagement. The purpose is to separate respondents with active commercial events, pressure, or value gaps from those who are merely exploring or early in their journey.

---

# 1. Core Architecture

The system evaluates answers in this order:

```
1. Ask Q1 (Unified Entry Point) to capture the primary objective.
2. Apply the hard-trigger branch from Q1 to select the `evaluation_track` (ESOP or Intangible Value).
3. If ESOP:
   a. Ask ESOP Q2 (Status).
   b. Apply ESOP hard-trigger branch.
   c. Ask branch-relevant diagnostic questions (Q3A/Q4A or Q3BC/Q4BC/Q5BC).
   d. Compute ESOP derived groups.
4. If Intangible Value:
   a. Ask IV Q2-Q9.
   b. Apply IV hard-trigger branch from Q6 (Reason/Event).
   c. Compute IV derived groups.
5. Apply the deterministic classification matrix for the chosen track.
6. Assign result code, report key, lead temperature, lead score, CTA policy, and payload.
7. Send the structured payload to the result page, email automation, CRM, and internal notification logic.
```

---

# 2. Customer-Facing Assessment Positioning

## Assessment title

```
Your business could be [worth] more than you think

**Layout instruction:**  
Keep this title on two lines. Insert the line break immediately after “[worth]”.
```

## Subtitle

```
Most companies are valued on revenue, profit, or industry benchmarks. But your brand, customers, contracts, software, data, IP and employee option plan carry more value that you think.

Take the assessment to find out whether your business has hidden value that may support ESOP valuation, fundraising, M&A, or a stronger valuation discussion.

**Layout instruction:**  
Keep this subtitle on two lines. Insert the line break immediately after “customers,” and "support".
```
## Primary Button

```
Start the assessment

```

## Button Supporting Text

```
No credit card. No login. Takes under 60 seconds.
Complete the assessment and receive a surprise reward if eligible.

**Layout instruction:**  
Keep this subtitle on two lines. Insert the line break immediately after “60 seconds.”.

```

# Assessment Intro Page Trust Bar

Column 1 (icon: shield / checkmark)
Heading: See what your numbers may not show.
Body: The assessment reviews the business assets that may not show clearly in your financials, including brand, customer relationships, contracts, software, data, IP, ESOPs, and operating systems.

Column 2 (icon: bar chart)
Heading: Know what needs to be proven.
Body: A higher valuation needs proof. The assessment shows whether your value drivers are clear enough for investors, auditors, buyers, or board members to understand.

Column 3 (icon: calendar / next step)
Heading: Leave with a clear next step.
Body: Your result tells you what to do next, whether that means ESOP valuation, a hidden value review, or preparing for fundraising, M&A, or shareholder discussions.

---

# 3. Shared Suite Policies

These policies apply to Financial Transformation, AI Automation, and IA Valuation.

## 3.1 Lead temperature and lead score base

| Internal `lead_temperature` | User-facing `lead_temperature_ui` | Base lead score |
| --- | --- | --- |
| `hot` | High fit | 70 |
| `warm` | Potential fit | 40 |
| `warm_low` | Potential fit | 30 |
| `cold` | Education track | 10 |

Implementation rule:

```
lead_temperature is internal sales classification.
lead_temperature_ui is the polite user-facing label.
warm_low is internal only and must never appear on the user interface.
```

## 3.2 Booking and CTA policy

| `lead_temperature` | Result page booking CTA | Report booking prompt | Email booking link |
| --- | --- | --- | --- |
| `hot` | Show only after valid business email submission | Strong prompt | Include |
| `warm` | Do not show on result page | Soft prompt allowed | Hide unless a nurture sequence is used |
| `warm_low` | Do not show on result page | Soft prompt allowed | Hide unless a nurture sequence is used |
| `cold` | Do not show on result page | No prompt | Hide |

No assessment may automatically redirect users to a booking page.

## 3.3 Business email validation

Every report request form must require a business email. The report must not be sent to personal email domains.

Blocked consumer domains:`gmail.com`, `yahoo.com`, `hotmail.com`, `outlook.com`, `live.com`, `msn.com`, `icloud.com`, `me.com`, `mac.com`, `proton.me`, `protonmail.com`, `aol.com`, `mail.com`, `gmx.com`, `qq.com`, `163.com`, `126.com`

Error copy:`A business email address helps us ensure your report is delivered correctly.`

## 3.4 Sales notification rule

Notify sales when: `lead_temperature = hot`Also notify sales when: `lead_temperature = warm AND lead_score >= 70`Do not notify sales by default for `warm_low` or `cold`.

## 3.5 Delivery policy

```
delivery_policy = send_report_after_business_email_validation
calendar_redirect_policy = never_auto_redirect
```

---

# 4. Unified Entry Point (Q1)

Q1 is shown to every respondent and acts as the master track selector.

## 4.1 Q1 - Objective

```
question_key = objective
type = single_select
required = true
```

Question text:

```
Are any of the following related to what you are trying to achieve?
```

| Display option | Helper text | Answer key | `evaluation_track` |
| --- | --- | --- | --- |
| I want to retain key employees using Employee Stock Options (ESOP). | Good choice. ESOPs can be a powerful way to reward key employees without relying only on higher cash salaries. The next few questions will help you understand whether you may need ESOP valuation support. | `retain_talent` | `esop_track` |
| I already issue Employee Stock Options (ESOP) and need valuation support. | You are in the right place. Keeping your valuation defensible is critical for audit and compliance. We will ask a few questions to see where you stand. | `need_esop_support` | `esop_track` |
| I am raising funds and want a stronger valuation. | Investors often anchor on basic multiples. We will help you figure out if you have hidden assets that can strengthen your story. | `raising_funds` | `iv_track` |
| I may sell, restructure, or bring in investors. | Preparation is key. Buyers will discount what they cannot verify. Let's see how defensible your value is today. | `selling_restructuring` | `iv_track` |
| I think my business is worth more than a basic profit multiple. | Standard accounting often misses the real value drivers. We will help you identify what might be missing from your books. | `think_company_worth_more` | `iv_track` |
| I am not sure. I just want to check if there is hidden value. | Exploring is a great first step. Let's walk through some common areas where companies find unexpected value. | `check_hidden_value` | `iv_track` |

---

# 5. ESOP Track Questions

Ask only if `evaluation_track = esop_track`.

## 5.1 ESOP Q2 - ESOP status (hard-trigger branch question)

```
question_key = esop_status
type = single_select
required = true
```

Question text:

```
Do you currently have an Employee Stock Options Plan (ESOP)?
```

| Display option | Helper text | Answer key | ESOP Branch | Next question |
| --- | --- | --- | --- | --- |
| Yes, we already have one. | Great. Since it is already in place, the main focus now is making sure the valuation and compliance hold up under scrutiny. | `yes_existing` | `existing_esop` | ESOP Q3A |
| No, but we are planning to set one up. | Planning ahead is the right approach. Understanding the valuation requirements before you issue options helps you set realistic expectations for employees and investors. | `planning` | `planning_esop` | ESOP Q3BC |
| No, we do not have one yet. | That is perfectly fine. Many companies do not need one early on. Let's see if the timing is right to start thinking about it. | `no` | `no_esop` | ESOP Q3BC |
| Not sure. | This is more common than you might think. Sometimes informal promises or draft documents create confusion. We can help you clarify your position. | `not_sure` | `unsure_esop` | ESOP Q3BC |

## 5.2 ESOP Branch A (Existing ESOP)

Ask when ESOP Branch = `existing_esop`.

### ESOP Q3A - Formal valuation

```
question_key = formal_valuation
type = single_select
required = true
```

Question text:

```
Has your company completed a formal ESOP valuation?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| Yes, we have completed a formal ESOP valuation. | Excellent. A third-party valuation gives you a defensible baseline for auditors and the board. | `yes` |
| No, we have not completed one. | This is a common gap. Issuing options without a formal valuation can create compliance and tax risks later. | `no` |
| Not sure. | If you cannot easily locate the valuation report, it may not hold up during an audit. It is best to verify this soon. | `not_sure` |

*Rule: If **`no`** or **`not_sure`**, classify as HOT and skip Q4A.*

### ESOP Q4A - Provider satisfaction

Ask only when ESOP Q3A = `yes`.

```
question_key = provider_satisfaction
type = single_select
required = true
```

Question text:

```
How satisfied are you with your current ESOP valuation provider?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| Yes, we are satisfied. | That is great to hear. A reliable partner makes the annual refresh process much smoother. | `satisfied` |
| No, we are not satisfied. | We understand. Issues with speed, price, or report quality are common reasons companies look for alternatives. | `not_satisfied` |
| Not sure. | It is always healthy to benchmark your provider occasionally to ensure you are getting the best commercial value. | `not_sure` |

## 5.3 ESOP Branches B, C, U (Planning, No ESOP, Unsure)

Ask when ESOP Branch IN (`planning_esop`, `no_esop`, `unsure_esop`).

### ESOP Q3BC - Stakeholder pressure

```
question_key = stakeholder_pressure
type = single_select
required = true
```

Question text:

```
Is anyone currently asking about equity, options, or employee incentives?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| Yes, investors, auditors, board members, or employees are actively asking. | Active questions mean you need a clear, structured answer soon before expectations harden. | `yes_actively` |
| We expect someone to ask soon. | It is smart to anticipate this. Having a plan ready puts you in a much stronger position. | `expected_soon` |
| No, but we want to prepare properly. | Proactive planning is the best way to avoid rushed, expensive mistakes later. | `no_but_prepare` |
| No, we are only exploring. | Exploring is fine. We will help you understand the basics without any pressure. | `no_exploring` |
| Not sure. | If you are unsure, it is safest to assume the question will come up at your next major growth milestone. | `not_sure` |

### ESOP Q4BC - Timing

```
question_key = timing
type = single_select
required = true
```

Question text:

```
If you needed to act on this, what is your timing?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| Immediately | We can help you move quickly to get the right structure in place. | `immediately` |
| Within 1 to 3 months | This gives us a good window to design a plan that aligns with your next quarter's goals. | `within_1_to_3_months` |
| In 3 to 6 months | You have time to carefully consider dilution and allocation before committing. | `within_3_to_6_months` |
| More than 6 months away | Perfect. You can learn the fundamentals now and act when the business is ready. | `more_than_6_months` |
| Not sure | No problem. We will focus on education for now. | `not_sure` |

### ESOP Q5BC - Main concern

```
question_key = main_concern
type = single_select
required = true
```

Question text:

```
What is the main thing you need help thinking through?
```

| Display option | Helper text | Answer key | Report key |
| --- | --- | --- | --- |
| How much equity to allocate | Setting the right pool size is critical to protect founders from unnecessary dilution. | `allocation` | `esop_structuring_dilution` |
| How the options should be valued | Getting the strike price right is essential for both tax compliance and employee motivation. | `valuation` | `esop_structuring_dilution` |
| Dilution and shareholder impact | We can help you model how future rounds will impact existing ownership. | `dilution` | `esop_structuring_dilution` |
| Legal, tax, compliance, or audit treatment | Proper documentation protects the company during due diligence and audits. | `legal_tax_compliance` | `esop_communication_legal` |
| How to communicate options to employees | Options only retain talent if the employees actually understand what they are worth. | `employee_communication` | `esop_communication_legal` |
| Not sure where to start | That is okay. Our starter guide covers the fundamental decisions you will need to make. | `not_sure_where_to_start` | `esop_starter` |

---

# 6. Intangible Value Track Questions

Ask only if `evaluation_track = iv_track`. All IV respondents see all 8 questions.

## 6.1 IV Q2 - Company stage

```
question_key = company_stage
type = single_select
required = true
```

Question text:

```
What stage is your company currently at?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| Bootstrapped or Seed stage. | Early-stage companies often have hidden value in their foundational IP or initial customer data. | `bootstrapped_seed` |
| Series A or B. | As you scale, proving the value of your operating systems and customer relationships becomes critical for investors. | `series_a_b` |
| Growth or Scale-up. | Growth-stage companies typically have more complex cap tables, larger option pools, and more scrutiny from investors and auditors. A formal valuation is usually non-negotiable at this stage. | `growth_scaleup` |
| Mature or Profitable SME. | Established businesses often possess deep, unrecorded value in long-term contracts and brand reputation. | `mature_profitable_sme` |

## 6.2 IV Q3 - Headcount

```
question_key = headcount
type = single_select
required = true
```

Question text:

```
Roughly how many employees do you have?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| 1 to 10 | Small teams often hold immense value in specialist knowledge and founder relationships. | `1_10` |
| 11 to 50 | As the team grows, documenting processes and workflows becomes a key driver of enterprise value. | `11_50` |
| 51 to 200 | At this size, your internal technology and data systems are likely significant, unrecorded assets. | `51_200` |
| More than 200 | Large organizations have complex intangible assets that require rigorous documentation for M&A or audit. | `more_than_200` |

## 6.3 IV Q4 - Valuation method

```
question_key = iv_valuation_method
type = single_select
required = true
```

Question text:

```
How is your company usually valued today?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| Profit multiple | Profit multiples are standard, but they often ignore the future value of your IP and brand. | `profit_multiple` |
| Revenue multiple | Revenue multiples reward growth, but may miss the stickiness of your customer relationships. | `revenue_multiple` |
| Asset value | Pure asset valuations almost always undervalue software, data, and human capital. | `asset_value` |
| Comparable companies | Benchmarks are useful, but they fail to capture what makes your specific operating system unique. | `comparable_companies` |
| Investor negotiation | Relying purely on negotiation means whoever has the best narrative wins. Evidence gives you leverage. | `investor_negotiation` |
| I do not know | That is fine. We will help you understand how buyers and investors will likely look at your business. | `do_not_know` |

## 6.4 IV Q5 - Value gap belief

```
question_key = iv_value_gap_belief
type = single_select
required = true
```

Question text:

```
Do you feel this valuation method misses important parts of your company?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| Yes, definitely | We hear this often. The challenge is turning that belief into evidence a buyer will accept. | `yes_definitely` |
| Maybe | It is worth investigating. Small adjustments to how you present your assets can significantly impact valuation. | `maybe` |
| Not sure | Many founders are surprised to learn what actually drives enterprise value in a transaction. | `not_sure` |
| No | If your current method captures everything, you are in a strong, transparent position. | `no` |

## 6.5 IV Q6 - Reason (hard-trigger event question)

```
question_key = reason_for_assessment
type = single_select
required = true
```

Question text:

```
Why do you want a stronger valuation?
```

| Display option | Helper text | Answer key | Event Group | Report Key |
| --- | --- | --- | --- | --- |
| We are raising funds | Investors will anchor on simple metrics unless you provide structured evidence of your intangible assets. | `raising_funds` | `capital_event` | `iv_fundraising_guide` |
| We may sell the company | Buyers will discount any value they cannot verify during due diligence. Documentation is critical. | `may_sell_company` | `exit_event` | `iv_mna_exit_guide` |
| We are bringing in investors or shareholders | New stakeholders need to understand the full picture to agree on a fair entry price. | `bringing_investors_shareholders` | `capital_event` | `iv_fundraising_guide` |
| We are planning succession or restructuring | Internal transfers require a defensible valuation to ensure fairness and tax compliance. | `succession_restructuring` | `exit_event` | `iv_mna_exit_guide` |
| We need to explain our value to the board, bank, auditor, or partners | Stakeholders trust structured evidence more than confident claims. We can help you build that structure. | `board_bank_auditor_partners` | `stakeholder_event` | `iv_intangible_asset_discovery_guide` |
| We want to understand what the company is really worth | A strategic review helps you identify which assets to invest in before you actually need to sell. | `understand_true_worth` | `strategic_review` | (Conditional) |
| No specific reason. Just curious. | Curiosity is a great place to start. We will show you what to look out for as you grow. | `just_curious` | `curiosity` | (Conditional) |

## 6.6 IV Q7 - Uncaptured assets (Multi-select)

```
question_key = iv_uncaptured_assets
type = multi_select
required = true
```

Question text:

```
What do you think your current valuation does not fully capture?
```

| Display option | Helper text | Answer key | Asset Category |
| --- | --- | --- | --- |
| Brand or reputation | A strong brand lowers customer acquisition costs and creates pricing power. | `brand_reputation` | `supporting` |
| Customer relationships | Deep account knowledge and high retention are massive value drivers for buyers. | `customer_relationships` | `supporting` |
| Repeat customers or recurring revenue | Predictable revenue streams are heavily rewarded in modern valuations. | `recurring_revenue` | `anchor` |
| Long-term contracts | Multi-year lock-ins provide the revenue certainty that investors look for. | `long_term_contracts` | `anchor` |
| Software, platform, app, or internal technology | In-house tech that creates operational leverage is a highly defensible asset. | `software_platform_internal_tech` | `anchor` |
| IP, trademarks, patents, designs, or know-how | Registered IP provides a legal moat that directly increases enterprise value. | `ip_trademarks_patents_designs_knowhow` | `anchor` |
| Operating systems, processes, or playbooks | Documented workflows prove the business can scale without relying entirely on the founder. | `operating_systems_processes_playbooks` | `supporting` |
| Technical team or specialist knowledge | Hard-to-replace expertise is valuable, but only if the knowledge is institutionalized. | `technical_team_specialist_knowledge` | `supporting` |
| None of the above | That is fine. Intangible value is not the primary driver for every business model. | `none_of_the_above` | `none` |
| I am not sure | We can help you map your business to see if any of these apply to you. | `not_sure` | `none` |

*Validation: **`none_of_the_above`** and **`not_sure`** are exclusive.*

## 6.7 IV Q8 - Documentation

```
question_key = documentation_strength
type = single_select
required = true
```

Question text:

```
Do you have any documentation, contracts, data, or reports that relate to these assets?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| Yes, clearly | Excellent. Clear documentation means your intangible value is already highly defensible. | `yes_clearly` |
| Somewhat | Partial evidence is a good start, but it may not survive rigorous due diligence. | `somewhat` |
| Not really | If it only exists in your head, buyers and auditors will likely treat it as a risk, not an asset. | `not_really` |
| No | Without documentation, intangible value is very difficult to monetize in a transaction. | `no` |
| I am not sure | Finding out what you actually have on file is the critical first step. | `not_sure` |

## 6.8 IV Q9 - Timing

```
question_key = timing
type = single_select
required = true
```

Question text:

```
When might you need to defend your valuation?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| Now | We can help you organize your evidence quickly to support your current conversations. | `now` |
| Within 3 months | This is a good window to build a structured, defensible valuation narrative. | `within_3_months` |
| Within 6 months | You have time to identify gaps in your documentation and fix them before the pressure hits. | `within_6_months` |
| Within 12 months | Perfect. Preparing early gives you maximum leverage when the event actually happens. | `within_12_months` |
| No clear timeline yet | Learning the framework now means you will be ready whenever the time comes. | `no_clear_timeline` |

## 6.9 IV Q10 - Primary concern

```
question_key = primary_concern
type = single_select
required = true
```

Question text:

```
What is your biggest concern about your company's valuation?
```

| Display option | Helper text | Answer key |
| --- | --- | --- |
| Investors may not understand the true value of the company | We can help you translate operational strengths into metrics investors care about. | `investors_misunderstand` |
| Buyers may value us too cheaply | A well-documented intangible asset map is your best defense against buyer discounts. | `buyers_value_too_cheaply` |
| Our brand, software, data, IP, or customer base is not reflected properly | These are classic blind spots in standard accounting. We specialize in bringing them to light. | `assets_not_reflected` |
| We do not know how to prove the company is worth more | Structuring the evidence is exactly what we do. You do not have to figure it out alone. | `cannot_prove_value` |
| We are being valued only on profit or revenue | Breaking out of the multiple-trap requires a shift in how you present the business. | `valued_only_on_profit_or_revenue` |
| We are not concerned. Just exploring. | Exploring without pressure is the best way to make smart long-term decisions. | `not_concerned_exploring` |

---

# 7. Derived Groups

## 7.1 ESOP Derived Groups

- **ESOP Status Group:** `existing`, `planning`, `none`, `unsure` (from ESOP Q2)

- **Pressure Group:** `active_pressure`, `expected_pressure`, `no_pressure` (from ESOP Q3BC)

- **Timing Group:** `near_term`, `planned`, `far_or_unsure` (from ESOP Q4BC)

- **Concern Group:** `structuring`, `legal_communication`, `starter` (from ESOP Q5BC)

## 7.2 Intangible Value Derived Groups

- **Event Group:** `capital_event`, `exit_event`, `stakeholder_event`, `strategic_review`, `curiosity` (from IV Q6)

- **Asset Signal Group:** `strong_asset_signal`, `moderate_asset_signal`, `weak_or_uncertain_asset_signal` (from IV Q7)

- **Documentation Group:** `strong_evidence`, `partial_evidence`, `weak_or_missing_evidence` (from IV Q8)

- **Pain Group:** `strong_pain`, `moderate_pain`, `low_or_no_pain` (from IV Q5 & Q10)

- **Timing Group:** `near_term`, `planned`, `no_timeline` (from IV Q9)

- **Value Gap Group:** `strong_value_gap`, `moderate_value_gap`, `weak_value_gap` (derived from Asset, Doc, and Pain groups)

---

# 8. Deterministic Classification Matrix

## 8.1 ESOP Classification

**Branch A - Existing ESOP**

| Q3A formal valuation | Q4A provider satisfaction | Result code | `lead_temperature` | Report key |
| --- | --- | --- | --- | --- |
| `no` or `not_sure` | not asked | `ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT` | `hot` | `esop_compliance_governance` |
| `yes` | `not_satisfied` | `ESOP_A2_PROVIDER_REVIEW_HOT` | `hot` | `esop_compliance_governance` |
| `yes` | `not_sure` | `ESOP_A2_PROVIDER_REVIEW_HOT` | `hot` | `esop_compliance_governance` |
| `yes` | `satisfied` | `ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM` | `warm` | `esop_compliance_governance` |

**Branch B - Planning ESOP**

| Pressure | Timing | Result code | `lead_temperature` |
| --- | --- | --- | --- |
| active/expected | near_term | `ESOP_B1_PLANNING_PRESSURE_NEAR_HOT` | `hot` |
| active/expected | planned/far | `ESOP_B2_PLANNING_PRESSURE_FAR_WARM` | `warm` |
| no_pressure | near_term | `ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM` | `warm` |
| no_pressure | planned/far | `ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW` | `warm_low` |

**Branch C - No ESOP**

| Pressure | Timing | Result code | `lead_temperature` |
| --- | --- | --- | --- |
| active/expected | near_term | `ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT` | `hot` |
| active/expected | planned/far | `ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM` | `warm` |
| no_pressure | near_term | `ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM` | `warm` |
| no_pressure | planned/far | `ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD` | `cold` |

**Branch U - Unsure ESOP**

| Pressure | Timing | Result code | `lead_temperature` |
| --- | --- | --- | --- |
| active/expected | near_term | `ESOP_U1_UNSURE_PRESSURE_NEAR_HOT` | `hot` |
| active/expected | planned/far | `ESOP_U2_UNSURE_PRESSURE_FAR_WARM` | `warm` |
| no_pressure | near_term | `ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM` | `warm` |
| no_pressure | planned/far | `ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD` | `cold` |

## 8.2 Intangible Value Classification

| Event group | Timing | Value gap | Result code | Lead |
| --- | --- | --- | --- | --- |
| capital_event | near_term | strong or moderate | `IV_CAPITAL_NEAR_VALUE_GAP_HOT` | Hot |
| capital_event | near_term | weak | `IV_CAPITAL_NEAR_WEAK_SIGNAL_WARM` | Warm |
| capital_event | planned | any | `IV_CAPITAL_PLANNED_WARM` | Warm |
| capital_event | no_timeline | strong or moderate | `IV_CAPITAL_NO_TIMELINE_VALUE_GAP_WARM` | Warm |
| capital_event | no_timeline | weak | `IV_CAPITAL_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW` | Warm Low |
| exit_event | near_term | strong or moderate | `IV_EXIT_NEAR_VALUE_GAP_HOT` | Hot |
| exit_event | near_term | weak | `IV_EXIT_NEAR_WEAK_SIGNAL_WARM` | Warm |
| exit_event | planned | any | `IV_EXIT_PLANNED_WARM` | Warm |
| exit_event | no_timeline | strong or moderate | `IV_EXIT_NO_TIMELINE_VALUE_GAP_WARM` | Warm |
| exit_event | no_timeline | weak | `IV_EXIT_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW` | Warm Low |
| stakeholder_event | near_term | strong or moderate | `IV_STAKEHOLDER_NEAR_VALUE_GAP_HOT` | Hot |
| stakeholder_event | near_term | weak | `IV_STAKEHOLDER_NEAR_WEAK_SIGNAL_WARM` | Warm |
| stakeholder_event | planned | strong or moderate | `IV_STAKEHOLDER_PLANNED_VALUE_GAP_WARM` | Warm |
| stakeholder_event | planned | weak | `IV_STAKEHOLDER_PLANNED_WEAK_SIGNAL_WARM_LOW` | Warm Low |
| stakeholder_event | no_timeline | strong or moderate | `IV_STAKEHOLDER_NO_TIMELINE_VALUE_GAP_WARM` | Warm |
| stakeholder_event | no_timeline | weak | `IV_STAKEHOLDER_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW` | Warm Low |
| strategic_review | near_term | strong or moderate | `IV_STRATEGIC_NEAR_VALUE_GAP_WARM` | Warm |
| strategic_review | near_term | weak | `IV_STRATEGIC_NEAR_WEAK_SIGNAL_WARM_LOW` | Warm Low |
| strategic_review | planned | strong or moderate | `IV_STRATEGIC_PLANNED_VALUE_REVIEW_WARM` | Warm |
| strategic_review | no_timeline | strong | `IV_STRATEGIC_NO_TIMELINE_VALUE_GAP_WARM_LOW` | Warm Low |
| strategic_review | any (other) | moderate | `IV_STRATEGIC_MODERATE_SIGNAL_WARM_LOW` | Warm Low |
| strategic_review | any | weak | `IV_STRATEGIC_WEAK_SIGNAL_COLD` | Cold |
| curiosity | any | strong | `IV_CURIOSITY_VALUE_SIGNAL_WARM_LOW` | Warm Low |
| curiosity | near_term | moderate | `IV_CURIOSITY_NEAR_MODERATE_SIGNAL_WARM_LOW` | Warm Low |
| curiosity | any | weak | `IV_CURIOSITY_WEAK_SIGNAL_COLD` | Cold |

---

# 9. Result Code to Result Page Mapping

**ESOP Variants:**

- `ESOP_A1_...` -> IA_RP01

- `ESOP_A2_...` -> IA_RP02

- `ESOP_A3_...` -> IA_RP03

- `ESOP_B1_...` -> IA_RP04

- `ESOP_B2_...` -> IA_RP05

- `ESOP_B3_...` / `ESOP_B4_...` -> IA_RP06

- `ESOP_C1_...` -> IA_RP07

- `ESOP_C2_...` -> IA_RP08

- `ESOP_C3_...` -> IA_RP09

- `ESOP_C4_...` -> IA_RP10

- `ESOP_U1_...` -> IA_RP11

- `ESOP_U2_...` / `ESOP_U3_...` -> IA_RP12

- `ESOP_U4_...` -> IA_RP13

**Intangible Value Variants:**

- `IV_CAPITAL_NEAR_VALUE_GAP_HOT` -> IA_RP14

- `IV_EXIT_NEAR_VALUE_GAP_HOT` -> IA_RP15

- `IV_STAKEHOLDER_NEAR_VALUE_GAP_HOT` -> IA_RP16

- `IV_CAPITAL_..._WARM` / `_WARM_LOW` -> IA_RP17

- `IV_EXIT_..._WARM` / `_WARM_LOW` -> IA_RP18

- `IV_STAKEHOLDER_...` / `IV_STRATEGIC_...` / `IV_CURIOSITY_...` (Warm/Warm Low) -> IA_RP19

- `IV_STRATEGIC_NEAR_WEAK_SIGNAL_WARM_LOW` -> IA_RP20

- `IV_..._COLD` -> IA_RP21

---

# 10. QA Checklist

```
[ ] Q1 successfully routes to either the ESOP or IV track.
[ ] All multiple-choice questions include contextual helper text.
[ ] ESOP hard-trigger branching relies exclusively on Q2.
[ ] IV hard-trigger branching relies exclusively on Q6 (Reason).
[ ] Lead score is never used to select the branch or track.
[ ] Result page mapping ensures no mixing of UI lead temperatures.
[ ] Personal email domains are blocked.
[ ] Hot leads see booking CTA only after email submission.
[ ] Warm/Cold leads do not see booking CTA on the result page.
```

