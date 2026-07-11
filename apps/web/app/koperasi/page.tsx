import { prisma } from "@temuniaga/database";
import { AppShell, Badge, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";
import { SiteNav } from "../../components/site-nav";

async function getKoperasiList() {
  return prisma.koperasi.findMany({
    take: 50,
    orderBy: { namaKoperasi: "asc" },
    select: {
      koperasiRef: true,
      namaKoperasi: true,
      kategoriUsaha: true,
      statusRegistrasi: true,
      alamatLengkap: true,
    },
  });
}

export default async function KoperasiDirectoryPage() {
  const koperasiList = await getKoperasiList();

  return (
    <AppShell appName="Jaringan Koperasi" nav={<SiteNav />}>
      <h1 className="mb-1 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
        Jaringan Koperasi
      </h1>
      <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">
        Menampilkan {koperasiList.length} koperasi pertama dari jaringan terdaftar.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {koperasiList.map((k) => (
          <Card key={k.koperasiRef}>
            <CardHeader>
              <CardTitle className="text-base normal-case tracking-normal text-stone-900 dark:text-stone-100">
                {k.namaKoperasi}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge tone="brand">{k.kategoriUsaha ?? "Koperasi"}</Badge>
                {k.statusRegistrasi ? <Badge tone="success">{k.statusRegistrasi}</Badge> : null}
              </div>
              <p className="text-xs text-stone-400">{k.alamatLengkap ?? "-"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
