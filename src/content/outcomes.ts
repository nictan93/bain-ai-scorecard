import type { Track, ResultKey } from "./questions";

export type LeadIntent = "hot" | "warm" | "nurture" | "cold";

export interface Outcome {
  id: ResultKey;
  track: Track;
  scoreRange: [number, number];
  /** Full plain-text label — used for aria */
  label: string;
  /**
   * Headline rendered as:
   *   headlineBefore [headlineHighlight] headlineAfter
   * The highlight word/phrase is shown in warning orange with brackets.
   * All three parts flow inline — no line break.
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
  secondaryCtaLabel: string;
  ctaUrl: string;
  calloutLabel: string;
  calloutBody: string;
}

const BOOKING_URL = "https://cal.com/bain-squared/ia-valuation";

export const OUTCOMES: Outcome[] = [

  // ── ESOP track ────────────────────────────────────────────────────────

  {
    id: "esop_required",
    track: "esop",
    scoreRange: [14, 18],
    label: "You have an immediate ESOP valuation need",
    headlineBefore: "You have an",
    headlineHighlight: "immediate",
    headlineAfter: "ESOP valuation need",
    statusLabel: "Action Required",
    description:
      "Your answers suggest that your company already has an ESOP or has issued employee options. In Singapore, this usually means the option value needs to be redone yearly to properly supported for audit, accounting, investor, or board purposes.\n\nDon't worry if you already have cap table management system provider. Bain Squared can prepare the ESOP valuation report at [competitive rates] and help liaise with your auditors.",
    leadIntent: "hot",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Speak with us today.",
    ctaBody:
      "Enter your details to book a discovery call so we can scope the report, timeline, auditor requirements, and documents needed.",
    primaryCtaLabel: "Book a Complimentary ESOP Valuation Call",
    secondaryCtaLabel: "Send me the ESOP Document Checklist",
    ctaUrl: BOOKING_URL,
    calloutLabel: "YOUR COMPANY IS ELIGIBLE",
    calloutBody:
      "Send us your most recent ESOP valuation invoice and get [10%] off your next ESOP valuation report with Bain Squared.",
  },

  {
    id: "esop_likely_needed",
    track: "esop",
    scoreRange: [6, 13],
    label: "ESOP valuation is likely needed soon",
    headlineBefore: "ESOP valuation is",
    headlineHighlight: "likely",
    headlineAfter: "needed soon",
    statusLabel: "Planning Window",
    description:
      "Your answers suggest that your company is planning, considering, or preparing to issue employee stock options.\n\nThis is a good time to get ahead of the valuation requirement instead of waiting until an audit, investor review, board discussion, or option issuance deadline creates pressure.\n\nIf you are using ESOPs to retain key employees or reduce cash salary pressure, the valuation should be handled properly before the plan becomes difficult to explain.",
    leadIntent: "warm",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Speak with us today.",
    ctaBody:
      "Enter your details to book a discovery call so we can help you understand what documents, decisions, and valuation support may be needed before you issue or refresh employee options.",
    primaryCtaLabel: "Book an ESOP Planning Call",
    secondaryCtaLabel: "Download the ESOP Valuation Checklist",
    ctaUrl: BOOKING_URL,
    calloutLabel: "YOUR COMPANY IS ELIGIBLE",
    calloutBody:
      "Send us your most recent ESOP valuation invoice and get [10%] off your next ESOP valuation report with Bain Squared.",
  },

  {
    id: "esop_planning",
    track: "esop",
    scoreRange: [3, 5],
    label: "You are in the planning stage for ESOPs",
    headlineBefore: "You are in the",
    headlineHighlight: "planning",
    headlineAfter: "stage for ESOPs",
    statusLabel: "Early Stage",
    description:
      "Your answers suggest that ESOP valuation is not urgent yet, but employee equity may become relevant as your company grows.\n\nThis is the right time to understand how ESOPs work and how it can help you incentivise your team. Planning early can help you avoid unclear option promises, messy employee communication, and last-minute valuation work later.",
    leadIntent: "nurture",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Download the ESOP starter checklist now.",
    ctaBody:
      "Enter your business email and we will send you the checklist that matches your result.",
    primaryCtaLabel: "Download the ESOP Checklist",
    secondaryCtaLabel: "Subscribe to valuation insights",
    ctaUrl: BOOKING_URL,
    calloutLabel: "PLANNING AHEAD",
    calloutBody:
      "Use the ESOP checklist to understand what may be required before setting up an option pool or employee equity plan.",
  },

  {
    id: "esop_no_need",
    track: "esop",
    scoreRange: [0, 2],
    label: "You have no ESOP valuation need right now",
    headlineBefore: "You have",
    headlineHighlight: "no",
    headlineAfter: "ESOP valuation need right now",
    statusLabel: "No Immediate Action",
    description:
      "Your answers suggest that your company does not need ESOP valuation at this stage. If you later decide to issue employee options, the valuation requirement may become relevant.\n\nAlthough there is no clear ESOP valuation trigger right now, you can still use our complimentary ESOP starter checklist to understand what may be required in the future or revisit the topic when you begin planning an option pool or employee equity plan.",
    leadIntent: "cold",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Download the ESOP starter checklist now.",
    ctaBody:
      "Enter your business email and we will send you the checklist that matches your result.",
    primaryCtaLabel: "Download the ESOP Starter Checklist",
    secondaryCtaLabel: "Subscribe to valuation insights",
    ctaUrl: BOOKING_URL,
    calloutLabel: "NO ACTION NEEDED YET",
    calloutBody:
      "You do not appear to need ESOP valuation today. Keep the checklist for future planning if employee equity becomes part of your retention or fundraising strategy.",
  },

  // ── Business Value track ──────────────────────────────────────────────

  {
    id: "business_value_review",
    track: "business_value",
    scoreRange: [15, 24],
    label: "A Intangibles Asset Valuation Review is strongly recommended",
    headlineBefore: "A Intangibles Asset Valuation Review is",
    headlineHighlight: "strongly",
    headlineAfter: "recommended",
    statusLabel: "High-Intent Review",
    description:
      "Your answers suggest that your business may have value that is not fully captured by a basic revenue or profit multiple.\n\nThere may be important value in your customer base, contracts, brand, software, data, IP, repeat revenue, systems, or specialist know-how.\n\nIf you are raising funds, selling, bringing in investors, restructuring, or preparing for a valuation discussion, this should be reviewed before external parties set the terms of the conversation.",
    leadIntent: "hot",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Speak with us today.",
    ctaBody:
      "Enter your details to book a discovery call so we can identify which value drivers can be evidenced, structured, and used to support a stronger valuation discussion.",
    primaryCtaLabel: "Book a Discovery Call today",
    secondaryCtaLabel: "Send me the Investor Evidence Checklist",
    ctaUrl: BOOKING_URL,
    calloutLabel: "YOUR BUSINESS HAS STRONG INTANGIBLES VALUE SIGNALS",
    calloutBody:
      "Your answers point to business assets that may not be fully visible in your current valuation. A structured review can help you evidence this value before investors, buyers, shareholders, or the board set the narrative.",
  },

  {
    id: "hidden_value_found",
    track: "business_value",
    scoreRange: [7, 14],
    label: "Your business has hidden intangibles value worth reviewing",
    headlineBefore: "Your business has",
    headlineHighlight: "hidden intangibles value",
    headlineAfter: "worth reviewing",
    statusLabel: "Value Signals Present",
    description:
      "Your answers suggest that your business has value drivers that may not show clearly in normal financial numbers.\n\nThis could include brand strength, customer relationships, contracts, software, data, IP, recurring revenue, internal systems, or operational know-how.\n\nYou may not have an urgent valuation event yet, but these value drivers are worth mapping before fundraising, M&A, shareholder discussions, or investor conversations begin.",
    leadIntent: "warm",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Speak with us today.",
    ctaBody:
      "Enter your details to book a discovery call so we can help you to understand which assets may be worth evidencing first.",
    primaryCtaLabel: "Book a Discovery Call today",
    secondaryCtaLabel: "Download the Hidden Value Checklist",
    ctaUrl: BOOKING_URL,
    calloutLabel: "YOUR BUSINESS HAS STRONG INTANGIBLES VALUE SIGNALS",
    calloutBody:
      "Your answers indicate value in brand, customers, contracts, software, data, IP, systems, or repeat revenue that may not be fully reflected today. A structured review can help you decide what is worth evidencing before a valuation discussion.",
  },

  {
    id: "early_value_discovery",
    track: "business_value",
    scoreRange: [1, 6],
    label: "There are early signals of hidden intangibles value",
    headlineBefore: "There are",
    headlineHighlight: "early signals",
    headlineAfter: "of hidden intangibles value",
    statusLabel: "Early Signal",
    description:
      "Your answers suggest that there may be some hidden value in your business, but the signal is still early.\n\nThis does not mean there is nothing there. It simply means the value drivers may need to be mapped more clearly before deciding whether a formal review is worthwhile.\n\nThe best starting point is to identify what the business has already built, including customers, contracts, brand, systems, software, data, IP, or internal know-how.",
    leadIntent: "nurture",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Speak with us today.",
    ctaBody:
      "Enter your details to book a discovery call so we can help you map which parts of your business may support a stronger valuation later.",
    primaryCtaLabel: "Book a Discovery Call today",
    secondaryCtaLabel: "Download the Hidden Value Checklist",
    ctaUrl: BOOKING_URL,
    calloutLabel: "EARLY INTANGIBLES VALUE SIGNALS FOUND",
    calloutBody:
      "You may have value that is not obvious yet. The checklist can help you identify which business assets are worth tracking, documenting, or reviewing in the future.",
  },

  {
    id: "no_clear_valuation_need",
    track: "business_value",
    scoreRange: [0, 0],
    label: "There is no clear valuation need right now",
    headlineBefore: "There is",
    headlineHighlight: "no",
    headlineAfter: "clear valuation need right now",
    statusLabel: "No Immediate Action",
    description:
      "Your answers do not point to an immediate valuation review need at this stage.\n\nThat does not mean your business lacks value. It simply means there may not be a clear trigger right now, such as fundraising, M&A, investor discussions, shareholder restructuring, or a strong hidden value signal.\n\nYou can still use the checklist to understand what investors and buyers may look for when reviewing business value in the future.",
    leadIntent: "cold",
    ctaSectionLabel: "RECOMMENDED NEXT STEP",
    ctaHeadline: "Download the Intangibles Asset Valuation Checklist now.",
    ctaBody:
      "Enter your business email and we will send you the checklist that matches your result.",
    primaryCtaLabel: "Download the Intangibles Asset Valuation Checklist",
    secondaryCtaLabel: "Subscribe to valuation insights",
    ctaUrl: BOOKING_URL,
    calloutLabel: "NO ACTION NEEDED YET",
    calloutBody:
      "There is no clear valuation trigger based on your answers. Keep the checklist for future planning if you later raise funds, sell the business, bring in investors, or review shareholder value.",
  },
];

export function getOutcome(track: Track, score: number): Outcome {
  const match = OUTCOMES.find(
    (o) => o.track === track && score >= o.scoreRange[0] && score <= o.scoreRange[1]
  );
  if (!match) {
    const trackOutcomes = OUTCOMES.filter((o) => o.track === track);
    return trackOutcomes[trackOutcomes.length - 1];
  }
  return match;
}

export function getOutcomeByKey(resultKey: ResultKey): Outcome {
  const match = OUTCOMES.find((o) => o.id === resultKey);
  if (!match) {
    // Should never happen with a valid ResultKey — fall back to last outcome
    return OUTCOMES[OUTCOMES.length - 1];
  }
  return match;
}
