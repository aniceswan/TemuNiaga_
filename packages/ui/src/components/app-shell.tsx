import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface AppShellProps {
  /** Short section label shown next to the TemuNiaga wordmark, e.g. "Dashboard Kopdes". */
  appName: string;
  /** Navigation slot — apps/web injects its own routing-aware <SiteNav> here. */
  nav?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Shared branded shell used by TemuNiaga's web app. Keeps every section
 * (public, dashboard, admin, buyer) visually part of one product instead of
 * looking like unrelated pages bolted together.
 */
export function AppShell({ appName, nav, children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <div className="flex items-baseline gap-2.5">
            <span className="text-lg font-bold tracking-tight text-brand-700 dark:text-brand-400">
              TemuNiaga
            </span>
            <span className="text-sm text-stone-400 dark:text-stone-500" aria-hidden>
              /
            </span>
            <span className="text-sm font-medium text-stone-600 dark:text-stone-300">{appName}</span>
          </div>
          {nav}
        </div>
      </header>
      <main className={cn("mx-auto max-w-6xl px-4 py-8 sm:px-6", className)}>{children}</main>
    </div>
  );
}
