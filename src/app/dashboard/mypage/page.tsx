import { createClient } from "@/lib/supabase/server";
import { Building2, UserPlus, UserX } from "lucide-react";
import { InviteMemberForm } from "./invite-member-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "マイページ",
  description: "組織情報の確認とメンバー招待を行います。",
};

export default async function MyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id, organizations(name)")
    .eq("id", user!.id)
    .single();

  const organizationData = Array.isArray(profile?.organizations)
    ? profile.organizations[0]
    : profile?.organizations;
  const organizationName = organizationData?.name ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">マイページ</h1>
          <p className="text-sm text-gray-500">今の所属と招待状況を確認</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">いまの所属</h2>
        {organizationName ? (
          <p className="text-gray-700">{organizationName}</p>
        ) : (
          <div className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-4">
            <UserX className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm">
                まだ組織に所属していません。招待が届いたらすぐに始められます。
              </p>
            </div>
          )}
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">メンバー招待</h2>
        </div>
        {profile?.organization_id ? (
          <InviteMemberForm />
        ) : (
            <p className="text-sm text-gray-600">所属後に、この画面から招待できます。</p>
        )}
      </div>
    </div>
  );
}
