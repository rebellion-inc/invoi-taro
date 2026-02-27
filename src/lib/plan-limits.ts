export type PlanTier = "free" | "pro" | "business";

type PlanLimits = {
  maxVendors: number | null;
  maxInvoices: number | null;
};

const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: { maxVendors: 5, maxInvoices: 30 },
  pro: { maxVendors: 50, maxInvoices: 300 },
  business: { maxVendors: null, maxInvoices: null },
};

export function isPlanTier(value: string): value is PlanTier {
  return value === "free" || value === "pro" || value === "business";
}

export function getPlanLimits(planTier: PlanTier): PlanLimits {
  return PLAN_LIMITS[planTier];
}
