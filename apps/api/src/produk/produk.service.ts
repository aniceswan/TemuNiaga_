import { randomBytes } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { ProdukListResponse, ProdukSummary } from "@temuniaga/contracts";
import type { CreateProdukDto } from "./create-produk.dto";

function generateRef(prefix: string): string {
  return `${prefix}-${randomBytes(6).toString("hex").toUpperCase()}`;
}

@Injectable()
export class ProdukService {
  constructor(private readonly prisma: PrismaService) {}

  /** Katalog publik marketplace -- hanya produk yang sudah diberi harga oleh operator kopdes. */
  async listMarketplace(opts: {
    page?: number;
    pageSize?: number;
    koperasiRef?: string;
    search?: string;
  }): Promise<ProdukListResponse> {
    const page = opts.page ?? 1;
    const pageSize = opts.pageSize ?? 24;

    const where = {
      hargaJual: { not: null },
      ...(opts.koperasiRef ? { koperasiRef: opts.koperasiRef } : {}),
      ...(opts.search ? { namaProduk: { contains: opts.search, mode: "insensitive" as const } } : {}),
    };

    const [total, rows] = await Promise.all([
      this.prisma.client.produk.count({ where }),
      this.prisma.client.produk.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { diperbaruiPada: "desc" },
        include: {
          koperasi: { select: { namaKoperasi: true } },
          inventaris: { select: { stok: true } },
        },
      }),
    ]);

    const items: ProdukSummary[] = rows.map((p) => ({
      produkSampleId: p.produkSampleId,
      koperasiRef: p.koperasiRef,
      namaKoperasi: p.koperasi.namaKoperasi,
      namaProduk: p.namaProduk,
      unit: p.unit,
      hargaJual: (p.hargaJual ?? 0).toString(),
      stok: p.inventaris.reduce((sum, i) => sum + (i.stok ?? 0), 0),
    }));

    return { total, page, pageSize, items };
  }

  /** Produk milik satu kopdes (dipakai dashboard operator untuk atur harga). */
  async listByKoperasi(koperasiRef: string, page = 1, pageSize = 20): Promise<ProdukListResponse> {
    const where = { koperasiRef };
    const [total, rows] = await Promise.all([
      this.prisma.client.produk.count({ where }),
      this.prisma.client.produk.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { namaProduk: "asc" },
        include: {
          koperasi: { select: { namaKoperasi: true } },
          inventaris: { select: { stok: true } },
        },
      }),
    ]);

    const items: ProdukSummary[] = rows.map((p) => ({
      produkSampleId: p.produkSampleId,
      koperasiRef: p.koperasiRef,
      namaKoperasi: p.koperasi.namaKoperasi,
      namaProduk: p.namaProduk,
      unit: p.unit,
      hargaJual: (p.hargaJual ?? 0).toString(),
      stok: p.inventaris.reduce((sum, i) => sum + (i.stok ?? 0), 0),
    }));

    return { total, page, pageSize, items };
  }

  /** Operator kopdes menambah produk baru langsung ke katalog marketplace-nya sendiri. */
  async create(dto: CreateProdukDto) {
    const koperasi = await this.prisma.client.koperasi.findUnique({ where: { koperasiRef: dto.koperasiRef } });
    if (!koperasi) throw new NotFoundException(`Koperasi ${dto.koperasiRef} tidak ditemukan`);

    const now = new Date();
    const produkSampleId = generateRef("PROD");
    const stok = dto.stok ?? 0;

    const produk = await this.prisma.client.produk.create({
      data: {
        produkSampleId,
        koperasiRef: dto.koperasiRef,
        namaProduk: dto.namaProduk,
        unit: dto.unit,
        hargaJual: dto.hargaJual,
        dibuatPada: now,
        diperbaruiPada: now,
        inventaris: {
          create: {
            inventarisRef: generateRef("INV"),
            koperasiRef: dto.koperasiRef,
            namaProduk: dto.namaProduk,
            stok,
            dibuatPada: now,
            diperbaruiPada: now,
          },
        },
      },
      include: { koperasi: { select: { namaKoperasi: true } }, inventaris: { select: { stok: true } } },
    });

    const summary: ProdukSummary = {
      produkSampleId: produk.produkSampleId,
      koperasiRef: produk.koperasiRef,
      namaKoperasi: produk.koperasi.namaKoperasi,
      namaProduk: produk.namaProduk,
      unit: produk.unit,
      hargaJual: (produk.hargaJual ?? 0).toString(),
      stok: produk.inventaris.reduce((sum, i) => sum + (i.stok ?? 0), 0),
    };
    return summary;
  }

  async setHarga(produkSampleId: string, hargaJual: number) {
    const produk = await this.prisma.client.produk.findUnique({ where: { produkSampleId } });
    if (!produk) throw new NotFoundException(`Produk ${produkSampleId} tidak ditemukan`);

    const updated = await this.prisma.client.produk.update({
      where: { produkSampleId },
      data: { hargaJual },
    });

    return { produkSampleId: updated.produkSampleId, hargaJual: (updated.hargaJual ?? 0).toString() };
  }
}
