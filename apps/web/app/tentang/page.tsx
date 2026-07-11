import Link from "next/link";
import { AppShell, Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";
import { SiteNav } from "../../components/site-nav";
import { getDashboardTotals } from "../../lib/api";

const PILLARS = [
  {
    title: "Agricultural Supply Network",
    description: "Komoditas → RFQ → pooling → industri",
  },
  {
    title: "Cooperative Operating System",
    description: "Anggota → pasokan → stok → transaksi → settlement → SHU",
  },
  {
    title: "Village Product Marketplace",
    description: "UMKM → katalog → order → pembayaran → pengiriman",
  },
  {
    title: "Conversational Access Layer",
    description: "WhatsApp teks dan voice note",
  },
];

export default async function TentangPage() {
  const { totalKoperasi, totalAnggota } = await getDashboardTotals();

  return (
    <AppShell appName="Tentang TemuNiaga" nav={<SiteNav />}>
      <section className="pattern-corak-hero -mx-4 mb-12 rounded-2xl border border-brand-100 bg-brand-50/60 p-6 dark:border-brand-900/40 dark:bg-brand-950/30 sm:-mx-6 sm:p-8">
        <Badge tone="brand" className="mb-4">
          Kemenkop RI · Koperasi Desa Merah Putih
        </Badge>
        <h1 className="mb-3 max-w-2xl text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Cooperative Trade Operating System
        </h1>
        <p className="mb-6 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          Petani berinteraksi melalui WhatsApp. Operator mengelola pasokan melalui dashboard. Buyer melakukan
          pengadaan melalui Buyer Portal atau belanja langsung lewat Marketplace. Harga dihitung dari sumber
          dan biaya yang transparan.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/marketplace">
            <Button>Mulai Belanja</Button>
          </Link>
          <Link href="/koperasi">
            <Button variant="outline">Lihat Jaringan Koperasi</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Masuk Dashboard Kopdes</Button>
          </Link>
        </div>
      </section>

      <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Koperasi Terdaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">
              {totalKoperasi.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Anggota Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">
              {totalAnggota.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        Empat Pilar
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
          <Card key={pillar.title}>
            <CardHeader>
              <CardTitle className="text-base normal-case tracking-normal text-stone-900 dark:text-stone-100">
                {pillar.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-500 dark:text-stone-400">{pillar.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
