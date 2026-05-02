import type { ReactNode } from "react";

type BracketColor =
  | "brand"
  | "primary"
  | "secondary"
  | "tertiary"
  | "inverse"
  | "success"
  | "warning"
  | "danger"
  | "info";

const colorClasses: Record<BracketColor, string> = {
  brand: "text-brand-primary",
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  tertiary: "text-text-tertiary",
  inverse: "text-text-inverse",
  success: "text-state-success",
  warning: "text-state-warning",
  danger: "text-state-danger",
  info: "text-state-info",
};

interface BracketProps {
  children: ReactNode;
  color?: BracketColor;
  className?: string;
}

export function Bracket({ children, color = "brand", className = "" }: BracketProps) {
  return (
    <span className={`font-sans font-bold tracking-tight ${colorClasses[color]} ${className}`}>
      <span aria-hidden="true">[</span>
      {children}
      <span aria-hidden="true">]</span>
    </span>
  );
}
