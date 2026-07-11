import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ProdukService } from "./produk.service";
import { SetHargaDto } from "./set-harga.dto";
import { CreateProdukDto } from "./create-produk.dto";

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
  listByKoperasi(@Param("ref") ref: string, @Query("page") page?: string, @Query("pageSize") pageSize?: string) {
    return this.produkService.listByKoperasi(ref, page ? Number(page) : undefined, pageSize ? Number(pageSize) : undefined);
  }

  @Post()
  create(@Body() dto: CreateProdukDto) {
    return this.produkService.create(dto);
  }

  @Patch(":id/harga")
  setHarga(@Param("id") id: string, @Body() dto: SetHargaDto) {
    return this.produkService.setHarga(id, dto.hargaJual);
  }
}
