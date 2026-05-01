"use client";

import { useState, useCallback } from "react";
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
import { calculateScore, getMaxScore } from "@/lib/scoring";
import { deriveTags } from "@/lib/tags";
import type { Track } from "@/content/questions";

interface AssessmentState {
  step: "idle" | "in_progress" | "completed";
  currentQuestionId: string | null;
  track: Track | null;
  answers: Record<string, string>;
  openText: Record<string, string>;
  history: string[];
}

const INITIAL_STATE: AssessmentState = {
  step: "idle",
  currentQuestionId: null,
  track: null,
  answers: {},
  openText: {},
  history: [],
};

export default function ScorecardPage() {
  const router = useRouter();
  const [state, setState] = useState<AssessmentState>(INITIAL_STATE);
  const [direction, setDirection] = useState<1 | -1>(1);

  const currentQuestion = state.currentQuestionId
    ? QUESTIONS.find((q) => q.id === state.currentQuestionId) ?? null
    : null;

  const currentValue = currentQuestion
    ? currentQuestion.type === "open_text"
      ? (state.openText[currentQuestion.id] ?? "")
      : (state.answers[currentQuestion.id] ?? "")
    : "";

  const canAdvance =
    currentQuestion !== null &&
    (currentQuestion.type === "open_text"
      ? (state.openText[currentQuestion.id] ?? "").trim().length > 0
      : Boolean(state.answers[currentQuestion.id]));

  const handleStart = useCallback(() => {
    setState((s) => ({
      ...s,
      step: "in_progress",
      currentQuestionId: "q1_routing",
      history: ["q1_routing"],
    }));
    setDirection(1);
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      setState((s) => {
        if (currentQuestion.type === "open_text") {
          return { ...s, openText: { ...s.openText, [currentQuestion.id]: value } };
        }
        const newAnswers = { ...s.answers, [currentQuestion.id]: value };
        // Re-derive track whenever an answer changes
        const newTrack = determineTrack(newAnswers);
        return { ...s, answers: newAnswers, track: newTrack };
      });
    },
    [currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (!currentQuestion || !canAdvance) return;

    const currentTrack = state.track;

    if (isLastQuestion(currentQuestion.id, currentTrack)) {
      // Assessment complete — compute result and navigate
      const track = currentTrack;
      if (!track) return;

      const score = calculateScore(track, state.answers);
      const maxScore = getMaxScore(track);
      const tags = deriveTags(track, state.answers);

      const resultPayload = {
        track,
        score,
        maxScore,
        tags,
        answers: state.answers,
        openText: state.openText,
      };

      sessionStorage.setItem("scorecard_result", JSON.stringify(resultPayload));
      router.push(`/scorecard/result?track=${track}&score=${score}&max=${maxScore}`);
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

  const isRoutingOrClarify =
    currentQuestion?.id === "q1_routing" ||
    currentQuestion?.id === "q2_clarify";

  const totalForProgress = isRoutingOrClarify
    ? progress.total
    : state.track
    ? QUESTIONS.filter((q) => q.track === state.track).length
    : 0;

  const currentForProgress = isRoutingOrClarify ? progress.current : progress.current;

  // ── Idle (start screen) ──────────────────────────────────────────────
  if (state.step === "idle") {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="px-6 py-5 border-b border-border-subtle">
          <span className="text-sm font-mono font-bold text-text-primary">Bain Squared</span>
        </header>
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-lg w-full space-y-8 text-center">
            <div className="space-y-4">
              <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest">
                Intangible Asset Valuation
              </p>
              <h1 className="text-3xl font-mono font-bold text-text-primary">
                Readiness Assessment
              </h1>
              <p className="text-base text-text-secondary leading-relaxed">
                Eight questions. Under 3 minutes. You will see your score and a
                specific next step the moment you finish.
              </p>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <Button variant="primary" size="lg" onClick={handleStart}>
                Start the assessment
              </Button>
              <p className="text-xs text-text-tertiary">
                No account required. Your score is shown immediately on completion.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── In progress ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5 border-b border-border-subtle">
        <div className="max-w-2xl mx-auto w-full">
          <ProgressHeader
            current={currentForProgress}
            total={totalForProgress}
            track={state.track}
          />
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
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
