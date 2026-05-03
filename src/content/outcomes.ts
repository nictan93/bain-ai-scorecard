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

const ESOP_BOOKING_URL = "https://cal.com/bain-squared/ia-valuation";
const BIP_BOOKING_URL = "https://cal.com/bain-squared/ia-valuation";

export const OUTCOMES: Outcome[] = [
  // ── ESOP (max score 18) ───────────────────────────────────────────────
  {
    id: "esop_low",
    track: "esop",
    scoreRange: [0, 4],
    label: "ESOP Valuation Gap",
    description:
      "You may not need ESOP valuation immediately, but it is useful to understand the requirements before issuing options. A scoping call will clarify what a Black-Scholes or binomial lattice valuation would involve for your structure and what to prepare when the time comes.",
    recommendedNextStep: "ESOP valuation scoping",
    ctaLabel: "Book an ESOP Valuation Scoping Call",
    ctaUrl: ESOP_BOOKING_URL,
  },
  {
    id: "esop_moderate",
    track: "esop",
    scoreRange: [5, 10],
    label: "ESOP Compliance Risk",
    description:
      "You may be early, but this is a good time to prepare. ESOPs are easier to manage when the valuation, option pool, and documentation are handled before there is pressure from auditors, investors, or board members. The engagement is fixed-fee and delivered within four to six weeks.",
    recommendedNextStep: "ESOP compliance review and formal valuation",
    ctaLabel: "Book an ESOP Compliance Review Call",
    ctaUrl: ESOP_BOOKING_URL,
  },
  {
    id: "esop_high",
    track: "esop",
    scoreRange: [11, 15],
    label: "ESOP Valuation Needed",
    description:
      "Your answers suggest that ESOP valuation may be important for your company. If you are issuing, refreshing, or reviewing employee options, a formal valuation can help support audit, investor, and board discussions before it becomes urgent.",
    recommendedNextStep: "Formal ESOP valuation under SFRS(I) 2",
    ctaLabel: "Request an ESOP Valuation Quote",
    ctaUrl: ESOP_BOOKING_URL,
  },
  {
    id: "esop_urgent",
    track: "esop",
    scoreRange: [16, 18],
    label: "ESOP Valuation Urgent",
    description:
      "This looks time-sensitive. If auditors, investors, or board members are already asking for ESOP valuation, you should move quickly to avoid delays. The first step is a readiness call to scope the work and confirm a delivery timeline against your grant schedule.",
    recommendedNextStep: "Urgent ESOP valuation scoping and execution",
    ctaLabel: "Book an ESOP Valuation Call",
    ctaUrl: ESOP_BOOKING_URL,
  },

  // ── Valuation Uplift (max score 20) ──────────────────────────────────
  {
    id: "bip_low",
    track: "brand_ip",
    scoreRange: [0, 5],
    label: "Hidden Value Unexplored",
    description:
      "There may not be an obvious hidden value gap based on your answers. Still, it is worth reviewing whether any assets are being overlooked before your next fundraising, board discussion, or ownership conversation.",
    recommendedNextStep: "Intangible asset identification and scoping",
    ctaLabel: "Book an Intangible Asset Scoping Call",
    ctaUrl: BIP_BOOKING_URL,
  },
  {
    id: "bip_moderate",
    track: "brand_ip",
    scoreRange: [6, 12],
    label: "Hidden Value Gap",
    description:
      "Your business may have hidden value, but it may not be fully organised or evidenced yet. The next step is to identify which value drivers can support a stronger valuation story before investors, buyers, or shareholders set the narrative.",
    recommendedNextStep: "Formal brand or IP valuation",
    ctaLabel: "Book a Hidden Value Review Call",
    ctaUrl: BIP_BOOKING_URL,
  },
  {
    id: "bip_high",
    track: "brand_ip",
    scoreRange: [13, 17],
    label: "Valuation Uplift Potential",
    description:
      "Your answers suggest that your business may be worth more than a basic revenue or profit multiple shows. The next step is to organise the evidence before speaking to investors, buyers, or shareholders — Relief-from-Royalty for brand and IP, income-based for software and data, Multi-Period Excess Earnings for customer relationships.",
    recommendedNextStep: "Formal valuation with methodology confirmed to asset type",
    ctaLabel: "Book a Valuation Uplift Review",
    ctaUrl: BIP_BOOKING_URL,
  },
  {
    id: "bip_urgent",
    track: "brand_ip",
    scoreRange: [18, 20],
    label: "Valuation Review Recommended",
    description:
      "This may be time-sensitive. If a valuation discussion is coming up soon, you should prepare your hidden value evidence before investors, buyers, or shareholders set the narrative. The first step is a readiness call to confirm scope, methodology, and delivery timeline against your deadline.",
    recommendedNextStep: "Urgent intangible asset valuation scoping and execution",
    ctaLabel: "Book a Valuation Review Call",
    ctaUrl: BIP_BOOKING_URL,
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
