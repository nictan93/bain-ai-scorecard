import { QUESTIONS, MAX_SCORE, type Track, type ResultKey, type DeliverableKey } from "@/content/questions";

// ── Aggregate score (kept for analytics/CRM; never shown to user) ─────────

export function calculateScore(
  track: Track,
  answers: Record<string, string | string[]>
): number {
  const trackQuestions = QUESTIONS.filter(
    (q) => q.track === track || q.track === "universal"
  );
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

// ── ESOP decision tree result ─────────────────────────────────────────────
//
// The result is determined by the explicit decision tree logic, not by score.
//
// Branch A (already has ESOP):
//   - No formal valuation (or not sure)          → esop_hot_compliance
//   - Formal valuation + dissatisfied            → esop_hot_dissatisfied
//   - Formal valuation + satisfied               → esop_warm_satisfied
//
// Branch B/C (planning or no ESOP):
//   - Someone asking + near-term (≤3 months)     → esop_hot_active_ask
//   - Someone asking + far-term (>3 months)      → esop_warm_active_ask
//   - Nobody asking + near-term (≤3 months)      → esop_warm_near_term
//   - Nobody asking + far-term (>3 months)       → esop_cold

export function calculateEsopResult(
  answers: Record<string, string | string[]>
): ResultKey {
  const esopStatus = answers["a_esop_status"] as string | undefined;
  const formalValuation = answers["a1_formal_valuation"] as string | undefined;
  const satisfaction = answers["a2_satisfaction"] as string | undefined;
  const asking = answers["bc1_asking"] as string | undefined;
  const timing = answers["bc3_timing"] as string | undefined;

  const hasExisting = esopStatus === "esop_yes_have_one";

  // ── Branch A ─────────────────────────────────────────────────────────────
  if (hasExisting) {
    // No formal valuation or unsure → immediate compliance gap
    if (formalValuation === "a1_no" || formalValuation === "a1_not_sure") {
      return "esop_hot_compliance";
    }
    // Formal valuation done — check satisfaction
    if (satisfaction === "a2_no_dissatisfied" || satisfaction === "a2_not_sure") {
      return "esop_hot_dissatisfied";
    }
    // Satisfied (regardless of price sensitivity or timing)
    return "esop_warm_satisfied";
  }

  // ── Branch B/C ────────────────────────────────────────────────────────────
  const someoneAsking =
    asking === "bc1_yes_asking" || asking === "bc1_may_come_up";
  const nearTerm =
    timing === "bc3_within_1_month" || timing === "bc3_within_3_months";

  if (someoneAsking && nearTerm) return "esop_hot_active_ask";
  if (someoneAsking && !nearTerm) return "esop_warm_active_ask";
  if (!someoneAsking && nearTerm) return "esop_warm_near_term";
  return "esop_cold";
}

// ── Business Value result ─────────────────────────────────────────────────
//
// HOT:  Strong event trigger (fundraising/selling/investors) + near-term urgency
//       + (strong pain OR strong asset signal)
// WARM_TRANSACTION: Strong event trigger + far-term OR near-term but weak signals
// WARM_ASSETS: No strong event trigger + strong asset signal + strong pain
// COLD: No strong event trigger + no near-term urgency + weak signals

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

export function calculateBusinessValueResult(
  answers: Record<string, string | string[]>
): ResultKey {
  const b2 = answers["b2"] as string | undefined;
  const b3 = answers["b3"] as string[] | undefined;
  const b5 = answers["b5"] as string | undefined;
  const b6 = answers["b6"] as string | undefined;
  const b7 = answers["b7"] as string | undefined;

  const assetSignalScore = b3AssetSignalScore(b3);

  const strongEvent =
    b5 === "fundraising" ||
    b5 === "selling_the_business" ||
    b5 === "bringing_investors_or_shareholders";

  const nearTerm =
    b6 === "now" || b6 === "within_3_months_bv";

  const strongPain =
    b2 === "yes_definitely" ||
    b7 === "investors_may_not_understand_true_value" ||
    b7 === "buyers_may_value_us_too_cheaply" ||
    b7 === "brand_software_data_ip_or_customer_base_not_reflected";

  const strongAssets = assetSignalScore >= 3;

  // HOT: transaction happening soon with evidence of hidden value
  if (strongEvent && nearTerm && (strongPain || strongAssets)) {
    return "bv_hot";
  }

  // WARM_TRANSACTION: transaction planned but not urgent, or near-term but weak signals
  if (strongEvent) {
    return "bv_warm_transaction";
  }

  // WARM_ASSETS: no transaction but strong assets + strong pain
  if (strongAssets && strongPain) {
    return "bv_warm_assets";
  }

  // COLD: just exploring, no transaction, weak signals
  return "bv_cold";
}

// ── Public entry point ────────────────────────────────────────────────────

export function calculateResultKey(
  track: Track,
  answers: Record<string, string | string[]>
): ResultKey {
  return track === "esop"
    ? calculateEsopResult(answers)
    : calculateBusinessValueResult(answers);
}

// ── Deliverable mapping ───────────────────────────────────────────────────
//
// ESOP deliverable is determined by branch + concern answer, not just result.
// Branch A always gets compliance guide.
// Branch B/C deliverable is based on bc2_concern answer.

export function getDeliverableKey(
  resultKey: ResultKey,
  answers: Record<string, string | string[]> = {}
): DeliverableKey {
  // ESOP track
  if (
    resultKey === "esop_hot_compliance" ||
    resultKey === "esop_hot_dissatisfied" ||
    resultKey === "esop_warm_satisfied"
  ) {
    return "esop_compliance_guide";
  }

  if (
    resultKey === "esop_hot_active_ask" ||
    resultKey === "esop_warm_active_ask" ||
    resultKey === "esop_warm_near_term" ||
    resultKey === "esop_cold"
  ) {
    const concern = answers["bc2_concern"] as string | undefined;
    if (concern === "bc2_legal_tax" || concern === "bc2_communication") {
      return "esop_communication_guide";
    }
    if (
      concern === "bc2_allocation" ||
      concern === "bc2_valuation" ||
      concern === "bc2_dilution"
    ) {
      return "esop_structuring_guide";
    }
    return "esop_starter_guide";
  }

  // Business Value track
  const b5 = answers["b5"] as string | undefined;

  if (b5 === "fundraising" || b5 === "bringing_investors_or_shareholders") {
    return "bv_fundraising_guide";
  }
  if (b5 === "selling_the_business" || b5 === "succession_or_restructuring") {
    return "bv_mna_guide";
  }
  if (
    b5 === "board_bank_auditor_or_partner_explanation" ||
    b5 === "understand_what_business_is_worth"
  ) {
    return "bv_intangibles_guide";
  }
  return "bv_starter_guide";
}
