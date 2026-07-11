import { Controller, Get, Param } from "@nestjs/common";
import { SimpananService } from "./simpanan.service";

@Controller("simpanan")
export class SimpananController {
  constructor(private readonly simpananService: SimpananService) {}

  @Get("status/:anggotaRef")
  statusByAnggota(@Param("anggotaRef") anggotaRef: string) {
    return this.simpananService.statusByAnggota(anggotaRef);
  }
}
