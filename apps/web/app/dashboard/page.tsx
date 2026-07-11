import { AppShell, Badge, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";
import { SiteNav } from "../../components/site-nav";
import { getDashboardTotals, getKoperasiList } from "../../lib/api";

async function getDashboardData() {
  const [totals, koperasi] = await Promise.all([getDashboardTotals(), getKoperasiList(20)]);
  return {
    totalKoperasi: totals.totalKoperasi,
    totalAnggota: totals.totalAnggota,
    totalSimpanan: Number(totals.totalSimpanan),
    koperasiList: koperasi.items,
  };
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    value,
  );
}

export default async function DashboardHomePage() {
  const { totalKoperasi, totalAnggota, totalSimpanan, koperasiList } = await getDashboardData();

  return (
    <AppShell appName="Dashboard Kopdes" nav={<SiteNav />}>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">Beranda Operator</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        <Card>
          <CardHeader>
            <CardTitle>Total Simpanan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-harvest-600 dark:text-harvest-400">
              {formatRupiah(totalSimpanan)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Koperasi (20 pertama)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-400 dark:border-stone-800">
                  <th className="py-2 pr-4 font-medium">Nama Koperasi</th>
                  <th className="py-2 pr-4 font-medium">Ref</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Bentuk</th>
                  <th className="py-2 font-medium">Alamat</th>
                </tr>
              </thead>
              <tbody>
                {koperasiList.map((k) => (
                  <tr
                    key={k.koperasiRef}
                    className="border-b border-stone-100 last:border-0 dark:border-stone-900"
                  >
                    <td className="py-2.5 pr-4 font-medium text-stone-900 dark:text-stone-100">
                      {k.namaKoperasi}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-stone-400">{k.koperasiRef}</td>
                    <td className="py-2.5 pr-4">
                      {k.statusRegistrasi ? <Badge tone="success">{k.statusRegistrasi}</Badge> : "-"}
                    </td>
                    <td className="py-2.5 pr-4 text-stone-500">{k.bentukKoperasi ?? "-"}</td>
                    <td className="py-2.5 text-stone-500">{k.alamatLengkap ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
