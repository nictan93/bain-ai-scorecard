export type Track = "esop" | "brand_ip";

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
}

export const QUESTIONS: Question[] = [
  // ── Routing ──────────────────────────────────────────────────────────
  {
    id: "q1_routing",
    track: "universal",
    order: 0,
    type: "single_select",
    prompt: "What are you trying to solve?",
    required: true,
    options: [
      {
        id: "q1_a",
        label: "I want to retain key employees using ESOPs.",
        routesTo: "esop",
        popup:
          "Good choice. ESOPs can be a powerful way to reward key employees without relying only on higher cash salaries. The next few questions will help you understand whether you may need ESOP valuation support.",
      },
      {
        id: "q1_b",
        label: "I already have ESOPs and need valuation support.",
        routesTo: "esop",
        popup:
          "You are already in the right zone. If your company has issued options, proper valuation support may be important for audit, investor, board, or governance purposes.",
      },
      {
        id: "q1_c",
        label: "I am raising funds and want a stronger valuation.",
        routesTo: "brand_ip",
        tags: ["fundraising_valuation_lead"],
        popup:
          "That makes sense. Investors usually look for evidence, not just ambition. This assessment will help identify whether your business has hidden value that could support a stronger valuation conversation.",
      },
      {
        id: "q1_d",
        label: "I may sell, restructure, or bring in investors.",
        routesTo: "brand_ip",
        tags: ["strategic_transaction_lead"],
        popup:
          "This is exactly when valuation matters. Before buyers, shareholders, or investors set the price, it helps to understand what value may not be obvious from your financials alone.",
      },
      {
        id: "q1_e",
        label: "I think my business is worth more than a basic profit multiple.",
        routesTo: "brand_ip",
        popup:
          "You may be right. Many businesses are valued too simply based on profit or revenue multiples, even when they have brand, customers, contracts, software, data, or systems that create additional value.",
      },
      {
        id: "q1_f",
        label: "I am not sure. I just want to check if there is hidden value.",
        routesTo: "brand_ip",
        popup:
          "That is a good place to start. Many business owners do not realise what counts as hidden value until they map it out clearly.",
      },
    ],
  },

  // ── Track A: ESOP ────────────────────────────────────────────────────
  {
    id: "a1",
    track: "esop",
    order: 0,
    type: "single_select",
    prompt: "Are you already issuing employee stock options?",
    required: true,
    options: [
      {
        id: "a1_a",
        label: "Yes, we already issue employee stock options.",
        score: 3,
        tags: ["esop_needs_report"],
        popup:
          "Great, you are already using one of the most common ways startups reward and retain key employees. The next step is making sure the option value is properly supported.",
      },
      {
        id: "a1_b",
        label: "Not yet, but we plan to issue them soon.",
        score: 2,
        popup:
          "That is a smart move to consider early. ESOPs can help you incentivise your team, but it is better to understand the valuation requirements before issuing options.",
      },
      {
        id: "a1_c",
        label: "We are considering it but have not decided.",
        score: 1,
        tags: ["esop_education_lead"],
        popup:
          "That is completely normal. ESOPs are useful, but they need to be structured carefully so employees, founders, investors, and auditors are aligned.",
      },
      {
        id: "a1_d",
        label: "No, we do not issue employee stock options.",
        score: 0,
        tags: ["esop_education_lead"],
        popup:
          "Did you know ESOPs can help companies reward employees without relying only on fixed salary increases? Instead of paying everything in cash, part of the reward can come from giving employees upside in the company's future value.",
      },
      {
        id: "a1_e",
        label: "I am not sure.",
        score: 1,
        popup:
          "No problem. Many founders and operators are not fully sure whether their company has an ESOP, an option pool, or informal equity promises. This assessment will help you understand what may need checking.",
      },
    ],
  },
  {
    id: "a2",
    track: "esop",
    order: 1,
    type: "single_select",
    prompt: "Why are you thinking about ESOPs?",
    required: true,
    options: [
      {
        id: "a2_a",
        label: "We want to retain key employees.",
        score: 2,
        popup:
          "That is one of the strongest reasons to use ESOPs. Good employees often want to feel that they are sharing in the company's upside, not just receiving a salary.",
      },
      {
        id: "a2_b",
        label: "We want to reward early team members.",
        score: 2,
        popup:
          "That makes sense. Early employees often take more risk, wear more hats, and help build value before the company becomes stable. ESOPs can be one way to recognise that contribution.",
      },
      {
        id: "a2_c",
        label: "We want to reduce pressure on cash salary increases.",
        score: 2,
        popup:
          "This is a very common startup problem. ESOPs can help balance cash constraints with long-term incentives, especially when the company is still growing.",
      },
      {
        id: "a2_d",
        label: "Investors or the board expect us to have an ESOP.",
        score: 3,
        tags: ["esop_stakeholder_pressure"],
        popup:
          "That is a strong signal. Investors and boards often expect a clear employee incentive plan because it affects hiring, retention, dilution, and future fundraising.",
      },
      {
        id: "a2_e",
        label: "Our auditor, investor, or board has asked for proper valuation support.",
        score: 3,
        tags: ["esop_hot_lead", "esop_stakeholder_pressure"],
        popup:
          "This is usually where valuation becomes urgent. Once an external party asks for support, internal estimates may not be enough.",
      },
      {
        id: "a2_f",
        label: "We are not sure how ESOPs should work.",
        score: 1,
        tags: ["esop_education_lead"],
        popup:
          "That is fine. ESOPs can sound technical at first, but the basic idea is simple: they give employees a way to share in the company's future value.",
      },
    ],
  },
  {
    id: "a3",
    track: "esop",
    order: 2,
    type: "single_select",
    prompt: "Have you done a formal ESOP valuation before?",
    required: true,
    options: [
      {
        id: "a3_a",
        label: "Yes, recently.",
        score: 1,
        popup:
          "Good. Having a recent valuation puts you in a better position. The key question is whether it still reflects your current company stage, latest fundraising, and option plan.",
      },
      {
        id: "a3_b",
        label: "Yes, but it may be outdated.",
        score: 2,
        tags: ["esop_needs_report"],
        popup:
          "That is worth reviewing. ESOP valuations can become outdated when the company raises funds, changes performance, expands, restructures, or issues new options.",
      },
      {
        id: "a3_c",
        label: "No, we have not done one.",
        score: 3,
        tags: ["esop_needs_report"],
        popup:
          "That is a common gap. If you are issuing options, a formal valuation can help support fair pricing and reduce questions from auditors, investors, or the board.",
      },
      {
        id: "a3_d",
        label: "We used internal estimates only.",
        score: 2,
        tags: ["esop_needs_report"],
        popup:
          "Internal estimates may be useful for planning, but they can be difficult to defend externally. A formal valuation report gives more support when auditors, investors, or board members ask questions.",
      },
      {
        id: "a3_e",
        label: "I am not sure.",
        score: 2,
        popup:
          "That is okay. If you are unsure, it may be worth checking your option documents, cap table, audit files, or board records before issuing or refreshing options.",
      },
    ],
  },
  {
    id: "a4",
    track: "esop",
    order: 3,
    type: "single_select",
    prompt: "Who is asking for the ESOP valuation?",
    required: true,
    options: [
      {
        id: "a4_a",
        label: "Auditor.",
        score: 3,
        tags: ["esop_hot_lead", "esop_stakeholder_pressure"],
        popup:
          "If your auditor is asking, the timing may matter. A proper ESOP valuation can help support audit review and reduce back-and-forth during reporting.",
      },
      {
        id: "a4_b",
        label: "Investor.",
        score: 3,
        tags: ["esop_hot_lead", "esop_stakeholder_pressure"],
        popup:
          "If an investor is asking, they likely want comfort around option pricing, dilution, and governance. This is a good reason to make sure the valuation is properly supported.",
      },
      {
        id: "a4_c",
        label: "Board.",
        score: 2,
        tags: ["esop_stakeholder_pressure"],
        popup:
          "Board-level questions usually mean the ESOP has become a governance matter. A clear valuation helps the board understand whether the plan is fair, reasonable, and properly documented.",
      },
      {
        id: "a4_d",
        label: "Founder or management team.",
        score: 2,
        popup:
          "That is a good sign. It is better for management to prepare early than wait until auditors, investors, or employees start asking difficult questions.",
      },
      {
        id: "a4_e",
        label: "HR or people team.",
        score: 1,
        popup:
          "That usually means the ESOP is becoming part of compensation and retention planning. The valuation should be clear enough for both finance and people teams to explain properly.",
      },
      {
        id: "a4_f",
        label: "Nobody yet. We are planning ahead.",
        score: 1,
        popup:
          "Planning ahead is the best time to do this. It is usually easier to structure and value options before there is pressure from auditors, investors, or employees.",
      },
    ],
  },
  {
    id: "a5",
    track: "esop",
    order: 4,
    type: "single_select",
    prompt: "When do you need this solved?",
    required: true,
    options: [
      {
        id: "a5_a",
        label: "Immediately.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "This may be urgent. If an audit, fundraising, board approval, or option issuance is already underway, you should move quickly to avoid delays.",
      },
      {
        id: "a5_b",
        label: "Within 1 month.",
        score: 3,
        tags: ["esop_hot_lead"],
        popup:
          "That is a near-term need. It is worth preparing the required documents early so the valuation process does not hold up your audit, fundraising, or ESOP issuance.",
      },
      {
        id: "a5_c",
        label: "Within 3 months.",
        score: 2,
        popup:
          "That is a good planning window. You likely have enough time to prepare properly instead of rushing the valuation at the last minute.",
      },
      {
        id: "a5_d",
        label: "Within 6 months.",
        score: 1,
        popup:
          "That gives you time to get organised. The earlier you understand the requirements, the easier it is to avoid messy clean-up later.",
      },
      {
        id: "a5_e",
        label: "Later this year.",
        score: 1,
        popup:
          "Good to know. ESOP valuation may not be urgent yet, but it is worth understanding what documents and decisions you will need before the timeline gets closer.",
      },
      {
        id: "a5_f",
        label: "No clear timeline yet.",
        score: 0,
        popup:
          "That is fine. Even without a fixed timeline, this assessment can help you understand whether ESOP valuation is something you should prepare for.",
      },
    ],
  },
  {
    id: "a6",
    track: "esop",
    order: 5,
    type: "single_select",
    prompt: "What is your biggest concern about ESOP valuation?",
    required: true,
    options: [
      {
        id: "a6_a",
        label: "We do not know how to value the options properly.",
        score: 2,
        tags: ["esop_education_lead"],
        popup:
          "That is very common. ESOP valuation can feel technical because it touches equity value, option pricing, dilution, and company stage. A clear report helps simplify the decision.",
      },
      {
        id: "a6_b",
        label: "We are worried the valuation may not satisfy auditors or investors.",
        score: 3,
        tags: ["esop_stakeholder_pressure"],
        popup:
          "That is a valid concern. A valuation that looks fine internally may still create problems if it is not clear, well-supported, or properly documented.",
      },
      {
        id: "a6_c",
        label: "We want to avoid overpricing or underpricing employee options.",
        score: 2,
        popup:
          "That is the right issue to focus on. If options are priced poorly, employees may not value them properly, and investors or auditors may question the plan later.",
      },
      {
        id: "a6_d",
        label: "We want a faster or clearer valuation process.",
        score: 2,
        popup:
          "That is reasonable. A good ESOP valuation process should be clear, practical, and not drag your team through unnecessary complexity.",
      },
      {
        id: "a6_e",
        label: "We are comparing valuation providers.",
        score: 2,
        popup:
          "That is a smart step. The lowest-cost provider is not always the best fit if the report is unclear, slow, or difficult to defend during audit or investor review.",
      },
      {
        id: "a6_f",
        label: "We just want to understand what is required.",
        score: 1,
        tags: ["esop_education_lead"],
        popup:
          "Good starting point. You do not need to know everything upfront. The key is understanding when valuation is needed, what documents are required, and who will rely on the report.",
      },
    ],
  },
  {
    id: "a_open",
    track: "esop",
    order: 6,
    type: "open_text",
    prompt: "Anything else worth knowing before we look at this together?",
    helper:
      "Tell us about any specific constraints, timeline pressures, or context not captured above. There is no right or wrong answer here.",
    required: false,
  },

  // ── Track B: Valuation Uplift ────────────────────────────────────────
  {
    id: "b1",
    track: "brand_ip",
    order: 0,
    type: "single_select",
    prompt: "How is your company usually valued today?",
    required: true,
    options: [
      {
        id: "b1_a",
        label: "Profit multiple.",
        score: 2,
        popup:
          "That is common for SMEs and traditional businesses. But a profit multiple may not capture the full value of your brand, customer base, contracts, systems, software, data, or IP.",
      },
      {
        id: "b1_b",
        label: "Revenue multiple.",
        score: 2,
        popup:
          "That is common for startups and growth companies. But revenue alone may not explain the quality of your business, customer stickiness, technology, brand strength, or future earning power.",
      },
      {
        id: "b1_c",
        label: "Asset value.",
        score: 2,
        popup:
          "That is common for asset-heavy businesses. But some of the most valuable parts of a company may not sit on the balance sheet, such as customer relationships, know-how, data, systems, and brand.",
      },
      {
        id: "b1_d",
        label: "Comparable companies.",
        score: 2,
        popup:
          "Comparable companies can be useful, but they do not always explain why your company should trade at the high end or low end of the range. The details matter.",
      },
      {
        id: "b1_e",
        label: "Investor negotiation.",
        score: 2,
        popup:
          "That is very common. If valuation is mostly negotiated, then your evidence matters. The stronger your proof, the stronger your position.",
      },
      {
        id: "b1_f",
        label: "I do not know.",
        score: 1,
        popup:
          "That is okay. Many owners only find out how the market values their business when they raise funds, bring in investors, or explore a sale.",
      },
    ],
  },
  {
    id: "b2",
    track: "brand_ip",
    order: 1,
    type: "single_select",
    prompt: "Do you feel this valuation method misses important parts of your business?",
    required: true,
    options: [
      {
        id: "b2_a",
        label: "Yes, definitely.",
        score: 3,
        popup:
          "That is exactly the gap this assessment is designed to explore. Many businesses have value that does not show up clearly in revenue, profit, or asset value alone.",
      },
      {
        id: "b2_b",
        label: "Maybe.",
        score: 2,
        popup:
          "That is worth checking. Sometimes the hidden value is obvious only after you map out the brand, customers, contracts, software, data, IP, or systems behind the business.",
      },
      {
        id: "b2_c",
        label: "Not sure.",
        score: 1,
        popup:
          "That is normal. Many business owners know their company is valuable, but they have not broken down exactly where that extra value comes from.",
      },
      {
        id: "b2_d",
        label: "No.",
        score: 0,
        popup:
          "That is useful to know. Even if the current method feels fair, it may still be worth checking whether any value drivers are being overlooked.",
      },
    ],
  },
  {
    id: "b3",
    track: "brand_ip",
    order: 2,
    type: "multi_select",
    prompt: "What do you think your current valuation does not fully capture?",
    helper: "Select all that apply.",
    required: true,
    options: [
      {
        id: "b3_a",
        label: "Brand or reputation.",
        score: 1,
        tags: ["brand_valuation_lead"],
        popup:
          "Brand can create real business value when it helps you win customers, charge better prices, reduce sales friction, or build trust faster than competitors.",
      },
      {
        id: "b3_b",
        label: "Customer relationships.",
        score: 1,
        tags: ["brand_valuation_lead"],
        popup:
          "Customer relationships can be valuable because buyers and investors care about repeat business, loyalty, retention, and how difficult it would be for customers to switch away.",
      },
      {
        id: "b3_c",
        label: "Repeat customers or recurring revenue.",
        score: 1,
        popup:
          "This is a strong value signal. Repeat and recurring revenue can make a business more predictable, which may support a stronger valuation conversation.",
      },
      {
        id: "b3_d",
        label: "Long-term contracts.",
        score: 1,
        popup:
          "Long-term contracts can reduce uncertainty. If your future revenue is already partly locked in, that can make your business more attractive to investors or buyers.",
      },
      {
        id: "b3_e",
        label: "Software, platform, app, or internal technology.",
        score: 1,
        tags: ["software_data_valuation_lead"],
        popup:
          "Technology can create value if it improves efficiency, supports customers, creates data, reduces manual work, or gives the business an advantage competitors do not have.",
      },
      {
        id: "b3_f",
        label: "Data or customer database.",
        score: 1,
        tags: ["software_data_valuation_lead"],
        popup:
          "Data can be valuable when it helps you understand customers, improve sales, personalise service, automate decisions, or create insights competitors cannot easily replicate.",
      },
      {
        id: "b3_g",
        label: "IP, trademarks, patents, designs, or know-how.",
        score: 1,
        tags: ["brand_valuation_lead"],
        popup:
          "Formal IP and business know-how can support value if they protect your advantage, differentiate your company, or make your products and services harder to copy.",
      },
      {
        id: "b3_h",
        label: "Operating systems, processes, or playbooks.",
        score: 1,
        popup:
          "Systems and processes matter because they make the business less dependent on one person. A company that runs well without constant founder intervention is usually more valuable.",
      },
      {
        id: "b3_i",
        label: "Technical team or specialist knowledge.",
        score: 1,
        tags: ["software_data_valuation_lead"],
        popup:
          "Specialist knowledge can be valuable when it helps the company build products, serve customers, solve hard problems, or maintain an advantage competitors cannot easily hire or copy.",
      },
      {
        id: "b3_j",
        label: "None of the above.",
        score: 0,
        popup:
          "That is okay. Your company may still have value, but it may be more directly tied to revenue, profit, assets, or market demand.",
      },
      {
        id: "b3_k",
        label: "I am not sure.",
        score: 0,
        popup:
          "No problem. Hidden value is often hard to spot because it feels like just how the business works. The next questions will help clarify whether there is anything worth reviewing.",
      },
    ],
  },
  {
    id: "b4",
    track: "brand_ip",
    order: 3,
    type: "single_select",
    prompt: "Can you prove these assets with documents, data, contracts, or reports?",
    required: true,
    options: [
      {
        id: "b4_a",
        label: "Yes, clearly.",
        score: 1,
        popup:
          "That is a strong position. If you can prove the value with documents, data, contracts, or reports, it becomes easier to support a stronger valuation conversation.",
      },
      {
        id: "b4_b",
        label: "Somewhat.",
        score: 2,
        popup:
          "That is a common middle ground. The value may exist, but the evidence may need to be cleaned up before investors, buyers, or shareholders can rely on it.",
      },
      {
        id: "b4_c",
        label: "Not really.",
        score: 3,
        popup:
          "This is where many companies get stuck. The value may be real, but if it cannot be shown clearly, outsiders may ignore it or discount it.",
      },
      {
        id: "b4_d",
        label: "No.",
        score: 3,
        popup:
          "That does not mean the value is not there. It means the first job may be to identify and organise the evidence before trying to include it in a valuation discussion.",
      },
      {
        id: "b4_e",
        label: "I am not sure.",
        score: 2,
        popup:
          "That is fine. A lot of business owners have the documents somewhere, but they are scattered across contracts, dashboards, customer files, financial reports, and internal systems.",
      },
    ],
  },
  {
    id: "b5",
    track: "brand_ip",
    order: 4,
    type: "single_select",
    prompt: "Why do you want a stronger valuation?",
    required: true,
    options: [
      {
        id: "b5_a",
        label: "We are raising funds.",
        score: 3,
        tags: ["fundraising_valuation_lead"],
        popup:
          "Fundraising is one of the clearest reasons to prepare your valuation story. Investors will usually challenge assumptions, so your evidence needs to be ready.",
      },
      {
        id: "b5_b",
        label: "We may sell the business.",
        score: 3,
        tags: ["brand_valuation_lead", "strategic_transaction_lead"],
        popup:
          "If you may sell the business, you do not want buyers to value it too simply. Hidden value should be identified before the buyer controls the valuation narrative.",
      },
      {
        id: "b5_c",
        label: "We are bringing in investors or shareholders.",
        score: 3,
        tags: ["fundraising_valuation_lead"],
        popup:
          "That is an important moment. When new money or new shareholders enter the business, valuation needs to be clear, fair, and supportable.",
      },
      {
        id: "b5_d",
        label: "We are planning succession or restructuring.",
        score: 2,
        tags: ["ownership_risk_lead"],
        popup:
          "Succession and restructuring often require a clearer view of business value. This is especially important for family businesses, shareholder changes, or ownership transfers.",
      },
      {
        id: "b5_e",
        label: "We need to explain our value to the board, bank, auditor, or partners.",
        score: 2,
        popup:
          "That is a practical reason. When external parties ask questions, a clear valuation story can help reduce confusion and strengthen decision-making.",
      },
      {
        id: "b5_f",
        label: "We want to understand what the business is really worth.",
        score: 1,
        popup:
          "That is a good reason to start. Even without a transaction, knowing where your business value comes from can help with strategy, growth, and future planning.",
      },
      {
        id: "b5_g",
        label: "No specific reason. Just curious.",
        score: 0,
        popup:
          "Curiosity is a fine starting point. Many owners only realise the value gap after seeing what parts of the business are not reflected in normal financial numbers.",
      },
    ],
  },
  {
    id: "b6",
    track: "brand_ip",
    order: 5,
    type: "single_select",
    prompt: "When might you need to defend your valuation?",
    required: true,
    options: [
      {
        id: "b6_a",
        label: "Now.",
        score: 3,
        tags: ["strategic_transaction_lead"],
        popup:
          "This may be urgent. If valuation discussions are already happening, you should avoid entering them without a clear view of what value may be missing.",
      },
      {
        id: "b6_b",
        label: "Within 3 months.",
        score: 3,
        tags: ["strategic_transaction_lead"],
        popup:
          "That is a near-term window. It is worth preparing early so you are not trying to build the valuation story while investors, buyers, or shareholders are already asking questions.",
      },
      {
        id: "b6_c",
        label: "Within 6 months.",
        score: 2,
        popup:
          "That is a good planning timeline. You likely have enough time to identify hidden value, organise evidence, and prepare a stronger valuation position.",
      },
      {
        id: "b6_d",
        label: "Within 12 months.",
        score: 1,
        popup:
          "That gives you time to prepare properly. The earlier you map your value drivers, the stronger your position may be when the valuation discussion begins.",
      },
      {
        id: "b6_e",
        label: "No clear timeline yet.",
        score: 0,
        popup:
          "That is okay. Even without a deadline, understanding your hidden value can help you make better decisions before fundraising, sale, succession, or investor discussions.",
      },
    ],
  },
  {
    id: "b7",
    track: "brand_ip",
    order: 6,
    type: "single_select",
    prompt: "What is your biggest concern about your company's valuation?",
    required: true,
    options: [
      {
        id: "b7_a",
        label: "Investors may not understand the true value of the business.",
        score: 3,
        tags: ["fundraising_valuation_lead"],
        popup:
          "That is a common fundraising issue. Investors need more than a strong story. They need evidence that supports why the business deserves its valuation.",
      },
      {
        id: "b7_b",
        label: "Buyers may value us too cheaply.",
        score: 3,
        tags: ["brand_valuation_lead"],
        popup:
          "That is a real risk. Buyers often look for reasons to discount a business, so it helps to identify hidden value before the negotiation starts.",
      },
      {
        id: "b7_c",
        label: "Our brand, software, data, IP, or customer base is not reflected properly.",
        score: 3,
        popup:
          "That is exactly where intangible value matters. These assets may not show clearly in the financials, but they can still influence what the business is worth.",
      },
      {
        id: "b7_d",
        label: "We do not know how to prove the business is worth more.",
        score: 2,
        popup:
          "That is often the main gap. The business may be valuable, but the value needs to be organised into evidence that outsiders can understand and accept.",
      },
      {
        id: "b7_e",
        label: "We are being valued only on profit or revenue.",
        score: 2,
        popup:
          "That can be frustrating if your business has more going on beneath the surface. A basic multiple may miss the quality, stickiness, systems, or assets behind the numbers.",
      },
      {
        id: "b7_f",
        label: "We are not concerned. Just exploring.",
        score: 1,
        popup:
          "That is a useful starting point. Even if there is no immediate concern, this can help you understand where business value may sit outside the usual numbers.",
      },
    ],
  },
  {
    id: "b_open",
    track: "brand_ip",
    order: 7,
    type: "open_text",
    prompt: "Anything else worth knowing before we look at this together?",
    helper:
      "Tell us about any deal terms, ownership structure, timeline pressure, or context not covered above. There is no right or wrong answer here.",
    required: false,
  },
];

// Max scores per track
export const MAX_SCORE: Record<Track, number> = {
  esop: 18,    // 3+3+3+3+3+3
  brand_ip: 20, // 2+3+3+3+3+3+3
};
