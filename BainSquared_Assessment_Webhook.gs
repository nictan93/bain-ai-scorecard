/**
 * Bain Squared IA Assessment — Google Apps Script Webhook v3
 *
 * Receives POST requests from the Next.js /api/submit route.
 * No Zapier or third-party middleware required.
 *
 * Flow:
 *   Next.js /api/submit  →  POST (JSON)  →  doPost()
 *     → logToSheet()           — appends row to "Submission Log v3"
 *     → sendUserEmail()        — sends personalised HTML email with PDF attached
 *     → sendInternalAlert()    — HOT leads always; WARM/WARM_LOW if lead_score >= 70
 *
 * ── Google Sheets v3 column order (A–V) ──────────────────────────────────────
 *
 *   A  submitted_at
 *   B  email
 *   C  name
 *   D  company
 *   E  track
 *   F  result_key
 *   G  lead_temperature
 *   H  lead_temperature_ui
 *   I  lead_score
 *   J  report_key
 *   K  report_title
 *   L  esop_sub_track
 *   M  event_group
 *   N  asset_signal_group
 *   O  documentation_group
 *   P  pain_group
 *   Q  tags
 *   R  newsletter_opt_in
 *   S  referral_code
 *   T  answers_json
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const SENDER_EMAIL   = "assessment@bainsquared.com";
const SENDER_NAME    = "Bain Squared Valuation Advisory";
const INTERNAL_EMAIL = "nic.tan@bainsquared.com";
const BOOKING_URL    = "https://cal.com/bain-squared/ia-valuation";

// Google Drive File IDs for each report_key.
// Replace each value with the Drive file ID from the shareable link:
//   https://drive.google.com/file/d/FILE_ID/view
const PDF_FILE_IDS = {
  esop_compliance_governance:          "REPLACE_WITH_DRIVE_FILE_ID",
  esop_structuring_dilution:           "REPLACE_WITH_DRIVE_FILE_ID",
  esop_communication_legal:            "REPLACE_WITH_DRIVE_FILE_ID",
  esop_starter:                        "REPLACE_WITH_DRIVE_FILE_ID",
  iv_fundraising_guide:                "REPLACE_WITH_DRIVE_FILE_ID",
  iv_mna_exit_guide:                   "REPLACE_WITH_DRIVE_FILE_ID",
  iv_intangible_asset_discovery_guide: "REPLACE_WITH_DRIVE_FILE_ID",
  iv_starter_guide:                    "REPLACE_WITH_DRIVE_FILE_ID"
};

const PDF_DISPLAY_TITLES = {
  esop_compliance_governance:          "ESOP Compliance and Governance Guide",
  esop_structuring_dilution:           "ESOP Structuring and Dilution Guide",
  esop_communication_legal:            "ESOP Communication and Legal Guide",
  esop_starter:                        "ESOP Starter Guide",
  iv_fundraising_guide:                "Fundraising Valuation Guide",
  iv_mna_exit_guide:                   "M&A and Exit Valuation Guide",
  iv_intangible_asset_discovery_guide: "Intangible Asset Discovery Guide",
  iv_starter_guide:                    "Intangible Value Starter Guide"
};

// ─── WEBHOOK ENTRY POINT ──────────────────────────────────────────────────────

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    logToSheet(payload);
    sendUserEmail(payload);

    if (shouldNotifySales(payload)) {
      sendInternalAlert(payload);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("doPost error: " + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── SHEET LOGGING (v3 schema) ────────────────────────────────────────────────

function logToSheet(data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Submission Log v3");
  if (!sheet) {
    console.error("Sheet 'Submission Log v3' not found.");
    return;
  }

  sheet.appendRow([
    data.submitted_at         || new Date().toISOString(),  // A  submitted_at
    data.email                || "",                        // B  email
    data.name                 || "",                        // C  name
    data.company              || "",                        // D  company
    data.track                || "",                        // E  track
    data.result_key           || "",                        // F  result_key
    data.lead_temperature     || "",                        // G  lead_temperature
    data.lead_temperature_ui  || "",                        // H  lead_temperature_ui
    data.lead_score           || 0,                         // I  lead_score
    data.report_key           || "",                        // J  report_key
    data.report_title         || "",                        // K  report_title
    data.esop_sub_track       || "",                        // L  esop_sub_track
    data.event_group          || "",                        // M  event_group
    data.asset_signal_group   || "",                        // N  asset_signal_group
    data.documentation_group  || "",                        // O  documentation_group
    data.pain_group           || "",                        // P  pain_group
    (data.tags || []).join(", "),                           // Q  tags
    data.newsletter_opt_in ? "Yes" : "No",                 // R  newsletter_opt_in
    data.referral_code        || "",                        // S  referral_code
    JSON.stringify(data.answers || {})                      // T  answers_json
  ]);
}

// ─── USER EMAIL ───────────────────────────────────────────────────────────────

function sendUserEmail(data) {
  const temp      = data.lead_temperature;
  const report    = data.report_key;
  const pdfTitle  = PDF_DISPLAY_TITLES[report] || "Intangible Value Report";
  const fileId    = PDF_FILE_IDS[report];
  const firstName = getFirstName(data.name);

  const templateKey  = getEmailTemplateKey(temp, report, data.track);
  const subjectLine  = getSubjectLine(templateKey);
  const htmlBody     = buildEmailHtml(templateKey, firstName, pdfTitle, data);

  const options = {
    name:     SENDER_NAME,
    from:     SENDER_EMAIL,
    replyTo:  INTERNAL_EMAIL,
    htmlBody: htmlBody
  };

  // All users receive their PDF. HOT users also get a booking button in the email.
  if (fileId && fileId !== "REPLACE_WITH_DRIVE_FILE_ID") {
    try {
      const file = DriveApp.getFileById(fileId);
      options.attachments = [file.getAs(MimeType.PDF)];
    } catch (err) {
      console.error("Drive fetch failed for " + fileId + ": " + err.toString());
    }
  }

  GmailApp.sendEmail(
    data.email,
    subjectLine,
    "Please view this email in an HTML-compatible email client.",
    options
  );
}

// ─── INTERNAL SALES ALERT ─────────────────────────────────────────────────────

function shouldNotifySales(data) {
  const temp  = data.lead_temperature;
  const score = data.lead_score || 0;
  if (temp === "hot")                                         return true;
  if ((temp === "warm" || temp === "warm_low") && score >= 70) return true;
  return false;
}

function sendInternalAlert(data) {
  const trackLabel  = data.track === "esop" ? "ESOP" : "Intangible Value";
  const tempLabel   = (data.lead_temperature || "").toUpperCase();
  const identifier  = data.company || data.name || data.email;
  const subject     = "[" + tempLabel + " LEAD] " + trackLabel + " — " + identifier;

  const lines = [
    tempLabel + " lead from the IA Assessment.",
    "",
    "Email:             " + (data.email           || "—"),
    "Name:              " + (data.name            || "—"),
    "Company:           " + (data.company         || "—"),
    "Track:             " + (data.track            || "—"),
    "Result key:        " + (data.result_key       || "—"),
    "Lead temperature:  " + (data.lead_temperature || "—"),
    "Lead score:        " + (data.lead_score       || "—"),
    "Report key:        " + (data.report_key       || "—"),
    "Report title:      " + (data.report_title     || "—"),
    "ESOP sub-track:    " + (data.esop_sub_track   || "—"),
    "Event group:       " + (data.event_group      || "—"),
    "Asset signal:      " + (data.asset_signal_group || "—"),
    "Documentation:     " + (data.documentation_group || "—"),
    "Pain group:        " + (data.pain_group       || "—"),
    "Tags:              " + (data.tags || []).join(", "),
    "Referral code:     " + (data.referral_code    || "—"),
    "Submitted:         " + (data.submitted_at     || "—"),
    "",
    "Answers (JSON):",
    JSON.stringify(data.answers || {}, null, 2)
  ];

  GmailApp.sendEmail(
    INTERNAL_EMAIL,
    subject,
    lines.join("\n"),
    { name: "Bain Squared Assessment" }
  );
}

// ─── EMAIL TEMPLATE KEY MAPPING ───────────────────────────────────────────────
//
// Maps (lead_temperature, report_key) → a template key used for subject + body.
// Matches the routing rules in INTANGIBLE_VALUE_EMAIL_COPY_AND_GOOGLE_SCRIPT_RULES.md
// and ESOP_EMAIL_COPY_AND_GOOGLE_SCRIPT_RULES.md.

function getEmailTemplateKey(temp, report, track) {
  if (track === "esop") {
    if (temp === "hot")                               return "esop_hot";
    if (temp === "warm" || temp === "warm_low")       return "esop_warm";
    return "esop_cold";
  }

  // Intangible Value track
  if (temp === "hot" && report === "iv_fundraising_guide")               return "iv_hot_fundraising";
  if (temp === "hot" && report === "iv_mna_exit_guide")                  return "iv_hot_mna_exit";
  if (temp === "hot" && report === "iv_intangible_asset_discovery_guide") return "iv_hot_discovery";
  if ((temp === "warm" || temp === "warm_low") && report === "iv_fundraising_guide")               return "iv_warm_fundraising";
  if ((temp === "warm" || temp === "warm_low") && report === "iv_mna_exit_guide")                  return "iv_warm_mna_exit";
  if ((temp === "warm" || temp === "warm_low") && report === "iv_intangible_asset_discovery_guide") return "iv_warm_discovery";
  if ((temp === "warm" || temp === "warm_low") && report === "iv_starter_guide")                    return "iv_warm_starter";
  return "iv_cold_starter";
}

// ─── SUBJECT LINES ────────────────────────────────────────────────────────────

function getSubjectLine(templateKey) {
  const subjects = {
    esop_hot:             "Your ESOP report is ready",
    esop_warm:            "Your ESOP report from Bain Squared",
    esop_cold:            "Your ESOP guide from Bain Squared",
    iv_hot_fundraising:   "Your Intangible Value report is ready, and your fundraising timeline looks important",
    iv_hot_mna_exit:      "Your Intangible Value report is ready, and your exit timeline looks important",
    iv_hot_discovery:     "Your Intangible Value report is ready, and your stakeholder timeline looks important",
    iv_warm_fundraising:  "Your Fundraising Valuation Guide from Bain Squared",
    iv_warm_mna_exit:     "Your M&A and Exit Valuation Guide from Bain Squared",
    iv_warm_discovery:    "Your Intangible Asset Discovery Guide from Bain Squared",
    iv_warm_starter:      "Your Intangible Value Starter Guide from Bain Squared",
    iv_cold_starter:      "Your Intangible Value Starter Guide from Bain Squared"
  };
  return subjects[templateKey] || "Your Intangible Value report from Bain Squared";
}

// ─── EMAIL HTML BUILDER ───────────────────────────────────────────────────────

function buildEmailHtml(templateKey, firstName, pdfTitle, data) {
  const greeting   = firstName ? "Hello " + firstName + "," : "Hello,";
  const isHot      = templateKey.indexOf("hot") !== -1;
  const assessmentSentence = getAssessmentSentence(data.result_key, data.track);
  const includeOffer       = shouldIncludeOffer(data);

  let body = "";

  // ── ESOP templates ──────────────────────────────────────────────────────────

  if (templateKey === "esop_hot") {
    body = "<p>Thank you for completing the Bain Squared Valuation Assessment.</p>"
         + "<p>Based on your answers, <strong>" + assessmentSentence + "</strong></p>"
         + "<p>I have attached your <em>" + pdfTitle + "</em>. It gives you a clear baseline before you make or explain your next ESOP decision.</p>"
         + "<p>Because your answers point to a near term or governance sensitive issue, I recommend booking a short call so we can understand your timeline, current documents, and what needs to be prepared before your next grant, audit, board discussion, investor review, or employee conversation.</p>"
         + (includeOffer ? buildOfferBlock() : "")
         + buildCtaButton("Book a discovery call", BOOKING_URL);

  } else if (templateKey === "esop_warm") {
    const warmSupportSentence = getEsopWarmSupportSentence(data.esop_sub_track);
    body = "<p>Thank you for completing the Bain Squared Valuation Assessment.</p>"
         + "<p>Based on your answers, <strong>" + assessmentSentence + "</strong></p>"
         + "<p>I have attached your <em>" + pdfTitle + "</em>. It is meant to help you understand the key questions around ESOP structure, valuation, communication, and compliance before your next decision.</p>"
         + "<p>" + warmSupportSentence + "</p>"
         + (includeOffer ? buildOfferBlock() : "");

  } else if (templateKey === "esop_cold") {
    body = "<p>Thank you for completing the Bain Squared Valuation Assessment.</p>"
         + "<p>Based on your answers, <strong>" + assessmentSentence + "</strong></p>"
         + "<p>I have attached your <em>" + pdfTitle + "</em> so you can review the basics at your own pace.</p>"
         + "<p>There does not appear to be an immediate ESOP valuation or advisory need based on your responses, but the report should help you understand what to watch for as your company grows.</p>";

  // ── Intangible Value templates ──────────────────────────────────────────────

  } else if (templateKey === "iv_hot_fundraising") {
    body = "<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>"
         + "<p>Based on your answers, <strong>your fundraising or investor timeline may require a clearer intangible value story.</strong></p>"
         + "<p>I have attached your guide, <em>The " + pdfTitle + "</em>, to help you understand what investors may look for when assessing value beyond standard revenue, profit, asset, or comparable company metrics.</p>"
         + "<p>Because your answers suggest a near-term valuation discussion, we strongly recommend booking a short call. We can help you understand what evidence matters, what may be missing, and how to prepare before the next investor conversation.</p>"
         + buildCtaButton("Book a call", BOOKING_URL);

  } else if (templateKey === "iv_hot_mna_exit") {
    body = "<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>"
         + "<p>Based on your answers, <strong>your exit, succession, or restructuring timeline may require stronger evidence of intangible value.</strong></p>"
         + "<p>I have attached your guide, <em>The " + pdfTitle + "</em>, to help you understand what buyers, shareholders, and stakeholders may look for when assessing the value of your business.</p>"
         + "<p>Because your answers suggest a near-term valuation discussion, we strongly recommend booking a short call. We can help you understand what evidence matters, what may be missing, and how to prepare before the conversation begins.</p>"
         + buildCtaButton("Book a call", BOOKING_URL);

  } else if (templateKey === "iv_hot_discovery") {
    body = "<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>"
         + "<p>Based on your answers, <strong>you may need a clearer evidence story for a board, bank, auditor, partner, investor, or stakeholder discussion.</strong></p>"
         + "<p>I have attached your guide, <em>The " + pdfTitle + "</em>, to help you identify which assets may matter, what evidence supports them, and how to explain intangible value more clearly.</p>"
         + "<p>Because your answers suggest a near-term stakeholder discussion, we strongly recommend booking a short call. We can help you understand what evidence matters, what may be missing, and how to present the value in a structured way.</p>"
         + buildCtaButton("Book a call", BOOKING_URL);

  } else if (templateKey === "iv_warm_fundraising") {
    body = "<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>"
         + "<p>Based on your answers, <strong>it is time to start preparing how your intangible value should be explained before a fundraising or investor discussion.</strong></p>"
         + "<p>I have attached your guide, <em>The " + pdfTitle + "</em>, to help you understand what investors may look for when assessing value beyond standard revenue, profit, asset, or comparable company metrics.</p>"
         + "<p>Use the guide to start identifying which assets are worth documenting, what evidence may matter, and where your valuation story may need to be strengthened before investor pressure begins.</p>";

  } else if (templateKey === "iv_warm_mna_exit") {
    body = "<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>"
         + "<p>Based on your answers, <strong>it is worth starting to document the intangible value that buyers or stakeholders may not see in the accounts.</strong></p>"
         + "<p>I have attached your guide, <em>The " + pdfTitle + "</em>, to help you understand how buyers, shareholders, and stakeholders may think about value beyond standard financial metrics.</p>"
         + "<p>Use the guide to identify which assets may need stronger evidence before a sale, succession, restructuring, or ownership discussion begins.</p>";

  } else if (templateKey === "iv_warm_discovery") {
    body = "<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>"
         + "<p>Based on your answers, <strong>your business may have intangible value signals that are worth mapping more clearly.</strong></p>"
         + "<p>I have attached your guide, <em>The " + pdfTitle + "</em>, to help you identify which assets may matter, what evidence supports them, and how to think about intangible value in a more structured way.</p>"
         + "<p>Use the guide to understand where your intangible assets may sit and what to prepare before a valuation conversation, stakeholder discussion, or internal review.</p>";

  } else if (templateKey === "iv_warm_starter") {
    body = "<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>"
         + "<p>Based on your answers, <strong>you are starting to uncover where intangible value may sit in your business.</strong></p>"
         + "<p>I have attached your guide, <em>The " + pdfTitle + "</em>, to help you understand the difference between standard financial value and the deeper value drivers that can develop as your company grows.</p>"
         + "<p>Keep the guide for future planning. It will help you identify which business assets may be worth tracking and documenting over time.</p>";

  } else {
    // iv_cold_starter (default for cold)
    body = "<p>Thank you for completing the Bain Squared Intangible Value Assessment.</p>"
         + "<p>Based on your answers, <strong>you are in the early stages of intangible value discovery.</strong></p>"
         + "<p>I have attached your guide, <em>The " + pdfTitle + "</em>. Keep this for future planning. It will help you understand the difference between standard financial value and the intangible value that can build as your company grows.</p>"
         + "<p>No immediate action is needed. Use the guide when you want to start identifying which business assets may be worth tracking and documenting over time.</p>";
  }

  const signature = buildSignature();

  return [
    "<!DOCTYPE html>",
    "<html><body>",
    "<div style='font-family: Arial, sans-serif; color: #333333; max-width: 600px; margin: 0 auto; line-height: 1.7; font-size: 15px;'>",
    "<p>" + greeting + "</p>",
    body,
    "<hr style='border: none; border-top: 1px solid #dddddd; margin: 28px 0;'>",
    signature,
    "</div>",
    "</body></html>"
  ].join("\n");
}

// ─── EMAIL CONTENT HELPERS ────────────────────────────────────────────────────

function getFirstName(name) {
  if (!name) return "";
  return name.trim().split(/\s+/)[0] || "";
}

function getAssessmentSentence(resultKey, track) {
  const esopMap = {
    ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT: "your existing ESOP appears to have an immediate valuation and governance gap.",
    ESOP_A2_PROVIDER_REVIEW_HOT:                "your current ESOP valuation process should be reviewed before your next grant, audit, board discussion, or investor review.",
    ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM:   "your current ESOP valuation process is worth benchmarking before your next refresh.",
    ESOP_A0_EXISTING_ESOP_INCOMPLETE_OR_UNCLEAR_HOT: "your existing ESOP appears to have an immediate valuation and governance gap.",
    ESOP_B1_PLANNING_PRESSURE_NEAR_HOT:         "your ESOP plan is entering a near term decision window.",
    ESOP_B2_PLANNING_PRESSURE_FAR_WARM:         "your ESOP plan is worth preparing before the pressure becomes more formal.",
    ESOP_B3_PLANNING_NO_PRESSURE_NEAR_WARM:     "your ESOP planning window is open, even if nobody is forcing the conversation yet.",
    ESOP_B4_PLANNING_NO_PRESSURE_FAR_WARM_LOW:  "your ESOP thinking is still early, but it is worth structuring before informal promises begin.",
    ESOP_C1_NO_ESOP_PRESSURE_NEAR_HOT:          "your ESOP question is becoming time sensitive.",
    ESOP_C2_NO_ESOP_PRESSURE_FAR_WARM:          "your ESOP question is likely to come up soon.",
    ESOP_C3_NO_ESOP_NO_PRESSURE_NEAR_WARM:      "your ESOP decision window is starting to open.",
    ESOP_C4_NO_ESOP_NO_PRESSURE_FAR_COLD:       "your ESOP need is still early.",
    ESOP_U1_UNSURE_PRESSURE_NEAR_HOT:           "your ESOP position needs to be clarified soon.",
    ESOP_U2_UNSURE_PRESSURE_FAR_WARM:           "your ESOP position is worth clarifying before the question becomes formal.",
    ESOP_U3_UNSURE_NO_PRESSURE_NEAR_WARM:       "your ESOP position is worth clarifying before you make a decision.",
    ESOP_U4_UNSURE_NO_PRESSURE_FAR_COLD:        "your ESOP need is still early, but it is useful to understand the basics."
  };
  return esopMap[resultKey] || "your assessment is complete.";
}

function getEsopWarmSupportSentence(esopSubTrack) {
  switch (esopSubTrack) {
    case "existing_esop":
      return "You may not need to change provider today, but a light benchmark before your next renewal can help you understand whether your current process remains competitive on price, quality, speed, and defensibility.";
    case "planning_esop":
      return "Use the report as a preparation checklist before your ESOP becomes a live implementation project.";
    case "no_esop":
      return "Use the report to understand what decisions normally matter before you commit to an ESOP structure or option grant.";
    default:
      return "Use the report to clarify what may already exist, what may only be informal, and what should be checked before you answer any ESOP or equity question formally.";
  }
}

function shouldIncludeOffer(data) {
  return (
    data.esop_sub_track === "existing_esop" &&
    (data.result_key === "ESOP_A2_PROVIDER_REVIEW_HOT" ||
     data.result_key === "ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM")
  );
}

function buildOfferBlock() {
  return [
    "<div style='background:#eaf4ef; border:1px solid #c8ded5; padding:16px; margin:20px 0;'>",
    "  <p style='margin:0 0 8px 0;'><strong>Your company is eligible for a 10% invoice review offer.</strong></p>",
    "  <p style='margin:0;'>Send us your most recent ESOP valuation invoice before your next refresh and we will apply 10% off your next ESOP valuation report with Bain Squared.</p>",
    "</div>"
  ].join("\n");
}

function buildCtaButton(label, url) {
  return [
    "<div style='margin: 28px 0;'>",
    "  <a href='" + url + "'",
    "     style='background:#073f31; color:#ffffff; text-decoration:none; padding:14px 22px;",
    "            border-radius:4px; font-weight:600; display:inline-block; font-size:14px;'>",
    "    " + label,
    "  </a>",
    "</div>"
  ].join("\n");
}

function buildSignature() {
  return [
    "<p>Best regards,</p>",
    "<p><strong>Vanessa</strong><br>",
    "Bain Squared Valuation Advisory<br>",
    "<a href='mailto:" + SENDER_EMAIL + "'>" + SENDER_EMAIL + "</a></p>"
  ].join("\n");
}

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", version: "3", service: "Bain Squared Assessment Webhook" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── TEST FUNCTIONS ───────────────────────────────────────────────────────────
// Run these manually from the Apps Script editor to verify the flow.
// Select the function name from the dropdown, then click Run.

function testEsopHotA1() {
  const mockPayload = {
    submitted_at:       new Date().toISOString(),
    email:              "nic.tan@bainsquared.com",
    name:               "Test User",
    company:            "Test Co Pte Ltd",
    newsletter_opt_in:  false,
    referral_code:      "",
    track:              "esop",
    result_key:         "ESOP_A1_MISSING_OR_UNCERTAIN_VALUATION_HOT",
    lead_temperature:   "hot",
    lead_temperature_ui: "hot",
    lead_score:         82,
    report_key:         "esop_compliance_governance",
    report_title:       "ESOP Compliance and Governance Guide",
    esop_sub_track:     "existing_esop",
    event_group:        "",
    asset_signal_group: "",
    documentation_group: "",
    pain_group:         "",
    tags:               ["esop_hot_lead", "esop_stakeholder_pressure"],
    answers:            { a_esop_status: "yes_existing", a1_formal_valuation: "no" }
  };
  logToSheet(mockPayload);
  sendUserEmail(mockPayload);
  sendInternalAlert(mockPayload);
  Logger.log("testEsopHotA1 complete — check inbox and Submission Log v3 sheet.");
}

function testEsopWarmA3WithOffer() {
  const mockPayload = {
    submitted_at:       new Date().toISOString(),
    email:              "nic.tan@bainsquared.com",
    name:               "Test User",
    company:            "Test Co Pte Ltd",
    newsletter_opt_in:  false,
    referral_code:      "PARTNER01",
    track:              "esop",
    result_key:         "ESOP_A3_EXISTING_PROVIDER_SATISFIED_WARM",
    lead_temperature:   "warm",
    lead_temperature_ui: "warm",
    lead_score:         55,
    report_key:         "esop_compliance_governance",
    report_title:       "ESOP Compliance and Governance Guide",
    esop_sub_track:     "existing_esop",
    event_group:        "",
    asset_signal_group: "",
    documentation_group: "",
    pain_group:         "",
    tags:               ["esop_needs_report"],
    answers:            { a_esop_status: "yes_existing", a1_formal_valuation: "yes", a2_satisfaction: "satisfied" }
  };
  logToSheet(mockPayload);
  sendUserEmail(mockPayload);
  Logger.log("testEsopWarmA3WithOffer complete — should include 10% offer block, no booking button.");
}

function testIvHotFundraising() {
  const mockPayload = {
    submitted_at:       new Date().toISOString(),
    email:              "nic.tan@bainsquared.com",
    name:               "Test User",
    company:            "Test Co Pte Ltd",
    newsletter_opt_in:  false,
    referral_code:      "",
    track:              "intangible_value",
    result_key:         "IV_CAPITAL_NEAR_VALUE_GAP_HOT",
    lead_temperature:   "hot",
    lead_temperature_ui: "hot",
    lead_score:         88,
    report_key:         "iv_fundraising_guide",
    report_title:       "Fundraising Valuation Guide",
    esop_sub_track:     "",
    event_group:        "capital_event",
    asset_signal_group: "strong_asset_signal",
    documentation_group: "weak_or_missing_evidence",
    pain_group:         "strong_pain",
    tags:               ["fundraising_valuation_lead"],
    answers:            { b5: "raising_funds", b6: "now" }
  };
  logToSheet(mockPayload);
  sendUserEmail(mockPayload);
  sendInternalAlert(mockPayload);
  Logger.log("testIvHotFundraising complete — should include booking button.");
}

function testIvColdStarter() {
  const mockPayload = {
    submitted_at:       new Date().toISOString(),
    email:              "nic.tan@bainsquared.com",
    name:               "Test User",
    company:            "Test Co Pte Ltd",
    newsletter_opt_in:  false,
    referral_code:      "",
    track:              "intangible_value",
    result_key:         "IV_CURIOSITY_WEAK_SIGNAL_COLD",
    lead_temperature:   "cold",
    lead_temperature_ui: "cold",
    lead_score:         12,
    report_key:         "iv_starter_guide",
    report_title:       "Intangible Value Starter Guide",
    esop_sub_track:     "",
    event_group:        "curiosity",
    asset_signal_group: "weak_or_uncertain_asset_signal",
    documentation_group: "weak_or_missing_evidence",
    pain_group:         "low_or_no_pain",
    tags:               [],
    answers:            { b5: "just_curious", b6: "no_clear_timeline" }
  };
  logToSheet(mockPayload);
  sendUserEmail(mockPayload);
  Logger.log("testIvColdStarter complete — should NOT include booking button.");
}
