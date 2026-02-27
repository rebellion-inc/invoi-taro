import { createClient } from "@/lib/supabase/server";
import { assertStripeConfig, getStripeClient } from "@/lib/stripe/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    assertStripeConfig();
    const stripe = getStripeClient();
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
      .select("stripe_customer_id")
      .eq("id", profile.organization_id)
      .single();
    if (organizationError || !organization?.stripe_customer_id) {
      return NextResponse.json(
        { error: "契約中プランが見つかりません" },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: organization.stripe_customer_id,
      return_url: `${request.nextUrl.origin}/dashboard/plans`,
    });

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: "ポータルの起動に失敗しました" },
      { status: 500 }
    );
  }
}
