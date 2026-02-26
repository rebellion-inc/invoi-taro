import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNav from "./dashboard-nav";
import { Sparkles, Coffee } from "lucide-react";

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
    <div className="aoi-shell min-h-screen bg-gradient-mesh">
      <DashboardNav
        organizationName={organizationName}
        organizationInitial={organizationInitial}
      />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <section className="aoi-stage glass rounded-3xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="aoi-kicker mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                TODAY IS ENOUGH
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {organizationName}の今日を、軽やかに進めましょう
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                大きく片付けるより、ひとつ終わらせる。そんなペースで大丈夫です。
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-gray-700">
              <Coffee className="w-4 h-4 text-rose-500" />
              5分だけでも前進です
            </div>
          </div>
        </section>
        {children}
      </main>
    </div>
  );
}
