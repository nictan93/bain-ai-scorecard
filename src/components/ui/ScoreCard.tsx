"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Bracket } from "./Bracket";
import { Badge } from "./Badge";
import type { BadgeVariant } from "./Badge";

interface ScoreCardProps {
  score: number;
  maxScore: number;
  label: string;
  description: string;
}

function getBandByPercent(pct: number): {
  bgClass: string;
  badgeVariant: BadgeVariant;
  statusLabel: string;
} {
  if (pct <= 30)
    return { bgClass: "bg-score-low-bg", badgeVariant: "danger", statusLabel: "Immediate Action" };
  if (pct <= 50)
    return { bgClass: "bg-score-mid-bg", badgeVariant: "warning", statusLabel: "Needs Attention" };
  if (pct <= 70)
    return { bgClass: "bg-score-mid-bg", badgeVariant: "warning", statusLabel: "Review Recommended" };
  return { bgClass: "bg-score-high-bg", badgeVariant: "success", statusLabel: "Strong Position" };
}

function AnimatedScore({ target }: { target: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 0.48,
      ease: [0.3, 0, 0, 1],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [count, rounded, target]);

  return <>{display}</>;
}

// Half-circle gauge arc
function GaugeArc({ percent }: { percent: number }) {
  const r = 54;
  const circumference = Math.PI * r; // half-circle
  const offset = circumference * (1 - Math.min(1, percent / 100));

  return (
    <svg
      viewBox="0 0 120 68"
      className="w-full max-w-[200px]"
      aria-hidden="true"
    >
      {/* Track */}
      <path
        d="M 8 62 A 54 54 0 0 1 112 62"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        className="text-border-subtle"
      />
      {/* Fill */}
      <motion.path
        d="M 8 62 A 54 54 0 0 1 112 62"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.48, ease: [0.3, 0, 0, 1] }}
        className={
          percent <= 30
            ? "text-state-danger"
            : percent <= 70
            ? "text-state-warning"
            : "text-state-success"
        }
      />
    </svg>
  );
}

export function ScoreCard({ score, maxScore, label, description }: ScoreCardProps) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const { bgClass, badgeVariant, statusLabel } = getBandByPercent(pct);

  return (
    <div className="rounded-2xl overflow-hidden shadow-md w-full">
      {/* Top section — tinted by score band */}
      <div className={`${bgClass} px-8 pt-8 pb-6 flex flex-col items-center gap-4`}>
        <GaugeArc percent={pct} />
        <div className="text-score font-sans font-bold leading-none text-text-primary -mt-2">
          <Bracket color="brand">
            <AnimatedScore target={score} />
          </Bracket>
        </div>
        <Badge variant={badgeVariant}>{statusLabel}</Badge>
      </div>

      {/* Bottom section — white */}
      <div className="bg-surface-card px-8 py-6">
        <p className="text-xs font-sans text-text-tertiary uppercase tracking-widest mb-2">
          {label}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        <p className="text-xs font-sans text-text-tertiary mt-4">
          {score} / {maxScore}
        </p>
      </div>
    </div>
  );
}
