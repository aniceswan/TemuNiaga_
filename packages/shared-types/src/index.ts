// Status lifecycles transcribed verbatim from plan.md §24 "Status Lifecycle".
// These are the canonical state machines for trade-flow entities — import
// these unions instead of re-typing the string literals elsewhere.

/** plan.md §24 "Supply lot" */
export const SUPPLY_LOT_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "VERIFIED",
  "AVAILABLE",
  "RESERVED",
  "ALLOCATED",
  "COLLECTED",
  "QC_PASSED",
  "SHIPPED",
  "DELIVERED",
  "SETTLED",
  "REJECTED",
  "CANCELLED",
  "DAMAGED",
  "EXPIRED",
] as const;
export type SupplyLotStatus = (typeof SUPPLY_LOT_STATUSES)[number];

/** plan.md §24 "RFQ" */
export const RFQ_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "MATCHING",
  "QUOTED",
  "NEGOTIATING",
  "ACCEPTED",
  "CONTRACTED",
  "FULFILLED",
  "CLOSED",
] as const;
export type RfqStatus = (typeof RFQ_STATUSES)[number];

/** plan.md §24 "Payment" */
export const PAYMENT_STATUSES = [
  "PENDING",
  "INVOICED",
  "PARTIALLY_PAID",
  "PAID",
  "RECONCILED",
  "SETTLED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/** plan.md §24 "Complaint" */
export const COMPLAINT_STATUSES = [
  "OPEN",
  "INVESTIGATING",
  "RESOLVED",
  "REJECTED",
  "ESCALATED",
] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

/** plan.md §10 "Readiness categories" */
export const READINESS_CATEGORIES = [
  "KURANG_SIAP",
  "MENENGAH",
  "SIAP",
  "LEAD_READY",
] as const;
export type ReadinessCategory = (typeof READINESS_CATEGORIES)[number];
