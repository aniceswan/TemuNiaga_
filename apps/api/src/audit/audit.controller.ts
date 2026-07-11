import { Controller, Get, Query } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("audit-log")
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list(@Query("page") page?: string, @Query("pageSize") pageSize?: string) {
    const take = pageSize ? Number(pageSize) : 50;
    const skip = page ? (Number(page) - 1) * take : 0;
    return this.prisma.client.auditEvent.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }
}
