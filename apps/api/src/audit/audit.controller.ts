import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../rbac/roles.guard";
import { Roles } from "../rbac/roles.decorator";
import { PrismaService } from "../prisma/prisma.service";

@Controller("audit-log")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Roles("SUPER_ADMIN", "ADMIN_PENDAMPING")
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
