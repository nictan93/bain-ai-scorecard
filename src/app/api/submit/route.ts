import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateFullResult } from "@/lib/scoring";
import { REPORT_TITLES } from "@/content/outcomes";

const SubmissionSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
  newsletterOptIn: z.boolean().optional(),
  track: z.enum(["esop", "intangible_value"]),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  tags: z.array(z.string()).optional(),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const data = SubmissionSchema.parse(body);

    // Always recompute classification server-side from answers
    const fullResult = calculateFullResult(data.track, data.answers ?? {});

    const webhookPayload = {
      submitted_at: new Date().toISOString(),

      // Contact
      email: data.email,
      name: data.name ?? "",
      company: data.company ?? "",
      newsletter_opt_in: data.newsletterOptIn ?? false,
      referral_code: data.referralCode ?? "",

      // Classification
      track: data.track,
      result_key: fullResult.resultKey,
      lead_temperature: fullResult.leadTemperature,
      lead_temperature_ui: fullResult.leadTemperatureUi,
      lead_score: fullResult.leadScore,
      report_key: fullResult.reportKey,
      report_title: REPORT_TITLES[fullResult.reportKey],

      // ESOP-specific
      esop_sub_track: fullResult.esopSubTrack ?? "",

      // IV-specific
      event_group: fullResult.eventGroup ?? "",
      asset_signal_group: fullResult.assetSignalGroup ?? "",
      documentation_group: fullResult.documentationGroup ?? "",
      pain_group: fullResult.painGroup ?? "",

      // Tags and answers
      tags: data.tags ?? [],
      answers: data.answers ?? {},
    };

    // Fire Google Apps Script webhook (non-blocking best-effort)
    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
          // GAS executes doPost before the 302 redirect. Do not follow redirects
          // — following them converts POST to GET which returns 405.
          redirect: "manual",
        });
      } catch (webhookErr) {
        console.error("[scorecard] gas webhook error", webhookErr);
      }
    }

    console.log("[scorecard] submission", {
      email: data.email,
      track: data.track,
      result_key: fullResult.resultKey,
      lead_temperature: fullResult.leadTemperature,
      lead_score: fullResult.leadScore,
      report_key: fullResult.reportKey,
      tags: data.tags,
    });

    return NextResponse.json({
      success: true,
      resultKey: fullResult.resultKey,
      reportKey: fullResult.reportKey,
      leadTemperature: fullResult.leadTemperature,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("[scorecard] submission error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
