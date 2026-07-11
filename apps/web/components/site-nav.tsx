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
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100",
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/marketplace/keranjang"
        className="relative whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
      >
        Keranjang
        {totalItems > 0 ? (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-harvest-500 px-1 text-xs font-bold text-white">
            {totalItems}
          </span>
        ) : null}
      </Link>
      {showLogout ? (
        <button
          type="button"
          onClick={handleLogout}
          className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
        >
          Keluar
        </button>
      ) : null}
    </nav>
  );
}
