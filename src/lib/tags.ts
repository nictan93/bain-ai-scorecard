import { QUESTIONS, type Track, type BackendTag } from "@/content/questions";

export function deriveTags(
  track: Track,
  answers: Record<string, string | string[]>
): BackendTag[] {
  const tagSet = new Set<BackendTag>();
  const trackQuestions = QUESTIONS.filter((q) => q.track === track);

  for (const question of trackQuestions) {
    if (!question.options) continue;
    const answer = answers[question.id];
    if (answer == null) continue;

    const selectedIds = Array.isArray(answer) ? answer : [answer];
    for (const id of selectedIds) {
      const option = question.options.find((o) => o.id === id);
      if (option?.tags) {
        option.tags.forEach((t) => tagSet.add(t));
      }
    }
  }

  // Also pick up tags from the routing question
  const routingAnswer = answers["q1_routing"];
  if (typeof routingAnswer === "string") {
    const routingOption = QUESTIONS.find((q) => q.id === "q1_routing")?.options?.find(
      (o) => o.id === routingAnswer
    );
    routingOption?.tags?.forEach((t) => tagSet.add(t));
  }

  return Array.from(tagSet);
}
