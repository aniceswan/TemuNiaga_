import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PesananService } from "./pesanan.service";
import { CreatePesananDto } from "./create-pesanan.dto";

@Controller("pesanan")
export class PesananController {
  constructor(private readonly pesananService: PesananService) {}

  @Post()
  create(@Body() dto: CreatePesananDto) {
    return this.pesananService.create(dto);
  }

  @Get("koperasi/:ref")
  listByKoperasi(@Param("ref") ref: string) {
    return this.pesananService.listByKoperasi(ref);
  }
}
