import { QUESTIONS, MAX_SCORE, type Track } from "@/content/questions";

export function calculateScore(
  track: Track,
  answers: Record<string, string>
): number {
  const trackQuestions = QUESTIONS.filter((q) => q.track === track);
  let total = 0;

  for (const question of trackQuestions) {
    if (question.type !== "single_select" || !question.options) continue;
    const answerId = answers[question.id];
    if (!answerId) continue;
    const option = question.options.find((o) => o.id === answerId);
    if (option?.score != null) total += option.score;
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
