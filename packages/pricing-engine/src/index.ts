// Typed contract for the netback calculation from plan.md §18's YAML shape.
// NOT implemented this pass (Fase 4 — Price Intelligence): the calculation
// requires the BPS/Panel Harga Pangan adapters, region/grade normalization,
// and outlier cleaning pipeline from plan.md §18, none of which exist yet.
// This stub exists so downstream code (apps/api, dashboards) can compile
// against the real shape before the implementation lands, instead of
// inventing ad-hoc placeholder types later.

export type DataStrength = "strong" | "medium" | "weak";

export interface NetbackInput {
  commodity: string;
  region: string;
  grade: string;
  volume: number;
  unit: string;
}

export interface NetbackCosts {
  collection: number;
  grading: number;
  packaging: number;
  transport: number;
  cooperativeService: number;
  platform: number;
}

export interface NetbackResult {
  commodity: string;
  region: string;
  grade: string;
  volume: number;
  unit: string;
  referenceRange: { min: number; median: number; max: number };
  activeBuyerOffer: number | null;
  estimatedCosts: NetbackCosts;
  estimatedFarmerReceipt: number;
  sources: string[];
  updatedAt: string;
  dataStrength: DataStrength;
}

export class NotImplementedError extends Error {
  constructor(fn: string) {
    super(`${fn} is not implemented yet — see plan.md §18 (Fase 4: Price Intelligence)`);
    this.name = "NotImplementedError";
  }
}

export function computeNetback(_input: NetbackInput): NetbackResult {
  throw new NotImplementedError("computeNetback");
}
