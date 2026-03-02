"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { getPlanLimits, isPlanTier } from "@/lib/plan-limits";

export async function createOrganization(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "認証が必要です" };
  }

  const organizationName = (formData.get("organizationName") as string | null)?.trim();
  if (!organizationName) {
    return { error: "組織名を入力してください" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return { error: "プロフィールの取得に失敗しました: " + profileError.message };
  }

  if (profile?.organization_id) {
    return { error: "既に組織に所属しています" };
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: organization, error: organizationError } = await adminClient
    .from("organizations")
    .insert({ name: organizationName })
    .select("id")
    .single();

  if (organizationError || !organization?.id) {
    return {
      error:
        "組織の作成に失敗しました: " + (organizationError?.message ?? "作成結果を取得できませんでした"),
    };
  }

  const { error: updateError } = await adminClient
    .from("profiles")
    .update({ organization_id: organization.id })
    .eq("id", user.id)
    .is("organization_id", null);

  if (updateError) {
    return { error: "プロフィールの更新に失敗しました: " + updateError.message };
  }

  revalidatePath("/dashboard/mypage");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function inviteMember(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "認証が必要です" };
  }

  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  if (!email) {
    return { error: "メールアドレスを入力してください" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) {
    return { error: "組織に所属していないため招待できません" };
  }

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select("plan_tier")
    .eq("id", profile.organization_id)
    .single();
  if (organizationError || !organization?.plan_tier) {
    return { error: "プラン情報の取得に失敗しました" };
  }
  if (!isPlanTier(organization.plan_tier)) {
    return { error: "プラン設定が不正です" };
  }

  const planLimits = getPlanLimits(organization.plan_tier);
  if (planLimits.maxMembers !== null) {
    const { count: memberCount, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", profile.organization_id);
    if (countError) {
      return { error: "組織メンバー数の確認に失敗しました: " + countError.message };
    }
    if ((memberCount ?? 0) >= planLimits.maxMembers) {
      return {
        error: `現在のプランの上限に達しています（組織メンバーは最大${planLimits.maxMembers}人）`,
      };
    }
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: targetProfiles, error: findError } = await adminClient
    .from("profiles")
    .select("id, organization_id")
    .ilike("email", email)
    .limit(2);

  if (findError) {
    return { error: "ユーザー検索に失敗しました: " + findError.message };
  }

  if (!targetProfiles || targetProfiles.length === 0) {
    return {
      error:
        "対象ユーザーが見つかりません。先に「組織未所属」でアカウントを作成してください",
    };
  }

  if (targetProfiles.length > 1) {
    return { error: "同一メールのユーザーが複数見つかりました" };
  }

  const targetProfile = targetProfiles[0];
  if (targetProfile.organization_id) {
    if (targetProfile.organization_id === profile.organization_id) {
      return { error: "対象ユーザーは既に同じ組織に所属しています" };
    }
    return { error: "対象ユーザーは別の組織に所属しているため招待できません" };
  }

  const { error: updateError } = await adminClient
    .from("profiles")
    .update({ organization_id: profile.organization_id })
    .eq("id", targetProfile.id)
    .is("organization_id", null);

  if (updateError) {
    return { error: "招待処理に失敗しました: " + updateError.message };
  }

  revalidatePath("/dashboard/mypage");
  return { success: true };
}
