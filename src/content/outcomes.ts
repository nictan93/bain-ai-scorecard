import type { Track } from "./questions";

export interface Outcome {
  id: string;
  track: Track;
  scoreRange: [number, number];
  label: string;
  description: string;
  recommendedNextStep: string;
  ctaLabel: string;
  ctaUrl: string;
}

// Calendly placeholder — replace before launch
const ESOP_BOOKING_URL = "https://calendly.com/bainsquared/ia-valuation";
const BIP_BOOKING_URL = "https://calendly.com/bainsquared/ia-valuation";

export const OUTCOMES: Outcome[] = [
  // ── ESOP (max score 17) ───────────────────────────────────────────────
  {
    id: "esop_gap",
    track: "esop",
    scoreRange: [0, 4],
    label: "ESOP Valuation Gap",
    description:
      "Your answers suggest the scheme is either early-stage or has not had a formal grant-date fair value documented under SFRS(I) 2. Without that documentation, options cannot be correctly expensed and IRAS compliance at exercise becomes uncertain. A scoping call will clarify what a Black-Scholes or binomial lattice valuation would involve for your structure.",
    recommendedNextStep: "ESOP valuation scoping",
    ctaLabel: "Book an ESOP Valuation Scoping Call",
    ctaUrl: ESOP_BOOKING_URL,
  },
  {
    id: "esop_risk",
    track: "esop",
    scoreRange: [5, 9],
    label: "ESOP Compliance Risk",
    description:
      "Your score indicates a valuation gap that has not yet generated formal pressure, but will. A scheme without a current grant-date fair value under SFRS(I) 2 accumulates audit exposure with each quarter that passes. The engagement is fixed-fee: a Black-Scholes or binomial lattice valuation, delivered within four to six weeks.",
    recommendedNextStep: "ESOP compliance review and formal valuation",
    ctaLabel: "Book an ESOP Compliance Review Call",
    ctaUrl: ESOP_BOOKING_URL,
  },
  {
    id: "esop_needed",
    track: "esop",
    scoreRange: [10, 13],
    label: "ESOP Valuation Needed",
    description:
      "Your score shows an active compliance or stakeholder driver with a defined grant timeline. The window between your current position and where your auditors or board need you to be is measured in weeks, not months. A formal valuation now resolves the exposure before it becomes a board-level issue.",
    recommendedNextStep: "Formal ESOP valuation under SFRS(I) 2",
    ctaLabel: "Book an ESOP Valuation Readiness Call",
    ctaUrl: ESOP_BOOKING_URL,
  },
  {
    id: "esop_urgent",
    track: "esop",
    scoreRange: [14, 17],
    label: "ESOP Valuation Urgent",
    description:
      "Your score signals active pressure from auditors or investors, or a grant deadline within 3 months. A delay in valuation directly affects your compliance position and your ability to close what is in front of you. The first step is a readiness call to scope the work and confirm a delivery timeline against your grant schedule.",
    recommendedNextStep: "Urgent ESOP valuation scoping and execution",
    ctaLabel: "Book an ESOP Valuation Readiness Call",
    ctaUrl: ESOP_BOOKING_URL,
  },

  // ── Brand / IP (max score 16) ─────────────────────────────────────────
  {
    id: "bip_unexplored",
    track: "brand_ip",
    scoreRange: [0, 3],
    label: "IP Value Unexplored",
    description:
      "Your answers suggest the intangible assets in your business have not been formally measured, and there is no immediate external driver pushing for it. That is not unusual at this stage. A scoping call will clarify which assets could carry a defensible valuation and what would be required to produce one.",
    recommendedNextStep: "Intangible asset identification and scoping",
    ctaLabel: "Book an Intangible Asset Scoping Call",
    ctaUrl: BIP_BOOKING_URL,
  },
  {
    id: "bip_gap",
    track: "brand_ip",
    scoreRange: [4, 7],
    label: "Brand IP Valuation Gap",
    description:
      "Your score indicates assets that carry meaningful value but have not been formally documented in a way that holds up in a deal, licence negotiation, or audit. The gap between what you believe the assets are worth and what you can defend in a negotiation is where value leaks. A formal valuation closes that gap.",
    recommendedNextStep: "Formal brand or IP valuation",
    ctaLabel: "Book a Brand IP Valuation Scoping Call",
    ctaUrl: BIP_BOOKING_URL,
  },
  {
    id: "bip_needed",
    track: "brand_ip",
    scoreRange: [8, 11],
    label: "Brand IP Valuation Needed",
    description:
      "Your score shows a defined driver, a transaction, a licensing deal, or a capital event, with a timeline that makes this work time-sensitive. The methodology will depend on the asset type: Relief-from-Royalty for brand and IP, income-based for software and data, Multi-Period Excess Earnings for customer relationships. The scoping call confirms which applies.",
    recommendedNextStep: "Formal valuation with methodology confirmed to asset type",
    ctaLabel: "Book a Brand IP Valuation Scoping Call",
    ctaUrl: BIP_BOOKING_URL,
  },
  {
    id: "bip_urgent",
    track: "brand_ip",
    scoreRange: [12, 16],
    label: "Brand IP Valuation Urgent",
    description:
      "Your score indicates active deal pressure, an acquirer's advisors, a due diligence process, or a licensing counterparty, against a timeline that does not leave room for a slow scoping process. The first step is a readiness call to confirm scope, methodology, and delivery timeline against your deadline.",
    recommendedNextStep: "Urgent intangible asset valuation scoping and execution",
    ctaLabel: "Book a Brand IP Valuation Scoping Call",
    ctaUrl: BIP_BOOKING_URL,
  },
];

export function getOutcome(track: Track, score: number): Outcome {
  const match = OUTCOMES.find(
    (o) => o.track === track && score >= o.scoreRange[0] && score <= o.scoreRange[1]
  );
  if (!match) {
    // Fallback to highest range for the track
    const trackOutcomes = OUTCOMES.filter((o) => o.track === track);
    return trackOutcomes[trackOutcomes.length - 1];
  }
  return match;
}
