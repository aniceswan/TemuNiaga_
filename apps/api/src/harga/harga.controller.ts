import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { HargaService } from "./harga.service";
import { RefreshHargaDto } from "./refresh-harga.dto";

@Controller("harga")
export class HargaController {
  constructor(private readonly hargaService: HargaService) {}

  @Post("refresh")
  refresh(@Body() dto: RefreshHargaDto) {
    return this.hargaService.refreshFromBps(dto);
  }

  @Get(":komoditas")
  getByKomoditas(@Param("komoditas") komoditas: string) {
    return this.hargaService.getByKomoditas(komoditas);
  }
}
