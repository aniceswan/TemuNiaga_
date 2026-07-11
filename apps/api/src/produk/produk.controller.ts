import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ProdukService } from "./produk.service";
import { SetHargaDto } from "./set-harga.dto";
import { CreateProdukDto } from "./create-produk.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../rbac/roles.guard";
import { Roles } from "../rbac/roles.decorator";

@Controller("produk")
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Get()
  listMarketplace(
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("koperasiRef") koperasiRef?: string,
    @Query("search") search?: string,
  ) {
    return this.produkService.listMarketplace({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      koperasiRef,
      search,
    });
  }

  @Get("koperasi/:ref")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN_PENDAMPING", "PENGURUS_KOPERASI", "OPERATOR_KOPERASI")
  listByKoperasi(@Param("ref") ref: string, @Query("page") page?: string, @Query("pageSize") pageSize?: string) {
    return this.produkService.listByKoperasi(ref, page ? Number(page) : undefined, pageSize ? Number(pageSize) : undefined);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN_PENDAMPING", "PENGURUS_KOPERASI", "OPERATOR_KOPERASI")
  create(@Body() dto: CreateProdukDto) {
    return this.produkService.create(dto);
  }

  @Patch(":id/harga")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN_PENDAMPING", "PENGURUS_KOPERASI", "OPERATOR_KOPERASI")
  setHarga(@Param("id") id: string, @Body() dto: SetHargaDto) {
    return this.produkService.setHarga(id, dto.hargaJual);
  }
}
