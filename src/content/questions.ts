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
  routesTo?: Track | "q2_clarify";
  tags?: BackendTag[];
}

export interface Question {
  id: string;
  track: "universal" | Track;
  order: number;
  type: "single_select" | "open_text";
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
    prompt: "What brings you to this assessment today?",
    required: true,
    options: [
      {
        id: "q1_a",
        label: "We are about to issue or refresh an ESOP grant and need a defensible valuation.",
        routesTo: "esop",
      },
      {
        id: "q1_b",
        label:
          "We have brand, IP, software, or data assets that need to be valued for a deal, audit, or licensing conversation.",
        routesTo: "brand_ip",
      },
      {
        id: "q1_c",
        label:
          "We are heading into an M&A process and need to understand what our intangible assets are worth.",
        routesTo: "q2_clarify",
      },
      {
        id: "q1_d",
        label: "I am not sure which applies. I want to understand my options.",
        routesTo: "q2_clarify",
      },
    ],
  },
  {
    id: "q2_clarify",
    track: "universal",
    order: 1,
    type: "single_select",
    prompt: "Which type of asset is at the centre of this?",
    required: true,
    options: [
      {
        id: "q2_a",
        label: "Employee share options or equity-based compensation.",
        routesTo: "esop",
      },
      {
        id: "q2_b",
        label: "Our brand, trademarks, or licensing income.",
        routesTo: "brand_ip",
      },
      {
        id: "q2_c",
        label: "Software, data assets, or proprietary technology.",
        routesTo: "brand_ip",
      },
      {
        id: "q2_d",
        label: "Customer relationships, a client book, or goodwill from an acquisition.",
        routesTo: "brand_ip",
      },
    ],
  },

  // ── ESOP track ───────────────────────────────────────────────────────
  {
    id: "esop_q1",
    track: "esop",
    order: 0,
    type: "single_select",
    prompt: "Has your company had a formal ESOP valuation done before?",
    required: true,
    options: [
      {
        id: "esop_q1_a",
        label: "No. This would be the first one.",
        score: 2,
        tags: ["esop_needs_report"],
      },
      {
        id: "esop_q1_b",
        label: "Yes, but more than 12 months ago.",
        score: 2,
        tags: ["esop_needs_report"],
      },
      {
        id: "esop_q1_c",
        label: "Yes, within the last 12 months.",
        score: 1,
      },
      {
        id: "esop_q1_d",
        label: "Yes, and we are on a recurring valuation schedule.",
        score: 0,
      },
    ],
  },
  {
    id: "esop_q2",
    track: "esop",
    order: 1,
    type: "single_select",
    prompt: "What is triggering the need for a valuation right now?",
    required: true,
    options: [
      {
        id: "esop_q2_a",
        label: "Our auditor has asked for grant-date fair value documentation.",
        score: 3,
        tags: ["esop_hot_lead", "esop_stakeholder_pressure"],
      },
      {
        id: "esop_q2_b",
        label: "A board member or institutional investor has flagged it.",
        score: 3,
        tags: ["esop_hot_lead", "esop_stakeholder_pressure"],
      },
      {
        id: "esop_q2_c",
        label:
          "We are planning the next grant and want the valuation done before we issue.",
        score: 2,
      },
      {
        id: "esop_q2_d",
        label:
          "We are exploring whether ESOP is the right structure and want to understand what it would involve.",
        score: 1,
        tags: ["esop_education_lead"],
      },
    ],
  },
  {
    id: "esop_q3",
    track: "esop",
    order: 2,
    type: "single_select",
    prompt: "When is your next planned ESOP grant?",
    required: true,
    options: [
      {
        id: "esop_q3_a",
        label: "Within 3 months.",
        score: 3,
        tags: ["esop_hot_lead"],
      },
      {
        id: "esop_q3_b",
        label: "3 to 6 months from now.",
        score: 2,
      },
      {
        id: "esop_q3_c",
        label: "6 to 12 months from now.",
        score: 1,
      },
      {
        id: "esop_q3_d",
        label: "No grant is planned yet.",
        score: 0,
        tags: ["esop_education_lead"],
      },
    ],
  },
  {
    id: "esop_q4",
    track: "esop",
    order: 3,
    type: "single_select",
    prompt: "How many employees are, or will be, participating in the scheme?",
    required: true,
    options: [
      { id: "esop_q4_a", label: "Fewer than 10.", score: 1 },
      { id: "esop_q4_b", label: "10 to 50.", score: 2 },
      { id: "esop_q4_c", label: "50 to 200.", score: 2 },
      { id: "esop_q4_d", label: "More than 200.", score: 3 },
    ],
  },
  {
    id: "esop_q5",
    track: "esop",
    order: 4,
    type: "single_select",
    prompt:
      "Have your auditors or legal advisors raised any concerns about your current valuation approach?",
    required: true,
    options: [
      {
        id: "esop_q5_a",
        label: "Yes, they have flagged it formally.",
        score: 3,
        tags: ["esop_hot_lead", "esop_stakeholder_pressure"],
      },
      {
        id: "esop_q5_b",
        label: "It has come up informally.",
        score: 2,
        tags: ["esop_stakeholder_pressure"],
      },
      {
        id: "esop_q5_c",
        label: "Not yet, but we expect it to come up.",
        score: 1,
      },
      {
        id: "esop_q5_d",
        label: "No concerns have been raised.",
        score: 0,
      },
    ],
  },
  {
    id: "esop_q6",
    track: "esop",
    order: 5,
    type: "single_select",
    prompt: "Is there a transaction or fundraising process running alongside this?",
    required: true,
    options: [
      {
        id: "esop_q6_a",
        label: "Yes, an M&A deal is underway or expected within 6 months.",
        score: 3,
        tags: ["strategic_transaction_lead"],
      },
      {
        id: "esop_q6_b",
        label:
          "Yes, a fundraising round is in progress or planned within 6 months.",
        score: 2,
      },
      {
        id: "esop_q6_c",
        label: "Not currently.",
        score: 0,
      },
    ],
  },
  {
    id: "esop_q7",
    track: "esop",
    order: 6,
    type: "open_text",
    prompt: "Anything else worth knowing before we look at this together?",
    helper:
      "Tell us about any specific constraints, timeline pressures, or context not captured above. There is no right or wrong answer here.",
    required: true,
  },

  // ── Brand/IP track ───────────────────────────────────────────────────
  {
    id: "bip_q1",
    track: "brand_ip",
    order: 0,
    type: "single_select",
    prompt: "What type of intangible asset are you looking to value?",
    required: true,
    options: [
      {
        id: "bip_q1_a",
        label: "Brand, trademarks, or trade names, including licensing potential.",
        score: 2,
        tags: ["brand_valuation_lead"],
      },
      {
        id: "bip_q1_b",
        label: "Proprietary software, a technology platform, or data assets.",
        score: 2,
        tags: ["software_data_valuation_lead"],
      },
      {
        id: "bip_q1_c",
        label: "Intellectual property or patents, including income-generating licences.",
        score: 2,
        tags: ["brand_valuation_lead"],
      },
      {
        id: "bip_q1_d",
        label: "Customer relationships or a client base acquired through a deal.",
        score: 2,
      },
    ],
  },
  {
    id: "bip_q2",
    track: "brand_ip",
    order: 1,
    type: "single_select",
    prompt: "What is driving the need for a valuation?",
    required: true,
    options: [
      {
        id: "bip_q2_a",
        label: "We are being acquired, or acquiring another business.",
        score: 3,
        tags: ["brand_valuation_lead", "strategic_transaction_lead"],
      },
      {
        id: "bip_q2_b",
        label:
          "We are raising capital and investors want intangible assets reflected in the valuation.",
        score: 3,
        tags: ["fundraising_valuation_lead"],
      },
      {
        id: "bip_q2_c",
        label:
          "We are licensing our brand or IP to a partner and need to substantiate the royalty rate.",
        score: 2,
        tags: ["brand_valuation_lead"],
      },
      {
        id: "bip_q2_d",
        label: "There is a shareholder restructuring or ownership dispute in play.",
        score: 2,
        tags: ["ownership_risk_lead"],
      },
      {
        id: "bip_q2_e",
        label: "Audit or financial reporting requires us to recognise the asset formally.",
        score: 2,
      },
      {
        id: "bip_q2_f",
        label:
          "We are exploring. We think the assets have value but have not measured it yet.",
        score: 1,
      },
    ],
  },
  {
    id: "bip_q3",
    track: "brand_ip",
    order: 2,
    type: "single_select",
    prompt: "Has this asset been formally valued before?",
    required: true,
    options: [
      {
        id: "bip_q3_a",
        label: "No, this would be the first time.",
        score: 2,
      },
      {
        id: "bip_q3_b",
        label: "Yes, but circumstances have changed materially since then.",
        score: 2,
      },
      {
        id: "bip_q3_c",
        label: "Yes, within the last 2 years and still current.",
        score: 0,
      },
      {
        id: "bip_q3_d",
        label: "We are not sure.",
        score: 1,
      },
    ],
  },
  {
    id: "bip_q4",
    track: "brand_ip",
    order: 3,
    type: "single_select",
    prompt: "What is your timeline for when you need this?",
    required: true,
    options: [
      {
        id: "bip_q4_a",
        label: "Within 3 months. There is a deal or deadline driving this.",
        score: 3,
        tags: ["strategic_transaction_lead"],
      },
      {
        id: "bip_q4_b",
        label: "3 to 6 months.",
        score: 2,
      },
      {
        id: "bip_q4_c",
        label: "6 to 12 months.",
        score: 1,
      },
      {
        id: "bip_q4_d",
        label: "No hard deadline yet.",
        score: 0,
      },
    ],
  },
  {
    id: "bip_q5",
    track: "brand_ip",
    order: 4,
    type: "single_select",
    prompt: "Who else is involved in this decision?",
    required: true,
    options: [
      {
        id: "bip_q5_a",
        label: "An acquirer's advisors or due diligence team.",
        score: 3,
        tags: ["strategic_transaction_lead"],
      },
      {
        id: "bip_q5_b",
        label: "An institutional investor or lead investor.",
        score: 2,
        tags: ["fundraising_valuation_lead"],
      },
      {
        id: "bip_q5_c",
        label: "Our auditors or external accountants.",
        score: 2,
      },
      {
        id: "bip_q5_d",
        label: "A licensing partner or counterparty.",
        score: 2,
        tags: ["brand_valuation_lead"],
      },
      {
        id: "bip_q5_e",
        label: "Board members or shareholders.",
        score: 2,
        tags: ["ownership_risk_lead"],
      },
      {
        id: "bip_q5_f",
        label: "This is an internal exploration at this stage.",
        score: 1,
      },
    ],
  },
  {
    id: "bip_q6",
    track: "brand_ip",
    order: 5,
    type: "single_select",
    prompt:
      "Does the ownership of this asset involve more than one entity, family group, or jurisdiction?",
    required: true,
    options: [
      {
        id: "bip_q6_a",
        label: "Yes, multiple shareholders or family interests have a stake.",
        score: 2,
        tags: ["ownership_risk_lead"],
      },
      {
        id: "bip_q6_b",
        label: "Yes, the asset sits in a holding structure or spans jurisdictions.",
        score: 2,
      },
      {
        id: "bip_q6_c",
        label: "No, single-entity ownership.",
        score: 0,
      },
      {
        id: "bip_q6_d",
        label: "It is complex. I would rather explain in the final question.",
        score: 1,
      },
    ],
  },
  {
    id: "bip_q7",
    track: "brand_ip",
    order: 6,
    type: "open_text",
    prompt: "Anything else worth knowing before we look at this together?",
    helper:
      "Tell us about any deal terms, jurisdictional complexity, counterparty requirements, or timeline pressure not covered above. There is no right or wrong answer here.",
    required: true,
  },
];

// Max scores per track (used for percentage display)
export const MAX_SCORE: Record<Track, number> = {
  esop: 17,   // 2+3+3+3+3+3
  brand_ip: 16, // 2+3+2+3+3+2 — max option per question
};
