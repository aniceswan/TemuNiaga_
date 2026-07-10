import Link from "next/link";
import { AppShell, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";

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

export default function PublicHomePage() {
  return (
    <AppShell appName="Public Web">
      <section className="mb-10">
        <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          TemuNiaga — Cooperative Trade Operating System
        </h1>
        <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
          Petani berinteraksi melalui WhatsApp. Operator mengelola pasokan melalui dashboard. Buyer melakukan
          pengadaan melalui Buyer Portal. Kopdes saling menggabungkan volume melalui pooling. Harga dihitung dari
          sumber dan biaya yang transparan.
        </p>
        <Link
          href="/koperasi"
          className="mt-4 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Lihat Jaringan Koperasi &rarr;
        </Link>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
          <Card key={pillar.title}>
            <CardHeader>
              <CardTitle>{pillar.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">{pillar.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
