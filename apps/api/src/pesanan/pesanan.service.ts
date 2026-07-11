import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreatePesananDto } from "./create-pesanan.dto";
import type {
  CreatePesananResponse,
  PesananListResponse,
  PesananSummary,
} from "@temuniaga/contracts";

@Injectable()
export class PesananService {
  constructor(private readonly prisma: PrismaService) {}

  /** Checkout: keranjang lintas-kopdes dipecah jadi satu Pesanan per kopdes, gaya Shopee. */
  async create(dto: CreatePesananDto): Promise<CreatePesananResponse> {
    const produkIds = dto.items.map((i) => i.produkSampleId);
    const produkList = await this.prisma.client.produk.findMany({
      where: { produkSampleId: { in: produkIds } },
      include: { koperasi: { select: { namaKoperasi: true } } },
    });

    const produkMap = new Map(produkList.map((p) => [p.produkSampleId, p]));
    for (const item of dto.items) {
      const produk = produkMap.get(item.produkSampleId);
      if (!produk) throw new BadRequestException(`Produk ${item.produkSampleId} tidak ditemukan`);
      if (produk.hargaJual === null) {
        throw new BadRequestException(`Produk ${produk.namaProduk ?? item.produkSampleId} belum dijual di marketplace`);
      }
    }

    const itemsByKoperasi = new Map<string, typeof dto.items>();
    for (const item of dto.items) {
      const produk = produkMap.get(item.produkSampleId)!;
      const list = itemsByKoperasi.get(produk.koperasiRef) ?? [];
      list.push(item);
      itemsByKoperasi.set(produk.koperasiRef, list);
    }

    const created = await this.prisma.client.$transaction(async (tx) => {
      const results: CreatePesananResponse["pesanan"] = [];

      for (const [koperasiRef, items] of itemsByKoperasi) {
        const itemsData = items.map((item) => {
          const produk = produkMap.get(item.produkSampleId)!;
          const hargaSatuan = Number(produk.hargaJual);
          const subtotal = hargaSatuan * item.jumlah;
          return {
            produkSampleId: item.produkSampleId,
            namaProduk: produk.namaProduk ?? "Produk tanpa nama",
            hargaSatuan,
            jumlah: item.jumlah,
            subtotal,
          };
        });
        const totalHarga = itemsData.reduce((sum, i) => sum + i.subtotal, 0);

        const pesanan = await tx.pesanan.create({
          data: {
            koperasiRef,
            namaPembeli: dto.namaPembeli,
            teleponPembeli: dto.teleponPembeli,
            alamatPembeli: dto.alamatPembeli,
            totalHarga,
            items: { create: itemsData },
          },
          include: { koperasi: { select: { namaKoperasi: true } } },
        });

        results.push({
          pesananRef: pesanan.pesananRef,
          koperasiRef: pesanan.koperasiRef,
          namaKoperasi: pesanan.koperasi.namaKoperasi,
          totalHarga: pesanan.totalHarga.toString(),
          status: pesanan.status,
        });
      }

      return results;
    });

    return { pesanan: created };
  }

  async listByKoperasi(koperasiRef: string): Promise<PesananListResponse> {
    const [total, rows] = await Promise.all([
      this.prisma.client.pesanan.count({ where: { koperasiRef } }),
      this.prisma.client.pesanan.findMany({
        where: { koperasiRef },
        orderBy: { dibuatPada: "desc" },
        include: { items: true },
      }),
    ]);

    const items: PesananSummary[] = rows.map((p) => ({
      pesananRef: p.pesananRef,
      koperasiRef: p.koperasiRef,
      namaPembeli: p.namaPembeli,
      teleponPembeli: p.teleponPembeli,
      alamatPembeli: p.alamatPembeli,
      totalHarga: p.totalHarga.toString(),
      status: p.status,
      dibuatPada: p.dibuatPada.toISOString(),
      items: p.items.map((i) => ({
        namaProduk: i.namaProduk,
        hargaSatuan: i.hargaSatuan.toString(),
        jumlah: i.jumlah,
        subtotal: i.subtotal.toString(),
      })),
    }));

    return { total, items };
  }
}
