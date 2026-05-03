import type { Track } from "./questions";

export interface Outcome {
  id: string;
  track: Track;
  scoreRange: [number, number];
  label: string;
  statusLabel: string;
  description: string;
  recommendedNextStep: string;
  ctaLabel: string;
  ctaUrl: string;
}

const BOOKING_URL = "https://cal.com/bain-squared/ia-valuation";

export const OUTCOMES: Outcome[] = [
  // ── ESOP (max score 18) ───────────────────────────────────────────────
  {
    id: "esop_low",
    track: "esop",
    scoreRange: [0, 4],
    label: "Low ESOP Valuation Need",
    statusLabel: "Early Stage",
    description:
      "Your answers suggest that ESOP valuation is not an immediate priority. You may not be issuing employee stock options yet, or there may be no clear audit, investor, board, or employee compensation trigger. That said, if you plan to use employee stock options in the future, it is better to understand the valuation process before options are issued.",
    recommendedNextStep:
      "You may not need ESOP valuation immediately, but it is useful to understand the documents, decisions, and valuation triggers before making equity promises to employees.",
    ctaLabel: "Book an ESOP Scoping Call",
    ctaUrl: BOOKING_URL,
  },
  {
    id: "esop_moderate",
    track: "esop",
    scoreRange: [5, 8],
    label: "Moderate ESOP Valuation Need",
    statusLabel: "Planning Stage",
    description:
      "Your answers suggest that ESOP valuation may become relevant soon. You may be considering employee stock options, planning ahead, or unsure whether valuation support is required. You may not need a full valuation immediately, but you should understand what auditors, investors, and boards may expect before issuing or refreshing employee options.",
    recommendedNextStep:
      "You may be early, but this is the right time to understand what auditors, investors, and boards may expect from an ESOP valuation process.",
    ctaLabel: "Book an ESOP Scoping Call",
    ctaUrl: BOOKING_URL,
  },
  {
    id: "esop_high",
    track: "esop",
    scoreRange: [9, 13],
    label: "High ESOP Valuation Need",
    statusLabel: "Action Recommended",
    description:
      "Your answers suggest that your company has a clear ESOP valuation need. If employee options have already been issued, are about to be issued, or are being reviewed by investors, auditors, or the board, internal estimates may not be enough. A formal ESOP valuation can help support option pricing, audit review, investor confidence, and board governance.",
    recommendedNextStep:
      "Your answers suggest that ESOP valuation may be relevant for audit, investor, board, or governance purposes. Speak with us to understand the timeline, documents, and valuation scope.",
    ctaLabel: "Request an ESOP Valuation Quote",
    ctaUrl: BOOKING_URL,
  },
  {
    id: "esop_urgent",
    track: "esop",
    scoreRange: [14, 18],
    label: "Urgent ESOP Valuation Need",
    statusLabel: "Time-Sensitive",
    description:
      "Your answers suggest that your ESOP valuation need may be time-sensitive. If auditors, investors, or board members are already asking for valuation support, you should move quickly to avoid delays in audit, fundraising, or option issuance. This is especially important if you have used internal estimates, have an outdated valuation, or need the report within the next month.",
    recommendedNextStep:
      "If auditors, investors, or board members are already asking for ESOP valuation support, you should scope the work quickly to avoid delays in audit, fundraising, or option issuance.",
    ctaLabel: "Book an ESOP Valuation Call",
    ctaUrl: BOOKING_URL,
  },

  // ── Valuation Uplift (max score 24) ──────────────────────────────────
  {
    id: "uplift_low",
    track: "valuation_uplift",
    scoreRange: [0, 6],
    label: "Low Valuation Uplift Potential",
    statusLabel: "Limited Signal",
    description:
      "Your answers suggest that your company may currently be valued mainly on revenue, profit, or physical assets. There may still be ways to improve your valuation story, but there is no obvious hidden value gap based on your answers. This does not mean your business lacks value. It means the additional value drivers are either not yet clear, not yet relevant, or not tied to a near-term valuation event.",
    recommendedNextStep:
      "There may not be an obvious hidden value gap based on your answers, but a brief review can help confirm whether brand, customers, contracts, software, data, IP, or systems are being overlooked.",
    ctaLabel: "Book a Scoping Call",
    ctaUrl: BOOKING_URL,
  },
  {
    id: "uplift_moderate",
    track: "valuation_uplift",
    scoreRange: [7, 12],
    label: "Moderate Valuation Uplift Potential",
    statusLabel: "Value Signals Present",
    description:
      "Your answers suggest that your business may have value that is not fully captured by a basic revenue or profit multiple. This could include customer relationships, brand, contracts, software, data, IP, systems, or repeat revenue. The next step is to identify which of these assets can be properly evidenced and used in a stronger valuation discussion.",
    recommendedNextStep:
      "Your business may have value that is not fully captured by a basic revenue or profit multiple. The next step is to identify which value drivers can be evidenced and included in a stronger valuation discussion.",
    ctaLabel: "Book a Hidden Value Review Call",
    ctaUrl: BOOKING_URL,
  },
  {
    id: "uplift_high",
    track: "valuation_uplift",
    scoreRange: [13, 18],
    label: "High Valuation Uplift Potential",
    statusLabel: "Strong Value Gap",
    description:
      "Your answers suggest that your company may have meaningful value beyond its current revenue, profit, or basic industry multiple. This value may sit in your brand, customer base, contracts, recurring revenue, software, data, IP, operating systems, or specialist know-how. The issue is not whether these things matter. The issue is whether investors, buyers, shareholders, or board members can clearly see and accept them.",
    recommendedNextStep:
      "Your answers suggest that your business may have meaningful value beyond the usual numbers. Before speaking to investors, buyers, shareholders, or the board, organise the evidence that supports that value.",
    ctaLabel: "Book a Valuation Uplift Review",
    ctaUrl: BOOKING_URL,
  },
  {
    id: "uplift_immediate",
    track: "valuation_uplift",
    scoreRange: [19, 24],
    label: "Immediate Valuation Review Recommended",
    statusLabel: "Time-Sensitive",
    description:
      "Your answers suggest that you may need to defend your company's valuation soon. If investors, buyers, shareholders, auditors, or board members are about to review your business, you should prepare your hidden value evidence before the valuation discussion begins. This is especially important if your current valuation is based mainly on revenue, profit, or a simple industry multiple.",
    recommendedNextStep:
      "If a valuation discussion is coming up soon, you should prepare your hidden value evidence before investors, buyers, shareholders, or auditors frame the conversation for you.",
    ctaLabel: "Book a Valuation Review Call",
    ctaUrl: BOOKING_URL,
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
