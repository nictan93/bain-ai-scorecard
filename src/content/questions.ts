export type Track = "esop" | "business_value";

export type ResultKey =
  // ESOP outcomes
  | "esop_hot_compliance"       // Has ESOP, no formal valuation
  | "esop_hot_dissatisfied"     // Has ESOP, dissatisfied with provider
  | "esop_hot_active_ask"       // No/planning ESOP, someone asking, near-term
  | "esop_warm_satisfied"       // Has ESOP, satisfied with provider
  | "esop_warm_active_ask"      // No/planning ESOP, someone asking, far-term
  | "esop_warm_near_term"       // No/planning ESOP, nobody asking, near-term
  | "esop_cold"                 // No/planning ESOP, nobody asking, far-term
  // Business Value outcomes
  | "bv_hot"
  | "bv_warm_transaction"
  | "bv_warm_assets"
  | "bv_cold";

export type DeliverableKey =
  // ESOP deliverables
  | "esop_compliance_guide"
  | "esop_structuring_guide"
  | "esop_communication_guide"
  | "esop_starter_guide"
  // Business Value deliverables
  | "bv_fundraising_guide"
  | "bv_mna_guide"
  | "bv_intangibles_guide"
  | "bv_starter_guide";

export type BackendTag =
  | "esop_hot_lead"
  | "esop_warm_lead"
  | "esop_cold_lead"
  | "esop_compliance_gap"
  | "esop_dissatisfied"
  | "esop_active_ask"
  | "esop_stakeholder_pressure"
  | "fundraising_valuation_lead"
  | "brand_valuation_lead"
  | "software_data_valuation_lead"
  | "ownership_risk_lead"
  | "strategic_transaction_lead";

export interface Option {
  id: string;
  label: string;
  score?: number;
  routesTo?: Track;
  tags?: BackendTag[];
  popup?: string;
}

export interface Question {
  id: string;
  track: "universal" | Track;
  order: number;
  type: "single_select" | "multi_select" | "open_text";
  prompt: string;
  helper?: string;
  options?: Option[];
  required: boolean;
  cap?: number;
}

export const QUESTIONS: Question[] = [

  // ── Q1: Entry / routing ───────────────────────────────────────────────────
  {
    id: "q1_routing",
    track: "universal",
    order: 0,
    type: "single_select",
    prompt: "What are you trying to solve?",
    required: true,
    options: [
      {
        id: "retain_key_employees_using_esops",
        label: "I want to retain key employees using ESOPs.",
        routesTo: "esop",
        popup:
          "Good choice. ESOPs can be a powerful way to reward key employees without relying only on higher cash salaries. The next few questions will help you understand whether you may need ESOP valuation support.",
      },
      {
        id: "already_have_esops_need_valuation_support",
        label: "I already have ESOPs and need valuation support.",
        routesTo: "esop",
        tags: ["esop_hot_lead"],
        popup:
          "You are already in the right zone. If your company has issued options, proper valuation support may be important for audit, investor, board, or governance purposes.",
      },
      {
        id: "raising_funds_want_stronger_valuation",
        label: "I am raising funds and want a stronger valuation.",
        routesTo: "business_value",
        tags: ["fundraising_valuation_lead"],
        popup:
          "That makes sense. Investors usually look for evidence, not just ambition. This assessment will help identify whether your business has hidden value that could support a stronger valuation conversation.",
      },
      {
        id: "may_sell_restructure_or_bring_in_investors",
        label: "I may sell, restructure, or bring in investors.",
        routesTo: "business_value",
        tags: ["strategic_transaction_lead"],
        popup:
          "This is exactly when valuation matters. Before buyers, shareholders, or investors set the price, it helps to understand what value may not be obvious from your financials alone.",
      },
      {
        id: "business_worth_more_than_basic_profit_multiple",
        label: "I think my business is worth more than a basic profit multiple.",
        routesTo: "business_value",
        popup:
          "You may be right. Many businesses are valued too simply based on profit or revenue multiples, even when they have brand, customers, contracts, software, data, or systems that create additional value.",
      },
      {
        id: "not_sure_check_hidden_value",
        label: "I am not sure. I just want to check if there is hidden value.",
        routesTo: "business_value",
        popup:
          "That is a good place to start. Many business owners do not realise what counts as hidden value until they map it out clearly.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ESOP TRACK
  // ══════════════════════════════════════════════════════════════════════════

  // ── a_esop_status: Do you currently have an ESOP? ─────────────────────────
  {
    id: "a_esop_status",
    track: "esop",
    order: 1,
    type: "single_select",
    prompt: "Do you currently have an ESOP or employee share option plan?",
    required: true,
    options: [
      {
        id: "esop_yes_have_one",
        label: "Yes, we already have one.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "You are already ahead of most companies. Having an ESOP in place is a meaningful commitment to your team. The next few questions will help us understand what valuation support you may need.",
      },
      {
        id: "esop_planning",
        label: "No, but we are planning to set one up.",
        score: 2,
        tags: ["esop_warm_lead"],
        popup:
          "Planning ahead is the right approach. Understanding the valuation requirements before you issue options helps you set realistic expectations for employees and investors.",
      },
      {
        id: "esop_no_not_yet",
        label: "No, we do not have one yet.",
        score: 1,
        popup:
          "That is fine. The assessment will help you understand whether ESOPs might be relevant for your situation and what would be required to set one up properly.",
      },
      {
        id: "esop_not_sure",
        label: "Not sure.",
        score: 1,
        popup:
          "That is okay. The remaining questions will help clarify whether ESOP valuation is something you need to think about.",
      },
    ],
  },

  // ── a_context_stage: Company stage (CRM data) ────────────────────────────
  {
    id: "a_context_stage",
    track: "esop",
    order: 2,
    type: "single_select",
    prompt: "What stage is your company currently at?",
    required: true,
    options: [
      {
        id: "stage_bootstrapped_seed",
        label: "Bootstrapped or Seed stage.",
        popup:
          "Early-stage companies often use ESOPs to attract and retain talent without the cash pressure of competitive salaries. Getting the valuation right from the start avoids messy corrections later.",
      },
      {
        id: "stage_series_a_b",
        label: "Series A or B.",
        tags: ["esop_stakeholder_pressure"],
        popup:
          "At this stage, investors and auditors often expect a formal ESOP valuation. It is one of the clearest governance signals that the company is managing its cap table professionally.",
      },
      {
        id: "stage_growth_scaleup",
        label: "Growth or Scale-up.",
        tags: ["esop_stakeholder_pressure"],
        popup:
          "Growth-stage companies typically have more complex cap tables, larger option pools, and more scrutiny from investors and auditors. A formal valuation is usually non-negotiable at this stage.",
      },
      {
        id: "stage_mature_sme",
        label: "Mature or Profitable SME.",
        popup:
          "Mature businesses sometimes use ESOPs as part of succession planning or to retain key managers. The valuation requirements are the same regardless of stage.",
      },
    ],
  },

  // ── a_context_headcount: Employee count (CRM data) ───────────────────────
  {
    id: "a_context_headcount",
    track: "esop",
    order: 3,
    type: "single_select",
    prompt: "Roughly how many employees do you have?",
    required: true,
    options: [
      {
        id: "headcount_1_10",
        label: "1 to 10.",
        popup:
          "At this size, ESOPs are typically used to reward co-founders and early key hires. Even with a small team, a formal valuation ensures the options are priced fairly and defensibly.",
      },
      {
        id: "headcount_11_50",
        label: "11 to 50.",
        popup:
          "This is the stage where equity conversations become more frequent. Employees start comparing offers and asking about option value. A formal valuation gives you a credible answer.",
      },
      {
        id: "headcount_51_200",
        label: "51 to 200.",
        popup:
          "At this size, the ESOP is likely a meaningful part of your compensation strategy. Auditors and investors will expect a formal, independent valuation to support the option pricing.",
      },
      {
        id: "headcount_200_plus",
        label: "More than 200.",
        tags: ["esop_stakeholder_pressure"],
        popup:
          "Larger companies typically have more complex option pools and more stakeholders scrutinising the valuation. A formal, independently prepared report is essential at this scale.",
      },
    ],
  },

  // ── BRANCH A: Already has ESOP ───────────────────────────────────────────

  // a1: Formal valuation done?
  {
    id: "a1_formal_valuation",
    track: "esop",
    order: 4,
    type: "single_select",
    prompt: "Have you completed a formal ESOP valuation before?",
    required: true,
    options: [
      {
        id: "a1_yes",
        label: "Yes.",
        score: 1,
        tags: ["esop_hot_lead"],
        popup:
          "Good. A formal valuation means you have already been through the process. The next question will help us understand whether your current setup is still working for you.",
      },
      {
        id: "a1_no",
        label: "No.",
        score: 3,
        tags: ["esop_compliance_gap", "esop_hot_lead"],
        popup:
          "This is important. If you have an active ESOP but no formal independent valuation, you may have a governance and compliance gap. This is worth addressing before your next audit, fundraising round, or employee discussion.",
      },
      {
        id: "a1_not_sure",
        label: "Not sure.",
        score: 2,
        tags: ["esop_compliance_gap", "esop_hot_lead"],
        popup:
          "If you are not sure whether a formal valuation has been done, it is worth checking before issuing or repricing any options. An informal or internal estimate is not the same as a formal independent report.",
      },
    ],
  },

  // a2: Satisfied with current valuation/provider?
  {
    id: "a2_satisfaction",
    track: "esop",
    order: 5,
    type: "single_select",
    prompt: "Are you satisfied with your current ESOP valuation or valuation provider?",
    required: true,
    options: [
      {
        id: "a2_yes_satisfied",
        label: "Yes, satisfied.",
        score: 1,
        popup:
          "Good to hear. Even if you are satisfied, it is worth reviewing whether your current process is giving you maximum clarity, defensibility, and commercial usefulness — especially as your company grows.",
      },
      {
        id: "a2_no_dissatisfied",
        label: "No, not satisfied.",
        score: 3,
        tags: ["esop_dissatisfied", "esop_hot_lead"],
        popup:
          "Dissatisfaction with your current valuation provider is a strong signal. Whether it is price, quality, or the way the process is managed, there is likely a better option available.",
      },
      {
        id: "a2_not_sure",
        label: "Not sure.",
        score: 2,
        tags: ["esop_dissatisfied"],
        popup:
          "Uncertainty about your current provider is worth exploring. If you are not sure whether the report is doing its job, it probably is not.",
      },
    ],
  },

  // a3_price: Would price be a deciding factor? (shown if satisfied)
  {
    id: "a3_price_factor",
    track: "esop",
    order: 6,
    type: "single_select",
    prompt: "Would pricing be a deciding factor if you considered another ESOP valuation provider?",
    required: true,
    options: [
      {
        id: "a3_price_yes",
        label: "Yes, price matters.",
        score: 2,
        tags: ["esop_hot_lead"],
        popup:
          "That is a commercially sensible position. Since you already understand the requirement and have been through the process, comparing providers on price and quality is a straightforward next step.",
      },
      {
        id: "a3_price_no",
        label: "No, price is not the main deciding factor.",
        score: 1,
        popup:
          "Understood. If price is not the main concern, the more important question is whether your current provider is giving you the clarity, defensibility, and auditor support you need.",
      },
      {
        id: "a3_price_maybe",
        label: "Maybe, if quality and credibility are strong.",
        score: 1,
        popup:
          "That is a reasonable position. Quality and credibility are the right criteria — a cheaper report that does not hold up under audit or investor scrutiny is not actually cheaper.",
      },
    ],
  },

  // a3_dissatisfied: What are you dissatisfied with? (shown if dissatisfied)
  {
    id: "a3_dissatisfied_reason",
    track: "esop",
    order: 7,
    type: "single_select",
    prompt: "What are you dissatisfied with?",
    required: true,
    options: [
      {
        id: "a3_dis_price",
        label: "Price is too high.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "Pricing is a legitimate concern. ESOP valuations vary significantly in cost, and there is no reason to overpay for a report that a more commercially efficient provider can deliver to the same standard.",
      },
      {
        id: "a3_dis_quality",
        label: "Report quality is weak.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "A weak report is a real problem. If the valuation methodology is not robust, the report will not hold up under audit, investor review, or employee scrutiny. This is worth fixing before the next grant cycle.",
      },
      {
        id: "a3_dis_explain",
        label: "Hard to explain to employees, board, or investors.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "This is more common than you might think. Many cap table software providers focus on the system and leave the communication entirely to you. A good valuation report should be usable — not just technically correct.",
      },
      {
        id: "a3_dis_slow",
        label: "Process is slow or painful.",
        score: 2,
        tags: ["esop_dissatisfied"],
        popup:
          "A slow or painful process is often a sign that the provider is not actively managing the relationship with your auditors. Many providers hand over a report and leave you to handle the rest — including answering auditor questions and managing the timeline.",
      },
      {
        id: "a3_dis_no_startup",
        label: "Provider does not understand startups or ESOPs.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "This is a critical gap. Many cap table management software providers are not valuation advisors. They manage the HR system and the cap table, but they do not advise on methodology, auditor communication, or employee education. That advisory gap is where most ESOP problems originate.",
      },
      {
        id: "a3_dis_other",
        label: "Other.",
        score: 2,
        tags: ["esop_dissatisfied"],
        popup:
          "Whatever the reason, if you are not satisfied with your current provider, it is worth exploring alternatives before your next grant cycle or audit.",
      },
    ],
  },

  // a4_timing: Next ESOP grant/refresh/review (shown for all Branch A users who reach it)
  {
    id: "a4_timing",
    track: "esop",
    order: 8,
    type: "single_select",
    prompt: "When is your next ESOP grant, refresh, or review?",
    required: true,
    options: [
      {
        id: "a4_within_1_month",
        label: "Within 1 month.",
        score: 3,
        popup:
          "That is a tight window. Getting started now will help ensure the report is ready when you need it.",
      },
      {
        id: "a4_within_3_months",
        label: "Within 1 to 3 months.",
        score: 3,
        popup:
          "That is a manageable timeline. Starting the scoping conversation now gives you enough time to prepare properly.",
      },
      {
        id: "a4_more_than_3_months",
        label: "More than 3 months.",
        score: 1,
        popup:
          "You have some time, but it is worth starting the conversation early to understand what documents and decisions are needed before the deadline arrives.",
      },
      {
        id: "a4_not_sure",
        label: "Not sure.",
        score: 1,
        popup:
          "That is okay. Even without a clear deadline, understanding the process helps you prepare before a trigger event creates urgency.",
      },
    ],
  },

  // ── BRANCH B/C: Planning or No ESOP ──────────────────────────────────────

  // bc1: Is anyone asking?
  {
    id: "bc1_asking",
    track: "esop",
    order: 9,
    type: "single_select",
    prompt: "Is anyone currently asking about equity, share options, or ESOP?",
    helper:
      "For example: existing investors asking about your cap table, auditors requesting a formal valuation, or employees and candidates asking to be part of the company's equity plan.",
    required: true,
    options: [
      {
        id: "bc1_yes_asking",
        label: "Yes, actively.",
        score: 3,
        tags: ["esop_active_ask", "esop_stakeholder_pressure"],
        popup:
          "Active demand is a strong signal. Whether it is employees, investors, or auditors asking, this means the ESOP conversation is already happening — and you need to be ready to respond credibly.",
      },
      {
        id: "bc1_no_asking",
        label: "No, not yet.",
        score: 1,
        popup:
          "That is fine. Many companies set up their ESOP framework before the demand arrives. Getting ahead of the conversation means you are not scrambling when employees or investors start asking.",
      },
      {
        id: "bc1_may_come_up",
        label: "Not directly, but we expect it to come up soon.",
        score: 2,
        tags: ["esop_active_ask"],
        popup:
          "Anticipating the demand is the right approach. If you expect the conversation to happen soon, now is the time to prepare — so you have a credible, defensible answer ready.",
      },
    ],
  },

  // bc2: Main concern
  {
    id: "bc2_concern",
    track: "esop",
    order: 10,
    type: "single_select",
    prompt: "What is your main concern about setting up or using ESOPs?",
    required: true,
    options: [
      {
        id: "bc2_allocation",
        label: "How much equity to allocate.",
        score: 2,
        popup:
          "Equity allocation is one of the most common concerns. A formal valuation helps you model exactly how much value is being transferred, so you can structure the option pool without giving away more than necessary.",
      },
      {
        id: "bc2_valuation",
        label: "How to value the company or options.",
        score: 2,
        popup:
          "Option valuation uses specific financial models — typically a Black-Scholes or binomial model — that require independent expertise to be credible. This is exactly what Bain Squared provides.",
      },
      {
        id: "bc2_dilution",
        label: "Dilution.",
        score: 2,
        popup:
          "Dilution is a legitimate concern. A well-structured ESOP valuation helps you model exactly how much value is being transferred and how the option pool affects your cap table over time.",
      },
      {
        id: "bc2_legal_tax",
        label: "Legal, tax, or compliance requirements.",
        score: 2,
        popup:
          "Singapore has specific compliance requirements for ESOP valuation — particularly for audit, tax reporting, and investor due diligence. A formal independent report protects both the company and the employees.",
      },
      {
        id: "bc2_communication",
        label: "Explaining ESOP to employees.",
        score: 2,
        popup:
          "This is one of the most underrated challenges. A formal valuation report gives you a credible, explainable basis for the conversation — so employees understand what their options are worth and trust the number.",
      },
      {
        id: "bc2_not_sure",
        label: "Not sure where to start.",
        score: 1,
        popup:
          "That is a very common starting point. The report we send you will walk you through exactly what is required before setting up an option pool or employee equity plan.",
      },
    ],
  },

  // bc3: Timing
  {
    id: "bc3_timing",
    track: "esop",
    order: 11,
    type: "single_select",
    prompt: "When do you expect to make a decision, respond, or issue options?",
    required: true,
    options: [
      {
        id: "bc3_within_1_month",
        label: "Within 1 month.",
        score: 3,
        popup:
          "That is a tight window. Getting started now will help ensure you have the valuation framework in place before you need to make formal commitments to employees or investors.",
      },
      {
        id: "bc3_within_3_months",
        label: "Within 1 to 3 months.",
        score: 3,
        popup:
          "That is a manageable timeline. Starting the scoping conversation now gives you enough time to prepare properly before the deadline arrives.",
      },
      {
        id: "bc3_more_than_3_months",
        label: "More than 3 months.",
        score: 1,
        popup:
          "You have time to plan properly. The report we send you will help you understand what to prepare before the need becomes urgent.",
      },
      {
        id: "bc3_not_sure",
        label: "Not sure.",
        score: 1,
        popup:
          "That is okay. Even without a clear timeline, understanding the process helps you prepare before a trigger event creates urgency.",
      },
    ],
  },

  // Open text (ESOP)
  {
    id: "a_open",
    track: "esop",
    order: 12,
    type: "open_text",
    prompt: "Anything else worth knowing before we look at this together?",
    helper:
      "Tell us about your cap table, option pool size, auditor requirements, or any context not covered above. There is no right or wrong answer here.",
    required: false,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BUSINESS VALUE TRACK
  // ══════════════════════════════════════════════════════════════════════════

  // ── b_context_stage: Company stage (CRM data) ────────────────────────────
  {
    id: "b_context_stage",
    track: "business_value",
    order: 1,
    type: "single_select",
    prompt: "What stage is your company currently at?",
    required: true,
    options: [
      {
        id: "bv_stage_bootstrapped_seed",
        label: "Bootstrapped or Seed stage.",
        popup:
          "Early-stage companies often have significant intangible value in their founding team, early IP, or initial customer relationships — even if the financials are still small. Mapping these assets early gives you a stronger story for future fundraising.",
      },
      {
        id: "bv_stage_series_a_b",
        label: "Series A or B.",
        tags: ["fundraising_valuation_lead"],
        popup:
          "At this stage, institutional investors will look closely at what makes your business defensible and scalable. Intangible assets — brand, IP, recurring revenue, customer relationships — are often the key differentiators in a valuation conversation.",
      },
      {
        id: "bv_stage_growth_scaleup",
        label: "Growth or Scale-up.",
        tags: ["fundraising_valuation_lead"],
        popup:
          "Growth-stage companies typically have the most to gain from a formal intangibles valuation. By this point, you have likely built significant brand equity, customer relationships, and operational systems that a basic financial multiple will miss.",
      },
      {
        id: "bv_stage_mature_sme",
        label: "Mature or Profitable SME.",
        tags: ["strategic_transaction_lead"],
        popup:
          "Mature businesses often have deep intangible value in brand, customer loyalty, and operational know-how that has been built over many years. This value is frequently underestimated in standard profit-multiple valuations.",
      },
    ],
  },

  // ── b_context_headcount ───────────────────────────────────────────────────
  {
    id: "b_context_headcount",
    track: "business_value",
    order: 2,
    type: "single_select",
    prompt: "Roughly how many employees do you have?",
    required: true,
    options: [
      {
        id: "bv_headcount_1_10",
        label: "1 to 10.",
        popup:
          "Small teams can still have significant intangible value — particularly in IP, founder expertise, and early customer relationships. These are worth mapping before a fundraising or sale conversation.",
      },
      {
        id: "bv_headcount_11_50",
        label: "11 to 50.",
        popup:
          "At this size, you have likely built meaningful operational systems, customer relationships, and brand presence. These assets may not show up in your financials but can meaningfully add to your valuation.",
      },
      {
        id: "bv_headcount_51_200",
        label: "51 to 200.",
        popup:
          "Mid-sized companies typically have the strongest case for intangibles valuation. You have scale, but you are not yet so large that your financials tell the whole story.",
      },
      {
        id: "bv_headcount_200_plus",
        label: "More than 200.",
        popup:
          "Larger companies often have the most complex intangibles picture — multiple brands, significant IP portfolios, and deep customer relationships. A formal review can identify which assets are most commercially significant.",
      },
    ],
  },

  {
    id: "b1",
    track: "business_value",
    order: 3,
    type: "single_select",
    prompt: "How is your company usually valued today?",
    required: true,
    options: [
      {
        id: "profit_multiple",
        label: "Profit multiple.",
        score: 1,
        popup:
          "That is common for SMEs and traditional businesses. A profit multiple is a useful starting point, but it only captures what shows up in your income statement. It typically misses the value of your brand, customer relationships, software, data, IP, and systems — all of which can add meaningful value on top of the financial baseline.",
      },
      {
        id: "revenue_multiple",
        label: "Revenue multiple.",
        score: 1,
        popup:
          "Revenue multiples are common in growth businesses. Like profit multiples, they do not account for the quality of your revenue — whether it is recurring, contract-backed, or driven by a strong brand — or for the intangible assets that make that revenue defensible.",
      },
      {
        id: "asset_value",
        label: "Asset value.",
        score: 0,
        popup:
          "Asset-based valuation is standard in asset-heavy businesses. It almost always misses intangible value entirely — brand equity, customer loyalty, proprietary systems, and specialist know-how are rarely reflected on a balance sheet.",
      },
      {
        id: "comparable_companies",
        label: "Comparable companies.",
        score: 1,
        popup:
          "Benchmarking against comparable companies is a useful sanity check, but it assumes your business is average. If you have stronger customer retention, better IP, or a more defensible market position than your peers, a comparables approach will undervalue you.",
      },
      {
        id: "investor_negotiation",
        label: "Investor negotiation.",
        score: 2,
        tags: ["fundraising_valuation_lead"],
        popup:
          "Negotiated valuations can work in your favour — but only if you control the narrative. If you cannot clearly articulate and evidence what makes your business worth more than a basic multiple, investors will use their own assumptions, which are usually conservative.",
      },
      {
        id: "do_not_know",
        label: "I do not know.",
        score: 1,
        popup:
          "That is more common than you might think. Understanding how your business is currently valued is the first step to improving it. Many founders only discover how they are being valued when they are already in a fundraising or sale conversation.",
      },
    ],
  },
  {
    id: "b2",
    track: "business_value",
    order: 4,
    type: "single_select",
    prompt: "Do you feel this valuation method misses important parts of your business?",
    required: true,
    options: [
      {
        id: "yes_definitely",
        label: "Yes, definitely.",
        score: 3,
        popup:
          "That instinct is often correct. Many businesses have built real value in areas that standard financial methods do not capture — customer loyalty, brand recognition, proprietary technology, long-term contracts, or specialist knowledge. The remaining questions will help identify exactly where that value may sit.",
      },
      {
        id: "maybe",
        label: "Maybe.",
        score: 2,
        popup:
          "A partial gap is still worth exploring. Even if your current method captures some of your value, there may be meaningful assets being overlooked — particularly if you have built strong customer relationships, recurring revenue, or any form of IP or technology.",
      },
      {
        id: "not_sure_bv",
        label: "Not sure.",
        score: 1,
        popup:
          "That is a fair answer. Many founders are not sure because they have never been walked through what intangible assets actually look like in a valuation context. The remaining questions are designed to help you identify whether there is something worth reviewing.",
      },
      {
        id: "no_bv",
        label: "No.",
        score: 0,
        popup:
          "That is useful to know. Even if you feel your current valuation is accurate, the remaining questions may surface assets you have not considered — particularly if your business has brand strength, customer stickiness, or systems that competitors cannot easily replicate.",
      },
    ],
  },
  {
    id: "b3",
    track: "business_value",
    order: 5,
    type: "multi_select",
    prompt: "What do you think your current valuation does not fully capture?",
    required: true,
    cap: 6,
    options: [
      {
        id: "brand_or_reputation",
        label: "Brand or reputation.",
        score: 1,
        tags: ["brand_valuation_lead"],
        popup:
          "Brand value is real but often invisible in financial statements. If customers choose you over competitors because of who you are — not just what you charge — that preference has commercial value. It can influence pricing power, customer acquisition costs, and acquisition premiums.",
      },
      {
        id: "customer_relationships",
        label: "Customer relationships.",
        score: 1,
        popup:
          "Strong, long-standing customer relationships reduce churn, increase lifetime value, and make the business more defensible. These are often undervalued because they do not appear on a balance sheet, but they are exactly what buyers and investors are paying for.",
      },
      {
        id: "repeat_customers_or_recurring_revenue",
        label: "Repeat customers or recurring revenue.",
        score: 2,
        popup:
          "This is one of the strongest value signals a business can have. Predictable, recurring revenue reduces investor risk and supports a higher valuation multiple. If a significant portion of your revenue comes back without you having to re-sell, that is a structural advantage worth documenting.",
      },
      {
        id: "long_term_contracts",
        label: "Long-term contracts.",
        score: 2,
        popup:
          "Contracts provide revenue visibility and reduce risk. They are a concrete, documentable form of intangible value — particularly if they are with well-known clients, span multiple years, or include renewal clauses.",
      },
      {
        id: "software_platform_app_or_internal_technology",
        label: "Software, platform, app, or internal technology.",
        score: 2,
        tags: ["software_data_valuation_lead"],
        popup:
          "Proprietary technology creates value when it improves efficiency, supports customers, generates data, or gives the business a competitive advantage that cannot be easily replicated. Even internal tools that reduce headcount or improve margins can be formally valued as an intangible asset.",
      },
      {
        id: "data_or_customer_database",
        label: "Data or customer database.",
        score: 1,
        tags: ["software_data_valuation_lead"],
        popup:
          "A well-maintained customer database or proprietary dataset can be a significant asset — particularly if it drives decisions, enables personalisation, or would be difficult for a competitor to replicate. The key is whether it is structured, maintained, and actively used.",
      },
      {
        id: "ip_trademarks_patents_designs_or_knowhow",
        label: "IP, trademarks, patents, designs, or know-how.",
        score: 2,
        popup:
          "Registered IP is one of the most clearly documentable forms of intangible value. Even unregistered know-how — proprietary methods, formulas, or processes — can be valued if it is documented and defensible.",
      },
      {
        id: "operating_systems_processes_or_playbooks",
        label: "Operating systems, processes, or playbooks.",
        score: 1,
        popup:
          "Well-documented systems and processes reduce key-person dependency and make the business more scalable and transferable. This is particularly relevant in service businesses where value is often trapped in the founder's head rather than in the organisation.",
      },
      {
        id: "technical_team_or_specialist_knowledge",
        label: "Technical team or specialist knowledge.",
        score: 1,
        popup:
          "A team with rare expertise is a competitive advantage — but only if that knowledge is captured in systems, processes, or documentation. If it walks out the door when someone leaves, it is harder to value formally.",
      },
      {
        id: "none_of_the_above",
        label: "None of the above.",
        score: 0,
        popup:
          "That is useful to know. The remaining questions will help identify whether there are other value signals worth exploring — particularly around your revenue quality, customer relationships, or market position.",
      },
      {
        id: "not_sure_bv3",
        label: "I am not sure.",
        score: 1,
        popup:
          "That is a very common answer. Most founders only realise what value they have built after mapping their assets more carefully. The remaining questions are designed to help you do exactly that.",
      },
    ],
  },
  {
    id: "b4",
    track: "business_value",
    order: 6,
    type: "single_select",
    prompt: "Do you have any documentation, contracts, data, or reports that relate to these assets?",
    required: true,
    options: [
      {
        id: "yes_clearly",
        label: "Yes, clearly.",
        score: 3,
        popup:
          "That is a real advantage, and it is more rare than you might think. Most companies have the assets but not the documentation to support them in a formal valuation. Having clear evidence means you are already in a stronger position than the majority of businesses going into a fundraising or sale conversation.",
      },
      {
        id: "somewhat",
        label: "Somewhat.",
        score: 2,
        popup:
          "That is a common middle ground. The value may exist, but the evidence may need to be cleaned up, consolidated, or formatted before investors, buyers, or shareholders can rely on it. This is exactly the kind of gap a structured review can help you close.",
      },
      {
        id: "not_really",
        label: "Not really.",
        score: 2,
        popup:
          "This is where many businesses lose value in a negotiation. The assets are real, but without documentation, they are difficult to defend. The good news is that this is fixable — and identifying the gap now, before a transaction, gives you time to address it.",
      },
      {
        id: "no_evidence",
        label: "No.",
        score: 1,
        popup:
          "A lack of documentation is one of the most common gaps we see. It does not mean the value is not there. It means it has not been captured yet. Starting that process now — before a fundraising round, sale, or investor conversation — puts you in a much stronger position.",
      },
      {
        id: "not_sure_evidence",
        label: "I am not sure.",
        score: 1,
        popup:
          "That is worth finding out. Knowing what documentation exists is an important first step before any valuation or investor discussion. Even a basic audit of what you have can reveal more than you expect.",
      },
    ],
  },
  {
    id: "b5",
    track: "business_value",
    order: 7,
    type: "single_select",
    prompt: "Why do you want a stronger valuation?",
    required: true,
    options: [
      {
        id: "fundraising",
        label: "We are raising funds.",
        score: 3,
        tags: ["fundraising_valuation_lead"],
        popup:
          "Fundraising is one of the clearest reasons to formally document your intangible assets. Institutional investors — including VCs and growth equity funds — do consider intangible assets when they are properly packaged and substantiated. A sum-of-parts valuation that clearly separates your financial multiple from your intangibles layer gives investors a structured, credible basis for understanding why your business is worth more than a basic revenue or profit multiple.",
      },
      {
        id: "selling_the_business",
        label: "We may sell the business.",
        score: 3,
        tags: ["strategic_transaction_lead"],
        popup:
          "Sellers who understand and can evidence their hidden value are in a significantly stronger negotiating position. Buyers are trained to discount anything they cannot verify. If your brand, customer relationships, IP, or systems are not formally documented, buyers will simply exclude them from the price.",
      },
      {
        id: "bringing_investors_or_shareholders",
        label: "We are bringing in investors or shareholders.",
        score: 3,
        tags: ["ownership_risk_lead"],
        popup:
          "New investors and shareholders will form their own view of value. If you do not have a clear, documented picture of your intangible assets before they arrive, you are negotiating without your strongest cards on the table.",
      },
      {
        id: "succession_or_restructuring",
        label: "We are planning succession or restructuring.",
        score: 2,
        tags: ["ownership_risk_lead"],
        popup:
          "Succession and restructuring often require a credible, independent business valuation. Intangible assets can significantly affect how the business is divided, transferred, or priced — particularly in family businesses or management buyouts.",
      },
      {
        id: "board_bank_auditor_or_partner_explanation",
        label: "We need to explain our value to the board, bank, auditor, or partners.",
        score: 2,
        popup:
          "Explaining value to stakeholders requires evidence, not just claims. A structured view of your intangible assets gives you a clear, defensible narrative that is much easier to communicate than a general assertion that the business is worth more.",
      },
      {
        id: "understand_what_business_is_worth",
        label: "We want to understand what the business is really worth.",
        score: 1,
        popup:
          "That is a strong reason to start. Even without an immediate transaction, knowing where your business value comes from — and what is not yet reflected in your financials — helps you make better decisions about growth, investment, and strategy.",
      },
      {
        id: "just_curious",
        label: "No specific reason. Just curious.",
        score: 0,
        popup:
          "Curiosity is a perfectly valid starting point. Many founders only realise the value gap after seeing what parts of the business are not reflected in normal financial numbers. This assessment may surface something worth paying attention to.",
      },
    ],
  },
  {
    id: "b6",
    track: "business_value",
    order: 8,
    type: "single_select",
    prompt: "When might you need to defend your valuation?",
    required: true,
    options: [
      {
        id: "now",
        label: "Now.",
        score: 3,
        tags: ["strategic_transaction_lead"],
        popup:
          "This may be urgent. If valuation discussions are already happening — with investors, buyers, or partners — you should not be entering them without a clear view of what value may be missing from the conversation.",
      },
      {
        id: "within_3_months_bv",
        label: "Within 3 months.",
        score: 3,
        tags: ["strategic_transaction_lead"],
        popup:
          "That is a near-term window. It is worth preparing now so you are not trying to build the valuation story while investors or buyers are already asking questions. The earlier you start, the more credible the output.",
      },
      {
        id: "within_6_months_bv",
        label: "Within 6 months.",
        score: 2,
        popup:
          "That is a good planning timeline. You likely have enough time to identify your hidden value, organise the evidence, and prepare a stronger valuation position before the conversation begins.",
      },
      {
        id: "within_12_months",
        label: "Within 12 months.",
        score: 1,
        popup:
          "That gives you time to prepare properly. The earlier you map your value drivers, the stronger your position when the valuation discussion starts.",
      },
      {
        id: "no_clear_timeline_bv",
        label: "No clear timeline yet.",
        score: 0,
        popup:
          "That is okay. Even without a deadline, understanding your hidden value can help you make better decisions before fundraising, sale, succession, or investor discussions. And when the moment does come, you will already be prepared.",
      },
    ],
  },
  {
    id: "b7",
    track: "business_value",
    order: 9,
    type: "single_select",
    prompt: "What is your biggest concern about your company\u2019s valuation?",
    required: true,
    options: [
      {
        id: "investors_may_not_understand_true_value",
        label: "Investors may not understand the true value of the business.",
        score: 3,
        tags: ["fundraising_valuation_lead"],
        popup:
          "That is a common and legitimate concern. Investors — particularly institutional ones — are trained to anchor on financial metrics. But when intangible assets are properly packaged and substantiated, they do factor into the conversation. The key is presenting them in a format that investors can evaluate, not just assert.",
      },
      {
        id: "buyers_may_value_us_too_cheaply",
        label: "Buyers may value us too cheaply.",
        score: 3,
        tags: ["brand_valuation_lead"],
        popup:
          "That is a real risk. Buyers are incentivised to find reasons to discount the price. If your brand, customer relationships, IP, or systems are not formally documented and evidenced, buyers will simply exclude them from their offer.",
      },
      {
        id: "brand_software_data_ip_or_customer_base_not_reflected",
        label: "Our brand, software, data, IP, or customer base is not reflected properly.",
        score: 3,
        popup:
          "That is exactly the gap a formal intangibles valuation is designed to address. These assets may not show clearly in the financials, but they can still influence what the business is worth — particularly to a strategic buyer or growth investor.",
      },
      {
        id: "do_not_know_how_to_prove_business_worth_more",
        label: "We do not know how to prove the business is worth more.",
        score: 2,
        popup:
          "That is often the main gap. The business may be genuinely valuable, but the value needs to be organised into evidence that outsiders can understand and accept. This is a process problem, not a value problem.",
      },
      {
        id: "valued_only_on_profit_or_revenue",
        label: "We are being valued only on profit or revenue.",
        score: 2,
        popup:
          "That can be frustrating if your business has more going on beneath the surface. A basic multiple may miss the quality, stickiness, systems, and assets behind the numbers — all of which can support a meaningfully higher valuation when formally documented.",
      },
      {
        id: "not_concerned",
        label: "We are not concerned. Just exploring.",
        score: 0,
        popup:
          "That is a useful starting point. Even if there is no immediate concern, this assessment can help you understand where business value may sit outside the usual financial numbers — and what you might want to start documenting before a transaction eventually happens.",
      },
    ],
  },
  {
    id: "b_open",
    track: "business_value",
    order: 10,
    type: "open_text",
    prompt: "Anything else worth knowing before we look at this together?",
    helper:
      "Tell us about any deal terms, ownership structure, timeline pressure, or context not covered above. There is no right or wrong answer here.",
    required: false,
  },
];

// Max scores per track (kept for analytics; not used for routing)
export const MAX_SCORE: Record<Track, number> = {
  esop: 24,
  business_value: 24,
};
