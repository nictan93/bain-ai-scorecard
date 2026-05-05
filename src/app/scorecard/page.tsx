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
import { calculateScore, getMaxScore, calculateResultKey } from "@/lib/scoring";
import { deriveTags } from "@/lib/tags";
import type { Track } from "@/content/questions";

interface AssessmentState {
  step: "in_progress" | "completed";
  currentQuestionId: string | null;
  track: Track | null;
  answers: Record<string, string | string[]>;
  openText: Record<string, string>;
  history: string[];
}

const INITIAL_STATE: AssessmentState = {
  step: "in_progress",
  currentQuestionId: "q1_routing",
  track: null,
  answers: {},
  openText: {},
  history: ["q1_routing"],
};

export default function ScorecardPage() {
  const router = useRouter();
  const [state, setState] = useState<AssessmentState>(INITIAL_STATE);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Tracks the most recently toggled option ID for popup display
  const [focusedOptionId, setFocusedOptionId] = useState<string | null>(null);

  // Track whether we are currently handling a popstate event to avoid
  // pushing a duplicate history entry in response to our own setState.
  const handlingPopState = useRef(false);

  // Reset popup whenever the question changes
  useEffect(() => {
    setFocusedOptionId(null);
  }, [state.currentQuestionId]);

  // ── Browser history integration ─────────────────────────────────────────
  // Each time the question advances, push a new browser history entry so the
  // native back gesture/button navigates between questions instead of leaving
  // the page entirely.

  const historyLengthRef = useRef(state.history.length);

  useEffect(() => {
    const newLength = state.history.length;
    const prevLength = historyLengthRef.current;
    historyLengthRef.current = newLength;

    if (handlingPopState.current) {
      handlingPopState.current = false;
      return;
    }

    if (newLength > prevLength) {
      // User moved forward — push a new browser history entry
      window.history.pushState({ questionIndex: newLength - 1 }, "");
    }
  }, [state.history]);

  useEffect(() => {
    const handlePopState = () => {
      handlingPopState.current = true;
      setState((s) => {
        const history = s.history;
        if (history.length <= 1) {
          // No more questions to go back to — let the browser navigate away
          handlingPopState.current = false;
          router.push("/");
          return s;
        }
        const prev = history[history.length - 2];
        setDirection(-1);
        return {
          ...s,
          currentQuestionId: prev,
          history: history.slice(0, -1),
        };
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  // ── Derived values ───────────────────────────────────────────────────────

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

  // ── Handlers ─────────────────────────────────────────────────────────────

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
        email: "",
        referralCode: "",
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
      if (history.length <= 1) {
        router.push("/");
        return s;
      }
      const prev = history[history.length - 2];
      return {
        ...s,
        currentQuestionId: prev,
        history: history.slice(0, -1),
      };
    });
    setDirection(-1);
  }, [router]);

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
