export type Track = "esop" | "business_value";

export type ResultKey =
  | "esop_no_need"
  | "esop_planning"
  | "esop_likely_needed"
  | "esop_required"
  | "no_clear_valuation_need"
  | "early_value_discovery"
  | "hidden_value_found"
  | "business_value_review";

export type DeliverableKey =
  | "esop_starter_checklist"
  | "esop_valuation_checklist"
  | "esop_valuation_document_checklist"
  | "hidden_value_checklist"
  | "investor_evidence_checklist";

export type BackendTag =
  | "esop_hot_lead"
  | "esop_needs_report"
  | "esop_education_lead"
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
  // ── Entry / routing question ──────────────────────────────────────────
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

  // ── ESOP track (max score 18) ─────────────────────────────────────────
  {
    id: "a1",
    track: "esop",
    order: 1,
    type: "single_select",
    prompt: "Are you already issuing employee stock options?",
    required: true,
    options: [
      {
        id: "already_issue_options",
        label: "Yes, we already issue employee stock options.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "If you are already issuing options, a formal ESOP valuation is usually required to support option pricing, audit, investor review, and board governance.",
      },
      {
        id: "plan_to_issue_soon",
        label: "Not yet, but we plan to issue them soon.",
        score: 3,
        tags: ["esop_needs_report"],
        popup:
          "Planning ahead is the right approach. Issuing options without a proper valuation can create problems later with auditors, investors, and employees.",
      },
      {
        id: "considering_not_decided",
        label: "We are considering it but have not decided.",
        score: 2,
        popup:
          "Understanding the valuation requirements before you decide is sensible. It helps you set realistic expectations for employees and investors.",
      },
      {
        id: "no_esop",
        label: "No, we do not issue employee stock options.",
        score: 0,
        popup:
          "That is fine. The assessment will help you understand whether ESOPs might be relevant for your situation in the future.",
      },
      {
        id: "not_sure_esop",
        label: "I am not sure.",
        score: 1,
        popup:
          "That is okay. The remaining questions will help clarify whether ESOP valuation is something you need to think about.",
      },
    ],
  },
  {
    id: "a2",
    track: "esop",
    order: 2,
    type: "single_select",
    prompt: "Why are you thinking about ESOPs?",
    required: true,
    options: [
      {
        id: "retain_key_employees",
        label: "We want to retain key employees.",
        score: 2,
        tags: ["esop_needs_report"],
        popup:
          "Retention-focused ESOPs are common in growth companies. The valuation is needed to set a fair option price that employees will trust.",
      },
      {
        id: "reward_early_team",
        label: "We want to reward early team members.",
        score: 2,
        popup:
          "Rewarding early contributors with equity is a strong signal. A proper valuation ensures the options are priced fairly and defensible.",
      },
      {
        id: "reduce_cash_salary_pressure",
        label: "We want to reduce pressure on cash salary increases.",
        score: 2,
        popup:
          "Using equity to manage cash costs is a practical strategy, but it requires a credible option price to be meaningful to employees.",
      },
      {
        id: "investor_or_board_expect_esop",
        label: "Investors or the board expect us to have an ESOP.",
        score: 3,
        tags: ["esop_stakeholder_pressure"],
        popup:
          "If investors or the board are expecting an ESOP, the valuation is likely to be scrutinised. A formal report will be needed.",
      },
      {
        id: "external_party_asked_valuation_support",
        label: "Our auditor, investor, or board has asked for proper valuation support.",
        score: 3,
        tags: ["esop_hot_lead", "esop_stakeholder_pressure"],
        popup:
          "A direct request from an auditor, investor, or board is a clear trigger. You should scope the valuation work as soon as possible.",
      },
      {
        id: "not_sure_how_esops_work",
        label: "We are not sure how ESOPs should work.",
        score: 1,
        tags: ["esop_education_lead"],
        popup:
          "That is a common starting point. The assessment will help you understand what is typically required before setting up an option plan.",
      },
    ],
  },
  {
    id: "a3",
    track: "esop",
    order: 3,
    type: "single_select",
    prompt: "Have you done a formal ESOP valuation before?",
    required: true,
    options: [
      {
        id: "yes_recently",
        label: "Yes, recently.",
        score: 1,
        tags: ["esop_hot_lead"],
        popup:
          "Good. A recent valuation means you are already in the process. You may need to refresh it depending on how much time has passed or whether your cap table has changed.",
      },
      {
        id: "yes_outdated",
        label: "Yes, but it may be outdated.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "An outdated valuation can create problems with auditors, investors, and employees. It is usually better to refresh it before it is challenged.",
      },
      {
        id: "no_formal_valuation",
        label: "No, we have not done one.",
        score: 3,
        tags: ["esop_needs_report"],
        popup:
          "If you are issuing or planning to issue options without a formal valuation, you may be exposed to audit, investor, or governance risk.",
      },
      {
        id: "internal_estimates_only",
        label: "We used internal estimates only.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "Internal estimates are not usually accepted by auditors, investors, or boards. A formal independent valuation is typically required.",
      },
      {
        id: "not_sure_valuation",
        label: "I am not sure.",
        score: 2,
        popup:
          "That is okay. If you are not sure whether a formal valuation has been done, it is worth checking before issuing or repricing any options.",
      },
    ],
  },
  {
    id: "a4",
    track: "esop",
    order: 4,
    type: "single_select",
    prompt: "Who is asking for the ESOP valuation?",
    required: true,
    options: [
      {
        id: "auditor",
        label: "Auditor.",
        score: 3,
        tags: ["esop_hot_lead", "esop_stakeholder_pressure"],
        popup:
          "An auditor request is one of the clearest triggers for a formal ESOP valuation. You should move quickly to avoid delays in the audit process.",
      },
      {
        id: "investor",
        label: "Investor.",
        score: 3,
        tags: ["esop_hot_lead", "esop_stakeholder_pressure"],
        popup:
          "Investors often require a formal ESOP valuation before completing due diligence. A credible report can help the process move faster.",
      },
      {
        id: "board",
        label: "Board.",
        score: 3,
        tags: ["esop_hot_lead", "esop_stakeholder_pressure"],
        popup:
          "Board-level requests for ESOP valuation are serious. A formal report supports governance, option pricing, and board minutes.",
      },
      {
        id: "founder_management",
        label: "Founder or management team.",
        score: 2,
        popup:
          "Internal demand is a good starting point. It suggests the team is thinking ahead about option pricing, governance, and employee expectations.",
      },
      {
        id: "hr_people_team",
        label: "HR or people team.",
        score: 2,
        popup:
          "HR-driven requests often come from the need to explain option value to employees. A formal valuation makes those conversations credible.",
      },
      {
        id: "nobody_planning_ahead",
        label: "Nobody yet. We are planning ahead.",
        score: 1,
        popup:
          "Planning ahead is the right approach. Understanding the valuation requirements before you need them avoids last-minute pressure.",
      },
    ],
  },
  {
    id: "a5",
    track: "esop",
    order: 5,
    type: "single_select",
    prompt: "When do you need this solved?",
    required: true,
    options: [
      {
        id: "immediately",
        label: "Immediately.",
        score: 3,
        popup:
          "This is urgent. We can help you scope the work quickly so you are not delayed in audit, fundraising, or option issuance.",
      },
      {
        id: "within_1_month",
        label: "Within 1 month.",
        score: 3,
        popup:
          "That is a tight window. Getting started now will help ensure the report is ready when you need it.",
      },
      {
        id: "within_3_months",
        label: "Within 3 months.",
        score: 2,
        popup:
          "That is a manageable timeline. Starting the scoping conversation now gives you enough time to prepare properly.",
      },
      {
        id: "within_6_months",
        label: "Within 6 months.",
        score: 1,
        popup:
          "You have some time, but it is worth starting the conversation early to understand what documents and decisions are needed.",
      },
      {
        id: "later_this_year",
        label: "Later this year.",
        score: 1,
        popup:
          "Good to plan ahead. Understanding the requirements now means you will not be caught off guard when the timeline gets closer.",
      },
      {
        id: "no_clear_timeline",
        label: "No clear timeline yet.",
        score: 0,
        popup:
          "That is okay. Even without a deadline, understanding the process helps you prepare before a trigger event creates urgency.",
      },
    ],
  },
  {
    id: "a6",
    track: "esop",
    order: 6,
    type: "single_select",
    prompt: "What is your biggest concern about ESOP valuation?",
    required: true,
    options: [
      {
        id: "do_not_know_how_to_value",
        label: "We do not know how to value the options properly.",
        score: 2,
        popup:
          "That is the most common concern. Option valuation uses specific financial models that require independent expertise to be credible.",
      },
      {
        id: "may_not_satisfy_auditors_investors",
        label: "We are worried the valuation may not satisfy auditors or investors.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "That is a legitimate concern. A formal independent valuation report is usually what auditors and investors require.",
      },
      {
        id: "avoid_overpricing_underpricing",
        label: "We want to avoid overpricing or underpricing employee options.",
        score: 2,
        popup:
          "Pricing options correctly matters for employee trust and legal compliance. A proper valuation gives you a defensible starting point.",
      },
      {
        id: "faster_clearer_process",
        label: "We want a faster or clearer valuation process.",
        score: 2,
        popup:
          "Speed and clarity are important when audit or investor deadlines are close. We can help you scope the work efficiently.",
      },
      {
        id: "comparing_providers",
        label: "We are comparing valuation providers.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "If you are already comparing providers, you clearly have a near-term need. We are happy to walk you through our approach and pricing.",
      },
      {
        id: "understand_required",
        label: "We just want to understand what is required.",
        score: 1,
        tags: ["esop_education_lead"],
        popup:
          "Understanding the requirements before committing is sensible. We can explain the process, timeline, and documents needed.",
      },
    ],
  },
  {
    id: "a_open",
    track: "esop",
    order: 7,
    type: "open_text",
    prompt: "Anything else worth knowing before we look at this together?",
    helper:
      "Tell us about your cap table, option pool size, auditor requirements, or any context not covered above. There is no right or wrong answer here.",
    required: false,
  },

  // ── Business Value track (max score 24) ──────────────────────────────
  {
    id: "b1",
    track: "business_value",
    order: 1,
    type: "single_select",
    prompt: "How is your company usually valued today?",
    required: true,
    options: [
      {
        id: "profit_multiple",
        label: "Profit multiple.",
        score: 1,
        popup:
          "That is common for SMEs and traditional businesses. But a profit multiple may not capture the full value of your brand, customer base, contracts, systems, software, data, or IP.",
      },
      {
        id: "revenue_multiple",
        label: "Revenue multiple.",
        score: 1,
        popup:
          "Revenue multiples are common in growth businesses. They may still miss value sitting in customer relationships, contracts, software, data, or IP.",
      },
      {
        id: "asset_value",
        label: "Asset value.",
        score: 0,
        popup:
          "Asset-based valuation is common in asset-heavy businesses. It often misses intangible value like brand, customer relationships, and operational know-how.",
      },
      {
        id: "comparable_companies",
        label: "Comparable companies.",
        score: 1,
        popup:
          "Comparable company analysis can be a useful benchmark, but it may not reflect what makes your business unique or more valuable than the average.",
      },
      {
        id: "investor_negotiation",
        label: "Investor negotiation.",
        score: 2,
        tags: ["fundraising_valuation_lead"],
        popup:
          "Negotiated valuations can work in your favour if you have a strong story, but they can also work against you if the investor controls the narrative.",
      },
      {
        id: "do_not_know",
        label: "I do not know.",
        score: 1,
        popup:
          "That is more common than you might think. Understanding how your business is currently valued is a useful first step.",
      },
    ],
  },
  {
    id: "b2",
    track: "business_value",
    order: 2,
    type: "single_select",
    prompt: "Do you feel this valuation method misses important parts of your business?",
    required: true,
    options: [
      {
        id: "yes_definitely",
        label: "Yes, definitely.",
        score: 3,
        popup:
          "That is exactly the gap this assessment is designed to explore. Many businesses have value that does not show up clearly in revenue, profit, or asset value alone.",
      },
      {
        id: "maybe",
        label: "Maybe.",
        score: 2,
        popup:
          "A partial gap is still worth exploring. Even if some value is captured, there may be more that is being overlooked.",
      },
      {
        id: "not_sure_bv",
        label: "Not sure.",
        score: 1,
        popup:
          "That is a fair answer. The remaining questions will help you identify whether there are value drivers that your current valuation method may be missing.",
      },
      {
        id: "no_bv",
        label: "No.",
        score: 0,
        popup:
          "That is useful to know. The assessment will still help you confirm whether there are any areas of hidden value worth understanding.",
      },
    ],
  },
  {
    id: "b3",
    track: "business_value",
    order: 3,
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
          "Brand value is real but often invisible in financial statements. It can influence customer loyalty, pricing power, and acquisition value.",
      },
      {
        id: "customer_relationships",
        label: "Customer relationships.",
        score: 1,
        popup:
          "Strong customer relationships can reduce churn, increase lifetime value, and make the business more defensible. These are often undervalued.",
      },
      {
        id: "repeat_customers_or_recurring_revenue",
        label: "Repeat customers or recurring revenue.",
        score: 2,
        popup:
          "This is a strong value signal. Repeat and recurring revenue can make a business more predictable, which may support a stronger valuation conversation.",
      },
      {
        id: "long_term_contracts",
        label: "Long-term contracts.",
        score: 2,
        popup:
          "Contracts provide revenue visibility and reduce risk. They can be a meaningful component of business value if properly documented.",
      },
      {
        id: "software_platform_app_or_internal_technology",
        label: "Software, platform, app, or internal technology.",
        score: 2,
        tags: ["software_data_valuation_lead"],
        popup:
          "Technology can create value if it improves efficiency, supports customers, creates data, reduces manual work, or gives the business an advantage competitors do not have.",
      },
      {
        id: "data_or_customer_database",
        label: "Data or customer database.",
        score: 1,
        tags: ["software_data_valuation_lead"],
        popup:
          "Data assets can be valuable if they are structured, maintained, and used to drive decisions or customer outcomes.",
      },
      {
        id: "ip_trademarks_patents_designs_or_knowhow",
        label: "IP, trademarks, patents, designs, or know-how.",
        score: 2,
        popup:
          "Intellectual property can be a significant value driver, especially if it is formally registered, actively used, and difficult for competitors to replicate.",
      },
      {
        id: "operating_systems_processes_or_playbooks",
        label: "Operating systems, processes, or playbooks.",
        score: 1,
        popup:
          "Well-documented systems and processes reduce key-person dependency and make the business more scalable and transferable.",
      },
      {
        id: "technical_team_or_specialist_knowledge",
        label: "Technical team or specialist knowledge.",
        score: 1,
        popup:
          "Specialist expertise can be a competitive advantage, but it needs to be captured in systems and processes to be valued as a business asset rather than a personal one.",
      },
      {
        id: "none_of_the_above",
        label: "None of the above.",
        score: 0,
        popup:
          "That is useful to know. The remaining questions will help identify whether there are other value signals worth exploring.",
      },
      {
        id: "not_sure_bv3",
        label: "I am not sure.",
        score: 1,
        popup:
          "That is a common answer. Many business owners only realise what value they have after mapping their assets more carefully.",
      },
    ],
  },
  {
    id: "b4",
    track: "business_value",
    order: 4,
    type: "single_select",
    prompt: "Can you prove these assets with documents, data, contracts, or reports?",
    required: true,
    options: [
      {
        id: "yes_clearly",
        label: "Yes, clearly.",
        score: 3,
        popup:
          "Strong evidence is a real advantage. Investors, buyers, and boards are more likely to accept value claims that are supported by documents and data.",
      },
      {
        id: "somewhat",
        label: "Somewhat.",
        score: 2,
        popup:
          "That is a common middle ground. The value may exist, but the evidence may need to be cleaned up before investors, buyers, or shareholders can rely on it.",
      },
      {
        id: "not_really",
        label: "Not really.",
        score: 2,
        popup:
          "This is where many businesses lose value in a negotiation. The assets may be real, but without evidence, they are difficult to defend.",
      },
      {
        id: "no_evidence",
        label: "No.",
        score: 1,
        popup:
          "A lack of documentation is a common gap. It does not mean the value is not there, but it does mean it will be harder to prove in a valuation discussion.",
      },
      {
        id: "not_sure_evidence",
        label: "I am not sure.",
        score: 1,
        popup:
          "That is worth finding out. Knowing what documentation exists is an important first step before any valuation or investor discussion.",
      },
    ],
  },
  {
    id: "b5",
    track: "business_value",
    order: 5,
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
          "Fundraising is one of the clearest reasons to prepare your valuation story. Investors will usually challenge assumptions, so your evidence needs to be ready.",
      },
      {
        id: "selling_the_business",
        label: "We may sell the business.",
        score: 3,
        tags: ["strategic_transaction_lead"],
        popup:
          "Sellers who understand their hidden value are in a stronger negotiating position. Buyers will look for reasons to discount the price.",
      },
      {
        id: "bringing_investors_or_shareholders",
        label: "We are bringing in investors or shareholders.",
        score: 3,
        tags: ["ownership_risk_lead"],
        popup:
          "New investors and shareholders will form their own view of value. Preparing your hidden value story before they arrive puts you in control of the narrative.",
      },
      {
        id: "succession_or_restructuring",
        label: "We are planning succession or restructuring.",
        score: 2,
        tags: ["ownership_risk_lead"],
        popup:
          "Succession and restructuring often require a credible business valuation. Hidden value can affect how the business is divided or transferred.",
      },
      {
        id: "board_bank_auditor_or_partner_explanation",
        label: "We need to explain our value to the board, bank, auditor, or partners.",
        score: 2,
        popup:
          "Explaining value to stakeholders requires evidence, not just claims. A structured view of your hidden value makes those conversations easier.",
      },
      {
        id: "understand_what_business_is_worth",
        label: "We want to understand what the business is really worth.",
        score: 1,
        popup:
          "That is a good reason to start. Even without a transaction, knowing where your business value comes from can help with strategy, growth, and future planning.",
      },
      {
        id: "just_curious",
        label: "No specific reason. Just curious.",
        score: 0,
        popup:
          "Curiosity is a fine starting point. Many owners only realise the value gap after seeing what parts of the business are not reflected in normal financial numbers.",
      },
    ],
  },
  {
    id: "b6",
    track: "business_value",
    order: 6,
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
          "This may be urgent. If valuation discussions are already happening, you should avoid entering them without a clear view of what value may be missing.",
      },
      {
        id: "within_3_months_bv",
        label: "Within 3 months.",
        score: 3,
        tags: ["strategic_transaction_lead"],
        popup:
          "That is a near-term window. It is worth preparing early so you are not trying to build the valuation story while investors, buyers, or shareholders are already asking questions.",
      },
      {
        id: "within_6_months_bv",
        label: "Within 6 months.",
        score: 2,
        popup:
          "That is a good planning timeline. You likely have enough time to identify hidden value, organise evidence, and prepare a stronger valuation position.",
      },
      {
        id: "within_12_months",
        label: "Within 12 months.",
        score: 1,
        popup:
          "That gives you time to prepare properly. The earlier you map your value drivers, the stronger your position may be when the valuation discussion begins.",
      },
      {
        id: "no_clear_timeline_bv",
        label: "No clear timeline yet.",
        score: 0,
        popup:
          "That is okay. Even without a deadline, understanding your hidden value can help you make better decisions before fundraising, sale, succession, or investor discussions.",
      },
    ],
  },
  {
    id: "b7",
    track: "business_value",
    order: 7,
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
          "That is a common fundraising issue. Investors need more than a strong story. They need evidence that supports why the business deserves its valuation.",
      },
      {
        id: "buyers_may_value_us_too_cheaply",
        label: "Buyers may value us too cheaply.",
        score: 3,
        tags: ["brand_valuation_lead"],
        popup:
          "That is a real risk. Buyers often look for reasons to discount a business, so it helps to identify hidden value before the negotiation starts.",
      },
      {
        id: "brand_software_data_ip_or_customer_base_not_reflected",
        label: "Our brand, software, data, IP, or customer base is not reflected properly.",
        score: 3,
        popup:
          "That is exactly where intangible value matters. These assets may not show clearly in the financials, but they can still influence what the business is worth.",
      },
      {
        id: "do_not_know_how_to_prove_business_worth_more",
        label: "We do not know how to prove the business is worth more.",
        score: 2,
        popup:
          "That is often the main gap. The business may be valuable, but the value needs to be organised into evidence that outsiders can understand and accept.",
      },
      {
        id: "valued_only_on_profit_or_revenue",
        label: "We are being valued only on profit or revenue.",
        score: 2,
        popup:
          "That can be frustrating if your business has more going on beneath the surface. A basic multiple may miss the quality, stickiness, systems, or assets behind the numbers.",
      },
      {
        id: "not_concerned",
        label: "We are not concerned. Just exploring.",
        score: 0,
        popup:
          "That is a useful starting point. Even if there is no immediate concern, this can help you understand where business value may sit outside the usual numbers.",
      },
    ],
  },
  {
    id: "b_open",
    track: "business_value",
    order: 8,
    type: "open_text",
    prompt: "Anything else worth knowing before we look at this together?",
    helper:
      "Tell us about any deal terms, ownership structure, timeline pressure, or context not covered above. There is no right or wrong answer here.",
    required: false,
  },
];

// Max scores per track
export const MAX_SCORE: Record<Track, number> = {
  esop: 18,
  business_value: 24,
};
