export type Track = "esop" | "intangible_value";

// ── ESOP result codes ─────────────────────────────────────────────────────
// ── IV result codes ───────────────────────────────────────────────────────
export type ResultKey =
  | "ESOP_A0_EXISTING_ESOP_INCOMPLETE_OR_UNCLEAR_HOT"
  | "ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT"
  | "ESOP_A2_PROVIDER_REVIEW_HOT"
  | "ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM"
  | "ESOP_B1_PLANNING_PRESSURE_NEAR_HOT"
  | "ESOP_B2_PLANNING_PRESSURE_FAR_WARM"
  | "ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM"
  | "ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW"
  | "ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT"
  | "ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM"
  | "ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM"
  | "ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD"
  | "ESOP_U1_UNSURE_PRESSURE_NEAR_HOT"
  | "ESOP_U2_UNSURE_PRESSURE_FAR_WARM"
  | "ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM"
  | "ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD"
  | "IV_CAPITAL_NEAR_VALUE_GAP_HOT"
  | "IV_CAPITAL_NEAR_WEAK_SIGNAL_WARM"
  | "IV_CAPITAL_PLANNED_WARM"
  | "IV_CAPITAL_NO_TIMELINE_VALUE_GAP_WARM"
  | "IV_CAPITAL_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW"
  | "IV_EXIT_NEAR_VALUE_GAP_HOT"
  | "IV_EXIT_NEAR_WEAK_SIGNAL_WARM"
  | "IV_EXIT_PLANNED_WARM"
  | "IV_EXIT_NO_TIMELINE_VALUE_GAP_WARM"
  | "IV_EXIT_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW"
  | "IV_STAKEHOLDER_NEAR_VALUE_GAP_HOT"
  | "IV_STAKEHOLDER_NEAR_WEAK_SIGNAL_WARM"
  | "IV_STAKEHOLDER_PLANNED_VALUE_GAP_WARM"
  | "IV_STAKEHOLDER_PLANNED_WEAK_SIGNAL_WARM_LOW"
  | "IV_STAKEHOLDER_NO_TIMELINE_VALUE_GAP_WARM"
  | "IV_STAKEHOLDER_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW"
  | "IV_STRATEGIC_NEAR_VALUE_GAP_WARM"
  | "IV_STRATEGIC_NEAR_WEAK_SIGNAL_WARM_LOW"
  | "IV_STRATEGIC_PLANNED_VALUE_REVIEW_WARM"
  | "IV_STRATEGIC_NO_TIMELINE_VALUE_GAP_WARM_LOW"
  | "IV_STRATEGIC_MODERATE_SIGNAL_WARM_LOW"
  | "IV_STRATEGIC_WEAK_SIGNAL_COLD"
  | "IV_CURIOSITY_VALUE_SIGNAL_WARM_LOW"
  | "IV_CURIOSITY_NEAR_MODERATE_SIGNAL_WARM_LOW"
  | "IV_CURIOSITY_WEAK_SIGNAL_COLD"
  | "IV_FALLBACK_UNCLEAR_COLD";

export type ReportKey =
  | "esop_compliance_governance"
  | "esop_structuring_dilution"
  | "esop_communication_legal"
  | "esop_starter"
  | "iv_fundraising_guide"
  | "iv_mna_exit_guide"
  | "iv_intangible_asset_discovery_guide"
  | "iv_starter_guide";

export type DeliverableKey = ReportKey;

export type BackendTag =
  | "esop_hot_lead"
  | "esop_warm_lead"
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
  type: "single_select" | "multi_select";
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
        id: "retain_talent",
        label: "I want to retain key employees using ESOPs.",
        routesTo: "esop",
        popup:
          "Good choice. ESOPs can be a powerful way to reward key employees without relying only on higher cash salaries. The next few questions will help you understand whether you may need ESOP valuation support.",
      },
      {
        id: "need_esop_support",
        label: "I already have ESOPs and need valuation support.",
        routesTo: "esop",
        tags: ["esop_hot_lead"],
        popup:
          "You are in the right place. Keeping your valuation defensible is critical for audit and compliance. We will ask a few questions to see where you stand.",
      },
      {
        id: "raising_funds",
        label: "I am raising funds and want a stronger valuation.",
        routesTo: "intangible_value",
        tags: ["fundraising_valuation_lead"],
        popup:
          "Investors often anchor on basic multiples. We will help you figure out if you have hidden assets that can strengthen your story.",
      },
      {
        id: "selling_restructuring",
        label: "I may sell, restructure, or bring in investors.",
        routesTo: "intangible_value",
        tags: ["strategic_transaction_lead"],
        popup:
          "Preparation is key. Buyers will discount what they cannot verify. Let's see how defensible your value is today.",
      },
      {
        id: "think_company_worth_more",
        label: "I think my business is worth more than a basic profit multiple.",
        routesTo: "intangible_value",
        popup:
          "Standard accounting often misses the real value drivers. We will help you identify what might be missing from your books.",
      },
      {
        id: "check_hidden_value",
        label: "I am not sure. I just want to check if there is hidden value.",
        routesTo: "intangible_value",
        popup:
          "Exploring is a great first step. Let's walk through some common areas where companies find unexpected value.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ESOP TRACK
  // ══════════════════════════════════════════════════════════════════════════

  // ── ESOP Q2: Status (hard-trigger branch selector) ────────────────────────
  {
    id: "a_esop_status",
    track: "esop",
    order: 1,
    type: "single_select",
    prompt: "Do you currently have an ESOP or employee share option plan?",
    required: true,
    options: [
      {
        id: "yes_existing",
        label: "Yes, we already have one.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "Great. Since it is already in place, the main focus now is making sure the valuation and compliance hold up under scrutiny.",
      },
      {
        id: "planning",
        label: "No, but we are planning to set one up.",
        score: 2,
        tags: ["esop_warm_lead"],
        popup:
          "Planning ahead is the right approach. Understanding the valuation requirements before you issue options helps you set realistic expectations for employees and investors.",
      },
      {
        id: "no",
        label: "No, we do not have one yet.",
        score: 1,
        popup:
          "That is perfectly fine. Many companies do not need one early on. Let's see if the timing is right to start thinking about it.",
      },
      {
        id: "not_sure",
        label: "Not sure.",
        score: 1,
        popup:
          "This is more common than you might think. Sometimes informal promises or draft documents create confusion. We can help you clarify your position.",
      },
    ],
  },

  // ── ESOP Branch A: Existing ESOP ─────────────────────────────────────────

  // ESOP Q3A: Formal valuation
  {
    id: "a1_formal_valuation",
    track: "esop",
    order: 2,
    type: "single_select",
    prompt: "Has your company completed a formal ESOP valuation?",
    required: true,
    options: [
      {
        id: "yes",
        label: "Yes, we have completed a formal ESOP valuation.",
        score: 1,
        tags: ["esop_hot_lead"],
        popup:
          "Excellent. A third-party valuation gives you a defensible baseline for auditors and the board.",
      },
      {
        id: "no",
        label: "No, we have not completed one.",
        score: 3,
        tags: ["esop_compliance_gap", "esop_hot_lead"],
        popup:
          "This is a common gap. Issuing options without a formal valuation can create compliance and tax risks later.",
      },
      {
        id: "not_sure",
        label: "Not sure.",
        score: 2,
        tags: ["esop_compliance_gap", "esop_hot_lead"],
        popup:
          "If you cannot easily locate the valuation report, it may not hold up during an audit. It is best to verify this soon.",
      },
    ],
  },

  // ESOP Q4A: Provider satisfaction (only asked when Q3A = yes)
  {
    id: "a2_satisfaction",
    track: "esop",
    order: 3,
    type: "single_select",
    prompt: "How satisfied are you with your current ESOP valuation provider?",
    required: true,
    options: [
      {
        id: "satisfied",
        label: "Yes, we are satisfied.",
        score: 1,
        popup:
          "That is great to hear. A reliable partner makes the annual refresh process much smoother.",
      },
      {
        id: "not_satisfied",
        label: "No, we are not satisfied.",
        score: 3,
        tags: ["esop_dissatisfied", "esop_hot_lead"],
        popup:
          "We understand. Issues with speed, price, or report quality are common reasons companies look for alternatives.",
      },
      {
        id: "not_sure",
        label: "Not sure.",
        score: 2,
        tags: ["esop_dissatisfied"],
        popup:
          "It is always healthy to benchmark your provider occasionally to ensure you are getting the best commercial value.",
      },
    ],
  },

  // ── ESOP Branches B, C, U: Planning, No ESOP, Unsure ─────────────────────

  // ESOP Q3BC: Stakeholder pressure
  {
    id: "bc1_asking",
    track: "esop",
    order: 4,
    type: "single_select",
    prompt: "Is anyone currently asking about equity, options, or employee incentives?",
    required: true,
    options: [
      {
        id: "yes_actively",
        label: "Yes, investors, auditors, board members, or employees are actively asking.",
        score: 3,
        tags: ["esop_active_ask", "esop_stakeholder_pressure"],
        popup:
          "Active questions mean you need a clear, structured answer soon before expectations harden.",
      },
      {
        id: "expected_soon",
        label: "We expect someone to ask soon.",
        score: 2,
        tags: ["esop_active_ask"],
        popup:
          "It is smart to anticipate this. Having a plan ready puts you in a much stronger position.",
      },
      {
        id: "no_but_prepare",
        label: "No, but we want to prepare properly.",
        score: 1,
        popup:
          "Proactive planning is the best way to avoid rushed, expensive mistakes later.",
      },
      {
        id: "no_exploring",
        label: "No, we are only exploring.",
        score: 1,
        popup:
          "Exploring is fine. We will help you understand the basics without any pressure.",
      },
      {
        id: "not_sure",
        label: "Not sure.",
        score: 1,
        popup:
          "If you are unsure, it is safest to assume the question will come up at your next major growth milestone.",
      },
    ],
  },

  // ESOP Q4BC: Timing (now second BCU question, before concern)
  {
    id: "bc3_timing",
    track: "esop",
    order: 5,
    type: "single_select",
    prompt: "If you needed to act on this, what is your timing?",
    required: true,
    options: [
      {
        id: "immediately",
        label: "Immediately.",
        score: 3,
        popup:
          "We can help you move quickly to get the right structure in place.",
      },
      {
        id: "within_1_to_3_months",
        label: "Within 1 to 3 months.",
        score: 3,
        popup:
          "This gives us a good window to design a plan that aligns with your next quarter's goals.",
      },
      {
        id: "within_3_to_6_months",
        label: "In 3 to 6 months.",
        score: 2,
        popup:
          "You have time to carefully consider dilution and allocation before committing.",
      },
      {
        id: "more_than_6_months",
        label: "More than 6 months away.",
        score: 1,
        popup:
          "Perfect. You can learn the fundamentals now and act when the business is ready.",
      },
      {
        id: "not_sure",
        label: "Not sure.",
        score: 1,
        popup:
          "No problem. We will focus on education for now.",
      },
    ],
  },

  // ESOP Q5BC: Main concern (now third BCU question, terminal)
  {
    id: "bc2_concern",
    track: "esop",
    order: 6,
    type: "single_select",
    prompt: "What is the main thing you need help thinking through?",
    required: true,
    options: [
      {
        id: "allocation",
        label: "How much equity to allocate.",
        score: 2,
        popup:
          "Setting the right pool size is critical to protect founders from unnecessary dilution.",
      },
      {
        id: "valuation",
        label: "How the options should be valued.",
        score: 2,
        popup:
          "Getting the strike price right is essential for both tax compliance and employee motivation.",
      },
      {
        id: "dilution",
        label: "Dilution and shareholder impact.",
        score: 2,
        popup:
          "We can help you model how future rounds will impact existing ownership.",
      },
      {
        id: "legal_tax_compliance",
        label: "Legal, tax, compliance, or audit treatment.",
        score: 2,
        popup:
          "Proper documentation protects the company during due diligence and audits.",
      },
      {
        id: "employee_communication",
        label: "How to communicate options to employees.",
        score: 2,
        popup:
          "Options only retain talent if the employees actually understand what they are worth.",
      },
      {
        id: "not_sure_where_to_start",
        label: "Not sure where to start.",
        score: 1,
        popup:
          "That is okay. Our starter guide covers the fundamental decisions you will need to make.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // INTANGIBLE VALUE TRACK
  // ══════════════════════════════════════════════════════════════════════════

  // IV Q2: Company stage
  {
    id: "b_context_stage",
    track: "intangible_value",
    order: 1,
    type: "single_select",
    prompt: "What stage is your company currently at?",
    required: true,
    options: [
      {
        id: "bootstrapped_seed",
        label: "Bootstrapped or Seed stage.",
        popup:
          "Early-stage companies often have hidden value in their foundational IP or initial customer data.",
      },
      {
        id: "series_a_b",
        label: "Series A or B.",
        tags: ["fundraising_valuation_lead"],
        popup:
          "As you scale, proving the value of your operating systems and customer relationships becomes critical for investors.",
      },
      {
        id: "growth_scaleup",
        label: "Growth or Scale-up.",
        tags: ["fundraising_valuation_lead"],
        popup:
          "Growth-stage companies typically have more complex cap tables, larger option pools, and more scrutiny from investors and auditors. A formal valuation is usually non-negotiable at this stage.",
      },
      {
        id: "mature_profitable_sme",
        label: "Mature or Profitable SME.",
        tags: ["strategic_transaction_lead"],
        popup:
          "Established businesses often possess deep, unrecorded value in long-term contracts and brand reputation.",
      },
    ],
  },

  // IV Q3: Headcount
  {
    id: "b_context_headcount",
    track: "intangible_value",
    order: 2,
    type: "single_select",
    prompt: "Roughly how many employees do you have?",
    required: true,
    options: [
      {
        id: "1_10",
        label: "1 to 10.",
        popup:
          "Small teams often hold immense value in specialist knowledge and founder relationships.",
      },
      {
        id: "11_50",
        label: "11 to 50.",
        popup:
          "As the team grows, documenting processes and workflows becomes a key driver of enterprise value.",
      },
      {
        id: "51_200",
        label: "51 to 200.",
        popup:
          "At this size, your internal technology and data systems are likely significant, unrecorded assets.",
      },
      {
        id: "more_than_200",
        label: "More than 200.",
        popup:
          "Large organizations have complex intangible assets that require rigorous documentation for M&A or audit.",
      },
    ],
  },

  // IV Q4: Valuation method
  {
    id: "b1",
    track: "intangible_value",
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
          "Profit multiples are standard, but they often ignore the future value of your IP and brand.",
      },
      {
        id: "revenue_multiple",
        label: "Revenue multiple.",
        score: 1,
        popup:
          "Revenue multiples reward growth, but may miss the stickiness of your customer relationships.",
      },
      {
        id: "asset_value",
        label: "Asset value.",
        score: 0,
        popup:
          "Pure asset valuations almost always undervalue software, data, and human capital.",
      },
      {
        id: "comparable_companies",
        label: "Comparable companies.",
        score: 1,
        popup:
          "Benchmarks are useful, but they fail to capture what makes your specific operating system unique.",
      },
      {
        id: "investor_negotiation",
        label: "Investor negotiation.",
        score: 2,
        tags: ["fundraising_valuation_lead"],
        popup:
          "Relying purely on negotiation means whoever has the best narrative wins. Evidence gives you leverage.",
      },
      {
        id: "do_not_know",
        label: "I do not know.",
        score: 1,
        popup:
          "That is fine. We will help you understand how buyers and investors will likely look at your business.",
      },
    ],
  },

  // IV Q5: Value gap belief
  {
    id: "b2",
    track: "intangible_value",
    order: 4,
    type: "single_select",
    prompt: "Do you feel this valuation method misses important parts of your company?",
    required: true,
    options: [
      {
        id: "yes_definitely",
        label: "Yes, definitely.",
        score: 3,
        popup:
          "We hear this often. The challenge is turning that belief into evidence a buyer will accept.",
      },
      {
        id: "maybe",
        label: "Maybe.",
        score: 2,
        popup:
          "It is worth investigating. Small adjustments to how you present your assets can significantly impact valuation.",
      },
      {
        id: "not_sure",
        label: "Not sure.",
        score: 1,
        popup:
          "Many founders are surprised to learn what actually drives enterprise value in a transaction.",
      },
      {
        id: "no",
        label: "No.",
        score: 0,
        popup:
          "If your current method captures everything, you are in a strong, transparent position.",
      },
    ],
  },

  // IV Q6: Reason / event (hard-trigger, now position 5 in the track)
  {
    id: "b5",
    track: "intangible_value",
    order: 5,
    type: "single_select",
    prompt: "Why do you want a stronger valuation?",
    required: true,
    options: [
      {
        id: "raising_funds",
        label: "We are raising funds.",
        score: 3,
        tags: ["fundraising_valuation_lead"],
        popup:
          "Investors will anchor on simple metrics unless you provide structured evidence of your intangible assets.",
      },
      {
        id: "may_sell_company",
        label: "We may sell the company.",
        score: 3,
        tags: ["strategic_transaction_lead"],
        popup:
          "Buyers will discount any value they cannot verify during due diligence. Documentation is critical.",
      },
      {
        id: "bringing_investors_shareholders",
        label: "We are bringing in investors or shareholders.",
        score: 3,
        tags: ["ownership_risk_lead"],
        popup:
          "New stakeholders need to understand the full picture to agree on a fair entry price.",
      },
      {
        id: "succession_restructuring",
        label: "We are planning succession or restructuring.",
        score: 2,
        tags: ["ownership_risk_lead"],
        popup:
          "Internal transfers require a defensible valuation to ensure fairness and tax compliance.",
      },
      {
        id: "board_bank_auditor_partners",
        label: "We need to explain our value to the board, bank, auditor, or partners.",
        score: 2,
        popup:
          "Stakeholders trust structured evidence more than confident claims. We can help you build that structure.",
      },
      {
        id: "understand_true_worth",
        label: "We want to understand what the company is really worth.",
        score: 1,
        popup:
          "A strategic review helps you identify which assets to invest in before you actually need to sell.",
      },
      {
        id: "just_curious",
        label: "No specific reason. Just curious.",
        score: 0,
        popup:
          "Curiosity is a great place to start. We will show you what to look out for as you grow.",
      },
    ],
  },

  // IV Q7: Uncaptured assets (multi-select, now position 6 in the track)
  {
    id: "b3",
    track: "intangible_value",
    order: 6,
    type: "multi_select",
    prompt: "What do you think your current valuation does not fully capture?",
    required: true,
    cap: 6,
    options: [
      {
        id: "brand_reputation",
        label: "Brand or reputation.",
        score: 1,
        tags: ["brand_valuation_lead"],
        popup:
          "A strong brand lowers customer acquisition costs and creates pricing power.",
      },
      {
        id: "customer_relationships",
        label: "Customer relationships.",
        score: 1,
        popup:
          "Deep account knowledge and high retention are massive value drivers for buyers.",
      },
      {
        id: "recurring_revenue",
        label: "Repeat customers or recurring revenue.",
        score: 2,
        popup:
          "Predictable revenue streams are heavily rewarded in modern valuations.",
      },
      {
        id: "long_term_contracts",
        label: "Long-term contracts.",
        score: 2,
        popup:
          "Multi-year lock-ins provide the revenue certainty that investors look for.",
      },
      {
        id: "software_platform_internal_tech",
        label: "Software, platform, app, or internal technology.",
        score: 2,
        tags: ["software_data_valuation_lead"],
        popup:
          "In-house tech that creates operational leverage is a highly defensible asset.",
      },
      {
        id: "ip_trademarks_patents_designs_knowhow",
        label: "IP, trademarks, patents, designs, or know-how.",
        score: 2,
        popup:
          "Registered IP provides a legal moat that directly increases enterprise value.",
      },
      {
        id: "operating_systems_processes_playbooks",
        label: "Operating systems, processes, or playbooks.",
        score: 1,
        popup:
          "Documented workflows prove the business can scale without relying entirely on the founder.",
      },
      {
        id: "technical_team_specialist_knowledge",
        label: "Technical team or specialist knowledge.",
        score: 1,
        popup:
          "Hard-to-replace expertise is valuable, but only if the knowledge is institutionalized.",
      },
      {
        id: "none_of_the_above",
        label: "None of the above.",
        score: 0,
        popup:
          "That is fine. Intangible value is not the primary driver for every business model.",
      },
      {
        id: "not_sure",
        label: "I am not sure.",
        score: 1,
        popup:
          "We can help you map your business to see if any of these apply to you.",
      },
    ],
  },

  // IV Q8: Documentation strength (now position 7 in the track)
  {
    id: "b4",
    track: "intangible_value",
    order: 7,
    type: "single_select",
    prompt: "Do you have any documentation, contracts, data, or reports that relate to these assets?",
    required: true,
    options: [
      {
        id: "yes_clearly",
        label: "Yes, clearly.",
        score: 3,
        popup:
          "Excellent. Clear documentation means your intangible value is already highly defensible.",
      },
      {
        id: "somewhat",
        label: "Somewhat.",
        score: 2,
        popup:
          "Partial evidence is a good start, but it may not survive rigorous due diligence.",
      },
      {
        id: "not_really",
        label: "Not really.",
        score: 2,
        popup:
          "If it only exists in your head, buyers and auditors will likely treat it as a risk, not an asset.",
      },
      {
        id: "no",
        label: "No.",
        score: 1,
        popup:
          "Without documentation, intangible value is very difficult to monetize in a transaction.",
      },
      {
        id: "not_sure",
        label: "I am not sure.",
        score: 1,
        popup:
          "Finding out what you actually have on file is the critical first step.",
      },
    ],
  },

  // IV Q9: Timing
  {
    id: "b6",
    track: "intangible_value",
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
          "We can help you organize your evidence quickly to support your current conversations.",
      },
      {
        id: "within_3_months",
        label: "Within 3 months.",
        score: 3,
        tags: ["strategic_transaction_lead"],
        popup:
          "This is a good window to build a structured, defensible valuation narrative.",
      },
      {
        id: "within_6_months",
        label: "Within 6 months.",
        score: 2,
        popup:
          "You have time to identify gaps in your documentation and fix them before the pressure hits.",
      },
      {
        id: "within_12_months",
        label: "Within 12 months.",
        score: 1,
        popup:
          "Perfect. Preparing early gives you maximum leverage when the event actually happens.",
      },
      {
        id: "no_clear_timeline",
        label: "No clear timeline yet.",
        score: 0,
        popup:
          "Learning the framework now means you will be ready whenever the time comes.",
      },
    ],
  },

  // IV Q10: Primary concern (terminal)
  {
    id: "b7",
    track: "intangible_value",
    order: 9,
    type: "single_select",
    prompt: "What is your biggest concern about your company's valuation?",
    required: true,
    options: [
      {
        id: "investors_misunderstand",
        label: "Investors may not understand the true value of the company.",
        score: 3,
        tags: ["fundraising_valuation_lead"],
        popup:
          "We can help you translate operational strengths into metrics investors care about.",
      },
      {
        id: "buyers_value_too_cheaply",
        label: "Buyers may value us too cheaply.",
        score: 3,
        tags: ["brand_valuation_lead"],
        popup:
          "A well-documented intangible asset map is your best defense against buyer discounts.",
      },
      {
        id: "assets_not_reflected",
        label: "Our brand, software, data, IP, or customer base is not reflected properly.",
        score: 3,
        popup:
          "These are classic blind spots in standard accounting. We specialize in bringing them to light.",
      },
      {
        id: "cannot_prove_value",
        label: "We do not know how to prove the company is worth more.",
        score: 2,
        popup:
          "Structuring the evidence is exactly what we do. You do not have to figure it out alone.",
      },
      {
        id: "valued_only_on_profit_or_revenue",
        label: "We are being valued only on profit or revenue.",
        score: 2,
        popup:
          "Breaking out of the multiple-trap requires a shift in how you present the business.",
      },
      {
        id: "not_concerned_exploring",
        label: "We are not concerned. Just exploring.",
        score: 0,
        popup:
          "Exploring without pressure is the best way to make smart long-term decisions.",
      },
    ],
  },
];

// Max scores per track (kept for analytics; not used for lead classification)
export const MAX_SCORE: Record<Track, number> = {
  esop: 24,
  intangible_value: 24,
};
