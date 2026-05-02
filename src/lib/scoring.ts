import { QUESTIONS, MAX_SCORE, type Track } from "@/content/questions";

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
      // Sum scores of selected options, capped at 3
      const sum = answer.reduce((acc, id) => {
        const opt = question.options!.find((o) => o.id === id);
        return acc + (opt?.score ?? 0);
      }, 0);
      total += Math.min(sum, 3);
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
