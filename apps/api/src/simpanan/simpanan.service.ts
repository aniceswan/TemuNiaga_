import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SimpananService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * plan.md §13.3's "status pembayaran" for WhatsApp maps to real seeded
   * Simpanan data (savings payment status), not the schema-only Payment
   * model (which has no rows yet -- no invoices/contracts exist). This is
   * the honest, demoable analogue: real member savings-payment status.
   */
  async statusByAnggota(anggotaRef: string) {
    const anggota = await this.prisma.client.anggota.findUnique({ where: { anggotaRef } });
    if (!anggota) throw new NotFoundException(`Anggota ${anggotaRef} tidak ditemukan`);

    const simpanan = await this.prisma.client.simpanan.findMany({
      where: { anggotaRef },
      orderBy: { dibuatPada: "desc" },
      take: 5,
    });

    return {
      anggotaRef: anggota.anggotaRef,
      nama: anggota.nama,
      riwayatSimpanan: simpanan.map((s) => ({
        periode: s.periodePembayaran,
        jumlah: s.jumlahSimpanan,
        status: s.status,
        dibayarPada: s.dibayarPada,
      })),
    };
  }
}
