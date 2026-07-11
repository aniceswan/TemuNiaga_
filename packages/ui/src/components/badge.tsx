import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "brand" | "harvest" | "neutral" | "success" | "warning" | "danger";
}

const TONE_CLASSES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  harvest: "bg-harvest-50 text-harvest-700 dark:bg-harvest-900/40 dark:text-harvest-300",
  neutral: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  danger: "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    />
  );
}
