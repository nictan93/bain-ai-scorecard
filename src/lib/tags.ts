import { QUESTIONS, type BackendTag, type Track } from "@/content/questions";

export function deriveTags(
  track: Track,
  answers: Record<string, string | string[]>
): BackendTag[] {
  const tagSet = new Set<BackendTag>();

  for (const question of QUESTIONS) {
    if (question.type === "open_text" || !question.options) continue;

    const answer = answers[question.id];
    if (answer == null) continue;

    if (question.type === "multi_select" && Array.isArray(answer)) {
      for (const selectedId of answer) {
        const option = question.options.find((o) => o.id === selectedId);
        option?.tags?.forEach((t) => tagSet.add(t));
      }
    } else if (typeof answer === "string") {
      const option = question.options.find((o) => o.id === answer);
      option?.tags?.forEach((t) => tagSet.add(t));
    }
  }

  const esopTags = new Set<BackendTag>([
    "esop_hot_lead",
    "esop_needs_report",
    "esop_education_lead",
    "esop_stakeholder_pressure",
  ]);
  const bipTags = new Set<BackendTag>([
    "fundraising_valuation_lead",
    "brand_valuation_lead",
    "software_data_valuation_lead",
    "ownership_risk_lead",
  ]);
  const eitherTags = new Set<BackendTag>(["strategic_transaction_lead"]);

  return Array.from(tagSet).filter((tag) => {
    if (eitherTags.has(tag)) return true;
    if (track === "esop") return esopTags.has(tag);
    return bipTags.has(tag);
  });
}
