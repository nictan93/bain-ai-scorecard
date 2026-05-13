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
  ctaOverline: string;
  ctaHeadline: string;
  ctaBody: string;          // {{report_title}} is replaced at render time
  formButtonLabel: string;
  afterSubmitBody: string;
  showOfferBlock: boolean;  // invoice review offer — ESOP A2 and A3 only
}

export const BOOKING_URL = "https://cal.com/bain-squared/ia-valuation";

export const REPORT_TITLES: Record<ReportKey, string> = {
  esop_compliance_governance:          "ESOP Compliance and Governance Guide",
  esop_structuring_dilution:           "ESOP Structuring and Dilution Guide",
  esop_communication_legal:            "ESOP Communication and Legal Guide",
  esop_starter:                        "ESOP Starter Guide",
  iv_fundraising_guide:                "Intangible Value Fundraising Guide",
  iv_mna_exit_guide:                   "Intangible Value M&A and Exit Guide",
  iv_intangible_asset_discovery_guide: "Intangible Asset Discovery Guide",
  iv_starter_guide:                    "Intangible Value Starter Guide",
};

// ── Legacy type kept for any callers that have not yet migrated ────────────
export type LeadIntent = "hot" | "warm" | "cold";

// ══════════════════════════════════════════════════════════════════════════
// ESOP OUTCOMES
// ══════════════════════════════════════════════════════════════════════════
//
// RP01 → ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT  (hot)
// RP02 → ESOP_A2_PROVIDER_REVIEW_HOT                 (hot, offer block)
// RP03 → ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM    (warm, offer block)
// RP04 → ESOP_B1_PLANNING_PRESSURE_NEAR_HOT          (hot)
// RP05 → ESOP_B2_PLANNING_PRESSURE_FAR_WARM          (warm)
// RP06 → ESOP_B3 + ESOP_B4                           (warm / warm_low)
// RP07 → ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT           (hot)
// RP08 → ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM           (warm)
// RP09 → ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM       (warm)
// RP10 → ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD        (cold)
// RP11 → ESOP_U1_UNSURE_PRESSURE_NEAR_HOT            (hot)
// RP12 → ESOP_U2 + ESOP_U3                           (warm)
// RP13 → ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD         (cold)
// ─────────────────────────────────────────────────────────────────────────

const RP01: Outcome = {
  track: "esop",
  headline: "Your ESOP valuation needs to be done.",
  badge: "Urgent Review",
  body: "You already have an ESOP in place, but your answers suggest you have not completed a formal third-party valuation, or you cannot easily confirm that one exists.\n\nThis is a common but serious gap. When options are issued without a defensible valuation, the company takes on compliance, tax, and governance risks that only surface later during an audit, fundraising round, or sale.",
  calloutTitle: "Valuations are harder to fix retroactively.",
  calloutBody: "If auditors, investors, or tax authorities challenge the strike price of your options, an informal or missing valuation offers no protection. It is significantly easier and cheaper to formalise the valuation now than to unwind the tax consequences later.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP Compliance and Governance Guide, then speak with us directly.",
  ctaBody: "We will send the ESOP Compliance and Governance Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Based on your answers, we strongly recommend booking a short call before your next board meeting, audit, or funding round to discuss how to formalise your valuation.",
  showOfferBlock: false,
};

const RP02: Outcome = {
  track: "esop",
  headline: "Your ESOP valuation can be done better.",
  badge: "Provider Review",
  body: "You already have an ESOP and a formal valuation, but your answers suggest you are not fully satisfied with your current provider, or you have not reviewed them recently.\n\nThis is a good time to review the relationship. As your company grows, your valuation needs become more complex. If your provider is slow, expensive, or produces reports that are hard to defend, it creates friction with your board and auditors.",
  calloutTitle: "Do not settle for a weak report.",
  calloutBody: "A good ESOP valuation is not just a compliance check box. It should be delivered quickly, priced fairly, and structured so that your board and auditors can rely on it without endless follow-up questions.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP Compliance and Governance Guide, then speak with us directly.",
  ctaBody: "We will send the ESOP Compliance and Governance Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Based on your answers, we strongly recommend booking a short call to benchmark your current provider before your next valuation refresh.",
  showOfferBlock: true,
};

const RP03: Outcome = {
  track: "esop",
  headline: "Your ESOP process appears ok, but it is still worth comparing.",
  badge: "Scheduled Review",
  body: "Your answers suggest that your current ESOP valuation process is not urgent today. That is a good position to be in.\n\nEven so, ESOPs need regular review as grants accumulate, valuations refresh, dilution evolves, and employee communication becomes more complex. Knowing what a more competitive option looks like is useful before the next renewal cycle, especially if your team or board are likely to ask harder questions later.",
  calloutTitle: "Good providers should still be reviewed.",
  calloutBody: "A quick review gives you a clearer view of whether the current report quality, pricing, turnaround time, and ESOP-specific support remain competitive. Even when you are happy with your provider, knowing the alternative makes the next renewal an easier decision.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP Compliance and Governance Guide.",
  ctaBody: "We will send the ESOP Compliance and Governance Guide to your inbox. Use it to review how modern ESOP valuation providers are improving process clarity, report quality, and commercial usefulness.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and review it before your next ESOP refresh or provider renewal.",
  showOfferBlock: true,
};

const RP04: Outcome = {
  track: "esop",
  headline: "You need to plan ahead for your ESOP plan.",
  badge: "Urgent review",
  body: "You are planning an ESOP, and someone is already asking about equity, options, or incentive structure. Your timing also suggests this is no longer a theoretical planning topic.\n\nThe decisions you make now will shape dilution, grant size, valuation support, employee expectations, and how the plan is later explained to the board, employees, or investors.",
  calloutTitle: "Decisions compound quickly.",
  calloutBody: "Once employees, candidates, investors, or board members start discussing equity, every number becomes an anchor. It is better to set the plan with structure, valuation logic, and communication discipline before expectations harden.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP planning report, then speak with us directly.",
  ctaBody: "We will send the {{report_title}} to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Based on your timing, we strongly recommend a short call before you finalise the ESOP structure or respond to the people asking about it.",
  showOfferBlock: false,
};

const RP05: Outcome = {
  track: "esop",
  headline: "You need to plan ahead for your ESOP plan.",
  badge: "Preparation",
  body: "You are planning an ESOP, and equity questions are already starting to appear or are expected soon. The timing may not be immediate, but the topic is now on the company agenda.\n\nThis is the right moment to prepare the structure, valuation logic, and employee communication before the process becomes rushed.",
  calloutTitle: "Use this time to your advantage",
  calloutBody: "The best ESOP decisions are usually made before the deadline arrives. When there is still time, you can compare structures, think through dilution, prepare valuation support, and avoid reactive commitments.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP readiness report.",
  ctaBody: "We will send the {{report_title}} to your inbox. Use it to understand the decisions you should prepare before the next investor, board, employee, candidate, or auditor conversation.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and use it to prepare before the pressure becomes more immediate.",
  showOfferBlock: false,
};

const RP06: Outcome = {
  track: "esop",
  headline: "You are early in the ESOP process.",
  badge: "Early Planning",
  body: "Your answers suggest you are exploring ESOP design before external pressure arrives. That is a useful place to start.\n\nAt this stage, the goal is not to rush into a valuation or legal process. The goal is to understand what decisions will matter later, especially around allocation, dilution, valuation support, and employee communication.",
  calloutTitle: "Design it as early as you can.",
  calloutBody: "Once equity expectations are discussed informally, they become harder to reset. Building the plan early gives you more control over dilution, grant logic, valuation support, and employee communication.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP planning starter report.",
  ctaBody: "We will send the {{report_title}} to your inbox. Use it to understand what to prepare before the ESOP becomes an active project.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and review it at your own pace.",
  showOfferBlock: false,
};

const RP07: Outcome = {
  track: "esop",
  headline: "You may need ESOP support soon.",
  badge: "Urgent Review",
  body: "You do not have an ESOP yet, but your answers suggest that investors, employees, auditors, or board members may soon ask questions that require a clearer position.\n\nThat means the company needs a clear answer before expectations harden, documents are prepared in a rush, or informal promises become difficult to unwind later.",
  calloutTitle: "Do not answer from memory.",
  calloutBody: "When equity questions become active, vague answers can create real issues. The company should know what exists, what has been promised, what needs to be valued, and what can be explained clearly before the next conversation.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP report, then speak with us directly.",
  ctaBody: "We will send the {{report_title}} to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Based on your answers, we strongly recommend a short call before you respond to the ESOP, equity, or option question in front of you.",
  showOfferBlock: false,
};

const RP08: Outcome = {
  track: "esop",
  headline: "You need to plan ahead for your ESOP plan.",
  badge: "Preparation",
  body: "You do not have an ESOP today, but your answers suggest the topic is likely to come up soon. Stakeholder questions are not yet acute, but they are forming.\n\nThis is a good time to understand the key structuring, valuation, legal, tax, and communication issues before someone asks for a definitive answer.",
  calloutTitle: "Prepare soon.",
  calloutBody: "The earlier you understand the ESOP decision points, the easier it is to avoid rushed promises, unclear dilution, weak valuation support, or employee communication problems later.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP readiness report.",
  ctaBody: "We will send the {{report_title}} to your inbox. Use it to prepare for the next investor, board, employee, candidate, or auditor conversation.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and review it before the ESOP question becomes more formal.",
  showOfferBlock: false,
};

const RP09: Outcome = {
  track: "esop",
  headline: "You are close to making an ESOP decision.",
  badge: "Strategic Review",
  body: "There may not be active pressure from employees, investors, auditors, or the board yet, but your timing suggests an ESOP decision is getting closer.\n\nThat makes this a useful moment to understand the structure before you commit to any allocation, valuation approach, employee message, or legal setup.",
  calloutTitle: "Clarity before commitment.",
  calloutBody: "ESOP decisions are easier to make when you separate the big questions early. How much equity should be allocated, how should it be valued, who should receive grants, and how should the plan be explained to the team.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP readiness report.",
  ctaBody: "We will send the {{report_title}} to your inbox. Use it to clarify the key decisions before you move into implementation.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and use it to prepare before making a formal ESOP decision.",
  showOfferBlock: false,
};

const RP10: Outcome = {
  track: "esop",
  headline: "Your company may not need ESOP yet.",
  badge: "Educational",
  body: "Based on your answers, there does not appear to be an immediate ESOP need. That is perfectly fine.\n\nThis is the right stage to understand the basics before the company makes any commitments around equity, options, valuation, dilution, or employee communication.",
  calloutTitle: "Learn the basics before building the plan.",
  calloutBody: "The goal for now is simple. Understand what an ESOP is, what decisions usually matter, and what signals would turn this from a learning topic into a real company priority.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP Starter Guide.",
  ctaBody: "We will send the ESOP Starter Guide to your inbox so you can review the key considerations at your own pace, recognise when ESOP support starts to matter, and understand what to prepare before that day arrives.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your results have been sent. Please check your inbox and review the report when useful.",
  showOfferBlock: false,
};

const RP11: Outcome = {
  track: "esop",
  headline: "You need to act fast to get clarity on what to do with your ESOP.",
  badge: "Urgent Review",
  body: "Your answers suggest that you are not fully sure where your ESOP position stands today, but stakeholder pressure is already active and your timing is near.\n\nThat combination makes a clear position the highest priority. The company needs to know what already exists, what may have been promised informally, what has been documented, and what counts as defensible before the next conversation.",
  calloutTitle: "Clarify before answering.",
  calloutBody: "When ESOP-related questions arrive, the worst answer is a vague one. Even a partial or incomplete ESOP position can usually be explained calmly, as long as someone in the company understands what is in place and what is not.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP Compliance and Governance Guide, then speak with us directly.",
  ctaBody: "We will send the ESOP Compliance and Governance Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Based on your answers, we strongly recommend a short call before you respond to the next equity, options, or ESOP question.",
  showOfferBlock: false,
};

const RP12: Outcome = {
  track: "esop",
  headline: "Start by clarifying what your ESOP should do.",
  badge: "Strategic Review",
  body: "Your answers suggest that you are not fully sure where your ESOP position stands today. The pressure may not be acute yet, but the question is becoming relevant enough to warrant a clear answer.\n\nThe most useful next step is to confirm what has been issued, drafted, or promised, so that any future ESOP decision starts from a known baseline rather than a guess.",
  calloutTitle: "Clarity before commitment.",
  calloutBody: "Most ESOP confusion is not malicious. It usually starts with informal promises, draft documents, or partial setups that were never fully reconciled. The earlier the company understands what is actually in place, the easier every later decision becomes.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP report.",
  ctaBody: "We will send the {{report_title}} to your inbox. Use it to understand what an ESOP position usually involves, how to confirm where your company stands, and what to prepare for the next stakeholder conversation.",
  formButtonLabel: "Send my report",
  afterSubmitBody: "Your report has been sent. Please check your inbox and use it to clarify the current ESOP position before further action.",
  showOfferBlock: false,
};

const RP13: Outcome = {
  track: "esop",
  headline: "Start by understanding whether an ESOP is relevant for your company.",
  badge: "Educational",
  body: "Your answers suggest you are still figuring out whether ESOPs matter for your company. There is no immediate pressure to act.\n\nThe most useful next step is to understand the basic structure, the typical tradeoffs, and the signals that would turn an ESOP from a learning topic into an actual priority.",
  calloutTitle: "Learn what triggers an ESOP decision.",
  calloutBody: "Many companies do not need an ESOP at all. Others need one earlier than they realise. The starter guide explains the situations where an ESOP usually becomes relevant, so you can recognise the trigger when it arrives.",
  ctaOverline: "Recommended next step",
  ctaHeadline: "Get your ESOP Starter Guide.",
  ctaBody: "We will send the ESOP Starter Guide to your inbox so you can review the key considerations at your own pace, recognise when ESOP support starts to matter, and understand what to prepare before that day arrives.",
  formButtonLabel: "Send my report",
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
  ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW:       RP06,
  ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT:               RP07,
  ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM:               RP08,
  ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM:           RP09,
  ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD:            RP10,
  ESOP_U1_UNSURE_PRESSURE_NEAR_HOT:                RP11,
  ESOP_U2_UNSURE_PRESSURE_FAR_WARM:                RP12,
  ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM:            RP12,
  ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD:             RP13,
};

// ══════════════════════════════════════════════════════════════════════════
// IV OUTCOMES — keyed by (reportKey, leadTemperature) page group
// ══════════════════════════════════════════════════════════════════════════
//
// RP14 → hot_fundraising    (IV_CAPITAL_NEAR_VALUE_GAP_HOT)
// RP15 → hot_mna_exit       (IV_EXIT_NEAR_VALUE_GAP_HOT)
// RP16 → hot_stakeholder    (IV_STAKEHOLDER_NEAR_VALUE_GAP_HOT)
// RP17 → warm_fundraising   (IV_CAPITAL_* warm/warm_low)
// RP18 → warm_mna_exit      (IV_EXIT_* warm/warm_low)
// RP19 → warm_stakeholder   (stakeholder, strategic, curiosity warm variants)
// RP20 → warm_starter       (IV_STRATEGIC_NEAR_WEAK_SIGNAL_WARM_LOW)
// RP21 → cold_starter       (cold variants)
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

  // RP14
  hot_fundraising: {
    track: "intangible_value",
    headline: "Your business intangible value needs a clearer evidence story for investors.",
    badge: "Urgent Review",
    body: "You are preparing for a fundraising round or bringing in new investors soon. Your answers suggest that some important value drivers may not yet be clearly documented or easy to explain to a third party.\n\nThis does not mean the value is not real. It usually means the evidence behind it needs to be organised in a way an investor can understand and rely on during their due diligence.",
    calloutTitle: "Investors anchor on what they can verify.",
    calloutBody: "If intangible value is not explained clearly, investors usually fall back on the simplest metrics they can verify, like revenue or profit multiples. The job is not to inflate value. The job is to make hidden value visible and defensible before the conversation starts.",
    ctaOverline: "Recommended next step",
    ctaHeadline: "Get your Intangible Value Fundraising Guide, then speak with us directly.",
    ctaBody: "We will send the Intangible Value Fundraising Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Based on your answers, we strongly recommend booking a short call before your next investor conversation, data room review, or valuation discussion.",
    showOfferBlock: false,
  },

  // RP15
  hot_mna_exit: {
    track: "intangible_value",
    headline: "Your business intangible value needs a clearer evidence story for buyers.",
    badge: "Urgent Review",
    body: "You are considering a sale, succession, or restructuring soon. Your answers suggest that some important value drivers may not yet be clearly documented or easy to explain to a buyer.\n\nThis does not mean the value is not real. It usually means the evidence behind it needs to be organised in a way a buyer can rely on during due diligence.",
    calloutTitle: "Buyers discount what they cannot verify.",
    calloutBody: "In a negotiation, value that cannot be evidenced is usually treated as risk. Strong contracts, customer relationships, systems, data, brand, software, and IP need a clear evidence story before buyers will give them full weight in a transaction.",
    ctaOverline: "Recommended next step",
    ctaHeadline: "Get your Intangible Value M&A and Exit Guide, then speak with us directly.",
    ctaBody: "We will send the Intangible Value M&A and Exit Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Based on your answers, we strongly recommend booking a short call before your next exit discussion, due diligence review, or buyer conversation.",
    showOfferBlock: false,
  },

  // RP16
  hot_stakeholder: {
    track: "intangible_value",
    headline: "Your business intangible value needs a clearer evidence story for stakeholders.",
    badge: "Urgent Review",
    body: "You may need to explain company value to a board, bank, auditor, partner, investor, or other stakeholder soon. Your answers suggest that some important value drivers may not yet be clearly documented or easy to explain to a third party.\n\nThis does not mean the value is not real. It usually means the evidence behind it needs to be organised in a way an outsider can understand and rely on.",
    calloutTitle: "Stakeholders trust structured evidence more than confident claims.",
    calloutBody: "Boards, banks, auditors, and partners are usually persuaded by structure, not enthusiasm. A clear intangible asset map turns hidden value into a credible answer when the harder questions arrive.",
    ctaOverline: "Recommended next step",
    ctaHeadline: "Get your Intangible Asset Discovery Guide.",
    ctaBody: "We will send the Intangible Asset Discovery Guide to your inbox. Based on your answers, a short complimentary call may also be helpful. The call is simply to help you understand the issues raised in your assessment, discuss what they may mean for your business, and share practical next steps. It usually takes 15 to 30 minutes, with no obligation to proceed further.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Based on your answers, we strongly recommend booking a short call before your next board meeting, bank review, audit cycle, partner discussion, or stakeholder update.",
    showOfferBlock: false,
  },

  // RP17
  warm_fundraising: {
    track: "intangible_value",
    headline: "Your business intangible value may matter in a future fundraising discussion.",
    badge: "High Urgency",
    body: "You are thinking about fundraising, bringing in investors, or strengthening your investor narrative. Your answers suggest that some of your company value may sit outside standard financial metrics, even if the timing is not urgent yet.\n\nThis may include recurring revenue, customer relationships, long-term contracts, brand, software, data, IP, or operating systems. These assets are easier to explain when they are mapped before investor pressure begins.",
    calloutTitle: "Prepare the evidence before the conversation needs it.",
    calloutBody: "Investors are easier to convince when intangibles are mapped, documented, and explained on your terms. Preparing earlier gives you more control over the valuation narrative when fundraising actually starts.",
    ctaOverline: "Recommended next step",
    ctaHeadline: "Get your Intangible Value Fundraising Guide.",
    ctaBody: "We will send the {{report_title}} to your inbox. Use it to understand what investors usually look for, what evidence matters, and how to prepare your intangible value story before the next fundraising discussion.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Please check your inbox and review it before your next investor, capital, or fundraising conversation.",
    showOfferBlock: false,
  },

  // RP18
  warm_mna_exit: {
    track: "intangible_value",
    headline: "Your business intangible value may matter in a future sale, succession, or ownership discussion.",
    badge: "High Urgency",
    body: "Your answers suggest that buyers or stakeholders may eventually ask for clearer evidence of value beyond the financial statements. The timing may not be urgent yet, but the preparation usually pays off later.\n\nA buyer or incoming shareholder will usually focus on what can be verified. The more clearly intangible value is documented, the easier it becomes to defend the value of the business when the conversation does happen.",
    calloutTitle: "The earlier you organise the evidence, the stronger your position.",
    calloutBody: "Exit value is shaped long before formal negotiations. If brand, contracts, customer relationships, software, data, or IP are clearly documented, they are far more likely to be treated as enterprise value rather than vague upside.",
    ctaOverline: "Recommended next step",
    ctaHeadline: "Get your Intangible Value M&A and Exit Guide.",
    ctaBody: "We will send the {{report_title}} to your inbox. The guide will help you understand how buyers think about intangible assets, what evidence strengthens your position, and what to prepare before an exit or ownership discussion.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Please check your inbox and review it before your next sale, succession, restructuring, or ownership conversation.",
    showOfferBlock: false,
  },

  // RP19
  warm_stakeholder: {
    track: "intangible_value",
    headline: "Your business may have intangible value that is worth mapping properly.",
    badge: "Discovery",
    body: "Your answers suggest that the business may have value drivers that are not fully captured by ordinary profit, revenue, asset, or comparable company valuation. This may include customer relationships, recurring revenue, long-term contracts, software, data, IP, brand, specialist knowledge, or operating systems.\n\nThe next step is usually to understand which of these are real valuation assets, what evidence already supports them, and what still needs to be developed.",
    calloutTitle: "Intangible value becomes useful when it is structured.",
    calloutBody: "A clear asset map helps you understand what matters, what can already be evidenced, and what still needs work. This turns a soft sense of value into something specific you can show, defend, and build on as the business grows.",
    ctaOverline: "Recommended next step",
    ctaHeadline: "Get your Intangible Asset Discovery Guide.",
    ctaBody: "We will send the {{report_title}} to your inbox. The guide will help you understand where your intangible assets may sit, what evidence matters, and what to prepare before a board, bank, auditor, partner, or valuation conversation.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Please check your inbox and review it at your own pace.",
    showOfferBlock: false,
  },

  // RP20
  warm_starter: {
    track: "intangible_value",
    headline: "You are early in the intangible value discovery process.",
    badge: "Starter Review",
    body: "Your answers suggest that intangible value may be relevant to your business, but the signal is still early. There may not be a strong asset signal, clear documentation, or specific concern yet, and that is a perfectly normal place to start.\n\nThe useful next step is to learn what to look for, which categories of intangible value most often matter, and what evidence usually supports them as the business grows.",
    calloutTitle: "Learning the basics now makes future events easier.",
    calloutBody: "Many companies only start thinking about intangible value when a fundraising round, sale conversation, or board review is already underway. Understanding the categories early helps you know what to track before the pressure begins.",
    ctaOverline: "Recommended next step",
    ctaHeadline: "Get your Intangible Value Starter Guide.",
    ctaBody: "We will send the Intangible Value Starter Guide to your inbox. The guide will help you understand the basics of intangible value, what assets to look out for, and how to think about value as the company grows.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Please check your inbox and review it when useful.",
    showOfferBlock: false,
  },

  // RP21
  cold_starter: {
    track: "intangible_value",
    headline: "Your intangible value signal appears early or unclear.",
    badge: "Education",
    body: "Based on your answers, there may not be a strong near-term intangible value issue yet. There is no specific event, the asset signal is still early, and there is no clear evidence gap.\n\nThat is perfectly fine. It does not mean your business lacks value. It usually means the relevant value drivers may need to be developed, tracked, or mapped more clearly over time.",
    calloutTitle: "Keep the guide for when the timing is right.",
    calloutBody: "Intangible value becomes more important when fundraising, exit discussions, board scrutiny, or large customer or partner relationships start to depend on a clearer story. The starter guide helps you know what to watch for as that point approaches.",
    ctaOverline: "Recommended next step",
    ctaHeadline: "Get your Intangible Value Starter Guide.",
    ctaBody: "We will send the Intangible Value Starter Guide to your inbox. The guide will help you understand the difference between standard financial value and the intangible value that can build over time, and what signals to watch for.",
    formButtonLabel: "Send my report",
    afterSubmitBody: "Your report has been sent. Please check your inbox and review it when useful.",
    showOfferBlock: false,
  },
};

// ── IV page key mapping ────────────────────────────────────────────────────

function getIvPageKey(reportKey: ReportKey, leadTemperature: LeadTemperature): IvPageKey {
  const hot    = leadTemperature === "hot";
  const warmish = leadTemperature === "warm" || leadTemperature === "warm_low";

  if (hot) {
    if (reportKey === "iv_fundraising_guide")                return "hot_fundraising";
    if (reportKey === "iv_mna_exit_guide")                   return "hot_mna_exit";
    if (reportKey === "iv_intangible_asset_discovery_guide") return "hot_stakeholder";
  }
  if (warmish) {
    if (reportKey === "iv_fundraising_guide")                return "warm_fundraising";
    if (reportKey === "iv_mna_exit_guide")                   return "warm_mna_exit";
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

// ── Backward-compat wrappers ───────────────────────────────────────────────

export function getOutcomeByKey(resultKey: ResultKey): Outcome {
  const esopMatch = ESOP_OUTCOMES[resultKey];
  if (esopMatch) return esopMatch;
  return IV_OUTCOMES.cold_starter;
}

export function getOutcome(track: Track, _score: number): Outcome {
  return track === "esop" ? RP13 : IV_OUTCOMES.cold_starter;
}
