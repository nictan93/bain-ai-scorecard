import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={[
        "bg-surface-card rounded-xl shadow-sm p-8",
        hover
          ? "transition-shadow duration-[180ms] hover:shadow-md cursor-pointer"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
