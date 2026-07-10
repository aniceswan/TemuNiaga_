import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("healthz")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    try {
      await this.prisma.client.$queryRaw`SELECT 1`;
      return { status: "ok", db: "connected" };
    } catch {
      throw new ServiceUnavailableException({ status: "error", db: "unreachable" });
    }
  }
}
