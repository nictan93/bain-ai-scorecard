import { QUESTIONS, type BackendTag, type Track } from "@/content/questions";

export function deriveTags(
  track: Track,
  answers: Record<string, string>
): BackendTag[] {
  const tagSet = new Set<BackendTag>();

  // Collect tags from every selected option across the entire question set
  for (const question of QUESTIONS) {
    if (question.type !== "single_select" || !question.options) continue;
    const answerId = answers[question.id];
    if (!answerId) continue;
    const option = question.options.find((o) => o.id === answerId);
    option?.tags?.forEach((t) => tagSet.add(t));
  }

  // Filter to tags that are valid for this track
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
