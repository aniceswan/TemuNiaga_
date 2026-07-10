import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface AppShellProps {
  /** Short app label shown next to the TemuNiaga wordmark, e.g. "Dashboard Kopdes". */
  appName: string;
  children: ReactNode;
  className?: string;
}

/**
 * Shared branded shell used by every TemuNiaga app (koperasi-dashboard,
 * public-web, admin-portal, buyer-portal). Keeps the 5 Next.js apps visually
 * related instead of looking like 5 unstyled framework starters.
 */
export function AppShell({ appName, children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <span className="text-lg font-bold text-brand-700 dark:text-brand-500">TemuNiaga</span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">{appName}</span>
        </div>
      </header>
      <main className={cn("mx-auto max-w-6xl px-6 py-8", className)}>{children}</main>
    </div>
  );
}
