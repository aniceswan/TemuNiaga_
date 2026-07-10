import { Controller, Get, Param, Query } from "@nestjs/common";
import { KoperasiService } from "./koperasi.service";

@Controller("koperasi")
export class KoperasiController {
  constructor(private readonly koperasiService: KoperasiService) {}

  @Get()
  list(@Query("page") page?: string, @Query("pageSize") pageSize?: string) {
    return this.koperasiService.list(page ? Number(page) : undefined, pageSize ? Number(pageSize) : undefined);
  }

  @Get("dashboard-totals")
  dashboardTotals() {
    return this.koperasiService.dashboardTotals();
  }

  @Get(":ref")
  findOne(@Param("ref") ref: string) {
    return this.koperasiService.findByRef(ref);
  }
}
