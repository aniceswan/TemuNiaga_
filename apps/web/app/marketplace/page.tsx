import { AppShell, Input } from "@temuniaga/ui";
import { SiteNav } from "../../components/site-nav";
import { getMarketplaceProduk } from "../../lib/api";
import { ProdukGrid } from "./produk-grid";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const { q, page } = searchParams;
  const { items, total, pageSize } = await getMarketplaceProduk({
    search: q,
    page: page ? Number(page) : undefined,
  });

  return (
    <AppShell appName="Belanja Produk Kopdes" nav={<SiteNav />}>
      <div className="mb-6">
        <h1 className="mb-1 font-display text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Belanja Produk Koperasi Desa
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {total.toLocaleString("id-ID")} produk dari koperasi di seluruh Indonesia — harga ditentukan
          masing-masing koperasi.
        </p>
      </div>

      <form className="relative mb-6 max-w-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
          <path d="m20 20-3-3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
        <Input type="text" name="q" defaultValue={q} placeholder="Cari produk..." className="pl-9" />
      </form>

      <ProdukGrid items={items} />

      {total > pageSize ? (
        <p className="mt-6 text-center text-xs text-stone-400">
          Menampilkan {items.length} dari {total.toLocaleString("id-ID")} produk.
        </p>
      ) : null}
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
