"use client";

import { motion } from "framer-motion";

interface ProgressProps {
  value: number;
  label?: string;
  className?: string;
}

export function Progress({ value, label = "Progress", className = "" }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`w-full h-1.5 bg-brand-primary-soft rounded-full overflow-hidden ${className}`}
    >
      <motion.div
        className="h-full bg-brand-primary rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${clamped}%` }}
        transition={{
          duration: 0.48,
          ease: [0.3, 0, 0, 1],
        }}
      />
    </div>
  );
}
