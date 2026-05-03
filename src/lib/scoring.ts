import { QUESTIONS, MAX_SCORE, type Track, type ResultKey, type DeliverableKey } from "@/content/questions";

export function calculateScore(
  track: Track,
  answers: Record<string, string | string[]>
): number {
  const trackQuestions = QUESTIONS.filter((q) => q.track === track);
  let total = 0;

  for (const question of trackQuestions) {
    if (question.type === "open_text" || !question.options) continue;

    const answer = answers[question.id];
    if (answer == null) continue;

    if (question.type === "multi_select" && Array.isArray(answer)) {
      const cap = question.cap ?? 3;
      const sum = answer.reduce((acc, id) => {
        const opt = question.options!.find((o) => o.id === id);
        return acc + (opt?.score ?? 0);
      }, 0);
      total += Math.min(sum, cap);
    } else if (typeof answer === "string") {
      const option = question.options.find((o) => o.id === answer);
      if (option?.score != null) total += option.score;
    }
  }

  return total;
}

export function getMaxScore(track: Track): number {
  return MAX_SCORE[track];
}

export function scoreAsPercent(score: number, track: Track): number {
  const max = getMaxScore(track);
  if (max === 0) return 0;
  return Math.round((score / max) * 100);
}

export function getResultKey(track: Track, score: number): ResultKey {
  if (track === "esop") {
    if (score <= 4) return "esop_low";
    if (score <= 8) return "esop_moderate";
    if (score <= 13) return "esop_high";
    return "esop_urgent";
  }
  // valuation_uplift
  if (score <= 6) return "uplift_low";
  if (score <= 12) return "uplift_moderate";
  if (score <= 18) return "uplift_high";
  return "uplift_immediate";
}

export const DELIVERABLE_BY_RESULT: Record<ResultKey, DeliverableKey> = {
  esop_low: "esop_startup_checklist",
  esop_moderate: "esop_startup_checklist",
  esop_high: "esop_document_checklist",
  esop_urgent: "esop_document_checklist",
  uplift_low: "hidden_value_checklist",
  uplift_moderate: "hidden_value_checklist",
  uplift_high: "investor_evidence_checklist",
  uplift_immediate: "investor_evidence_checklist",
};

export function getDeliverableKey(resultKey: ResultKey): DeliverableKey {
  return DELIVERABLE_BY_RESULT[resultKey];
}
