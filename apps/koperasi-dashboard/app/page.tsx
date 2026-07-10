import { prisma } from "@temuniaga/database";
import { AppShell, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";

async function getDashboardData() {
  const [totalKoperasi, totalAnggota, simpananAgg, koperasiList] = await Promise.all([
    prisma.koperasi.count(),
    prisma.anggota.count(),
    prisma.simpanan.aggregate({ _sum: { jumlahSimpanan: true } }),
    prisma.koperasi.findMany({
      take: 20,
      orderBy: { namaKoperasi: "asc" },
      select: {
        koperasiRef: true,
        namaKoperasi: true,
        statusRegistrasi: true,
        bentukKoperasi: true,
        alamatLengkap: true,
      },
    }),
  ]);

  return {
    totalKoperasi,
    totalAnggota,
    totalSimpanan: Number(simpananAgg._sum.jumlahSimpanan ?? 0),
    koperasiList,
  };
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    Number(value),
  );
}

export default async function DashboardHomePage() {
  const { totalKoperasi, totalAnggota, totalSimpanan, koperasiList } = await getDashboardData();

  return (
    <AppShell appName="Dashboard Kopdes">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Beranda</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Koperasi Terdaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-600">{totalKoperasi.toLocaleString("id-ID")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Anggota Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-600">{totalAnggota.toLocaleString("id-ID")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Simpanan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-600">{formatRupiah(totalSimpanan)}</p>
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
                <tr className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800">
                  <th className="py-2 pr-4">Nama Koperasi</th>
                  <th className="py-2 pr-4">Ref</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Bentuk</th>
                  <th className="py-2">Alamat</th>
                </tr>
              </thead>
              <tbody>
                {koperasiList.map((k) => (
                  <tr key={k.koperasiRef} className="border-b border-neutral-100 dark:border-neutral-900">
                    <td className="py-2 pr-4 font-medium">{k.namaKoperasi}</td>
                    <td className="py-2 pr-4 text-neutral-500">{k.koperasiRef}</td>
                    <td className="py-2 pr-4">{k.statusRegistrasi ?? "-"}</td>
                    <td className="py-2 pr-4">{k.bentukKoperasi ?? "-"}</td>
                    <td className="py-2 text-neutral-500">{k.alamatLengkap ?? "-"}</td>
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
