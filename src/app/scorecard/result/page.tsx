"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getOutcomeByKey } from "@/content/outcomes";
import { RESULT_COPY } from "@/content/copy";
import type { Track, BackendTag, ResultKey } from "@/content/questions";
import type { LeadIntent } from "@/content/outcomes";

interface ResultPayload {
  track: Track;
  score: number;
  maxScore: number;
  resultKey?: ResultKey;
  tags: BackendTag[];
  answers: Record<string, string | string[]>;
  openText: Record<string, string>;
  email?: string;
  referralCode?: string;
}

const INTENT_BADGE: Record<LeadIntent, "danger" | "warning" | "default"> = {
  hot: "danger",
  warm: "warning",
  cold: "default",
};

const emailSchema = z.object({
  email: z.string().email("Enter a valid business email address."),
  name: z.string().optional(),
  company: z.string().optional(),
  newsletterOptIn: z.boolean().optional(),
});
type EmailFormValues = z.infer<typeof emailSchema>;

/**
 * Renders the result headline as a single flowing sentence:
 *   before [highlight] after
 * Only the highlight word is in warning orange — no line break.
 */
function ResultHeadline({
  before,
  highlight,
  after,
}: {
  before: string;
  highlight: string;
  after: string;
}) {
  return (
    <h1 className="text-2xl sm:text-3xl font-sans font-bold text-text-primary leading-tight">
      {before}{" "}
      <span className="text-state-warning">[{highlight}]</span>
      {after ? (
        <>
          {" "}
          {after}
        </>
      ) : null}
    </h1>
  );
}

/**
 * Renders body text that may contain [10%] or [competitive rates] —
 * those tokens are replaced with a larger warning-coloured span.
 */
function RichBody({ text, className = "text-sm text-text-secondary leading-relaxed" }: { text: string; className?: string }) {
  const parts = text.split(/(\[10%\]|\[competitive rates\])/g);
  return (
    <p className={className}>
      {parts.map((part, i) =>
        part === "[10%]" || part === "[competitive rates]" ? (
          <span key={i} className="text-state-warning font-bold text-base">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </p>
  );
}

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
      // sessionStorage unavailable — fall back to URL params
    }
  }, []);

  const track = (payload?.track ?? params.get("track")) as Track | null;
  const score = payload?.score ?? Number(params.get("score") ?? 0);
  const maxScore = payload?.maxScore ?? Number(params.get("max") ?? 0);
  const resultKey = (payload?.resultKey ?? params.get("resultKey")) as ResultKey | null;

  const outcome = resultKey ? getOutcomeByKey(resultKey) : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newsletterOptIn: false },
  });

  const onSubmit = async (values: EmailFormValues) => {
    setSubmitError(null);
    try {
      const body = {
        ...values,
        track,
        score,
        maxScore,
        tags: payload?.tags ?? [],
        answers: payload?.answers ?? {},
        openText: payload?.openText ?? {},
        referralCode: payload?.referralCode ?? "",
      };
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      // HOT and WARM: open the booking calendar after capturing contact details.
      // COLD: no booking link — report only.
      if ((isHot || isWarm) && outcome) {
        window.open(outcome.ctaUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      setSubmitError(
        "Something went wrong. Please email us directly at scorecard@bainsquared.com."
      );
    }
  };

  if (!resultKey || !outcome) {
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

  const isHot = outcome.leadIntent === "hot";
  const isWarm = outcome.leadIntent === "warm";
  const isCold = outcome.leadIntent === "cold";

  return (
    <div className="min-h-screen flex flex-col bg-surface-canvas">

      {/* Header */}
      <header className="px-4 sm:px-6 py-4 border-b border-border-subtle">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between">
          <img src="/logo.png" alt="Bain Squared" className="h-8 w-auto" />
          <Link
            href="/scorecard"
            className="text-xs font-sans text-text-tertiary hover:text-text-primary transition-colors duration-[180ms]"
          >
            {RESULT_COPY.retakeLabel}
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-6">

        {/* ── Result card ───────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border-default bg-surface-card overflow-hidden">
          <div className="px-8 pt-8 pb-6 space-y-4">
            <p className="text-xs font-sans text-text-tertiary uppercase tracking-widest">
              {RESULT_COPY.yourResultLabel}
            </p>

            {/* Headline — full sentence with highlight word in [brackets] warning colour */}
            <ResultHeadline
              before={outcome.headlineBefore}
              highlight={outcome.headlineHighlight}
              after={outcome.headlineAfter}
            />

            {/* Status badge */}
            <Badge variant={INTENT_BADGE[outcome.leadIntent]}>
              {outcome.statusLabel}
            </Badge>
          </div>

          {/* Description — supports [10%] and [competitive rates] tokens */}
          <div className="border-t border-border-subtle px-8 py-6">
            <RichBody
              text={outcome.description}
              className="text-sm text-text-secondary leading-relaxed whitespace-pre-line"
            />
          </div>
        </div>

        {/* ── Callout card — shown for ALL results ─────────────────── */}
        <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary-soft px-8 py-6">
          <p className="text-xs font-sans font-semibold text-brand-primary uppercase tracking-widest mb-2">
            {outcome.calloutLabel}
          </p>
          <RichBody text={outcome.calloutBody} />
        </div>

        {/* ── CTA card ─────────────────────────────────────────────── */}
        {!submitted ? (
          <div className="rounded-2xl border border-border-default bg-surface-card overflow-hidden">
            <div className="p-8 space-y-6">

              {/* Section label + headline + body */}
              <div className="space-y-2">
                <p className="text-xs font-sans text-text-tertiary uppercase tracking-widest">
                  {outcome.ctaSectionLabel}
                </p>
                <h2 className="text-xl font-sans font-bold text-text-primary">
                  {outcome.ctaHeadline}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {outcome.ctaBody}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                {/* Email — always required */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-sans text-text-secondary">
                    {RESULT_COPY.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={RESULT_COPY.emailPlaceholder}
                    {...register("email")}
                    className={[
                      "w-full rounded-xl border bg-surface-canvas px-4 py-3",
                      "text-sm sm:text-base text-text-primary placeholder:text-text-tertiary",
                      "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
                      "transition-colors duration-[180ms]",
                      errors.email ? "border-state-danger" : "border-border-default",
                    ].join(" ")}
                  />
                  {errors.email && (
                    <p className="text-xs text-state-danger">{errors.email.message}</p>
                  )}
                </div>

                {/* Name + Company */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-sans text-text-secondary flex items-center gap-1">
                      {RESULT_COPY.namePlaceholder}
                      <span className="text-text-tertiary">{RESULT_COPY.nameOptional}</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder={RESULT_COPY.namePlaceholder}
                      {...register("name")}
                      className={[
                        "w-full rounded-xl border border-border-default bg-surface-canvas px-4 py-3",
                        "text-sm sm:text-base text-text-primary placeholder:text-text-tertiary",
                        "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
                        "transition-colors duration-[180ms]",
                      ].join(" ")}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="company" className="text-xs font-sans text-text-secondary flex items-center gap-1">
                      {RESULT_COPY.companyPlaceholder}
                      <span className="text-text-tertiary">{RESULT_COPY.nameOptional}</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      autoComplete="organization"
                      placeholder={RESULT_COPY.companyPlaceholder}
                      {...register("company")}
                      className={[
                        "w-full rounded-xl border border-border-default bg-surface-canvas px-4 py-3",
                        "text-sm sm:text-base text-text-primary placeholder:text-text-tertiary",
                        "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
                        "transition-colors duration-[180ms]",
                      ].join(" ")}
                    />
                  </div>
                </div>

                {/* Newsletter opt-in */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("newsletterOptIn")}
                    className="mt-0.5 h-4 w-4 rounded border-border-default text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-xs text-text-secondary leading-relaxed">
                    {RESULT_COPY.newsletterCheckboxLabel}
                  </span>
                </label>

                {submitError && (
                  <p className="text-xs text-state-danger">{submitError}</p>
                )}

                {/* Primary CTA */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? RESULT_COPY.submittingLabel : outcome.primaryCtaLabel}
                </Button>

                {/* Privacy note */}
                <p className="text-xs text-text-tertiary text-center whitespace-pre-line">
                  {RESULT_COPY.privacyNote}
                </p>
              </form>
            </div>
          </div>
        ) : (isHot || isWarm) ? (
          /* Post-submit: hot/warm — cal.com opened, show fallback */
          <div className="rounded-2xl border border-border-default bg-surface-card overflow-hidden">
            <div className="p-8 space-y-4">
              <Badge variant="success">Details saved</Badge>
              <h2 className="text-xl font-sans font-bold text-text-primary">
                {RESULT_COPY.calOpenedHeadline}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {RESULT_COPY.calOpenedBody}
              </p>
              <a
                href={outcome.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-brand-primary underline underline-offset-2 hover:opacity-70 transition-opacity duration-[180ms]"
              >
                {RESULT_COPY.calFallbackLabel}
              </a>
            </div>
          </div>
        ) : (
          /* Post-submit: cold — report sent confirmation */
          <div className="rounded-2xl border border-border-default bg-surface-card overflow-hidden">
            <div className="p-8 space-y-4">
              <Badge variant="success">Sent</Badge>
              <h2 className="text-xl font-sans font-bold text-text-primary">
                {RESULT_COPY.successHeadline}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {RESULT_COPY.successBody}
              </p>
            </div>
          </div>
        )}

      </main>

      <footer className="px-6 py-5 border-t border-border-subtle">
        <p className="text-xs font-sans text-text-tertiary text-center">
          © 2026 Bain Squared | All rights reserved.
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
