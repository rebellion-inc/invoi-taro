import { createClient } from "@/lib/supabase/server";
import { getPlanLimits, isPlanTier, type PlanTier } from "@/lib/plan-limits";
import { CreditCard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SpecialCodeModal } from "./special-code-modal";

export const metadata: Metadata = {
  title: "プラン",
  description: "利用プランの確認とアップグレードができます。",
};

const planOrder: PlanTier[] = ["free", "pro", "business"];

const formatLimit = (value: number | null, unit: string) =>
  value === null ? "無制限" : `${value}${unit}`;

const statusLabel: Record<string, string> = {
  active: "有効",
  trialing: "トライアル中",
  past_due: "支払い遅延",
  canceled: "解約済み",
  unpaid: "未払い",
  incomplete: "処理中",
  incomplete_expired: "期限切れ",
  paused: "一時停止",
};

export default async function PlansPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user!.id)
    .single();

  if (!profile?.organization_id) {
    return (
      <div className="glass rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">プラン</h1>
        <p className="text-gray-600 mb-4">
          組織に所属するとプランを選択できます。先にマイページで招待を受けてください。
        </p>
        <Link
          href="/dashboard/mypage"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200"
        >
          マイページへ
        </Link>
      </div>
    );
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("name, plan_tier, subscription_status, current_period_end, stripe_customer_id")
    .eq("id", profile.organization_id)
    .single();

  const currentPlanTier =
    organization?.plan_tier && isPlanTier(organization.plan_tier)
      ? organization.plan_tier
      : "free";
  const currentPlan = getPlanLimits(currentPlanTier);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プラン</h1>
          <p className="text-sm text-gray-500">現在の契約確認とアップグレード</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">現在の契約</h2>
        <p className="text-gray-700">
          {organization?.name ?? "未設定組織"}: {currentPlan.displayName}
        </p>
        {organization?.subscription_status && (
          <p className="text-sm text-gray-500 mt-1">
            ステータス:{" "}
            {statusLabel[organization.subscription_status] ??
              organization.subscription_status}
          </p>
        )}
      </div>

      <SpecialCodeModal />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {planOrder.map((planTier) => {
          const limits = getPlanLimits(planTier);
          const isCurrent = planTier === currentPlanTier;
          const isFree = planTier === "free";
          return (
            <div key={planTier} className="glass rounded-2xl p-6 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{limits.displayName}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                {limits.monthlyPrice === 0
                  ? "0円"
                  : `¥${limits.monthlyPrice.toLocaleString()}`}
                {limits.monthlyPrice > 0 && (
                  <span className="text-sm text-gray-500 ml-1">/月</span>
                )}
              </p>

              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                <li>取引社数: {formatLimit(limits.maxVendors, "社")}まで</li>
                <li>受取可能請求書数: {formatLimit(limits.maxInvoices, "件")}</li>
                <li>CSV出力: {limits.canExportCsv ? "可能" : "不可"}</li>
                <li>組織人数: {formatLimit(limits.maxMembers, "人")}まで</li>
              </ul>

              <div className="mt-auto">
                {isCurrent ? (
                  <p className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-medium text-center">
                    現在のプラン
                  </p>
                ) : isFree ? (
                  <p className="text-sm text-gray-500">Freeへ戻す場合は下の契約管理をご利用ください。</p>
                ) : (
                  <form action="/api/stripe/checkout" method="post">
                    <input type="hidden" name="planTier" value={planTier} />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      {currentPlanTier === "free" ? "このプランで開始" : "このプランに変更"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {organization?.stripe_customer_id && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">契約管理</h2>
          <p className="text-sm text-gray-600 mb-4">
            支払い方法の変更や解約はStripeのカスタマーポータルから行えます。
          </p>
          <form action="/api/stripe/portal" method="post">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              契約を管理する
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
