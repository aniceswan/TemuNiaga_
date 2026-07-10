import { Controller, Get, Param, Query } from "@nestjs/common";
import { AnggotaService } from "./anggota.service";

@Controller("koperasi/:ref/anggota")
export class AnggotaController {
  constructor(private readonly anggotaService: AnggotaService) {}

  @Get()
  list(@Param("ref") ref: string, @Query("page") page?: string, @Query("pageSize") pageSize?: string) {
    return this.anggotaService.listByKoperasi(
      ref,
      page ? Number(page) : undefined,
      pageSize ? Number(pageSize) : undefined,
    );
  }
}
