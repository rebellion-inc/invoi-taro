import type { PlanTier } from "@/lib/plan-limits";
import Stripe from "stripe";

export type PaidPlanTier = Exclude<PlanTier, "free">;

const getPriceIdMap = () => {
  const proPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY_ID;
  const businessPriceId = process.env.STRIPE_PRICE_BUSINESS_MONTHLY_ID;

  if (!proPriceId || !businessPriceId) {
    throw new Error("Stripe Price IDが設定されていません");
  }

  return {
    pro: proPriceId,
    business: businessPriceId,
  } as const;
};

export function assertStripeConfig() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEYが設定されていません");
  }
}

export function getStripeClient() {
  assertStripeConfig();
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export function getStripePriceIdByPlanTier(planTier: PaidPlanTier) {
  const map = getPriceIdMap();
  return map[planTier];
}

export function getPlanTierByStripePriceId(priceId: string): PaidPlanTier | null {
  const map = getPriceIdMap();
  if (priceId === map.pro) {
    return "pro";
  }
  if (priceId === map.business) {
    return "business";
  }
  return null;
}
