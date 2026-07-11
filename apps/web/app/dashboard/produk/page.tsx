import { AppShell } from "@temuniaga/ui";
import { SiteNav } from "../../../components/site-nav";
import { getKoperasiList } from "../../../lib/api";
import { ProdukManager } from "./produk-manager";

export default async function DashboardProdukPage() {
  const { items: koperasiList } = await getKoperasiList(100);

  return (
    <AppShell appName="Kelola Produk Marketplace" nav={<SiteNav />}>
      <h1 className="mb-1 font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
        Kelola Produk Marketplace
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-stone-500 dark:text-stone-400">
        Pilih koperasi Anda, lalu tambahkan produk baru atau ubah harga produk yang sudah ada. Produk dengan
        harga terisi akan langsung muncul di halaman Marketplace publik.
      </p>
      <ProdukManager koperasiList={koperasiList} />
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
