import { MAX_SCORE, type Track, type ResultKey, type ReportKey, type DeliverableKey } from "@/content/questions";

// ── Lead temperature type ─────────────────────────────────────────────────

export type LeadTemperature = "hot" | "warm" | "warm_low" | "cold";
export type LeadTemperatureUi = "hot" | "warm" | "cold";

// ── ESOP sub-track ────────────────────────────────────────────────────────

export type EsopSubTrack = "existing_esop" | "planning_esop" | "no_esop" | "unsure_esop";

export type EventGroup =
  | "capital_event"
  | "exit_event"
  | "stakeholder_event"
  | "strategic_review"
  | "curiosity";

export type AssetSignalGroup =
  | "strong_asset_signal"
  | "moderate_asset_signal"
  | "weak_or_uncertain_asset_signal";

export type DocumentationGroup =
  | "strong_evidence"
  | "partial_evidence"
  | "weak_or_missing_evidence";

export type PainGroup =
  | "strong_pain"
  | "moderate_pain"
  | "low_or_no_pain";

export interface FullResult {
  resultKey: ResultKey;
  leadTemperature: LeadTemperature;
  leadTemperatureUi: LeadTemperatureUi;
  leadScore: number;
  reportKey: ReportKey;
  // ESOP-specific
  esopSubTrack?: EsopSubTrack;
  // IV-specific
  eventGroup?: EventGroup;
  assetSignalGroup?: AssetSignalGroup;
  documentationGroup?: DocumentationGroup;
  painGroup?: PainGroup;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function toUiTemp(t: LeadTemperature): LeadTemperatureUi {
  return t === "warm_low" ? "warm" : t;
}

// ══════════════════════════════════════════════════════════════════════════
// ESOP CLASSIFICATION
// ══════════════════════════════════════════════════════════════════════════

function getEsopSubTrack(answers: Record<string, string | string[]>): EsopSubTrack {
  switch (answers["a_esop_status"]) {
    case "yes_existing": return "existing_esop";
    case "planning":     return "planning_esop";
    case "no":           return "no_esop";
    case "not_sure":     return "unsure_esop";
    default:             return "unsure_esop";
  }
}

function classifyExistingEsop(
  answers: Record<string, string | string[]>
): { leadTemperature: LeadTemperature; resultCode: ResultKey } {
  const fv = answers["a1_formal_valuation"] as string | undefined;
  const sat = answers["a2_satisfaction"] as string | undefined;

  if (fv === "no" || fv === "not_sure") {
    return { leadTemperature: "hot", resultCode: "ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT" };
  }
  if (fv === "yes" && (sat === "not_satisfied" || sat === "not_sure")) {
    return { leadTemperature: "hot", resultCode: "ESOP_A2_PROVIDER_REVIEW_HOT" };
  }
  if (fv === "yes" && sat === "satisfied") {
    return { leadTemperature: "warm", resultCode: "ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM" };
  }
  // Fallback: existing ESOP with incomplete answers → treat as hot
  return { leadTemperature: "hot", resultCode: "ESOP_A0_EXISTING_ESOP_INCOMPLETE_OR_UNCLEAR_HOT" };
}

function classifyBcuBranch(
  answers: Record<string, string | string[]>,
  branch: "B" | "C" | "U"
): { leadTemperature: LeadTemperature; resultCode: ResultKey } {
  const asking = answers["bc1_asking"] as string | undefined;
  const timing = answers["bc3_timing"] as string | undefined;

  const pressureExists = asking === "yes_actively" || asking === "expected_soon";
  const nearTerm = timing === "within_1_month" || timing === "within_1_to_3_months";

  if (branch === "B") {
    if (pressureExists && nearTerm)  return { leadTemperature: "hot",      resultCode: "ESOP_B1_PLANNING_PRESSURE_NEAR_HOT" };
    if (pressureExists && !nearTerm) return { leadTemperature: "warm",     resultCode: "ESOP_B2_PLANNING_PRESSURE_FAR_WARM" };
    if (!pressureExists && nearTerm) return { leadTemperature: "warm",     resultCode: "ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM" };
    return                                  { leadTemperature: "warm_low", resultCode: "ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW" };
  }
  if (branch === "C") {
    if (pressureExists && nearTerm)  return { leadTemperature: "hot",  resultCode: "ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT" };
    if (pressureExists && !nearTerm) return { leadTemperature: "warm", resultCode: "ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM" };
    if (!pressureExists && nearTerm) return { leadTemperature: "warm", resultCode: "ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM" };
    return                                  { leadTemperature: "cold", resultCode: "ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD" };
  }
  // Branch U (unsure — same rules as C but U result codes)
  if (pressureExists && nearTerm)  return { leadTemperature: "hot",  resultCode: "ESOP_U1_UNSURE_PRESSURE_NEAR_HOT" };
  if (pressureExists && !nearTerm) return { leadTemperature: "warm", resultCode: "ESOP_U2_UNSURE_PRESSURE_FAR_WARM" };
  if (!pressureExists && nearTerm) return { leadTemperature: "warm", resultCode: "ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM" };
  return                                  { leadTemperature: "cold", resultCode: "ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD" };
}

function calculateEsopLeadScore(
  leadTemperature: LeadTemperature,
  esopSubTrack: EsopSubTrack,
  answers: Record<string, string | string[]>
): number {
  const base: Record<LeadTemperature, number> = { hot: 70, warm: 40, warm_low: 30, cold: 10 };
  let score = base[leadTemperature];

  // Stage modifier (same field used for both ESOP and IV context)
  const stage = answers["a_context_stage"] as string | undefined;
  if (stage === "bootstrapped_seed")   score += 5;
  else if (stage === "series_a_b")     score += 10;
  else if (stage === "growth_scaleup") score += 15;
  else if (stage === "mature_profitable_sme") score += 10;

  // Employee modifier
  const employees = answers["a_context_headcount"] as string | undefined;
  if (employees === "1_10")          score += 2;
  else if (employees === "11_50")    score += 8;
  else if (employees === "51_200")   score += 15;
  else if (employees === "more_than_200") score += 20;

  if (esopSubTrack === "existing_esop") {
    // Branch A timing modifier
    const timing = answers["a4_timing"] as string | undefined;
    if (timing === "within_1_month")       score += 15;
    else if (timing === "within_1_to_3_months") score += 10;
    else if (timing === "more_than_3_months")    score += 3;

    // Provider dissatisfaction modifier
    const dissReason = answers["a3_dissatisfied_reason"] as string | undefined;
    if (dissReason === "weak_report_quality" || dissReason === "hard_to_explain" || dissReason === "provider_not_esop_specialist") score += 10;
    else if (dissReason === "slow_or_painful_process") score += 8;
    else if (dissReason === "price_too_high" || dissReason === "other") score += 5;

    // Price sensitivity modifier
    const priceSensitivity = answers["a3_price_factor"] as string | undefined;
    if (priceSensitivity === "price_matters") score += 3;
    else if (priceSensitivity === "maybe_if_quality_strong") score += 5;

  } else {
    // Branch B/C/U: pressure + timing modifiers
    const asking = answers["bc1_asking"] as string | undefined;
    if (asking === "yes_actively")  score += 15;
    else if (asking === "expected_soon") score += 8;

    const timing = answers["bc3_timing"] as string | undefined;
    if (timing === "within_1_month")       score += 15;
    else if (timing === "within_1_to_3_months") score += 10;
    else if (timing === "more_than_3_months")    score += 3;
  }

  return Math.min(100, score);
}

export function calculateEsopResult(
  answers: Record<string, string | string[]>
): FullResult {
  const esopSubTrack = getEsopSubTrack(answers);

  let classification: { leadTemperature: LeadTemperature; resultCode: ResultKey };
  if (esopSubTrack === "existing_esop") {
    classification = classifyExistingEsop(answers);
  } else if (esopSubTrack === "planning_esop") {
    classification = classifyBcuBranch(answers, "B");
  } else if (esopSubTrack === "no_esop") {
    classification = classifyBcuBranch(answers, "C");
  } else {
    classification = classifyBcuBranch(answers, "U");
  }

  const { leadTemperature, resultCode } = classification;
  const reportKey = getEsopReportKey(esopSubTrack, answers);
  const leadScore = calculateEsopLeadScore(leadTemperature, esopSubTrack, answers);

  return {
    resultKey: resultCode,
    leadTemperature,
    leadTemperatureUi: toUiTemp(leadTemperature),
    leadScore,
    reportKey,
    esopSubTrack,
  };
}

function getEsopReportKey(
  esopSubTrack: EsopSubTrack,
  answers: Record<string, string | string[]>
): ReportKey {
  if (esopSubTrack === "existing_esop") return "esop_compliance_governance";

  const concern = answers["bc2_concern"] as string | undefined;
  if (concern === "allocation" || concern === "valuation" || concern === "dilution") {
    return "esop_structuring_dilution";
  }
  if (concern === "legal_tax_compliance" || concern === "employee_communication") {
    return "esop_communication_legal";
  }
  return "esop_starter";
}

// ══════════════════════════════════════════════════════════════════════════
// INTANGIBLE VALUE CLASSIFICATION
// ══════════════════════════════════════════════════════════════════════════

const IV_ANCHOR_ASSETS = new Set([
  "recurring_revenue",
  "long_term_contracts",
  "software_platform_internal_tech",
  "data_customer_database",
  "ip_trademarks_patents_designs_knowhow",
]);

const IV_SUPPORTING_ASSETS = new Set([
  "brand_reputation",
  "customer_relationships",
  "operating_systems_processes_playbooks",
  "technical_team_specialist_knowledge",
]);

export function deriveAssetSignalGroup(
  selectedAssets: string[] | undefined
): AssetSignalGroup {
  if (!Array.isArray(selectedAssets) || selectedAssets.length === 0) {
    return "weak_or_uncertain_asset_signal";
  }

  // If only exclusive non-asset options are selected
  const realAssets = selectedAssets.filter(
    (a) => a !== "none_of_the_above" && a !== "not_sure"
  );

  if (realAssets.length === 0) return "weak_or_uncertain_asset_signal";

  if (realAssets.some((a) => IV_ANCHOR_ASSETS.has(a))) {
    return "strong_asset_signal";
  }

  const supportingCount = realAssets.filter((a) => IV_SUPPORTING_ASSETS.has(a)).length;
  if (supportingCount >= 3) return "strong_asset_signal";
  if (supportingCount >= 1) return "moderate_asset_signal";

  return "weak_or_uncertain_asset_signal";
}

export function deriveDocumentationGroup(q4: string | undefined): DocumentationGroup {
  switch (q4) {
    case "yes_clearly": return "strong_evidence";
    case "somewhat":    return "partial_evidence";
    default:            return "weak_or_missing_evidence";
  }
}

export function derivePainGroup(
  q2ValueGapBelief: string | undefined,
  q7PrimaryConcern: string | undefined
): PainGroup {
  const strongConcerns = new Set([
    "investors_misunderstand",
    "buyers_value_too_cheaply",
    "assets_not_reflected",
    "cannot_prove_value",
    "valued_only_on_profit_or_revenue",
  ]);

  if (q2ValueGapBelief === "yes_definitely" || strongConcerns.has(q7PrimaryConcern ?? "")) {
    return "strong_pain";
  }
  if (q2ValueGapBelief === "maybe" || q2ValueGapBelief === "not_sure") {
    return "moderate_pain";
  }
  return "low_or_no_pain";
}

export function deriveEventGroup(q5Reason: string | undefined): EventGroup {
  switch (q5Reason) {
    case "raising_funds":
    case "bringing_investors_shareholders":
      return "capital_event";
    case "may_sell_company":
    case "succession_restructuring":
      return "exit_event";
    case "board_bank_auditor_partners":
      return "stakeholder_event";
    case "understand_true_worth":
      return "strategic_review";
    default:
      return "curiosity";
  }
}

function hasStrongValueGap(
  assetSignalGroup: AssetSignalGroup,
  documentationGroup: DocumentationGroup,
  painGroup: PainGroup
): boolean {
  return (
    assetSignalGroup === "strong_asset_signal" ||
    painGroup === "strong_pain" ||
    (documentationGroup === "weak_or_missing_evidence" &&
      assetSignalGroup !== "weak_or_uncertain_asset_signal")
  );
}

function hasModerateValueGap(
  assetSignalGroup: AssetSignalGroup,
  documentationGroup: DocumentationGroup,
  painGroup: PainGroup
): boolean {
  return (
    assetSignalGroup === "moderate_asset_signal" ||
    painGroup === "moderate_pain" ||
    documentationGroup === "partial_evidence" ||
    documentationGroup === "weak_or_missing_evidence"
  );
}

function classifyIntangibleValue(params: {
  eventGroup: EventGroup;
  timing: string | undefined;
  strongValueGap: boolean;
  moderateValueGap: boolean;
}): { leadTemperature: LeadTemperature; resultCode: ResultKey } {
  const { eventGroup, timing, strongValueGap, moderateValueGap } = params;
  const nearTerm = timing === "now" || timing === "within_3_months";
  const planned   = timing === "within_6_months" || timing === "within_12_months";
  const noTimeline = timing === "no_clear_timeline";

  if (eventGroup === "capital_event") {
    if (nearTerm && strongValueGap)  return { leadTemperature: "hot",      resultCode: "IV_CAPITAL_NEAR_VALUE_GAP_HOT" };
    if (nearTerm)                    return { leadTemperature: "warm",     resultCode: "IV_CAPITAL_NEAR_WEAK_SIGNAL_WARM" };
    if (planned)                     return { leadTemperature: "warm",     resultCode: "IV_CAPITAL_PLANNED_WARM" };
    if (noTimeline && strongValueGap)return { leadTemperature: "warm",     resultCode: "IV_CAPITAL_NO_TIMELINE_VALUE_GAP_WARM" };
    return                                  { leadTemperature: "warm_low", resultCode: "IV_CAPITAL_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW" };
  }

  if (eventGroup === "exit_event") {
    if (nearTerm && strongValueGap)  return { leadTemperature: "hot",      resultCode: "IV_EXIT_NEAR_VALUE_GAP_HOT" };
    if (nearTerm)                    return { leadTemperature: "warm",     resultCode: "IV_EXIT_NEAR_WEAK_SIGNAL_WARM" };
    if (planned)                     return { leadTemperature: "warm",     resultCode: "IV_EXIT_PLANNED_WARM" };
    if (noTimeline && strongValueGap)return { leadTemperature: "warm",     resultCode: "IV_EXIT_NO_TIMELINE_VALUE_GAP_WARM" };
    return                                  { leadTemperature: "warm_low", resultCode: "IV_EXIT_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW" };
  }

  if (eventGroup === "stakeholder_event") {
    if (nearTerm && strongValueGap)   return { leadTemperature: "hot",      resultCode: "IV_STAKEHOLDER_NEAR_VALUE_GAP_HOT" };
    if (nearTerm)                     return { leadTemperature: "warm",     resultCode: "IV_STAKEHOLDER_NEAR_WEAK_SIGNAL_WARM" };
    if (planned && strongValueGap)    return { leadTemperature: "warm",     resultCode: "IV_STAKEHOLDER_PLANNED_VALUE_GAP_WARM" };
    if (planned)                      return { leadTemperature: "warm_low", resultCode: "IV_STAKEHOLDER_PLANNED_WEAK_SIGNAL_WARM_LOW" };
    if (noTimeline && strongValueGap) return { leadTemperature: "warm",     resultCode: "IV_STAKEHOLDER_NO_TIMELINE_VALUE_GAP_WARM" };
    return                                   { leadTemperature: "warm_low", resultCode: "IV_STAKEHOLDER_NO_TIMELINE_WEAK_SIGNAL_WARM_LOW" };
  }

  if (eventGroup === "strategic_review") {
    if (nearTerm && strongValueGap)   return { leadTemperature: "warm",     resultCode: "IV_STRATEGIC_NEAR_VALUE_GAP_WARM" };
    if (nearTerm)                     return { leadTemperature: "warm_low", resultCode: "IV_STRATEGIC_NEAR_WEAK_SIGNAL_WARM_LOW" };
    if (planned && (strongValueGap || moderateValueGap)) {
      return                                 { leadTemperature: "warm",     resultCode: "IV_STRATEGIC_PLANNED_VALUE_REVIEW_WARM" };
    }
    if (strongValueGap)               return { leadTemperature: "warm_low", resultCode: "IV_STRATEGIC_NO_TIMELINE_VALUE_GAP_WARM_LOW" };
    if (moderateValueGap)             return { leadTemperature: "warm_low", resultCode: "IV_STRATEGIC_MODERATE_SIGNAL_WARM_LOW" };
    return                                   { leadTemperature: "cold",     resultCode: "IV_STRATEGIC_WEAK_SIGNAL_COLD" };
  }

  // curiosity
  if (strongValueGap)               return { leadTemperature: "warm_low", resultCode: "IV_CURIOSITY_VALUE_SIGNAL_WARM_LOW" };
  if (nearTerm && moderateValueGap) return { leadTemperature: "warm_low", resultCode: "IV_CURIOSITY_NEAR_MODERATE_SIGNAL_WARM_LOW" };
  return                                   { leadTemperature: "cold",     resultCode: "IV_CURIOSITY_WEAK_SIGNAL_COLD" };
}

function getIvReportKey(
  answers: Record<string, string | string[]>,
  assetSignalGroup: AssetSignalGroup,
  painGroup: PainGroup
): ReportKey {
  const q5 = answers["b5"] as string | undefined;

  switch (q5) {
    case "raising_funds":
    case "bringing_investors_shareholders":
      return "iv_fundraising_guide";
    case "may_sell_company":
    case "succession_restructuring":
      return "iv_mna_exit_guide";
    case "board_bank_auditor_partners":
      return "iv_intangible_asset_discovery_guide";
    case "understand_true_worth":
      if (
        assetSignalGroup === "strong_asset_signal" ||
        assetSignalGroup === "moderate_asset_signal" ||
        painGroup === "strong_pain"
      ) {
        return "iv_intangible_asset_discovery_guide";
      }
      return "iv_starter_guide";
    default:
      // just_curious or fallback
      if (assetSignalGroup === "strong_asset_signal" || painGroup === "strong_pain") {
        return "iv_intangible_asset_discovery_guide";
      }
      return "iv_starter_guide";
  }
}

function calculateIvLeadScore(
  leadTemperature: LeadTemperature,
  eventGroup: EventGroup,
  assetSignalGroup: AssetSignalGroup,
  documentationGroup: DocumentationGroup,
  painGroup: PainGroup,
  answers: Record<string, string | string[]>
): number {
  const base: Record<LeadTemperature, number> = { hot: 70, warm: 40, warm_low: 30, cold: 10 };
  let score = base[leadTemperature];

  // Stage modifier
  const stage = answers["b_context_stage"] as string | undefined;
  if (stage === "bootstrapped_seed")        score += 5;
  else if (stage === "series_a_b")          score += 10;
  else if (stage === "growth_scaleup")      score += 15;
  else if (stage === "mature_profitable_sme") score += 10;

  // Employee modifier
  const employees = answers["b_context_headcount"] as string | undefined;
  if (employees === "1_10")               score += 2;
  else if (employees === "11_50")         score += 8;
  else if (employees === "51_200")        score += 15;
  else if (employees === "more_than_200") score += 20;

  // Timing modifier
  const timing = answers["b6"] as string | undefined;
  if (timing === "now")                  score += 15;
  else if (timing === "within_3_months") score += 10;
  else if (timing === "within_6_months") score += 6;
  else if (timing === "within_12_months") score += 3;

  // Event modifier
  if (eventGroup === "capital_event" || eventGroup === "exit_event") score += 15;
  else if (eventGroup === "stakeholder_event") score += 10;
  else if (eventGroup === "strategic_review")  score += 5;

  // Asset signal modifier
  if (assetSignalGroup === "strong_asset_signal")   score += 15;
  else if (assetSignalGroup === "moderate_asset_signal") score += 7;

  // Documentation modifier
  if (documentationGroup === "partial_evidence")       score += 4;
  else if (documentationGroup === "weak_or_missing_evidence") score += 8;

  // Pain modifier
  if (painGroup === "strong_pain")   score += 10;
  else if (painGroup === "moderate_pain") score += 5;

  // Valuation method modifier
  const valMethod = answers["b1"] as string | undefined;
  if (valMethod === "profit_multiple" || valMethod === "revenue_multiple") score += 3;
  else if (valMethod === "asset_value")          score += 4;
  else if (valMethod === "comparable_companies") score += 2;
  else if (valMethod === "investor_negotiation" || valMethod === "do_not_know") score += 5;

  return Math.min(100, score);
}

export function calculateIvResult(
  answers: Record<string, string | string[]>
): FullResult {
  const selectedAssets = answers["b3"] as string[] | undefined;
  const assetSignalGroup = deriveAssetSignalGroup(selectedAssets);
  const documentationGroup = deriveDocumentationGroup(answers["b4"] as string | undefined);
  const painGroup = derivePainGroup(
    answers["b2"] as string | undefined,
    answers["b7"] as string | undefined
  );
  const eventGroup = deriveEventGroup(answers["b5"] as string | undefined);

  const strongVG = hasStrongValueGap(assetSignalGroup, documentationGroup, painGroup);
  const moderateVG = hasModerateValueGap(assetSignalGroup, documentationGroup, painGroup);

  const { leadTemperature, resultCode } = classifyIntangibleValue({
    eventGroup,
    timing: answers["b6"] as string | undefined,
    strongValueGap: strongVG,
    moderateValueGap: moderateVG,
  });

  const reportKey = getIvReportKey(answers, assetSignalGroup, painGroup);
  const leadScore = calculateIvLeadScore(
    leadTemperature,
    eventGroup,
    assetSignalGroup,
    documentationGroup,
    painGroup,
    answers
  );

  return {
    resultKey: resultCode,
    leadTemperature,
    leadTemperatureUi: toUiTemp(leadTemperature),
    leadScore,
    reportKey,
    eventGroup,
    assetSignalGroup,
    documentationGroup,
    painGroup,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// PUBLIC ENTRY POINTS
// ══════════════════════════════════════════════════════════════════════════

export function calculateFullResult(
  track: Track,
  answers: Record<string, string | string[]>
): FullResult {
  return track === "esop"
    ? calculateEsopResult(answers)
    : calculateIvResult(answers);
}

// Backward-compat thin wrappers
export function calculateResultKey(
  track: Track,
  answers: Record<string, string | string[]>
): ResultKey {
  return calculateFullResult(track, answers).resultKey;
}

export function getReportKey(
  track: Track,
  answers: Record<string, string | string[]>
): ReportKey {
  return calculateFullResult(track, answers).reportKey;
}

export function getDeliverableKey(
  _resultKey: ResultKey,
  answers: Record<string, string | string[]> = {},
  track: Track = "esop"
): DeliverableKey {
  return getReportKey(track, answers);
}

// ── Legacy score helpers (kept for analytics / CRM, not for classification) ─

export function calculateScore(
  track: Track,
  answers: Record<string, string | string[]>
): number {
  return calculateFullResult(track, answers).leadScore;
}

export function getMaxScore(track: Track): number {
  return MAX_SCORE[track];
}

export function scoreAsPercent(score: number, track: Track): number {
  const max = getMaxScore(track);
  if (max === 0) return 0;
  return Math.round((score / max) * 100);
}
