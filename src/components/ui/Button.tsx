"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-brand-primary text-text-inverse rounded-full",
    "hover:bg-brand-primary-pressed",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
    "active:scale-[0.98]",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
  ].join(" "),
  secondary: [
    "bg-surface-card text-text-primary border border-border-default rounded-full",
    "hover:bg-surface-card-soft",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
    "active:scale-[0.98]",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
  ].join(" "),
  ghost: [
    "bg-transparent text-text-primary rounded-md",
    "hover:bg-surface-card-soft",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
    "active:scale-[0.98]",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm font-medium",
  md: "px-6 py-3 text-base font-medium",
  lg: "px-8 py-4 text-lg font-medium",
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  type = "button",
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 transition-all duration-[180ms]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
