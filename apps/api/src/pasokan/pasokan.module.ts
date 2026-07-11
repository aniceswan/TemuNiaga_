import { Module } from "@nestjs/common";
import { PasokanController } from "./pasokan.controller";
import { PasokanService } from "./pasokan.service";

@Module({
  controllers: [PasokanController],
  providers: [PasokanService],
})
export class PasokanModule {}
