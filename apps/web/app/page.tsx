import Link from "next/link";
import { AppShell, Badge, Button } from "@temuniaga/ui";
import { SiteNav } from "../components/site-nav";

export default function PublicHomePage() {
  return (
    <AppShell appName="Beranda" nav={<SiteNav />}>
      <section className="pattern-corak-hero -mx-4 flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-brand-200 bg-white px-4 text-center dark:border-brand-800/50 dark:bg-brand-900 sm:-mx-6 sm:px-6">
        <Badge tone="brand" className="mb-4">
          Kemenkop RI · Koperasi Desa Merah Putih
        </Badge>
        <h1 className="mb-4 max-w-2xl font-display text-5xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 sm:text-6xl">
          TemuNiaga
        </h1>
        <p className="mb-8 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          Menghubungkan petani, koperasi desa, dan pembeli dalam satu platform — belanja produk kopdes,
          kelola pasokan, dan pantau harga, semua dari satu tempat.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/marketplace">
            <Button size="lg">Mulai Belanja</Button>
          </Link>
          <Link href="/tentang">
            <Button variant="outline" size="lg">
              Pelajari Lebih Lanjut
            </Button>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
