import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { LaporPasokanDto } from "./lapor-pasokan.dto";

@Injectable()
export class PasokanService {
  constructor(private readonly prisma: PrismaService) {}

  /** plan.md §24 supply lot lifecycle starts at DRAFT; WA report lands here, operator verifies later. */
  async lapor(dto: LaporPasokanDto) {
    const koperasi = await this.prisma.client.koperasi.findUnique({ where: { koperasiRef: dto.koperasiRef } });
    if (!koperasi) throw new NotFoundException(`Koperasi ${dto.koperasiRef} tidak ditemukan`);

    const commodity = await this.prisma.client.commodity.upsert({
      where: { name: dto.komoditas },
      update: {},
      create: { name: dto.komoditas, defaultUnit: dto.unit },
    });

    const supplyLot = await this.prisma.client.supplyLot.create({
      data: {
        koperasiRef: dto.koperasiRef,
        commodityId: commodity.id,
        memberRef: dto.memberRef,
        quantity: dto.quantity,
        unit: dto.unit,
        location: dto.location,
        status: "SUBMITTED",
      },
    });

    return {
      supplyLotId: supplyLot.id,
      status: supplyLot.status,
      komoditas: commodity.name,
      quantity: Number(supplyLot.quantity),
      unit: supplyLot.unit,
    };
  }
}
