import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { AnggotaListResponse } from "@temuniaga/contracts";

@Injectable()
export class AnggotaService {
  constructor(private readonly prisma: PrismaService) {}

  async listByKoperasi(koperasiRef: string, page = 1, pageSize = 20): Promise<AnggotaListResponse> {
    const where = { koperasiRef };
    const [total, items] = await Promise.all([
      this.prisma.client.anggota.count({ where }),
      this.prisma.client.anggota.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { nama: "asc" },
        select: {
          anggotaRef: true,
          koperasiRef: true,
          nama: true,
          statusKeanggotaan: true,
          pekerjaan: true,
        },
      }),
    ]);
    return { total, page, pageSize, items };
  }
}
