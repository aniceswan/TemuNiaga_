import Link from "next/link";
import { prisma } from "@temuniaga/database";
import { AppShell, Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";
import { SiteNav } from "../components/site-nav";

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

async function getStats() {
  const [totalKoperasi, totalAnggota] = await Promise.all([prisma.koperasi.count(), prisma.anggota.count()]);
  return { totalKoperasi, totalAnggota };
}

export default async function PublicHomePage() {
  const { totalKoperasi, totalAnggota } = await getStats();

  return (
    <AppShell appName="Beranda" nav={<SiteNav />}>
      <section className="mb-12">
        <Badge tone="harvest" className="mb-4">
          Kemenkop RI · Koperasi Desa Merah Putih
        </Badge>
        <h1 className="mb-3 max-w-2xl text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Cooperative Trade Operating System
        </h1>
        <p className="mb-6 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          Petani berinteraksi melalui WhatsApp. Operator mengelola pasokan melalui dashboard. Buyer melakukan
          pengadaan melalui Buyer Portal. Harga dihitung dari sumber dan biaya yang transparan.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/koperasi">
            <Button>Lihat Jaringan Koperasi</Button>
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
