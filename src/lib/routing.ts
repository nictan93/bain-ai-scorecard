import { QUESTIONS, type Track } from "@/content/questions";

// ── Track determination ────────────────────────────────────────────────────

export function determineTrack(answers: Record<string, string | string[]>): Track | null {
  const q1Answer = answers["q1_routing"];
  if (!q1Answer || typeof q1Answer !== "string") return null;
  const q1Option = QUESTIONS.find((q) => q.id === "q1_routing")?.options?.find(
    (o) => o.id === q1Answer
  );
  if (!q1Option?.routesTo) return null;
  return q1Option.routesTo;
}

// ── ESOP branch helpers ────────────────────────────────────────────────────

function esopHasExisting(answers: Record<string, string | string[]>): boolean {
  return answers["a_esop_status"] === "yes_existing";
}

function esopNoFormalValuation(answers: Record<string, string | string[]>): boolean {
  const v = answers["a1_formal_valuation"];
  return v === "no" || v === "not_sure";
}

// ── ESOP branching next-question map ──────────────────────────────────────
//
// Branch A (already has ESOP):
//   q1_routing -> a_esop_status
//   -> a1_formal_valuation
//     -> if no/not_sure: TERMINAL (hot, result page)
//     -> if yes: a2_satisfaction -> TERMINAL
//
// Branch B/C/U (planning, no ESOP, unsure):
//   q1_routing -> a_esop_status
//   -> bc1_asking -> bc3_timing -> bc2_concern -> TERMINAL

function getNextEsopQuestionId(
  currentId: string,
  answers: Record<string, string | string[]>
): string | null {
  switch (currentId) {
    case "q1_routing":
      return "a_esop_status";

    case "a_esop_status":
      if (esopHasExisting(answers)) return "a1_formal_valuation";
      return "bc1_asking";

    // ── Branch A ──────────────────────────────────────────────────────────
    case "a1_formal_valuation":
      if (esopNoFormalValuation(answers)) return null; // terminal: hot result
      return "a2_satisfaction";

    case "a2_satisfaction":
      return null; // terminal

    // ── Branch B/C/U ──────────────────────────────────────────────────────
    case "bc1_asking":
      return "bc3_timing"; // timing now before concern

    case "bc3_timing":
      return "bc2_concern"; // concern is the terminal question

    case "bc2_concern":
      return null; // terminal

    default:
      return null;
  }
}

// ── Intangible Value next-question map ────────────────────────────────────
// Master order: stage, headcount, valuation-method, value-gap, reason(b5),
//               uncaptured-assets(b3), documentation(b4), timing(b6), concern(b7)

function getNextIvQuestionId(currentId: string): string | null {
  const order: string[] = [
    "b_context_stage",
    "b_context_headcount",
    "b1",
    "b2",
    "b5",  // reason / hard-trigger event (moved up from position 7)
    "b3",  // uncaptured assets (multi-select)
    "b4",  // documentation
    "b6",  // timing
    "b7",  // primary concern (terminal)
  ];
  const idx = order.indexOf(currentId);
  if (idx === -1 || idx === order.length - 1) return null;
  return order[idx + 1];
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getNextQuestionId(
  currentId: string,
  answers: Record<string, string | string[]>,
  track: Track | null
): string | null {
  if (currentId === "q1_routing") {
    const q1Answer = answers["q1_routing"];
    if (typeof q1Answer !== "string") return null;
    const q1Option = QUESTIONS.find((q) => q.id === "q1_routing")?.options?.find(
      (o) => o.id === q1Answer
    );
    if (!q1Option?.routesTo) return null;
    if (q1Option.routesTo === "esop") return "a_esop_status";
    if (q1Option.routesTo === "intangible_value") return "b_context_stage";
    return null;
  }

  if (track === "esop") return getNextEsopQuestionId(currentId, answers);
  if (track === "intangible_value") return getNextIvQuestionId(currentId);
  return null;
}

// Returns true when the user clicking Next on this question should go to the result page.
// For ESOP Branch A, a1_formal_valuation is terminal only when the answer is no/not_sure.
export function isLastQuestion(
  questionId: string,
  track: Track | null,
  answers?: Record<string, string | string[]>
): boolean {
  if (track === "esop") {
    if (questionId === "bc2_concern") return true;
    if (questionId === "a2_satisfaction") return true;
    if (questionId === "a1_formal_valuation") {
      const fv = answers?.["a1_formal_valuation"];
      return fv === "no" || fv === "not_sure";
    }
    return false;
  }
  if (track === "intangible_value") return questionId === "b7";
  return false;
}

export function getQuestionProgress(
  questionId: string,
  track: Track | null,
  answers: Record<string, string | string[]> = {}
): { current: number; total: number } {
  if (questionId === "q1_routing") return { current: 1, total: 1 };
  if (!track) return { current: 0, total: 0 };

  if (track === "esop") {
    const path = buildEsopPath(answers);
    const idx = path.indexOf(questionId);
    return { current: idx >= 0 ? idx + 1 : 1, total: path.length };
  }

  if (track === "intangible_value") {
    const ivOrder = [
      "b_context_stage", "b_context_headcount",
      "b1", "b2", "b5", "b3", "b4", "b6", "b7",
    ];
    const idx = ivOrder.indexOf(questionId);
    return { current: idx >= 0 ? idx + 1 : 1, total: ivOrder.length };
  }

  return { current: 0, total: 0 };
}

// Build the expected ESOP question path based on current answers
function buildEsopPath(answers: Record<string, string | string[]>): string[] {
  if (esopHasExisting(answers)) {
    // Branch A
    if (esopNoFormalValuation(answers)) {
      return ["a_esop_status", "a1_formal_valuation"];
    }
    return ["a_esop_status", "a1_formal_valuation", "a2_satisfaction"];
  }

  // Branch B/C/U: pressure -> timing -> concern
  return ["a_esop_status", "bc1_asking", "bc3_timing", "bc2_concern"];
}
