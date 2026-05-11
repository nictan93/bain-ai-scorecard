"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ProgressHeader } from "@/components/scorecard/ProgressHeader";
import { Question } from "@/components/scorecard/Question";
import { QUESTIONS } from "@/content/questions";
import {
  determineTrack,
  getNextQuestionId,
  isLastQuestion,
  getQuestionProgress,
} from "@/lib/routing";
import { calculateFullResult } from "@/lib/scoring";
import { deriveTags } from "@/lib/tags";
import type { Track } from "@/content/questions";

interface AssessmentState {
  step: "in_progress" | "completed";
  currentQuestionId: string | null;
  track: Track | null;
  answers: Record<string, string | string[]>;
  history: string[];
}

const INITIAL_STATE: AssessmentState = {
  step: "in_progress",
  currentQuestionId: "q1_routing",
  track: null,
  answers: {},
  history: ["q1_routing"],
};

export default function ScorecardPage() {
  const router = useRouter();
  const [state, setState] = useState<AssessmentState>(INITIAL_STATE);
  const [direction, setDirection] = useState<1 | -1>(1);

  const [focusedOptionId, setFocusedOptionId] = useState<string | null>(null);

  const handlingPopState = useRef(false);

  useEffect(() => {
    setFocusedOptionId(null);
  }, [state.currentQuestionId]);

  // ── Browser history integration ─────────────────────────────────────────

  const historyLengthRef = useRef(state.history.length);
  const historyRef = useRef(state.history);
  useEffect(() => { historyRef.current = state.history; }, [state.history]);

  useEffect(() => {
    const newLength = state.history.length;
    const prevLength = historyLengthRef.current;
    historyLengthRef.current = newLength;

    if (handlingPopState.current) {
      handlingPopState.current = false;
      return;
    }

    if (newLength > prevLength) {
      window.history.pushState({ questionIndex: newLength - 1 }, "");
    }
  }, [state.history]);

  useEffect(() => {
    const handlePopState = () => {
      if (historyRef.current.length <= 1) {
        handlingPopState.current = false;
        router.push("/");
        return;
      }
      handlingPopState.current = true;
      const prev = historyRef.current[historyRef.current.length - 2];
      setDirection(-1);
      setState((s) => ({
        ...s,
        currentQuestionId: prev,
        history: s.history.slice(0, -1),
      }));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  // ── Derived values ───────────────────────────────────────────────────────

  const currentQuestion = state.currentQuestionId
    ? QUESTIONS.find((q) => q.id === state.currentQuestionId) ?? null
    : null;

  const currentValue: string | string[] = currentQuestion
    ? currentQuestion.type === "multi_select"
      ? ((state.answers[currentQuestion.id] as string[] | undefined) ?? [])
      : ((state.answers[currentQuestion.id] as string | undefined) ?? "")
    : "";

  const canAdvance =
    currentQuestion !== null &&
    (currentQuestion.type === "multi_select"
      ? ((state.answers[currentQuestion.id] as string[] | undefined) ?? []).length > 0
      : Boolean(state.answers[currentQuestion.id]));

  const currentPopupText = useMemo(() => {
    if (!currentQuestion || !focusedOptionId) return null;
    return currentQuestion.options?.find((o) => o.id === focusedOptionId)?.popup ?? null;
  }, [currentQuestion, focusedOptionId]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = useCallback(
    (value: string | string[], justToggled?: string) => {
      if (!currentQuestion) return;

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

    if (isLastQuestion(currentQuestion.id, currentTrack, state.answers)) {
      const track = currentTrack;
      if (!track) return;

      const fullResult = calculateFullResult(track, state.answers);
      const tags = deriveTags(track, state.answers);

      let referralCode = "";
      try {
        referralCode = localStorage.getItem("referral_code") ?? "";
      } catch {
        // localStorage unavailable
      }

      const resultPayload = {
        track,
        fullResult,
        tags,
        answers: state.answers,
        referralCode,
      };

      sessionStorage.setItem("scorecard_result", JSON.stringify(resultPayload));
      router.push(
        `/scorecard/result?track=${track}&resultKey=${fullResult.resultKey}&score=${fullResult.leadScore}`
      );
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
    if (state.history.length <= 1) {
      router.push("/");
      return;
    }
    const prev = state.history[state.history.length - 2];
    setDirection(-1);
    setState((s) => ({
      ...s,
      currentQuestionId: prev,
      history: s.history.slice(0, -1),
    }));
  }, [router, state.history]);

  // ── Progress ─────────────────────────────────────────────────────────────

  const progress = currentQuestion
    ? getQuestionProgress(currentQuestion.id, state.track, state.answers)
    : { current: 0, total: 0 };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-surface-canvas">
      <header className="px-4 sm:px-6 py-4 border-b border-border-subtle">
        <div className="max-w-[1320px] mx-auto flex items-center gap-6">
          <img src="/logo.png" alt="Bain Squared" className="h-8 w-auto shrink-0" />
          <div className="flex-1">
            <ProgressHeader
              current={progress.current}
              total={progress.total}
              track={state.track}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="max-w-2xl w-full space-y-4">

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
            {currentQuestion && isLastQuestion(currentQuestion.id, state.track, state.answers)
              ? "See my result"
              : "Next"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
