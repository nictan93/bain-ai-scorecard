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

function esopIsSatisfied(answers: Record<string, string | string[]>): boolean {
  return answers["a2_satisfaction"] === "satisfied";
}

// ── ESOP branching next-question map ──────────────────────────────────────
//
// Branch A (already has ESOP):
//   a_esop_status -> a_context_stage -> a_context_headcount
//   -> a1_formal_valuation
//     -> if no/not_sure: a4_timing (HOT, skip rest)
//     -> if yes: a2_satisfaction
//       -> if satisfied: a3_price_factor -> a4_timing
//       -> if dissatisfied/not_sure: a3_dissatisfied_reason -> a4_timing
//   [terminal]
//
// Branch B/C/U (planning, no ESOP, unsure):
//   a_esop_status -> a_context_stage -> a_context_headcount
//   -> bc1_asking -> bc2_concern -> bc3_timing
//   [terminal]

function getNextEsopQuestionId(
  currentId: string,
  answers: Record<string, string | string[]>
): string | null {
  switch (currentId) {
    case "q1_routing":
      return "a_esop_status";

    case "a_esop_status":
      return "a_context_stage";

    case "a_context_stage":
      return "a_context_headcount";

    case "a_context_headcount":
      if (esopHasExisting(answers)) return "a1_formal_valuation";
      return "bc1_asking";

    // ── Branch A ──────────────────────────────────────────────────────────
    case "a1_formal_valuation":
      if (esopNoFormalValuation(answers)) return "a4_timing";
      return "a2_satisfaction";

    case "a2_satisfaction":
      if (esopIsSatisfied(answers)) return "a3_price_factor";
      return "a3_dissatisfied_reason";

    case "a3_price_factor":
      return "a4_timing";

    case "a3_dissatisfied_reason":
      return "a4_timing";

    case "a4_timing":
      return null; // terminal for branch A

    // ── Branch B/C/U ──────────────────────────────────────────────────────
    case "bc1_asking":
      return "bc2_concern";

    case "bc2_concern":
      return "bc3_timing";

    case "bc3_timing":
      return null; // terminal for branches B/C/U

    default:
      return null;
  }
}

// ── Intangible Value next-question map ────────────────────────────────────
// Linear: context questions first, then b1–b7

function getNextIvQuestionId(currentId: string): string | null {
  const order: string[] = [
    "b_context_stage",
    "b_context_headcount",
    "b1",
    "b2",
    "b3",
    "b4",
    "b5",
    "b6",
    "b7",
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

export function isLastQuestion(questionId: string, track: Track | null): boolean {
  if (track === "esop") return questionId === "a4_timing" || questionId === "bc3_timing";
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
      "b1", "b2", "b3", "b4", "b5", "b6", "b7",
    ];
    const idx = ivOrder.indexOf(questionId);
    return { current: idx >= 0 ? idx + 1 : 1, total: ivOrder.length };
  }

  return { current: 0, total: 0 };
}

// Build the expected ESOP question path based on current answers
function buildEsopPath(answers: Record<string, string | string[]>): string[] {
  const base = ["a_esop_status", "a_context_stage", "a_context_headcount"];

  if (esopHasExisting(answers)) {
    // Branch A
    const branchA = ["a1_formal_valuation"];
    if (esopNoFormalValuation(answers)) {
      return [...base, ...branchA, "a4_timing"];
    }
    branchA.push("a2_satisfaction");
    if (esopIsSatisfied(answers)) {
      branchA.push("a3_price_factor");
    } else {
      branchA.push("a3_dissatisfied_reason");
    }
    branchA.push("a4_timing");
    return [...base, ...branchA];
  }

  // Branch B/C/U
  return [...base, "bc1_asking", "bc2_concern", "bc3_timing"];
}
