import { AppShell, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";
import { READINESS_CATEGORIES } from "@temuniaga/shared-types";
import { SiteNav } from "../../components/site-nav";
import { getDashboardTotals } from "../../lib/api";

const READINESS_LABELS: Record<(typeof READINESS_CATEGORIES)[number], { title: string; description: string }> = {
  KURANG_SIAP: { title: "Kurang Siap", description: "Belum memenuhi persyaratan transaksi." },
  MENENGAH: { title: "Menengah", description: "Dapat menjalankan buyer-first terbatas." },
  SIAP: { title: "Siap", description: "Dapat melakukan pooling dan transaksi B2B." },
  LEAD_READY: { title: "Lead-ready", description: "Dapat menjadi koordinator atau legal seller." },
};

export default async function AdminHomePage() {
  const { totalKoperasi: koperasiCount } = await getDashboardTotals();

  return (
    <AppShell appName="Admin & Pendamping" nav={<SiteNav />}>
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">Beranda Admin</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle variant="eyebrow">Koperasi Terdaftar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">
            {koperasiCount.toLocaleString("id-ID")}
          </p>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        Readiness Categories
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {READINESS_CATEGORIES.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{READINESS_LABELS[category].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {READINESS_LABELS[category].description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
