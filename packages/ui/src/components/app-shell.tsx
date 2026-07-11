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
    <div className="min-h-screen bg-white text-stone-900 dark:bg-brand-950 dark:text-stone-100">
      <header className="sticky top-0 z-10 border-b border-brand-200 bg-white/80 backdrop-blur dark:border-brand-800/50 dark:bg-brand-950/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white dark:bg-brand-500">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                <path
                  d="M12 21c-4.5-1-7-4.8-7-9 0-3.5 2.5-7 7-9 4.5 2 7 5.5 7 9 0 4.2-2.5 8-7 9Z"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
                <path d="M12 21V9" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
              </svg>
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-brand-800 dark:text-brand-300">
              TemuNiaga
            </span>
            <span className="hidden text-sm text-stone-400 dark:text-stone-500 sm:inline" aria-hidden>
              /
            </span>
            <span className="hidden text-sm font-medium text-stone-600 dark:text-stone-300 sm:inline">
              {appName}
            </span>
          </div>
          {nav}
        </div>
      </header>
      <main className={cn("mx-auto max-w-6xl px-4 py-8 sm:px-6", className)}>{children}</main>
    </div>
  );
}
