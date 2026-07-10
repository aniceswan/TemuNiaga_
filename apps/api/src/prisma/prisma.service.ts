import { Injectable } from "@nestjs/common";
import { prisma } from "@temuniaga/database";

/** Thin Nest-injectable wrapper around the shared @temuniaga/database client. */
@Injectable()
export class PrismaService {
  readonly client = prisma;
}
