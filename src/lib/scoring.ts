import { QUESTIONS, MAX_SCORE, type Track, type ResultKey, type DeliverableKey } from "@/content/questions";

// ── Aggregate score (kept for analytics/CRM; never shown to user) ─────────────

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
      const cap = question.cap ?? 6;
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

// ── ESOP hard routing ────────────────────────────────────────────────────────
//
// Rules evaluated in priority order. First match wins.
// Option IDs below are the codebase IDs (descriptive form), mapped from
// the spec's shorthand (a1_yes_existing → "already_issue_options", etc.).

export function calculateEsopResult(
  answers: Record<string, string | string[]>
): ResultKey {
  const q1 = answers["q1_routing"] as string | undefined;
  const a1 = answers["a1"] as string | undefined;
  const a2 = answers["a2"] as string | undefined;
  const a3 = answers["a3"] as string | undefined;
  const a4 = answers["a4"] as string | undefined;
  const a5 = answers["a5"] as string | undefined;
  const a6 = answers["a6"] as string | undefined;

  // ── esop_required (hard triggers) ──────────────────────────────────────
  if (
    q1 === "already_have_esops_need_valuation_support" ||
    a1 === "already_issue_options" ||
    a2 === "external_party_asked_valuation_support" ||
    a3 === "yes_outdated" ||
    a3 === "internal_estimates_only" ||
    a4 === "auditor" ||
    a4 === "investor" ||
    a4 === "board" ||
    a6 === "comparing_providers" ||
    // existing ESOP with no formal valuation (or unsure if one exists)
    (a1 === "already_issue_options" &&
      (a3 === "no_formal_valuation" || a3 === "not_sure_valuation")) ||
    // planning soon + external stakeholder pressure
    (a1 === "plan_to_issue_soon" &&
      (a4 === "auditor" || a4 === "investor" || a4 === "board")) ||
    // planning soon + urgent timeline
    (a1 === "plan_to_issue_soon" &&
      (a5 === "immediately" || a5 === "within_1_month"))
  ) {
    return "esop_required";
  }

  // ── esop_likely_needed ──────────────────────────────────────────────────
  if (
    a1 === "plan_to_issue_soon" ||
    a2 === "investor_or_board_expect_esop" ||
    a5 === "immediately" ||
    a5 === "within_1_month" ||
    a5 === "within_3_months" ||
    (a1 === "considering_not_decided" &&
      (a5 === "immediately" || a5 === "within_1_month" || a5 === "within_3_months")) ||
    ((a2 === "retain_key_employees" ||
      a2 === "reward_early_team" ||
      a2 === "reduce_cash_salary_pressure") &&
      (a5 === "immediately" || a5 === "within_1_month" || a5 === "within_3_months"))
  ) {
    return "esop_likely_needed";
  }

  // ── esop_planning ───────────────────────────────────────────────────────
  if (
    a1 === "considering_not_decided" ||
    a1 === "not_sure_esop" ||
    a2 === "retain_key_employees" ||
    a2 === "reward_early_team" ||
    a2 === "reduce_cash_salary_pressure" ||
    a2 === "not_sure_how_esops_work" ||
    a4 === "founder_management" ||
    a4 === "hr_people_team" ||
    a4 === "nobody_planning_ahead"
  ) {
    return "esop_planning";
  }

  // ── esop_no_need (fallback) ─────────────────────────────────────────────
  return "esop_no_need";
}

// ── Business Value component-score routing ───────────────────────────────────
//
// Each question contributes to a specific sub-score.
// B1 is not used in routing (only the direct ID check b1_dont_know matters).
// painScore = max(B2 pain score, B7 pain score).

function b2PainScore(answer: string | undefined): number {
  switch (answer) {
    case "yes_definitely": return 3;
    case "maybe":          return 2;
    case "not_sure_bv":    return 1;
    default:               return 0;
  }
}

function b3AssetSignalScore(answer: string[] | undefined): number {
  if (!Array.isArray(answer)) return 0;
  const scoreMap: Record<string, number> = {
    brand_or_reputation:                        1,
    customer_relationships:                     1,
    repeat_customers_or_recurring_revenue:      2,
    long_term_contracts:                        2,
    software_platform_app_or_internal_technology: 2,
    data_or_customer_database:                  1,
    ip_trademarks_patents_designs_or_knowhow:   2,
    operating_systems_processes_or_playbooks:   1,
    technical_team_or_specialist_knowledge:     1,
    none_of_the_above:                          0,
    not_sure_bv3:                               1,
  };
  const sum = answer.reduce((acc, id) => acc + (scoreMap[id] ?? 0), 0);
  return Math.min(sum, 6);
}

function b4EvidenceScore(answer: string | undefined): number {
  switch (answer) {
    case "yes_clearly":       return 3;
    case "somewhat":          return 2;
    case "not_really":        return 2;
    case "no_evidence":       return 1;
    case "not_sure_evidence": return 1;
    default:                  return 0;
  }
}

function b5ValuationEventScore(answer: string | undefined): number {
  switch (answer) {
    case "fundraising":                          return 3;
    case "selling_the_business":                 return 3;
    case "bringing_investors_or_shareholders":   return 3;
    case "succession_or_restructuring":          return 2;
    case "board_bank_auditor_or_partner_explanation": return 2;
    case "understand_what_business_is_worth":    return 1;
    case "just_curious":                         return 0;
    default:                                     return 0;
  }
}

function b6UrgencyScore(answer: string | undefined): number {
  switch (answer) {
    case "now":                  return 3;
    case "within_3_months_bv":   return 3;
    case "within_6_months_bv":   return 2;
    case "within_12_months":     return 1;
    case "no_clear_timeline_bv": return 0;
    default:                     return 0;
  }
}

function b7PainScore(answer: string | undefined): number {
  switch (answer) {
    case "investors_may_not_understand_true_value":           return 3;
    case "buyers_may_value_us_too_cheaply":                   return 3;
    case "brand_software_data_ip_or_customer_base_not_reflected": return 3;
    case "do_not_know_how_to_prove_business_worth_more":      return 2;
    case "valued_only_on_profit_or_revenue":                  return 2;
    case "not_concerned":                                     return 0;
    default:                                                  return 0;
  }
}

export function calculateBusinessValueResult(
  answers: Record<string, string | string[]>
): ResultKey {
  const b1 = answers["b1"] as string | undefined;
  const b2 = answers["b2"] as string | undefined;
  const b3 = answers["b3"] as string[] | undefined;
  const b4 = answers["b4"] as string | undefined;
  const b5 = answers["b5"] as string | undefined;
  const b6 = answers["b6"] as string | undefined;
  const b7 = answers["b7"] as string | undefined;

  const assetSignalScore    = b3AssetSignalScore(b3);
  const valuationEventScore = b5ValuationEventScore(b5);
  const urgencyScore        = b6UrgencyScore(b6);
  const painScore           = Math.max(b2PainScore(b2), b7PainScore(b7));
  const evidenceScore       = b4EvidenceScore(b4);

  // ── business_value_review ───────────────────────────────────────────────
  if (
    (valuationEventScore >= 2 && assetSignalScore >= 3) ||
    (painScore >= 3 && assetSignalScore >= 3) ||
    (valuationEventScore >= 3 && painScore >= 2) ||
    (urgencyScore >= 3 && assetSignalScore >= 3)
  ) {
    return "business_value_review";
  }

  // ── hidden_value_found ──────────────────────────────────────────────────
  if (
    assetSignalScore >= 3 ||
    (assetSignalScore >= 2 && painScore >= 2) ||
    (assetSignalScore >= 2 && evidenceScore <= 2 && b4 !== "yes_clearly")
  ) {
    return "hidden_value_found";
  }

  // ── early_value_discovery ───────────────────────────────────────────────
  if (
    assetSignalScore === 1 || assetSignalScore === 2 ||
    painScore === 1 || painScore === 2 ||
    valuationEventScore === 1 ||
    b1 === "do_not_know" ||
    (Array.isArray(b3) && b3.includes("not_sure_bv3"))
  ) {
    return "early_value_discovery";
  }

  // ── no_clear_valuation_need (fallback) ──────────────────────────────────
  return "no_clear_valuation_need";
}

// ── Public entry point ───────────────────────────────────────────────────────

export function calculateResultKey(
  track: Track,
  answers: Record<string, string | string[]>
): ResultKey {
  return track === "esop"
    ? calculateEsopResult(answers)
    : calculateBusinessValueResult(answers);
}

// ── Deliverable mapping ──────────────────────────────────────────────────────

export const DELIVERABLE_BY_RESULT: Record<ResultKey, DeliverableKey> = {
  esop_no_need:             "esop_starter_checklist",
  esop_planning:            "esop_valuation_checklist",
  esop_likely_needed:       "esop_valuation_checklist",
  esop_required:            "esop_valuation_document_checklist",
  no_clear_valuation_need:  "hidden_value_checklist",
  early_value_discovery:    "hidden_value_checklist",
  hidden_value_found:       "hidden_value_checklist",
  business_value_review:    "investor_evidence_checklist",
};

export function getDeliverableKey(resultKey: ResultKey): DeliverableKey {
  return DELIVERABLE_BY_RESULT[resultKey];
}
