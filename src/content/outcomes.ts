import type { Track, ResultKey, ReportKey } from "./questions";
import type { FullResult, LeadTemperature } from "@/lib/scoring";

// ── Outcome interface ──────────────────────────────────────────────────────

export interface Outcome {
  track: Track;
  headline: string;
  badge: string;
  body: string;             // \n\n for paragraph breaks; rendered as multiple <p>
  calloutTitle: string;
  calloutBody: string;
  ctaOverline: string;      // e.g. "RECOMMENDED NEXT STEP"
  ctaHeadline: string;
  ctaBody: string;          // shown before email submission; explains the offer
  formButtonLabel: string;
  afterSubmitBody: string;  // shown after successful submission
  showOfferBlock: boolean;  // 10% off invoice offer — ESOP A2 and A3 only
}

export const BOOKING_URL = "https://cal.com/bain-squared/ia-valuation";

export const REPORT_TITLES: Record<ReportKey, string> = {
  esop_compliance_governance: "ESOP Compliance and Governance Guide",
  esop_structuring_dilution:  "ESOP Structuring and Dilution Guide",
  esop_communication_legal:   "ESOP Communication and Legal Guide",
  esop_starter:               "ESOP Starter Guide",
  iv_fundraising_guide:               "Fundraising Valuation Guide",
  iv_mna_exit_guide:                  "M&A and Exit Valuation Guide",
  iv_intangible_asset_discovery_guide: "Intangible Asset Discovery Guide",
  iv_starter_guide:                   "Intangible Value Starter Guide",
};

// ── Legacy type kept for any callers that have not yet migrated ────────────
export type LeadIntent = "hot" | "warm" | "cold";

// ══════════════════════════════════════════════════════════════════════════
// ESOP OUTCOMES — keyed by ResultKey
// ══════════════════════════════════════════════════════════════════════════
//
// Mapping: spec result page variants (RP01–RP11) to result codes
//
//   RP01 → ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT
//   RP02 → ESOP_A2_PROVIDER_REVIEW_HOT
//   RP03 → ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM
//   RP04 → ESOP_B1_PLANNING_PRESSURE_NEAR_HOT
//   RP05 → ESOP_B2_PLANNING_PRESSURE_FAR_WARM
//   RP06 → ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM
//   RP07 → ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW
//   RP08 → ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT + ESOP_U1_UNSURE_PRESSURE_NEAR_HOT
//   RP09 → ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM + ESOP_U2_UNSURE_PRESSURE_FAR_WARM
//   RP10 → ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM + ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM
//   RP11 → ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD + ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD
//   A0   → ESOP_A0_EXISTING_ESOP_INCOMPLETE_OR_UNCLEAR_HOT (fallback)
// ─────────────────────────────────────────────────────────────────────────

const RP01: Outcome = {
  track: "esop",
  headline: "Your existing ESOP has a valuation gap",
  badge: "Urgent governance review",
  body: "You already have an ESOP in place, but your answers suggest that a formal valuation has not been completed or cannot be confirmed. That is the part to fix first.\n\nWithout a defensible valuation, option pricing, employee grants, audit support, board review, and future investor discussions become harder to explain.\n\nEven if nobody has raised the issue yet, uncertainty around valuation support can become a problem the moment your next grant, audit request, board discussion, or fundraising process arrives.",
  calloutTitle: "Fix the baseline first",
  calloutBody: "An ESOP is only as credible as the valuation support behind it. If the company has already issued options, or is planning to issue more, the priority is to establish a clean and defensible valuation baseline before the gap becomes harder to fix.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get the report, then speak with us directly.",
  ctaBody: "We will send the ESOP Compliance and Governance Guide to your inbox. Because your answers point to a governance sensitive issue, we strongly recommend booking a short call after the report is sent.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Based on your answers, we strongly recommend a short call before your next ESOP grant, audit request, board discussion, investor review, or employee communication.",
  showOfferBlock: false,
};

const RP02: Outcome = {
  track: "esop",
  headline: "Your ESOP valuation provider deserves a second look",
  badge: "Provider review window",
  body: "You already have a formal ESOP valuation process, but your answers suggest that something about the current experience is not working as well as it should.\n\nIt may be price, report quality, speed, explainability, or confidence in how the provider handles ESOP specific questions. This is not just a vendor issue. It affects whether your next valuation report can stand up to employee questions, board review, investor due diligence, and audit scrutiny.",
  calloutTitle: "A better benchmark changes the conversation",
  calloutBody: "Before renewing, refreshing, or defending your current valuation process, it is worth knowing what a more responsive, ESOP focused, and commercially useful report could look like.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your provider review report.",
  ctaBody: "We will send the ESOP Compliance and Governance Guide to your inbox. Because your answers show a current provider or valuation process worth reviewing, we recommend booking a short call after the report is sent.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Your answers suggest that your current ESOP valuation process is worth reviewing before the next refresh, grant, audit, or board discussion.",
  showOfferBlock: true,
};

const RP03: Outcome = {
  track: "esop",
  headline: "Your current ESOP valuation process is worth benchmarking",
  badge: "Optimization window",
  body: "You already have an ESOP valuation process in place, and you appear to be satisfied with it. That is a good position to be in.\n\nThe next question is whether the process is giving you the best mix of clarity, defensibility, speed, and commercial usefulness as your company grows and each grant cycle becomes more complex.\n\nEven if there is no urgent reason to switch providers today, it is still worth knowing what a more competitive option looks like before your next refresh.",
  calloutTitle: "Benchmark before your next renewal",
  calloutBody: "Good providers should still be benchmarked. A quick review gives you a clearer view of whether your current report quality, pricing, turnaround time, and ESOP specific support remain competitive.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP optimization report.",
  ctaBody: "We will send the ESOP Compliance and Governance Guide to your inbox. Use it to review how modern ESOP valuation providers are improving process clarity, report quality, and commercial usefulness.",
  formButtonLabel: "Get my ESOP report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and review it before your next ESOP refresh or provider renewal.",
  showOfferBlock: true,
};

const RP04: Outcome = {
  track: "esop",
  headline: "Your ESOP plan is entering decision territory",
  badge: "Near term planning window",
  body: "You are planning to set up an ESOP, and someone is already asking about equity, options, or incentive structure. Your timing also suggests that this is no longer a theoretical planning topic.\n\nThe decisions you make now will shape dilution, grant size, valuation support, employee expectations, and how the plan is explained to the board or investors later.",
  calloutTitle: "Decisions compound quickly",
  calloutBody: "Once employees, candidates, investors, or board members start discussing equity, every number becomes an anchor. It is better to set the plan with structure, valuation logic, and communication discipline before expectations harden.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP planning report, then speak with us.",
  ctaBody: "We will send your report to your inbox. Because your answers show active or expected pressure with near term timing, we strongly recommend booking a short call after the report is sent.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Based on your timing, we strongly recommend a short call before you finalize the ESOP structure or respond to the people asking about it.",
  showOfferBlock: false,
};

const RP05: Outcome = {
  track: "esop",
  headline: "Your ESOP plan is forming before the pressure peaks",
  badge: "Preparation window",
  body: "You are planning to set up an ESOP, and equity questions are already starting to appear or are expected soon. The timing may not be immediate, but the topic is now on the company agenda.\n\nThis is the right moment to prepare the structure, valuation logic, and employee communication before the process becomes rushed.",
  calloutTitle: "Use the quiet period well",
  calloutBody: "The best ESOP decisions are usually made before the deadline arrives. When there is still time, you can compare structures, think through dilution, prepare valuation support, and avoid reactive commitments.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP readiness report.",
  ctaBody: "We will send your report to your inbox. Use it to understand the decisions you should prepare before the next investor, board, employee, candidate, or auditor conversation.",
  formButtonLabel: "Get my ESOP report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and use it to prepare before the pressure becomes more immediate.",
  showOfferBlock: false,
};

const RP06: Outcome = {
  track: "esop",
  headline: "Your ESOP planning window is open",
  badge: "Build before launch",
  body: "You are planning to act soon, even though nobody appears to be forcing the conversation yet. That gives you a useful advantage.\n\nYou can still shape the ESOP before employees, candidates, investors, or board members start anchoring around specific numbers.",
  calloutTitle: "Design it before people price it",
  calloutBody: "Once equity expectations are discussed informally, they become harder to reset. Building the plan early gives you more control over dilution, grant logic, valuation support, and employee communication.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP readiness report.",
  ctaBody: "We will send your report to your inbox. Use it to clarify what should be decided before you move from planning to implementation.",
  formButtonLabel: "Get my ESOP report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and use it to prepare before you launch the ESOP process.",
  showOfferBlock: false,
};

const RP07: Outcome = {
  track: "esop",
  headline: "Your ESOP thinking is early, but worth structuring",
  badge: "Early planning",
  body: "You are not under immediate pressure yet, but you are already thinking about ESOPs. That is a useful place to start.\n\nAt this stage, the goal is not to rush into a valuation or legal process. The goal is to understand what decisions will matter later, especially around allocation, dilution, valuation support, and employee communication.",
  calloutTitle: "Start with the shape of the plan",
  calloutBody: "Early ESOP planning should help you avoid messy promises later. A simple structure today can prevent confusion when hiring, retention, fundraising, or board discussions become more serious.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP starter report.",
  ctaBody: "We will send your report to your inbox. Use it to understand what to prepare before the ESOP becomes an active project.",
  formButtonLabel: "Get my ESOP report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and review it at your own pace.",
  showOfferBlock: false,
};

const RP08: Outcome = {
  track: "esop",
  headline: "Your ESOP question is becoming urgent",
  badge: "Active pressure",
  body: "You may not have a formal ESOP today, or you may not be fully sure what is already in place. But someone is asking about equity, options, or incentives, and your timing is near.\n\nThat means the company needs a clear answer before expectations harden, documents are prepared in a rush, or informal promises become difficult to unwind.",
  calloutTitle: "Do not answer from memory",
  calloutBody: "When equity questions become active, vague answers can create real issues. The company should know what exists, what has been promised, what needs to be valued, and what can be explained clearly before the next conversation.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your report, then speak with us directly.",
  ctaBody: "We will send your report to your inbox. Because your answers show active pressure with near term timing, we strongly recommend booking a short call after the report is sent.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Based on your answers, we strongly recommend a short call before you respond to the ESOP, equity, or option question in front of you.",
  showOfferBlock: false,
};

const RP09: Outcome = {
  track: "esop",
  headline: "Your ESOP question is on the horizon",
  badge: "Prepare before it lands",
  body: "You may not have a formal ESOP today, or you may not be fully sure what is already in place. Still, the topic is likely to come up soon.\n\nThis is a good time to understand the key structuring, valuation, legal, tax, and communication issues before someone asks for a definitive answer.",
  calloutTitle: "Prepare before the ask becomes formal",
  calloutBody: "The earlier you understand the ESOP decision points, the easier it is to avoid rushed promises, unclear dilution, weak valuation support, or employee communication problems later.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP readiness report.",
  ctaBody: "We will send your report to your inbox. Use it to prepare for the next investor, board, employee, candidate, or auditor conversation.",
  formButtonLabel: "Get my ESOP report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and review it before the ESOP question becomes more formal.",
  showOfferBlock: false,
};

const RP10: Outcome = {
  track: "esop",
  headline: "You are close to making an ESOP decision",
  badge: "Decision window",
  body: "There may not be active pressure from employees, investors, auditors, or the board yet, but your timing suggests that an ESOP decision is getting closer.\n\nThat makes this a useful moment to understand the structure before you commit to any allocation, valuation approach, employee message, or legal setup.",
  calloutTitle: "Clarity before commitment",
  calloutBody: "ESOP decisions are easier to make when you separate the big questions early. How much equity should be allocated, how should it be valued, who should receive grants, and how should the plan be explained.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP readiness report.",
  ctaBody: "We will send your report to your inbox. Use it to clarify the key decisions before you move into implementation.",
  formButtonLabel: "Get my ESOP report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and use it to prepare before making a formal ESOP decision.",
  showOfferBlock: false,
};

const RP11: Outcome = {
  track: "esop",
  headline: "Your ESOP need is still early",
  badge: "Education track",
  body: "Based on your answers, there does not appear to be an immediate ESOP valuation or advisory need. That is not a problem.\n\nThis is the right stage to understand the basics before the company makes any commitments around equity, options, valuation, dilution, or employee communication.",
  calloutTitle: "Learn the basics before building the plan",
  calloutBody: "The goal for now is simple. Understand what an ESOP is, what decisions usually matter, and what signals would turn this from a learning topic into a real company priority.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP guide.",
  ctaBody: "We will send your report to your inbox so you can review the key considerations at your own pace.",
  formButtonLabel: "Get my ESOP report",
  afterSubmitBody: "Your results have been sent. Please check your inbox and review the report when useful.",
  showOfferBlock: false,
};

const ESOP_OUTCOMES: Partial<Record<ResultKey, Outcome>> = {
  ESOP_A0_EXISTING_ESOP_INCOMPLETE_OR_UNCLEAR_HOT: RP01,
  ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT:      RP01,
  ESOP_A2_PROVIDER_REVIEW_HOT:                     RP02,
  ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM:        RP03,
  ESOP_B1_PLANNING_PRESSURE_NEAR_HOT:              RP04,
  ESOP_B2_PLANNING_PRESSURE_FAR_WARM:              RP05,
  ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM:          RP06,
  ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW:       RP07,
  ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT:               RP08,
  ESOP_U1_UNSURE_PRESSURE_NEAR_HOT:                RP08,
  ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM:               RP09,
  ESOP_U2_UNSURE_PRESSURE_FAR_WARM:                RP09,
  ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM:           RP10,
  ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM:            RP10,
  ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD:            RP11,
  ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD:             RP11,
};

// ══════════════════════════════════════════════════════════════════════════
// IV OUTCOMES — keyed by (reportKey, leadTemperature) page group
// ══════════════════════════════════════════════════════════════════════════
//
// 8 display groups per the spec:
//   hot_fundraising           iv_fundraising_guide  + hot
//   hot_mna_exit              iv_mna_exit_guide     + hot
//   hot_stakeholder           iv_intangible_asset_discovery_guide + hot
//   warm_fundraising          iv_fundraising_guide  + warm / warm_low
//   warm_mna_exit             iv_mna_exit_guide     + warm / warm_low
//   warm_stakeholder          iv_intangible_asset_discovery_guide + warm / warm_low
//   warm_starter              iv_starter_guide      + warm / warm_low
//   cold_starter              iv_starter_guide      + cold (or any cold)
// ─────────────────────────────────────────────────────────────────────────

type IvPageKey =
  | "hot_fundraising"
  | "hot_mna_exit"
  | "hot_stakeholder"
  | "warm_fundraising"
  | "warm_mna_exit"
  | "warm_stakeholder"
  | "warm_starter"
  | "cold_starter";

const IV_OUTCOMES: Record<IvPageKey, Outcome> = {

  hot_fundraising: {
    track: "intangible_value",
    headline: "Your intangible value needs to be clear before investors see the numbers.",
    badge: "Urgent Review",
    body: "You are entering a fundraising or investor discussion soon, and your answers suggest that important value drivers may not be fully visible in a standard revenue, profit, asset, or comparable company valuation.\n\nThis can include recurring revenue, long-term contracts, software, data, IP, customer relationships, brand strength, or operating systems that make the company more valuable than the headline numbers suggest.",
    calloutTitle: "WHY THIS MATTERS",
    calloutBody: "If this evidence is not prepared before the conversation begins, investors may anchor the valuation around the easiest metric to defend, not the full value of the business.",
    ctaOverline: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your report, then book a call.",
    ctaBody: "We will send the Fundraising Valuation Guide to your inbox. Because your fundraising or investor timeline appears to be near-term, we strongly recommend booking a short call. We can help you understand what evidence matters, what may be missing, and how to prepare before the next investor conversation.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Because your answers suggest a near-term valuation issue, we strongly recommend booking a short call. We can help you understand what evidence matters, what may be missing, and how to prepare before the next investor conversation.",
    showOfferBlock: false,
  },

  hot_mna_exit: {
    track: "intangible_value",
    headline: "Your intangible value needs to be evidenced before an exit conversation begins.",
    badge: "Urgent Review",
    body: "You may be approaching a sale, succession, restructuring, or ownership discussion, and your answers suggest that important value drivers may not be fully reflected in your current financials.\n\nBuyers often focus on what they can verify quickly. If brand strength, customer relationships, long-term contracts, software, data, IP, or operating systems are not clearly documented, they may be discounted during negotiation.",
    calloutTitle: "WHY THIS MATTERS",
    calloutBody: "In an exit or ownership event, value that is not evidenced usually becomes value that is negotiated away. The earlier you organize the evidence, the stronger your position becomes.",
    ctaOverline: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your report, then book a call.",
    ctaBody: "We will send the M&A and Exit Valuation Guide to your inbox. Because your exit, succession, or restructuring timeline appears to be near-term, we strongly recommend booking a short call. We can help you understand what buyers or stakeholders may look for, and what you should prepare before the conversation begins.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Because your exit, succession, or restructuring timeline appears to be near-term, we strongly recommend booking a short call. We can help you understand what buyers or stakeholders may look for, and what you should prepare before the conversation begins.",
    showOfferBlock: false,
  },

  hot_stakeholder: {
    track: "intangible_value",
    headline: "Your intangible value needs a clearer evidence story for stakeholders.",
    badge: "Urgent Review",
    body: "You may need to explain your company value to a board, bank, auditor, partner, investor, or other stakeholder soon. Your answers suggest that some important value drivers may not yet be clearly documented or easy to explain.\n\nThis does not mean the value is not real. It means the evidence needs to be organized in a way that a third party can understand and rely on.",
    calloutTitle: "WHY THIS MATTERS",
    calloutBody: "Stakeholders usually respond better to structured evidence than broad claims about potential. A clear intangible asset map helps turn hidden value into a more credible valuation discussion.",
    ctaOverline: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your report, then book a call.",
    ctaBody: "We will send the Intangible Asset Discovery Guide to your inbox. Because your stakeholder discussion appears to be near-term, we strongly recommend booking a short call. We can help you identify what evidence matters, what is missing, and how to present the value in a more structured way.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Because your stakeholder discussion appears to be near-term, we strongly recommend booking a short call. We can help you identify what evidence matters, what is missing, and how to present the value in a structured way.",
    showOfferBlock: false,
  },

  warm_fundraising: {
    track: "intangible_value",
    headline: "It is time to start preparing your intangible value story before fundraising.",
    badge: "Planning Window",
    body: "You are thinking about fundraising, bringing in investors, or strengthening your investor narrative. Your answers suggest that some of your company value may sit outside standard financial metrics.\n\nThis may include recurring revenue, customer relationships, long-term contracts, brand, software, data, IP, or operating systems. These assets are easier to explain when they are mapped before investor pressure begins.",
    calloutTitle: "WHY THIS MATTERS",
    calloutBody: "Investors usually value what they can understand, compare, and verify. Preparing your intangible value evidence early gives you more control over the valuation narrative.",
    ctaOverline: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your Fundraising Valuation Guide.",
    ctaBody: "We will send the Fundraising Valuation Guide to your inbox. Review the guide to understand what investors may look for, what evidence matters, and how to prepare before your next fundraising discussion.",
    formButtonLabel: "Get my report",
    afterSubmitBody: "Your report has been sent. Review the guide to understand what investors may look for, what evidence matters, and how to prepare before your next fundraising discussion.",
    showOfferBlock: false,
  },

  warm_mna_exit: {
    track: "intangible_value",
    headline: "Start documenting the value buyers may not see in the accounts.",
    badge: "Planning Window",
    body: "You may be planning for a sale, succession, restructuring, or ownership discussion in the future. Your answers suggest that some parts of your business value may not be fully visible through standard financials alone.\n\nA buyer or incoming shareholder will usually ask what can be verified. The more clearly you document your intangible value, the easier it becomes to defend the value of the business.",
    calloutTitle: "WHY THIS MATTERS",
    calloutBody: "Exit value is often shaped before formal negotiations begin. If your intangible assets are not prepared early, they may be treated as general upside instead of real enterprise value.",
    ctaOverline: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your M&A and Exit Valuation Guide.",
    ctaBody: "We will send the M&A and Exit Valuation Guide to your inbox. Review the guide to understand how buyers think about intangible assets, what evidence strengthens your position, and what to prepare before an exit or ownership discussion.",
    formButtonLabel: "Get my report",
    afterSubmitBody: "Your report has been sent. Review the guide to understand how buyers think about intangible assets, what evidence strengthens your position, and what to prepare before an exit or ownership discussion.",
    showOfferBlock: false,
  },

  warm_stakeholder: {
    track: "intangible_value",
    headline: "You have intangible value signals that are worth mapping properly.",
    badge: "Evidence Review",
    body: "Your answers suggest that your business may have value drivers that are not fully captured by a simple profit, revenue, asset, or comparable company valuation.\n\nThis could include customer relationships, recurring revenue, long-term contracts, software, data, IP, brand, specialist knowledge, or operating systems. The next step is to understand which of these are real valuation assets and what evidence supports them.",
    calloutTitle: "WHY THIS MATTERS",
    calloutBody: "Intangible value becomes more useful when it is structured. A clear asset map helps you understand what matters, what can be evidenced, and what still needs to be developed.",
    ctaOverline: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your Intangible Asset Discovery Guide.",
    ctaBody: "We will send the Intangible Asset Discovery Guide to your inbox. Review the guide to understand where your intangible assets may sit, what evidence matters, and what to prepare before a valuation conversation.",
    formButtonLabel: "Get my report",
    afterSubmitBody: "Your report has been sent. Review the guide to understand where your intangible assets may sit, what evidence matters, and what to prepare before a valuation conversation.",
    showOfferBlock: false,
  },

  warm_starter: {
    track: "intangible_value",
    headline: "You are starting to uncover where intangible value may sit in your business.",
    badge: "Education Stage",
    body: "Your answers suggest that you are still exploring how intangible value applies to your company. You may not have an immediate valuation event, but it is still useful to understand what buyers, investors, and stakeholders may look for over time.\n\nThis is the right stage to learn the difference between standard financial value and the deeper value drivers that can develop as your company grows.",
    calloutTitle: "WHY THIS MATTERS",
    calloutBody: "Many companies only start thinking about intangible value when a transaction is already underway. Learning the basics early helps you know what to track before the pressure begins.",
    ctaOverline: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your Intangible Value Starter Guide.",
    ctaBody: "We will send the Intangible Value Starter Guide to your inbox. Review the guide to understand the basics of intangible value, what assets to look out for, and how to think about value as your company grows.",
    formButtonLabel: "Get my report",
    afterSubmitBody: "Your report has been sent. Review the starter guide to understand the basics of intangible value, what assets to look out for, and how to think about value as your company grows.",
    showOfferBlock: false,
  },

  cold_starter: {
    track: "intangible_value",
    headline: "You are in the early stages of intangible value discovery.",
    badge: "Education Stage",
    body: "Your answers suggest that you are currently exploring how intangible value works, but you do not appear to have an immediate valuation event or a clear evidence gap yet.\n\nThis does not mean your business lacks value. It simply means the relevant value drivers may need to be developed, tracked, or mapped more clearly over time.",
    calloutTitle: "NO ACTION NEEDED YET",
    calloutBody: "Keep the guide for future planning. It will help you understand what business assets may be worth tracking and documenting as your company grows.",
    ctaOverline: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your Intangible Value Starter Guide.",
    ctaBody: "We will send the Intangible Value Starter Guide to your inbox. Review the guide when you want to understand the difference between standard financial value and the intangible value that can build over time.",
    formButtonLabel: "Get my report",
    afterSubmitBody: "Your report has been sent. Review the starter guide when you want to understand the difference between standard financial value and the intangible value that can build over time.",
    showOfferBlock: false,
  },
};

// ── IV page key mapping ────────────────────────────────────────────────────

function getIvPageKey(reportKey: ReportKey, leadTemperature: LeadTemperature): IvPageKey {
  const hot = leadTemperature === "hot";
  const warmish = leadTemperature === "warm" || leadTemperature === "warm_low";

  if (hot) {
    if (reportKey === "iv_fundraising_guide")               return "hot_fundraising";
    if (reportKey === "iv_mna_exit_guide")                  return "hot_mna_exit";
    if (reportKey === "iv_intangible_asset_discovery_guide") return "hot_stakeholder";
  }
  if (warmish) {
    if (reportKey === "iv_fundraising_guide")               return "warm_fundraising";
    if (reportKey === "iv_mna_exit_guide")                  return "warm_mna_exit";
    if (reportKey === "iv_intangible_asset_discovery_guide") return "warm_stakeholder";
    if (reportKey === "iv_starter_guide")                    return "warm_starter";
  }
  return "cold_starter";
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getOutcomeForResult(result: FullResult): Outcome {
  if (result.resultKey.startsWith("ESOP_")) {
    return ESOP_OUTCOMES[result.resultKey] ?? RP01;
  }
  return IV_OUTCOMES[getIvPageKey(result.reportKey, result.leadTemperature)];
}

// ── Backward-compat wrapper ────────────────────────────────────────────────
// Only works reliably for ESOP result codes.
// Callers should migrate to getOutcomeForResult(fullResult) where possible.
export function getOutcomeByKey(resultKey: ResultKey): Outcome {
  const esopMatch = ESOP_OUTCOMES[resultKey];
  if (esopMatch) return esopMatch;
  return IV_OUTCOMES.cold_starter;
}

// ── Legacy wrapper ─────────────────────────────────────────────────────────
export function getOutcome(track: Track, _score: number): Outcome {
  return track === "esop" ? RP11 : IV_OUTCOMES.cold_starter;
}
