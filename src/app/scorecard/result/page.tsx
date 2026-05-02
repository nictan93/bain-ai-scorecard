"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScoreCard } from "@/components/ui/ScoreCard";
import { Button } from "@/components/ui/Button";
import { Bracket } from "@/components/ui/Bracket";
import { Badge } from "@/components/ui/Badge";
import { getOutcome } from "@/content/outcomes";
import { RESULT_COPY } from "@/content/copy";
import type { Track, BackendTag } from "@/content/questions";

interface ResultPayload {
  track: Track;
  score: number;
  maxScore: number;
  tags: BackendTag[];
  answers: Record<string, string | string[]>;
  openText: Record<string, string>;
}

const TRACK_LABELS: Record<Track, string> = {
  esop: "ESOP",
  brand_ip: "Brand & IP",
};

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  name: z.string().optional(),
  company: z.string().optional(),
});
type EmailFormValues = z.infer<typeof emailSchema>;

function ResultContent() {
  const params = useSearchParams();
  const [payload, setPayload] = useState<ResultPayload | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("scorecard_result");
      if (raw) setPayload(JSON.parse(raw) as ResultPayload);
    } catch {
      // sessionStorage unavailable or parse failure — fall back to URL params
    }
  }, []);

  // Fallback from URL params if sessionStorage is empty (e.g. direct link)
  const track = (payload?.track ?? params.get("track")) as Track | null;
  const score = payload?.score ?? Number(params.get("score") ?? 0);
  const maxScore = payload?.maxScore ?? Number(params.get("max") ?? 0);

  const outcome = track ? getOutcome(track, score) : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (values: EmailFormValues) => {
    setSubmitError(null);
    try {
      const body = {
        ...values,
        track,
        score,
        maxScore,
        outcomeTitle: outcome?.label,
        outcomeRangeLow: outcome?.scoreRange[0],
        outcomeRangeHigh: outcome?.scoreRange[1],
        tags: payload?.tags ?? [],
        answers: payload?.answers ?? {},
        openText: payload?.openText ?? {},
      };
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Something went wrong. Please email us directly at scorecard@bainsquared.com."
      );
    }
  };

  if (!track || !outcome) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-base text-text-secondary">
            No result found. Please complete the assessment first.
          </p>
          <Link href="/scorecard">
            <Button variant="primary" size="md">
              Start the assessment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
        <span className="text-sm font-sans font-bold text-text-primary">Bain Squared</span>
        <Link
          href="/scorecard"
          className="text-xs font-sans text-text-tertiary hover:text-text-primary transition-colors duration-[180ms]"
        >
          {RESULT_COPY.retakeLabel}
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-12">
        {/* Track label */}
        <div className="space-y-1">
          <p className="text-xs font-sans text-text-tertiary uppercase tracking-widest">
            {RESULT_COPY.scoreLabel}
          </p>
          <p className="text-sm font-sans text-text-secondary">
            Track:{" "}
            <Bracket color="brand" className="text-sm">
              {TRACK_LABELS[track]}
            </Bracket>
          </p>
        </div>

        {/* Score card */}
        <ScoreCard
          score={score}
          maxScore={maxScore}
          label={outcome.label}
          description={outcome.description}
        />

        {/* Diagnosis */}
        <div className="space-y-3">
          <p className="text-xs font-sans text-text-tertiary uppercase tracking-widest">
            {RESULT_COPY.diagnosisLabel}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Bracket color="brand" className="text-2xl font-bold">
              {outcome.label}
            </Bracket>
          </div>
        </div>

        {/* Recommended next step — gated behind email */}
        <div className="rounded-2xl border border-border-default bg-surface-card overflow-hidden">
          {!submitted ? (
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-sans text-text-tertiary uppercase tracking-widest">
                  {RESULT_COPY.nextStepLabel}
                </p>
                <h2 className="text-xl font-sans font-bold text-text-primary">
                  {RESULT_COPY.emailGateHeadline}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {RESULT_COPY.emailGateBody}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-sans text-text-secondary">
                    Email address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={RESULT_COPY.emailPlaceholder}
                    {...register("email")}
                    className={[
                      "w-full rounded-xl border bg-surface-canvas px-4 py-3",
                      "text-base text-text-primary placeholder:text-text-tertiary",
                      "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
                      "transition-colors duration-[180ms]",
                      errors.email ? "border-state-danger" : "border-border-default",
                    ].join(" ")}
                  />
                  {errors.email && (
                    <p className="text-xs text-state-danger">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-sans text-text-secondary">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder={RESULT_COPY.namePlaceholder}
                      {...register("name")}
                      className={[
                        "w-full rounded-xl border border-border-default bg-surface-canvas px-4 py-3",
                        "text-base text-text-primary placeholder:text-text-tertiary",
                        "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
                        "transition-colors duration-[180ms]",
                      ].join(" ")}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="company" className="text-xs font-sans text-text-secondary">
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      autoComplete="organization"
                      placeholder={RESULT_COPY.companyPlaceholder}
                      {...register("company")}
                      className={[
                        "w-full rounded-xl border border-border-default bg-surface-canvas px-4 py-3",
                        "text-base text-text-primary placeholder:text-text-tertiary",
                        "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
                        "transition-colors duration-[180ms]",
                      ].join(" ")}
                    />
                  </div>
                </div>

                {submitError && (
                  <p className="text-xs text-state-danger">{submitError}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? RESULT_COPY.submittingLabel : RESULT_COPY.submitLabel}
                </Button>

                <p className="text-xs text-text-tertiary text-center">
                  {RESULT_COPY.privacyNote}
                </p>
              </form>
            </div>
          ) : (
            /* Post-submit: unlock the CTA */
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Badge variant="success">Sent</Badge>
                <h2 className="text-xl font-sans font-bold text-text-primary">
                  {RESULT_COPY.successHeadline}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {RESULT_COPY.successBody}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-sans text-text-tertiary uppercase tracking-widest">
                  {RESULT_COPY.nextStepLabel}
                </p>
                <p className="text-sm text-text-secondary">{outcome.recommendedNextStep}</p>
                <a href={outcome.ctaUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="md">
                    {outcome.ctaLabel}
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="px-6 py-5 border-t border-border-subtle">
        <p className="text-xs font-sans text-text-tertiary">
          Bain Squared — Intangible Asset Valuation
        </p>
      </footer>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm font-sans text-text-tertiary">Loading result...</p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
