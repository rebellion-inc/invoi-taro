export type PlanTier = "free" | "pro" | "business";

export type PlanLimits = {
  maxVendors: number | null;
  maxInvoices: number | null;
  maxMembers: number | null;
  canExportCsv: boolean;
  monthlyPrice: number;
  displayName: string;
};

const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    maxVendors: 5,
    maxInvoices: 5,
    maxMembers: 1,
    canExportCsv: false,
    monthlyPrice: 0,
    displayName: "Free",
  },
  pro: {
    maxVendors: 50,
    maxInvoices: 300,
    maxMembers: 3,
    canExportCsv: true,
    monthlyPrice: 980,
    displayName: "Pro",
  },
  business: {
    maxVendors: null,
    maxInvoices: null,
    maxMembers: null,
    canExportCsv: true,
    monthlyPrice: 4980,
    displayName: "Business",
  },
};

export function isPlanTier(value: string): value is PlanTier {
  return value === "free" || value === "pro" || value === "business";
}

export function getPlanLimits(planTier: PlanTier): PlanLimits {
  return PLAN_LIMITS[planTier];
}
