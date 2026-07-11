import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Set true for cards in a hoverable grid (product cards, list items) to lift on hover. */
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl2 border border-stone-200/80 bg-white shadow-card transition-all duration-200 dark:border-brand-800/50 dark:bg-brand-900",
        interactive && "hover:-translate-y-0.5 hover:shadow-card-hover hover:border-brand-200 dark:hover:border-brand-700",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1 p-5", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** "title" (default) is a warm serif heading for named content (product, section titles).
   *  "eyebrow" is the small uppercase label used above a big stat number. */
  variant?: "title" | "eyebrow";
}

export const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, variant = "title", ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        variant === "eyebrow"
          ? "text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400"
          : "font-display text-lg font-semibold leading-snug text-stone-900 dark:text-stone-100",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";
