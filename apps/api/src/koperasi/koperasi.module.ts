import { Module } from "@nestjs/common";
import { KoperasiController } from "./koperasi.controller";
import { KoperasiService } from "./koperasi.service";

@Module({
  controllers: [KoperasiController],
  providers: [KoperasiService],
})
export class KoperasiModule {}
