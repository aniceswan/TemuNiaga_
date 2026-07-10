import { prisma } from "@temuniaga/database";
import { AppShell, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";

async function getKoperasiList() {
  return prisma.koperasi.findMany({
    take: 50,
    orderBy: { namaKoperasi: "asc" },
    select: {
      koperasiRef: true,
      namaKoperasi: true,
      kategoriUsaha: true,
      alamatLengkap: true,
    },
  });
}

export default async function KoperasiDirectoryPage() {
  const koperasiList = await getKoperasiList();

  return (
    <AppShell appName="Jaringan Koperasi">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
        Jaringan Koperasi ({koperasiList.length}+ ditampilkan)
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {koperasiList.map((k) => (
          <Card key={k.koperasiRef}>
            <CardHeader>
              <CardTitle className="text-base">{k.namaKoperasi}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">{k.kategoriUsaha ?? "Koperasi"}</p>
              <p className="mt-1 text-xs text-neutral-400">{k.alamatLengkap ?? "-"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
