import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { PesananService } from "./pesanan.service";
import { CreatePesananDto } from "./create-pesanan.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../rbac/roles.guard";
import { Roles } from "../rbac/roles.decorator";

@Controller("pesanan")
export class PesananController {
  constructor(private readonly pesananService: PesananService) {}

  @Post()
  create(@Body() dto: CreatePesananDto) {
    return this.pesananService.create(dto);
  }

  @Get("koperasi/:ref")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN_PENDAMPING", "PENGURUS_KOPERASI", "OPERATOR_KOPERASI")
  listByKoperasi(@Param("ref") ref: string) {
    return this.pesananService.listByKoperasi(ref);
  }
}
