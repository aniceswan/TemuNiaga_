import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { DashboardTotals, KoperasiListResponse } from "@temuniaga/contracts";

@Injectable()
export class KoperasiService {
  constructor(private readonly prisma: PrismaService) {}

  async list(page = 1, pageSize = 20): Promise<KoperasiListResponse> {
    const [total, items] = await Promise.all([
      this.prisma.client.koperasi.count(),
      this.prisma.client.koperasi.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { namaKoperasi: "asc" },
        select: {
          koperasiRef: true,
          namaKoperasi: true,
          statusRegistrasi: true,
          bentukKoperasi: true,
          kategoriUsaha: true,
          alamatLengkap: true,
        },
      }),
    ]);
    return { total, items };
  }

  async findByRef(koperasiRef: string) {
    const koperasi = await this.prisma.client.koperasi.findUnique({ where: { koperasiRef } });
    if (!koperasi) throw new NotFoundException(`Koperasi ${koperasiRef} not found`);
    return koperasi;
  }

  async dashboardTotals(): Promise<DashboardTotals> {
    const [totalKoperasi, totalAnggota, simpananAgg] = await Promise.all([
      this.prisma.client.koperasi.count(),
      this.prisma.client.anggota.count(),
      this.prisma.client.simpanan.aggregate({ _sum: { jumlahSimpanan: true } }),
    ]);
    return {
      totalKoperasi,
      totalAnggota,
      totalSimpanan: (simpananAgg._sum.jumlahSimpanan ?? 0).toString(),
    };
  }
}
