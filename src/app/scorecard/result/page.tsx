"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getOutcomeForResult, BOOKING_URL, REPORT_TITLES } from "@/content/outcomes";
import { RESULT_COPY } from "@/content/copy";
import type { BackendTag, Track } from "@/content/questions";
import type { FullResult } from "@/lib/scoring";

// ── Session payload (written by scorecard/page.tsx) ───────────────────────

interface StoredPayload {
  track: Track;
  fullResult: FullResult;
  tags: BackendTag[];
  answers: Record<string, string | string[]>;
  referralCode?: string;
}

// ── Form schema ───────────────────────────────────────────────────────────

const emailSchema = z.object({
  email: z.string().email("Enter a valid business email address."),
  name: z.string().optional(),
  company: z.string().optional(),
  newsletterOptIn: z.boolean().optional(),
});
type EmailFormValues = z.infer<typeof emailSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Splits body text on \n\n and renders each paragraph as a <p>.
 */
function BodyText({ text, className }: { text: string; className?: string }) {
  const paras = text.split(/\n\n+/);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className={className ?? "text-sm text-text-secondary leading-relaxed"}>
          {p}
        </p>
      ))}
    </>
  );
}

// ── Main content ──────────────────────────────────────────────────────────

function ResultContent() {
  const params = useSearchParams();
  const [payload, setPayload] = useState<StoredPayload | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("scorecard_result");
      if (raw) setPayload(JSON.parse(raw) as StoredPayload);
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newsletterOptIn: false },
  });

  // ── Derive result from sessionStorage or URL fallback ───────────────────

  const fullResult = payload?.fullResult ?? null;
  const outcome = fullResult ? getOutcomeForResult(fullResult) : null;

  // URL-param fallbacks (for direct links / page refresh)
  const trackFromUrl = params.get("track");
  const resultKeyFromUrl = params.get("resultKey");

  const isHot     = fullResult ? fullResult.leadTemperatureUi === "hot"  : false;
  const isWarm    = fullResult ? fullResult.leadTemperatureUi === "warm" : false;

  const reportTitle = fullResult ? REPORT_TITLES[fullResult.reportKey] : "";

  // Resolve {{REPORT_TITLE}} token in ctaBody for ESOP B/C/U variants where
  // the report title varies by concern selection.
  const resolvedCtaBody = outcome?.ctaBody.replace("{{REPORT_TITLE}}", reportTitle) ?? "";
  const resolvedAfterSubmitBody = outcome?.afterSubmitBody.replace("{{REPORT_TITLE}}", reportTitle) ?? "";

  // ── Submit handler ───────────────────────────────────────────────────────

  const onSubmit = async (values: EmailFormValues) => {
    setSubmitError(null);
    if (!fullResult) return;

    try {
      const body = {
        email: values.email,
        name: values.name ?? "",
        company: values.company ?? "",
        newsletterOptIn: values.newsletterOptIn ?? false,
        track: payload?.track ?? (fullResult.resultKey.startsWith("ESOP_") ? "esop" : "intangible_value"),
        resultKey: fullResult.resultKey,
        leadTemperature: fullResult.leadTemperature,
        leadTemperatureUi: fullResult.leadTemperatureUi,
        leadScore: fullResult.leadScore,
        reportKey: fullResult.reportKey,
        esopSubTrack: fullResult.esopSubTrack ?? null,
        eventGroup: fullResult.eventGroup ?? null,
        assetSignalGroup: fullResult.assetSignalGroup ?? null,
        documentationGroup: fullResult.documentationGroup ?? null,
        painGroup: fullResult.painGroup ?? null,
        tags: payload?.tags ?? [],
        answers: payload?.answers ?? {},
        referralCode: payload?.referralCode ?? "",
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
        "Something went wrong. Please email us directly at assessment@bainsquared.com."
      );
    }
  };

  // ── No result guard ──────────────────────────────────────────────────────

  if (!fullResult || !outcome) {
    // Show a minimal fallback if sessionStorage is empty (e.g. direct navigation)
    const hasUrlHint = trackFromUrl && resultKeyFromUrl;
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-base text-text-secondary">
            {hasUrlHint
              ? "Loading your result..."
              : "No result found. Please complete the assessment first."}
          </p>
          {!hasUrlHint && (
            <Link href="/scorecard">
              <Button variant="primary" size="md">
                Start the assessment
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // ── Page ─────────────────────────────────────────────────────────────────

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
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-text-primary leading-tight">
              {outcome.headline}
            </h1>
            <Badge variant={isHot ? "danger" : isWarm ? "warning" : "default"}>
              {outcome.badge}
            </Badge>
          </div>
          <div className="border-t border-border-subtle px-8 py-6 space-y-3">
            <BodyText
              text={outcome.body}
              className="text-sm text-text-secondary leading-relaxed"
            />
          </div>
        </div>

        {/* ── Callout card ─────────────────────────────────────────── */}
        <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary-soft px-8 py-6 space-y-2">
          <p className="text-xs font-sans font-semibold text-brand-primary uppercase tracking-widest">
            {outcome.calloutTitle}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {outcome.calloutBody}
          </p>
        </div>

        {/* ── 10% offer block — ESOP A2 and A3 only ───────────────── */}
        {outcome.showOfferBlock && (
          <div className="rounded-2xl border border-brand-primary/30 bg-brand-primary-soft px-8 py-6 space-y-2">
            <p className="text-xs font-sans font-semibold text-brand-primary uppercase tracking-widest">
              {RESULT_COPY.offerBlockTitle}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {RESULT_COPY.offerBlockBody}
            </p>
          </div>
        )}

        {/* ── CTA card — form (pre-submit) or confirmation (post-submit) ── */}
        {!submitted ? (

          <div className="rounded-2xl border border-border-default bg-surface-card overflow-hidden">
            <div className="p-8 space-y-6">

              <div className="space-y-2">
                <p className="text-xs font-sans text-text-tertiary uppercase tracking-widest">
                  {outcome.ctaOverline}
                </p>
                <h2 className="text-xl font-sans font-bold text-text-primary">
                  {outcome.ctaHeadline}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {resolvedCtaBody}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                {/* Email */}
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
                      className="w-full rounded-xl border border-border-default bg-surface-canvas px-4 py-3 text-sm sm:text-base text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors duration-[180ms]"
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
                      className="w-full rounded-xl border border-border-default bg-surface-canvas px-4 py-3 text-sm sm:text-base text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors duration-[180ms]"
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

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? RESULT_COPY.submittingLabel : outcome.formButtonLabel}
                </Button>

                <p className="text-xs text-text-tertiary text-center whitespace-pre-line">
                  {RESULT_COPY.privacyNote}
                </p>
              </form>
            </div>
          </div>

        ) : isHot ? (

          /* ── Post-submit: HOT — report sent + booking button ──── */
          <div className="rounded-2xl border border-border-default bg-surface-card overflow-hidden">
            <div className="p-8 space-y-4">
              <Badge variant="success">{RESULT_COPY.hotSubmitBadge}</Badge>
              <p className="text-sm text-text-secondary leading-relaxed">
                {resolvedAfterSubmitBody}
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="md">
                  {RESULT_COPY.hotBookingButtonLabel}
                </Button>
              </a>
            </div>
          </div>

        ) : (

          /* ── Post-submit: WARM / COLD — report sent, no booking ── */
          <div className="rounded-2xl border border-border-default bg-surface-card overflow-hidden">
            <div className="p-8 space-y-4">
              <Badge variant="success">
                {isWarm ? RESULT_COPY.warmSubmitBadge : RESULT_COPY.coldSubmitBadge}
              </Badge>
              <p className="text-sm text-text-secondary leading-relaxed">
                {resolvedAfterSubmitBody}
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
