import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { RegisterWaDto } from "./register.dto";

@Injectable()
export class WaService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterWaDto) {
    if (dto.anggotaRef) {
      const anggota = await this.prisma.client.anggota.findUnique({ where: { anggotaRef: dto.anggotaRef } });
      if (!anggota) throw new NotFoundException(`Anggota ${dto.anggotaRef} tidak ditemukan`);
    }

    return this.prisma.client.waRegistration.upsert({
      where: { phone: dto.phone },
      update: { anggotaRef: dto.anggotaRef, koperasiRef: dto.koperasiRef },
      create: { phone: dto.phone, anggotaRef: dto.anggotaRef, koperasiRef: dto.koperasiRef },
    });
  }

  async lookup(phone: string) {
    const registration = await this.prisma.client.waRegistration.findUnique({ where: { phone } });
    if (!registration) throw new NotFoundException(`Nomor ${phone} belum terdaftar`);
    return registration;
  }
}
