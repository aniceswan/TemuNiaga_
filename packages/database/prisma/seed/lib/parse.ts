import { Prisma } from "@prisma/client";

function isBlank(raw?: string | null): raw is undefined | null | "" {
  return raw === undefined || raw === null || raw.trim() === "";
}

/** Handles scientific notation (e.g. "3e+09") natively via decimal.js. */
export function toDecimal(raw?: string | null): Prisma.Decimal | null {
  if (isBlank(raw)) return null;
  return new Prisma.Decimal(raw.trim());
}

export function toDate(raw?: string | null): Date | null {
  if (isBlank(raw)) return null;
  const d = new Date(raw.trim());
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toInt(raw?: string | null): number | null {
  if (isBlank(raw)) return null;
  const n = Number.parseInt(raw.trim(), 10);
  return Number.isNaN(n) ? null : n;
}

export function toFloat(raw?: string | null): number | null {
  if (isBlank(raw)) return null;
  const n = Number.parseFloat(raw.trim());
  return Number.isNaN(n) ? null : n;
}

export function toStr(raw?: string | null): string | null {
  if (isBlank(raw)) return null;
  return raw;
}

export function toJson(raw?: string | null): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (isBlank(raw)) return Prisma.JsonNull;
  try {
    return JSON.parse(raw);
  } catch {
    return Prisma.JsonNull;
  }
}
