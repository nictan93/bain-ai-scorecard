import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SubmissionSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
  track: z.enum(["esop", "brand_ip"]),
  score: z.number(),
  maxScore: z.number(),
  outcomeTitle: z.string().optional(),
  outcomeRangeLow: z.number().optional(),
  outcomeRangeHigh: z.number().optional(),
  tags: z.array(z.string()).optional(),
  answers: z.record(z.string(), z.string()).optional(),
  openText: z.record(z.string(), z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const data = SubmissionSchema.parse(body);

    // Phase 5: wire Vercel Postgres and Resend here.
    console.log("[scorecard] submission received", {
      email: data.email,
      track: data.track,
      score: data.score,
      tags: data.tags,
    });

    return NextResponse.json({ success: true });
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
