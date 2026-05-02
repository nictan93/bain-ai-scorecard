import { QUESTIONS, type Question, type Track } from "@/content/questions";

export function determineTrack(answers: Record<string, string | string[]>): Track | null {
  const q1Answer = answers["q1_routing"];
  if (!q1Answer || typeof q1Answer !== "string") return null;

  const q1Option = QUESTIONS.find((q) => q.id === "q1_routing")?.options?.find(
    (o) => o.id === q1Answer
  );
  if (!q1Option?.routesTo) return null;

  return q1Option.routesTo;
}

function trackQuestionsInOrder(track: Track): Question[] {
  return QUESTIONS.filter((q) => q.track === track).sort(
    (a, b) => a.order - b.order
  );
}

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
    return trackQuestionsInOrder(q1Option.routesTo)[0]?.id ?? null;
  }

  // Within a track: advance to next in order
  if (!track) return null;
  const trackQuestions = trackQuestionsInOrder(track);
  const idx = trackQuestions.findIndex((q) => q.id === currentId);
  if (idx === -1 || idx === trackQuestions.length - 1) return null;
  return trackQuestions[idx + 1].id;
}

export function isLastQuestion(questionId: string, track: Track | null): boolean {
  if (!track) return false;
  const trackQuestions = trackQuestionsInOrder(track);
  return trackQuestions[trackQuestions.length - 1]?.id === questionId;
}

export function getQuestionProgress(
  questionId: string,
  track: Track | null
): { current: number; total: number } {
  if (questionId === "q1_routing") return { current: 1, total: 1 };
  if (!track) return { current: 0, total: 0 };

  const trackQuestions = trackQuestionsInOrder(track);
  const idx = trackQuestions.findIndex((q) => q.id === questionId);
  return {
    current: idx + 1,
    total: trackQuestions.length,
  };
}
