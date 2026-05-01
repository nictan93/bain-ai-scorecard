import { QUESTIONS, type Question, type Track } from "@/content/questions";

export function determineTrack(answers: Record<string, string>): Track | null {
  const q1Answer = answers["q1_routing"];
  if (!q1Answer) return null;

  const q1Option = QUESTIONS.find((q) => q.id === "q1_routing")?.options?.find(
    (o) => o.id === q1Answer
  );
  if (!q1Option) return null;

  if (q1Option.routesTo === "esop") return "esop";
  if (q1Option.routesTo === "brand_ip") return "brand_ip";

  // Needs Q2 clarifier
  const q2Answer = answers["q2_clarify"];
  if (!q2Answer) return null;

  const q2Option = QUESTIONS.find((q) => q.id === "q2_clarify")?.options?.find(
    (o) => o.id === q2Answer
  );
  if (q2Option?.routesTo === "esop") return "esop";
  if (q2Option?.routesTo === "brand_ip") return "brand_ip";

  return null;
}

function trackQuestionsInOrder(track: Track): Question[] {
  return QUESTIONS.filter((q) => q.track === track).sort(
    (a, b) => a.order - b.order
  );
}

export function getNextQuestionId(
  currentId: string,
  answers: Record<string, string>,
  track: Track | null
): string | null {
  if (currentId === "q1_routing") {
    const q1Answer = answers["q1_routing"];
    const q1Option = QUESTIONS.find((q) => q.id === "q1_routing")?.options?.find(
      (o) => o.id === q1Answer
    );
    if (!q1Option) return null;
    if (q1Option.routesTo === "q2_clarify") return "q2_clarify";
    // Direct route into track
    if (q1Option.routesTo === "esop") {
      return trackQuestionsInOrder("esop")[0]?.id ?? null;
    }
    if (q1Option.routesTo === "brand_ip") {
      return trackQuestionsInOrder("brand_ip")[0]?.id ?? null;
    }
    return null;
  }

  if (currentId === "q2_clarify") {
    if (!track) return null;
    return trackQuestionsInOrder(track)[0]?.id ?? null;
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
  if (questionId === "q2_clarify") return { current: 2, total: 2 };
  if (!track) return { current: 0, total: 0 };

  const trackQuestions = trackQuestionsInOrder(track);
  const idx = trackQuestions.findIndex((q) => q.id === questionId);
  return {
    current: idx + 1,
    total: trackQuestions.length,
  };
}
