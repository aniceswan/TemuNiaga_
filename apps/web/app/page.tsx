import Link from "next/link";
import { AppShell, Badge, Button } from "@temuniaga/ui";
import { SiteNav } from "../components/site-nav";

export default function PublicHomePage() {
  return (
    <AppShell appName="Beranda" nav={<SiteNav />}>
      <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Badge tone="harvest" className="mb-4">
          Kemenkop RI · Koperasi Desa Merah Putih
        </Badge>
        <h1 className="mb-4 max-w-2xl text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
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
