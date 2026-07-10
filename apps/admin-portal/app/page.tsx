import { prisma } from "@temuniaga/database";
import { AppShell, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";
import { READINESS_CATEGORIES } from "@temuniaga/shared-types";

const READINESS_LABELS: Record<(typeof READINESS_CATEGORIES)[number], { title: string; description: string }> = {
  KURANG_SIAP: { title: "Kurang Siap", description: "Belum memenuhi persyaratan transaksi." },
  MENENGAH: { title: "Menengah", description: "Dapat menjalankan buyer-first terbatas." },
  SIAP: { title: "Siap", description: "Dapat melakukan pooling dan transaksi B2B." },
  LEAD_READY: { title: "Lead-ready", description: "Dapat menjadi koordinator atau legal seller." },
};

async function getKoperasiCount() {
  return prisma.koperasi.count();
}

export default async function AdminHomePage() {
  const koperasiCount = await getKoperasiCount();

  return (
    <AppShell appName="Admin & Pendamping Portal">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Beranda</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Koperasi Terdaftar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-brand-600">{koperasiCount.toLocaleString("id-ID")}</p>
        </CardContent>
      </Card>

      <h2 className="mb-3 text-lg font-medium text-neutral-800 dark:text-neutral-200">Readiness Categories</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {READINESS_CATEGORIES.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-base">{READINESS_LABELS[category].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">{READINESS_LABELS[category].description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
