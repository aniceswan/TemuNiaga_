import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { fetchBpsSeries, summarize } from "./bps-client";
import type { RefreshHargaDto } from "./refresh-harga.dto";

@Injectable()
export class HargaService {
  constructor(private readonly prisma: PrismaService) {}

  /** Fetches a BPS dynamic-table series and caches its price distribution for cek_harga lookups. */
  async refreshFromBps(dto: RefreshHargaDto) {
    const values = await fetchBpsSeries({ domain: dto.domain, varId: dto.varId, th: dto.th });
    const { min, median, max } = summarize(values);

    const commodity = await this.prisma.client.commodity.upsert({
      where: { name: dto.komoditas },
      update: {},
      create: { name: dto.komoditas, defaultUnit: dto.unit ?? "kg" },
    });

    const priceCache = await this.prisma.client.priceCache.create({
      data: {
        commodityId: commodity.id,
        region: dto.region ?? null,
        hargaMin: min,
        hargaMedian: median,
        hargaMax: max,
        unit: dto.unit ?? "kg",
        sumber: "BPS",
      },
    });

    return {
      komoditas: commodity.name,
      hargaMin: priceCache.hargaMin,
      hargaMedian: priceCache.hargaMedian,
      hargaMax: priceCache.hargaMax,
      sampleSize: values.length,
      fetchedAt: priceCache.fetchedAt,
    };
  }

  async getByKomoditas(komoditasName: string) {
    const commodity = await this.prisma.client.commodity.findFirst({
      where: { name: { equals: komoditasName, mode: "insensitive" } },
    });
    if (!commodity) {
      throw new NotFoundException(`Belum ada data harga untuk komoditas "${komoditasName}"`);
    }

    const price = await this.prisma.client.priceCache.findFirst({
      where: { commodityId: commodity.id },
      orderBy: { fetchedAt: "desc" },
    });
    if (!price) {
      throw new NotFoundException(`Belum ada data harga untuk komoditas "${komoditasName}"`);
    }

    return {
      komoditas: commodity.name,
      region: price.region ?? "nasional",
      hargaMin: price.hargaMin,
      hargaMedian: price.hargaMedian,
      hargaMax: price.hargaMax,
      unit: price.unit,
      sumber: price.sumber,
      updatedAt: price.fetchedAt,
    };
  }
}
