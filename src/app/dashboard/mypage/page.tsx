import { createClient } from "@/lib/supabase/server";
import { Building2, CreditCard, LogOut, UserPlus, UserX } from "lucide-react";
import { InviteMemberForm } from "./invite-member-form";
import { CreateOrganizationForm } from "./create-organization-form";
import type { Metadata } from "next";
import { isPlanTier } from "@/lib/plan-limits";
import { logout } from "@/app/auth/actions";
import { TutorialStartButton } from "./tutorial-start-button";

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
    .select("organization_id, organizations(name, plan_tier)")
    .eq("id", user!.id)
    .single();

  const organizationData = Array.isArray(profile?.organizations)
    ? profile.organizations[0]
    : profile?.organizations;
  const organizationName = organizationData?.name ?? null;
  const planTier = organizationData?.plan_tier;
  const planLabel =
    typeof planTier === "string" && isPlanTier(planTier)
      ? planTier.charAt(0).toUpperCase() + planTier.slice(1)
      : "Free";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-linear-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">マイページ</h1>
          <p className="text-sm text-gray-500">組織情報とメンバー管理</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">所属組織</h2>
        {organizationName ? (
          <p className="text-gray-700">{organizationName}</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <UserX className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm">
                現在、組織に所属していません。既存メンバーから招待を受けるか、新しい組織を作成してください。
              </p>
            </div>
            <CreateOrganizationForm />
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
          <p className="text-sm text-gray-600">
            組織未所属のため招待はできません。所属後にこの画面から招待できます。
          </p>
        )}
      </div>

      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">アカウント</h2>
            </div>
            <p className="text-sm text-gray-500">プラン確認と各種操作をここから実行できます</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/70 bg-white/60 p-4">
            <p className="text-xs font-medium text-gray-500">現在のプラン</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{planLabel}</p>
            <p className="mt-1 text-xs text-gray-500">詳細設定はプラン画面で変更できます</p>
          </div>

          <div className="rounded-xl border border-white/70 bg-white/60 p-4">
            <p className="text-xs font-medium text-gray-500">クイック操作</p>
            <div className="mt-3 flex flex-col gap-2">
              <TutorialStartButton />
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white/70 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
