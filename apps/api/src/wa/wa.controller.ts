import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { WaService } from "./wa.service";
import { RegisterWaDto } from "./register.dto";

@Controller("wa")
export class WaController {
  constructor(private readonly waService: WaService) {}

  @Post("register")
  register(@Body() dto: RegisterWaDto) {
    return this.waService.register(dto);
  }

  @Get("register/:phone")
  lookup(@Param("phone") phone: string) {
    return this.waService.lookup(phone);
  }
}
