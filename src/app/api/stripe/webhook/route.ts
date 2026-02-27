import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getPlanTierByStripePriceId,
  getStripeClient,
} from "@/lib/stripe/server";
import { isPlanTier, type PlanTier } from "@/lib/plan-limits";

export const runtime = "nodejs";

const getAdminClient = () =>
  createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

const resolvePlanTierFromSubscription = (
  subscription: Stripe.Subscription
): PlanTier => {
  if (subscription.status === "canceled") {
    return "free";
  }

  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) {
    throw new Error("subscriptionのpriceが見つかりません");
  }

  const planTier = getPlanTierByStripePriceId(priceId);
  if (!planTier) {
    throw new Error(`未対応のStripe price IDです: ${priceId}`);
  }

  return planTier;
};

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "署名がありません" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRETが未設定です" },
      { status: 500 }
    );
  }

  const payload = await request.text();
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEYが未設定です" },
      { status: 500 }
    );
  }
  const stripe = getStripeClient();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "署名検証に失敗しました" }, { status: 400 });
  }

  const adminClient = getAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.client_reference_id ?? session.metadata?.organization_id;
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        const metadataPlanTier = session.metadata?.plan_tier;

        if (!organizationId || !customerId) {
          throw new Error("Checkout Sessionにorganization/customer情報がありません");
        }

        const updatePayload: {
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          subscription_status: string;
          plan_tier?: PlanTier;
        } = {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId ?? null,
          subscription_status: "active",
        };

        if (metadataPlanTier && isPlanTier(metadataPlanTier)) {
          updatePayload.plan_tier = metadataPlanTier;
        }

        const { error } = await adminClient
          .from("organizations")
          .update(updatePayload)
          .eq("id", organizationId);
        if (error) {
          throw new Error("Checkout反映に失敗しました: " + error.message);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const priceId = subscription.items.data[0]?.price.id ?? null;
        const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
        const planTier = resolvePlanTierFromSubscription(subscription);

        const updatePayload = {
          stripe_subscription_id:
            event.type === "customer.subscription.deleted" ? null : subscription.id,
          stripe_price_id: planTier === "free" ? null : priceId,
          subscription_status: subscription.status,
          current_period_end: currentPeriodEnd
            ? new Date(currentPeriodEnd * 1000).toISOString()
            : null,
          plan_tier: planTier,
        };

        const { data: updatedOrganizations, error } = await adminClient
          .from("organizations")
          .update(updatePayload)
          .eq("stripe_customer_id", customerId)
          .select("id");
        if (error) {
          throw new Error("Subscription反映に失敗しました: " + error.message);
        }
        if (!updatedOrganizations || updatedOrganizations.length === 0) {
          const metadataOrganizationId = subscription.metadata.organization_id;
          if (!metadataOrganizationId) {
            throw new Error("Stripe顧客に紐づく組織が見つかりません");
          }
          const { error: fallbackError } = await adminClient
            .from("organizations")
            .update({
              ...updatePayload,
              stripe_customer_id: customerId,
            })
            .eq("id", metadataOrganizationId);
          if (fallbackError) {
            throw new Error("Subscription反映に失敗しました: " + fallbackError.message);
          }
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook処理に失敗しました" },
      { status: 500 }
    );
  }
}
