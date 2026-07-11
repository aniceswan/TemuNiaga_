import { Module } from "@nestjs/common";
import { HargaController } from "./harga.controller";
import { HargaService } from "./harga.service";

@Module({
  controllers: [HargaController],
  providers: [HargaService],
})
export class HargaModule {}
