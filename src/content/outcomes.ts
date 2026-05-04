import type { Track, ResultKey } from "./questions";

export type LeadIntent = "hot" | "warm" | "cold";

export interface Outcome {
  id: ResultKey;
  track: Track;
  /** Full plain-text label — used for aria */
  label: string;
  /**
   * Headline rendered as:
   *   headlineBefore [headlineHighlight] headlineAfter
   * The highlight word/phrase is shown in warning orange with brackets.
   */
  headlineBefore: string;
  headlineHighlight: string;
  headlineAfter: string;
  statusLabel: string;
  description: string;
  leadIntent: LeadIntent;
  ctaSectionLabel: string;
  ctaHeadline: string;
  ctaBody: string;
  primaryCtaLabel: string;
  secondaryCtaLabel?: string;
  ctaUrl: string;
  calloutLabel: string;
  calloutBody: string;
}

const BOOKING_URL = "https://cal.com/bain-squared/ia-valuation";

export const OUTCOMES: Outcome[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // ESOP TRACK
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "esop_hot_compliance",
    track: "esop",
    label: "Your existing ESOP has an immediate compliance and governance gap",
    headlineBefore: "Your existing ESOP has an immediate",
    headlineHighlight: "compliance and governance gap",
    headlineAfter: "",
    statusLabel: "Urgent Review",
    description:
      "You already have an ESOP in place, but you do not have a formal, independent valuation supporting it. This is a priority issue. The valuation is required to anchor option pricing, ensure legal compliance, and support future fundraising or audit conversations. The absence of a formal valuation report exposes the company, the board, and the employees to governance and legal risk — regardless of whether anyone has raised it yet.\n\nIssuing options without a defensible, independent valuation means your strike prices may not hold up under audit, investor due diligence, or employee scrutiny. The longer this is left unaddressed, the harder it becomes to fix retroactively.",
    leadIntent: "hot",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Speak with us directly.",
    ctaBody:
      "The next step is not a report. You should speak with us directly so we can understand how your ESOP was structured, whether previous grants were issued, and what valuation support is needed to close this gap now.",
    primaryCtaLabel: "Schedule a call",
    ctaUrl: BOOKING_URL,
    calloutLabel: "WHY THIS CANNOT WAIT",
    calloutBody:
      "Issuing options without a defensible, independent valuation means your strike prices may not hold up under audit, investor due diligence, or employee scrutiny. The longer this is left unaddressed, the harder it becomes to fix retroactively.",
  },

  {
    id: "esop_hot_dissatisfied",
    track: "esop",
    label: "Your current ESOP valuation process has a credibility gap",
    headlineBefore: "Your current ESOP valuation process has a",
    headlineHighlight: "credibility gap",
    headlineAfter: "",
    statusLabel: "Action Required",
    description:
      "Your answers suggest that your current ESOP valuation report is difficult to rely on, explain to employees, or defend to investors. This is more common than you might think. Many cap table management providers focus on the software and leave the advisory work — explaining the valuation to auditors, employees, and the board — entirely to you.\n\nA valuation that employees do not understand or that investors cannot trust defeats the purpose of having an ESOP. This is worth reviewing immediately before your next grant cycle or employee discussion.",
    leadIntent: "hot",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Speak with us about switching.",
    ctaBody:
      "Your ESOP need is active and time-sensitive. The best next step is to speak with us directly so we can understand your current valuation challenges and how to fix them before your next grant cycle.",
    primaryCtaLabel: "Schedule a call",
    ctaUrl: BOOKING_URL,
    calloutLabel: "YOUR COMPANY IS ELIGIBLE",
    calloutBody:
      "Send us your most recent ESOP valuation invoice and get [10%] off your next ESOP valuation report with Bain Squared.",
  },

  {
    id: "esop_hot_active_ask",
    track: "esop",
    label: "You have an immediate ESOP valuation requirement",
    headlineBefore: "You have an",
    headlineHighlight: "immediate",
    headlineAfter: "ESOP valuation requirement",
    statusLabel: "Action Required",
    description:
      "Your answers indicate that key stakeholders — existing investors, auditors, or employees and candidates asking about equity — are actively raising the topic, and you need to make a decision soon. Before you can formally issue options or communicate strike prices, a formal independent valuation is required to set the baseline.\n\nSetting up an ESOP under pressure without a proper valuation can lead to over-promising equity, pricing options incorrectly, or creating expectations you cannot defend later.",
    leadIntent: "hot",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Speak with us directly.",
    ctaBody:
      "Your ESOP need is active and time-sensitive. The best next step is to speak with us directly so we can understand your grant timing, valuation requirement, and decision context.",
    primaryCtaLabel: "Schedule a call",
    ctaUrl: BOOKING_URL,
    calloutLabel: "WHY THIS MATTERS",
    calloutBody:
      "Setting up an ESOP under pressure without a proper valuation can lead to over-promising equity, pricing options incorrectly, or creating expectations you cannot defend later.",
  },

  {
    id: "esop_warm_satisfied",
    track: "esop",
    label: "Your current ESOP valuation process is worth reviewing",
    headlineBefore: "Your current ESOP valuation process is",
    headlineHighlight: "worth reviewing",
    headlineAfter: "",
    statusLabel: "Optimization Window",
    description:
      "You already have an ESOP valuation process in place and you appear to be satisfied with it. While there may not be an urgent reason to switch providers today, it is still worth reviewing whether your current process is giving you maximum clarity, defensibility, and commercial usefulness — especially as your company grows and grant cycles become more complex.\n\nEven if you are satisfied, it is worth knowing what a more competitive option looks like before your next refresh.",
    leadIntent: "warm",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your ESOP optimization report.",
    ctaBody:
      "Review the report to see how modern valuation providers are streamlining the process, then book a call if you would like to explore alternatives before your next refresh.",
    primaryCtaLabel: "Get your ESOP report",
    secondaryCtaLabel: "Book a call",
    ctaUrl: BOOKING_URL,
    calloutLabel: "YOUR COMPANY IS ELIGIBLE",
    calloutBody:
      "Send us your most recent ESOP valuation invoice and get [10%] off your next ESOP valuation report with Bain Squared. Even if you are satisfied today, it is worth knowing what a more competitive option looks like.",
  },

  {
    id: "esop_warm_active_ask",
    track: "esop",
    label: "ESOP valuation is likely needed soon for your retention strategy",
    headlineBefore: "ESOP valuation is",
    headlineHighlight: "likely needed soon",
    headlineAfter: "for your retention strategy",
    statusLabel: "Planning Window",
    description:
      "Your answers suggest that employee equity is becoming a relevant topic for your company. While you may not have an immediate deadline, getting ahead of the valuation requirement is the best way to avoid rushed decisions when an investor, auditor, or employee formally raises it.\n\nThe earlier you establish a baseline, the more flexibility you have in structuring the plan.",
    leadIntent: "warm",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your ESOP readiness report.",
    ctaBody:
      "Your ESOP need is relevant, but may not require immediate action. Get the report first to understand your readiness, key risks, and what to prepare before speaking with an advisor.",
    primaryCtaLabel: "Get your ESOP report",
    secondaryCtaLabel: "Book a call",
    ctaUrl: BOOKING_URL,
    calloutLabel: "PLANNING AHEAD",
    calloutBody:
      "If you are using ESOPs to retain key employees, the valuation must be handled properly before the plan becomes difficult to explain. Starting early gives you time to structure it correctly.",
  },

  {
    id: "esop_warm_near_term",
    track: "esop",
    label: "Your retention strategy is ready for ESOP planning",
    headlineBefore: "Your retention strategy is",
    headlineHighlight: "ready for ESOP planning",
    headlineAfter: "",
    statusLabel: "Planning Window",
    description:
      "Your answers suggest that while no one is actively asking for equity yet, you are thinking about retention proactively and your timeline is near-term. This is exactly the right time to understand the valuation requirement before the demand arrives.\n\nCompanies that set up their ESOP structure before employees ask are in a much stronger position to communicate it credibly.",
    leadIntent: "warm",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your ESOP readiness report.",
    ctaBody:
      "Your ESOP need is relevant, but may not require immediate action. Get the report first to understand your readiness, key risks, and what to prepare before speaking with an advisor.",
    primaryCtaLabel: "Get your ESOP report",
    secondaryCtaLabel: "Book a call",
    ctaUrl: BOOKING_URL,
    calloutLabel: "GET AHEAD OF THE DEMAND",
    calloutBody:
      "When employees or candidates start asking about equity, you want to have a clear, defensible answer ready. Setting up the valuation framework now means you are not scrambling when the conversation happens.",
  },

  {
    id: "esop_cold",
    track: "esop",
    label: "You are in the early exploration stage for ESOPs",
    headlineBefore: "You are in the",
    headlineHighlight: "early exploration stage",
    headlineAfter: "for ESOPs",
    statusLabel: "Education Stage",
    description:
      "Your answers suggest that while retaining talent is important to you, there is no active demand for equity from employees and no immediate timeline to implement an ESOP. You do not need a valuation today.\n\nBut understanding how ESOPs work — and what triggers the need for a formal valuation — is a valuable step for future planning. The report below will help you understand what to prepare before the need becomes urgent.",
    leadIntent: "cold",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your ESOP readiness report.",
    ctaBody:
      "You may not have an immediate ESOP valuation need yet. The report will help you understand when valuation becomes relevant and what to prepare before the need becomes urgent.",
    primaryCtaLabel: "Get your ESOP report",
    ctaUrl: BOOKING_URL,
    calloutLabel: "NO ACTION NEEDED YET",
    calloutBody:
      "Keep the report for future planning. If employee equity becomes part of your retention or fundraising strategy later this year, you will already know what to expect.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BUSINESS VALUE TRACK
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "bv_hot",
    track: "business_value",
    label: "Your business has hidden value that investors need to see now",
    headlineBefore: "Your business has",
    headlineHighlight: "hidden value",
    headlineAfter: "that investors need to see now",
    statusLabel: "Urgent Review",
    description:
      "You are entering a valuation discussion soon, and your answers indicate that your business has significant value — such as brand, software, data, IP, or strong customer relationships — that is not fully captured by a standard profit or revenue multiple.\n\nIf you do not formally evidence these intangible assets now, investors will likely control the narrative and value the business too cheaply. A sum-of-parts valuation that clearly separates your financial multiple from your intangibles layer gives investors a structured, credible basis for understanding why your business is worth more.",
    leadIntent: "hot",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Speak with us directly.",
    ctaBody:
      "Your valuation event is approaching quickly. The best next step is to speak with us directly so we can understand your timeline and how to evidence your hidden value before the conversation begins.",
    primaryCtaLabel: "Schedule a call",
    ctaUrl: BOOKING_URL,
    calloutLabel: "WHY THIS MATTERS",
    calloutBody:
      "Raising funds or selling without a clear, documented view of your intangible assets often leads to unnecessary equity dilution or a lower exit price. You must prove the value before the term sheet is drafted.",
  },

  {
    id: "bv_warm_transaction",
    track: "business_value",
    label: "It is time to start evidencing the hidden value in your business",
    headlineBefore: "It is time to start",
    headlineHighlight: "evidencing the hidden value",
    headlineAfter: "in your business",
    statusLabel: "Planning Window",
    description:
      "You are planning a valuation event in the future, and your answers point to business assets that may not be fully visible in your current financials. While you do not have an urgent deadline this month, the best time to map and document your brand, software, data, or IP is before the pressure of a transaction begins.\n\nA structured review now will help you decide which assets are worth investing in and documenting before investors, buyers, or shareholders set the narrative.",
    leadIntent: "warm",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your Valuation Evidence Guide.",
    ctaBody:
      "Review the guide to understand what buyers and investors look for, then book a call when you are ready to start mapping your specific assets.",
    primaryCtaLabel: "Get your Valuation Guide",
    secondaryCtaLabel: "Book a call",
    ctaUrl: BOOKING_URL,
    calloutLabel: "INVESTOR CONNECTIONS",
    calloutBody:
      "Bain Squared works with a network of institutional investors, family offices, and growth equity funds across Southeast Asia. For clients who have completed a formal intangibles valuation, we can facilitate introductions where there is a strong fit.",
  },

  {
    id: "bv_warm_assets",
    track: "business_value",
    label: "Your business has strong intangible assets worth reviewing",
    headlineBefore: "Your business has",
    headlineHighlight: "strong intangible assets",
    headlineAfter: "worth reviewing",
    statusLabel: "Value Discovery",
    description:
      "Your answers suggest that your business has built significant value in areas like brand, customer relationships, software, data, or IP. Even though you are not actively selling or raising funds right now, understanding how these assets drive your company's true worth is a critical part of long-term strategic planning.\n\nMany founders only realise what their business is truly worth when it is too late. Mapping your intangible assets now gives you a clearer picture of your competitive advantage.",
    leadIntent: "warm",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your Intangible Asset Guide.",
    ctaBody:
      "Review the guide to see how intangible assets are valued in your industry, then book a call if you would like to explore a formal value discovery session.",
    primaryCtaLabel: "Get your Asset Guide",
    secondaryCtaLabel: "Book a call",
    ctaUrl: BOOKING_URL,
    calloutLabel: "YOUR BUSINESS HAS STRONG INTANGIBLES VALUE SIGNALS",
    calloutBody:
      "Your answers point to business assets that may not be fully visible in your current valuation. A structured review can help you evidence this value before investors, buyers, shareholders, or the board set the narrative.",
  },

  {
    id: "bv_cold",
    track: "business_value",
    label: "You are in the early stages of value discovery",
    headlineBefore: "You are in the",
    headlineHighlight: "early stages",
    headlineAfter: "of value discovery",
    statusLabel: "Education Stage",
    description:
      "Your answers suggest that you are currently exploring how business valuation works, but you do not have an immediate transaction planned and the signals for hidden intangible value are still early.\n\nThis does not mean your business lacks value. It simply means the value drivers may need to be developed or mapped more clearly over time. The guide below will help you understand the difference between standard financial value and true business value.",
    leadIntent: "cold",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Get your Business Value Starter Guide.",
    ctaBody:
      "You may not have an immediate valuation need yet. The guide will help you understand the difference between standard financial value and true business value.",
    primaryCtaLabel: "Get your Starter Guide",
    ctaUrl: BOOKING_URL,
    calloutLabel: "NO ACTION NEEDED YET",
    calloutBody:
      "Keep the guide for future planning. It will help you identify which business assets are worth tracking and documenting as your company grows.",
  },
];

export function getOutcomeByKey(resultKey: ResultKey): Outcome {
  const match = OUTCOMES.find((o) => o.id === resultKey);
  if (!match) return OUTCOMES[OUTCOMES.length - 1];
  return match;
}

// Legacy compatibility — kept for any code that still calls getOutcome by score
export function getOutcome(track: Track, _score: number): Outcome {
  const trackOutcomes = OUTCOMES.filter((o) => o.track === track);
  return trackOutcomes[0];
}
