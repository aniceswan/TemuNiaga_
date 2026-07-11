import { Body, Controller, Post } from "@nestjs/common";
import { PasokanService } from "./pasokan.service";
import { LaporPasokanDto } from "./lapor-pasokan.dto";

@Controller("pasokan")
export class PasokanController {
  constructor(private readonly pasokanService: PasokanService) {}

  @Post()
  lapor(@Body() dto: LaporPasokanDto) {
    return this.pasokanService.lapor(dto);
  }
}
