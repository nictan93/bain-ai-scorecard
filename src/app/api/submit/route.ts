import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateResultKey, getDeliverableKey } from "@/lib/scoring";
import { OUTCOMES } from "@/content/outcomes";
import type { Track } from "@/content/questions";

const SubmissionSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
  track: z.enum(["esop", "business_value"]),
  newsletterOptIn: z.boolean().optional(),
  score: z.number(),
  maxScore: z.number(),
  tags: z.array(z.string()).optional(),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  openText: z.record(z.string(), z.string()).optional(),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const data = SubmissionSchema.parse(body);

    // Derive result key server-side from answers — never trust client-supplied resultKey
    const track = data.track as Track;
    const resultKey = calculateResultKey(track, data.answers ?? {});
    const deliverableKey = getDeliverableKey(resultKey);
    const outcome = OUTCOMES.find((o) => o.id === resultKey);

    const webhookPayload = {
      email: data.email,
      name: data.name ?? "",
      company: data.company ?? "",
      referralCode: data.referralCode ?? "",
      track,
      score: data.score,
      maxScore: data.maxScore,
      resultKey,
      deliverableKey,
      outcomeLabel: outcome?.label ?? "",
      statusLabel: outcome?.statusLabel ?? "",
      tags: data.tags ?? [],
      openText: data.openText ?? {},
      newsletterOptIn: data.newsletterOptIn ?? false,
      submittedAt: new Date().toISOString(),
    };

    // Fire Zapier webhook (non-blocking best-effort)
    const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
    if (zapierUrl) {
      try {
        await fetch(zapierUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        });
      } catch (webhookErr) {
        // Log but don't fail the user-facing response
        console.error("[scorecard] zapier webhook error", webhookErr);
      }
    }

    console.log("[scorecard] submission received", {
      email: data.email,
      track,
      score: data.score,
      resultKey,
      deliverableKey,
      tags: data.tags,
    });

    return NextResponse.json({ success: true, resultKey, deliverableKey });
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
