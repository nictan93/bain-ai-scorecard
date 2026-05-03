"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ProgressHeader } from "@/components/scorecard/ProgressHeader";
import { Question } from "@/components/scorecard/Question";
import { QUESTIONS } from "@/content/questions";
import { IDLE_COPY } from "@/content/copy";
import {
  determineTrack,
  getNextQuestionId,
  isLastQuestion,
  getQuestionProgress,
} from "@/lib/routing";
import { calculateScore, getMaxScore, calculateResultKey } from "@/lib/scoring";
import { deriveTags } from "@/lib/tags";
import type { Track } from "@/content/questions";

interface AssessmentState {
  step: "idle" | "in_progress" | "completed";
  currentQuestionId: string | null;
  track: Track | null;
  answers: Record<string, string | string[]>;
  openText: Record<string, string>;
  history: string[];
  email: string;
  referralCode: string;
}

const INITIAL_STATE: AssessmentState = {
  step: "idle",
  currentQuestionId: null,
  track: null,
  answers: {},
  openText: {},
  history: [],
  email: "",
  referralCode: "",
};

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com",
  "live.com", "aol.com", "msn.com", "protonmail.com", "pm.me",
  "me.com", "mac.com", "ymail.com", "googlemail.com", "yahoo.co.uk",
  "hotmail.co.uk", "live.co.uk",
]);

function isBusinessEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? !PERSONAL_EMAIL_DOMAINS.has(domain) : false;
}

export default function ScorecardPage() {
  const router = useRouter();
  const [state, setState] = useState<AssessmentState>(INITIAL_STATE);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Idle form state
  const [idleEmail, setIdleEmail] = useState("");
  const [idleReferral, setIdleReferral] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [referralError, setReferralError] = useState<string | null>(null);

  // Tracks the most recently toggled option ID for popup display
  const [focusedOptionId, setFocusedOptionId] = useState<string | null>(null);

  // Reset popup whenever the question changes
  useEffect(() => {
    setFocusedOptionId(null);
  }, [state.currentQuestionId]);

  const currentQuestion = state.currentQuestionId
    ? QUESTIONS.find((q) => q.id === state.currentQuestionId) ?? null
    : null;

  const currentValue: string | string[] = currentQuestion
    ? currentQuestion.type === "open_text"
      ? (state.openText[currentQuestion.id] ?? "")
      : currentQuestion.type === "multi_select"
      ? ((state.answers[currentQuestion.id] as string[] | undefined) ?? [])
      : ((state.answers[currentQuestion.id] as string | undefined) ?? "")
    : "";

  const canAdvance =
    currentQuestion !== null &&
    (currentQuestion.type === "open_text"
      ? true
      : currentQuestion.type === "multi_select"
      ? ((state.answers[currentQuestion.id] as string[] | undefined) ?? []).length > 0
      : Boolean(state.answers[currentQuestion.id]));

  // Derive popup text from the focused option on the current question
  const currentPopupText = useMemo(() => {
    if (!currentQuestion || !focusedOptionId) return null;
    return currentQuestion.options?.find((o) => o.id === focusedOptionId)?.popup ?? null;
  }, [currentQuestion, focusedOptionId]);

  const handleIdleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setEmailError(null);
      setReferralError(null);

      let valid = true;
      const email = idleEmail.trim();
      const referral = idleReferral.trim();

      if (referral && !email) {
        setEmailError("A business email is required when using a referral code.");
        valid = false;
      } else if (email && !isBusinessEmail(email)) {
        setEmailError("Please enter a business email address.");
        valid = false;
      }

      if (!valid) return;

      setState((s) => ({
        ...s,
        step: "in_progress",
        currentQuestionId: "q1_routing",
        history: ["q1_routing"],
        email,
        referralCode: referral,
      }));
      setDirection(1);
    },
    [idleEmail, idleReferral]
  );

  const handleChange = useCallback(
    (value: string | string[], justToggled?: string) => {
      if (!currentQuestion) return;

      if (currentQuestion.type === "open_text") {
        setState((s) => ({
          ...s,
          openText: { ...s.openText, [currentQuestion.id]: value as string },
        }));
        return;
      }

      if (currentQuestion.type === "multi_select") {
        setState((s) => ({
          ...s,
          answers: { ...s.answers, [currentQuestion.id]: value as string[] },
        }));
        if (justToggled) setFocusedOptionId(justToggled);
        return;
      }

      // single_select
      const newAnswers = { ...state.answers, [currentQuestion.id]: value as string };
      const newTrack = determineTrack(newAnswers);
      setState((s) => ({
        ...s,
        answers: newAnswers,
        track: newTrack,
      }));
      if (justToggled) setFocusedOptionId(justToggled);
    },
    [currentQuestion, state.answers]
  );

  const handleNext = useCallback(() => {
    if (!currentQuestion || !canAdvance) return;

    const currentTrack = state.track;

    if (isLastQuestion(currentQuestion.id, currentTrack)) {
      const track = currentTrack;
      if (!track) return;

      const score = calculateScore(track, state.answers);
      const maxScore = getMaxScore(track);
      const resultKey = calculateResultKey(track, state.answers);
      const tags = deriveTags(track, state.answers);

      const resultPayload = {
        track,
        score,
        maxScore,
        resultKey,
        tags,
        answers: state.answers,
        openText: state.openText,
        email: state.email,
        referralCode: state.referralCode,
      };

      sessionStorage.setItem("scorecard_result", JSON.stringify(resultPayload));
      router.push(`/scorecard/result?track=${track}&resultKey=${resultKey}&score=${score}&max=${maxScore}`);
      return;
    }

    const nextId = getNextQuestionId(
      currentQuestion.id,
      state.answers,
      currentTrack
    );
    if (!nextId) return;

    setDirection(1);
    setState((s) => ({
      ...s,
      currentQuestionId: nextId,
      history: [...s.history, nextId],
    }));
  }, [currentQuestion, canAdvance, state, router]);

  const handleBack = useCallback(() => {
    setState((s) => {
      const history = s.history;
      if (history.length <= 1) return { ...INITIAL_STATE };
      const prev = history[history.length - 2];
      return {
        ...s,
        currentQuestionId: prev,
        history: history.slice(0, -1),
      };
    });
    setDirection(-1);
  }, []);

  const progress = currentQuestion
    ? getQuestionProgress(currentQuestion.id, state.track)
    : { current: 0, total: 0 };

  const isRoutingQuestion = currentQuestion?.id === "q1_routing";

  const totalForProgress = isRoutingQuestion
    ? progress.total
    : state.track
    ? QUESTIONS.filter((q) => q.track === state.track).length
    : 0;

  // ── Idle (start screen) ──────────────────────────────────────────────
  if (state.step === "idle") {
    return (
      <div className="min-h-screen flex flex-col bg-surface-canvas">

        {/* Header */}
        <header className="px-4 sm:px-6 py-4">
          <div className="max-w-[1320px] mx-auto flex items-center justify-between">
            <img src="/logo.png" alt="Bain Squared" className="h-8 w-auto" />
          </div>
        </header>

        <main className="flex-1 flex flex-col px-4 sm:px-6 pb-6">
          <div className="max-w-[1320px] w-full mx-auto bg-surface-card rounded-[32px] shadow-sm overflow-hidden">
            <div className="px-8 sm:px-16 md:px-24 pt-16 pb-16 flex flex-col items-start sm:items-center text-left sm:text-center min-h-[560px]">

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-text-primary leading-[1.05] tracking-[-0.03em] mb-6">
                {IDLE_COPY.headline}
              </h1>

              <p className="text-base sm:text-lg text-text-secondary max-w-[880px] mb-10 leading-relaxed">
                {IDLE_COPY.subheadline}
              </p>

              <div className="mt-auto w-full flex flex-col items-start sm:items-center">
                <form
                  onSubmit={handleIdleSubmit}
                  className="w-full max-w-sm space-y-4"
                  noValidate
                >
                  <div className="space-y-2 text-left">
                    <label
                      htmlFor="idle_email"
                      className="text-xs font-sans font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Business email{" "}
                      <span className="normal-case tracking-normal text-text-tertiary">(optional)</span>
                    </label>
                    <input
                      id="idle_email"
                      type="email"
                      value={idleEmail}
                      onChange={(e) => {
                        setIdleEmail(e.target.value);
                        setEmailError(null);
                      }}
                      placeholder="your@company.com"
                      autoComplete="email"
                      className={[
                        "w-full rounded-xl border bg-surface-canvas px-4 py-3.5",
                        "text-sm sm:text-base text-text-primary placeholder:text-text-tertiary",
                        "focus:outline-none focus:border-brand-primary",
                        "transition-colors duration-[180ms]",
                        emailError ? "border-state-danger" : "border-border-default",
                      ].join(" ")}
                    />
                    {emailError && (
                      <p className="text-xs text-state-danger">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2 text-left">
                    <label
                      htmlFor="idle_referral"
                      className="text-xs font-sans font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Referral code{" "}
                      <span className="normal-case tracking-normal text-text-tertiary">(optional)</span>
                    </label>
                    <input
                      id="idle_referral"
                      type="text"
                      value={idleReferral}
                      onChange={(e) => {
                        setIdleReferral(e.target.value);
                        setReferralError(null);
                      }}
                      placeholder={IDLE_COPY.referralPlaceholder}
                      className={[
                        "w-full rounded-xl border bg-surface-canvas px-4 py-3.5",
                        "text-sm sm:text-base text-text-primary placeholder:text-text-tertiary",
                        "focus:outline-none focus:border-brand-primary",
                        "transition-colors duration-[180ms]",
                        referralError ? "border-state-danger" : "border-border-default",
                      ].join(" ")}
                    />
                    {referralError && (
                      <p className="text-xs text-state-danger">{referralError}</p>
                    )}
                  </div>

                  <div className="pt-2 flex justify-start sm:justify-center">
                    <Button type="submit" variant="primary" size="lg">
                      {IDLE_COPY.ctaLabel}
                    </Button>
                  </div>
                </form>

                <p className="text-sm text-text-tertiary mt-4">
                  {IDLE_COPY.disclaimer}
                </p>
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── In progress ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-surface-canvas">
      <header className="px-4 sm:px-6 py-4 border-b border-border-subtle">
        <div className="max-w-[1320px] mx-auto flex items-center gap-6">
          <img src="/logo.png" alt="Bain Squared" className="h-8 w-auto shrink-0" />
          <div className="flex-1">
            <ProgressHeader
              current={progress.current}
              total={totalForProgress}
              track={state.track}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="max-w-2xl w-full space-y-4">

          {/* Question — slides in/out on change */}
          <AnimatePresence mode="wait" initial={false}>
            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
              >
                <Question
                  question={currentQuestion}
                  value={currentValue}
                  onChange={handleChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Popup strip — fades in when an option is selected */}
          <AnimatePresence mode="wait">
            {currentPopupText && (
              <motion.div
                key={currentPopupText}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                className="rounded-xl border border-brand-primary/20 bg-brand-primary-soft px-5 py-4"
              >
                <p className="text-sm text-text-secondary leading-relaxed">
                  {currentPopupText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <footer className="px-6 py-5 border-t border-border-subtle">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            disabled={!canAdvance}
          >
            {currentQuestion && isLastQuestion(currentQuestion.id, state.track)
              ? "See my result"
              : "Next"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
