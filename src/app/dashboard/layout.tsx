import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNav from "./dashboard-nav";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(*)")
    .eq("id", user.id)
    .single();

  const organizationName = profile?.organizations?.name ?? "組織未所属";
  const organizationInitial = organizationName?.[0] ?? "未";

  return (
    <div className="ops-theme min-h-screen bg-gradient-mesh">
      <DashboardNav
        organizationName={organizationName}
        organizationInitial={organizationInitial}
      />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
