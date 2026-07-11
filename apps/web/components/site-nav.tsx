"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@temuniaga/ui";
import { useCart } from "../lib/cart-context";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/tentang", label: "Tentang" },
  { href: "/koperasi", label: "Koperasi" },
  { href: "/dashboard", label: "Dashboard Kopdes" },
  { href: "/buyer", label: "Buyer Portal" },
  { href: "/admin", label: "Admin" },
] as const;

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const showLogout = PROTECTED_PREFIXES.some((prefix) => pathname?.startsWith(prefix));
  const { totalItems } = useCart();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="flex flex-1 items-center gap-1 overflow-x-auto sm:justify-end">
      {LINKS.map((link) => {
        const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-brand-200"
                : "text-stone-600 hover:bg-brand-50 hover:text-brand-800 dark:text-stone-400 dark:hover:bg-brand-900/40 dark:hover:text-brand-200",
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/marketplace/keranjang"
        className="relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-brand-50 hover:text-brand-800 dark:text-stone-400 dark:hover:bg-brand-900/40 dark:hover:text-brand-200"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path
            d="M4 6h2l1.5 9.5a2 2 0 0 0 2 1.5h7a2 2 0 0 0 2-1.6L20 8H7"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="20" r="1.3" fill="currentColor" />
          <circle cx="16.5" cy="20" r="1.3" fill="currentColor" />
        </svg>
        Keranjang
        {totalItems > 0 ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-harvest-500 px-1 text-xs font-bold text-white">
            {totalItems}
          </span>
        ) : null}
      </Link>
      {showLogout ? (
        <button
          type="button"
          onClick={handleLogout}
          className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
        >
          Keluar
        </button>
      ) : null}
    </nav>
  );
}
