// Mirrors the Prisma `Role` enum in packages/database/prisma/schema.prisma —
// keep the two in sync if either changes.
export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN_PENDAMPING",
  "PENGURUS_KOPERASI",
  "OPERATOR_KOPERASI",
  "BUYER",
  "PUBLIC",
] as const;

export type Role = (typeof ROLES)[number];
