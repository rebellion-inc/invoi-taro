import { createClient } from "@/lib/supabase/server";
import {
  assertStripeConfig,
  getStripeClient,
  getStripePriceIdByPlanTier,
  type PaidPlanTier,
} from "@/lib/stripe/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const isPaidPlanTier = (value: string): value is PaidPlanTier =>
  value === "pro" || value === "business";

export async function POST(request: NextRequest) {
  try {
    assertStripeConfig();
    const stripe = getStripeClient();
    const formData = await request.formData();
    const planTier = formData.get("planTier");
    if (typeof planTier !== "string" || !isPaidPlanTier(planTier)) {
      return NextResponse.json({ error: "プランが不正です" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();
    if (!profile?.organization_id) {
      return NextResponse.json({ error: "組織が見つかりません" }, { status: 403 });
    }

    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: organization, error: organizationError } = await adminClient
      .from("organizations")
      .select("id, name, stripe_customer_id")
      .eq("id", profile.organization_id)
      .single();
    if (organizationError || !organization) {
      return NextResponse.json({ error: "組織情報の取得に失敗しました" }, { status: 500 });
    }

    let stripeCustomerId = organization.stripe_customer_id as string | null;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: organization.name,
        metadata: { organization_id: organization.id },
      });
      stripeCustomerId = customer.id;

      const { error: updateError } = await adminClient
        .from("organizations")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", organization.id);
      if (updateError) {
        return NextResponse.json(
          { error: "Stripe顧客情報の保存に失敗しました" },
          { status: 500 }
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: getStripePriceIdByPlanTier(planTier),
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/dashboard/plans?checkout=success`,
      cancel_url: `${request.nextUrl.origin}/dashboard/plans?checkout=cancel`,
      client_reference_id: organization.id,
      metadata: {
        organization_id: organization.id,
        plan_tier: planTier,
      },
      subscription_data: {
        metadata: {
          organization_id: organization.id,
          plan_tier: planTier,
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "決済セッションURLの作成に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
