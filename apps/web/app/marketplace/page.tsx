import { AppShell } from "@temuniaga/ui";
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
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Belanja Produk Koperasi Desa
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {total.toLocaleString("id-ID")} produk dari koperasi di seluruh Indonesia — harga ditentukan
          masing-masing koperasi.
        </p>
      </div>

      <form className="mb-6 max-w-sm">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cari produk..."
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-stone-700 dark:bg-stone-900"
        />
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
