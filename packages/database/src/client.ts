import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __temuniagaPrisma: PrismaClient | undefined;
}

export const prisma = globalThis.__temuniagaPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__temuniagaPrisma = prisma;
}
