"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import type { Question as QuestionType } from "@/content/questions";

interface QuestionProps {
  question: QuestionType;
  value: string;
  onChange: (value: string) => void;
}

export function Question({ question, value, onChange }: QuestionProps) {
  if (question.type === "open_text") {
    return (
      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <label
            htmlFor={question.id}
            className="block text-2xl font-sans font-bold text-text-primary leading-snug"
          >
            {question.prompt}
          </label>
          {question.helper && (
            <p className="text-sm text-text-secondary">{question.helper}</p>
          )}
        </div>
        <textarea
          id={question.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write as much or as little as is useful."
          rows={6}
          className={[
            "w-full rounded-xl border border-border-default bg-surface-card",
            "px-4 py-3 text-base text-text-primary placeholder:text-text-tertiary",
            "resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
            "transition-colors duration-[180ms]",
          ].join(" ")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <p className="text-2xl font-sans font-bold text-text-primary leading-snug">
          {question.prompt}
        </p>
        {question.helper && (
          <p className="text-sm text-text-secondary">{question.helper}</p>
        )}
      </div>

      <RadioGroup.Root
        value={value}
        onValueChange={onChange}
        className="space-y-3"
        aria-label={question.prompt}
      >
        {question.options?.map((option) => (
          <RadioGroup.Item
            key={option.id}
            value={option.id}
            className={[
              "group w-full text-left rounded-xl border bg-surface-card px-5 py-4",
              "transition-all duration-[180ms] cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
              "data-[state=checked]:border-brand-primary data-[state=checked]:bg-brand-primary-soft",
              "data-[state=unchecked]:border-border-default hover:border-brand-primary/50 hover:bg-surface-card-soft",
            ].join(" ")}
          >
            <div className="flex items-start gap-4">
              {/* Custom radio indicator */}
              <span
                className={[
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-[180ms]",
                  "group-data-[state=checked]:border-brand-primary group-data-[state=checked]:bg-brand-primary",
                  "group-data-[state=unchecked]:border-border-default",
                ].join(" ")}
                aria-hidden="true"
              >
                <RadioGroup.Indicator>
                  <span className="block h-1.5 w-1.5 rounded-full bg-text-inverse" />
                </RadioGroup.Indicator>
              </span>
              <span className="text-base text-text-primary leading-relaxed">
                {option.label}
              </span>
            </div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
