import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import DashboardNav from "./dashboard-nav";
import { InvitationBanner } from "@/components/invitation-banner";
import { BugReportFab } from "./bug-report-fab";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 保留中の招待を取得
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: pendingInvitations } = await adminClient
    .from("organization_invitations")
    .select("id, organization_id, email, invited_by, expires_at, organizations(name)")
    .ilike("email", user.email ?? "")
    .eq("status", "pending")
    .gte("expires_at", new Date().toISOString());

  const invitations = (pendingInvitations ?? []).map((inv) => {
    const orgData = Array.isArray(inv.organizations) ? inv.organizations[0] : inv.organizations;
    return {
      id: inv.id,
      organization_name: orgData?.name ?? "不明な組織",
      inviter_email: inv.invited_by,
    };
  });

  // invited_by（UUID）からメールアドレスを取得
  const inviterIds = [...new Set(invitations.map((i) => i.inviter_email))];
  if (inviterIds.length > 0) {
    const { data: inviterProfiles } = await adminClient
      .from("profiles")
      .select("id, email")
      .in("id", inviterIds);

    const inviterMap = new Map(
      (inviterProfiles ?? []).map((p) => [p.id, p.email])
    );
    for (const inv of invitations) {
      inv.inviter_email = inviterMap.get(inv.inviter_email) ?? inv.inviter_email;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col">
      <DashboardNav />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
          <InvitationBanner invitations={invitations} />
          {children}
        </div>
      </main>
      <SiteFooter
        className="border-t border-white/20 px-4 pt-6 pb-24 sm:pb-8"
        innerClassName="max-w-7xl mx-auto"
      />
      <BugReportFab />
    </div>
  );
}
