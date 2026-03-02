"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { getPlanLimits, isPlanTier } from "@/lib/plan-limits";
import {
  sendInvitationEmail,
  sendExistingUserInvitationEmail,
} from "@/lib/notifications/invitation";

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

  // 組織名を取得（招待メール用）
  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", profile.organization_id)
    .single();
  const organizationName = org?.name ?? "組織";

  // 既に同じ組織への pending 招待が存在するかチェック
  const { data: existingInvitation } = await adminClient
    .from("organization_invitations")
    .select("id")
    .eq("organization_id", profile.organization_id)
    .ilike("email", email)
    .eq("status", "pending")
    .gte("expires_at", new Date().toISOString())
    .maybeSingle();

  if (existingInvitation) {
    return { error: "このメールアドレスには既に招待を送信済みです" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(".supabase.co", "").replace("https://", "https://") ?? "";

  if (!targetProfiles || targetProfiles.length === 0) {
    // 未登録ユーザー: 招待レコード作成 + メール送信
    const { data: invitation, error: inviteError } = await adminClient
      .from("organization_invitations")
      .insert({
        organization_id: profile.organization_id,
        email,
        invited_by: user.id,
      })
      .select("token")
      .single();

    if (inviteError) {
      return { error: "招待の作成に失敗しました: " + inviteError.message };
    }

    const signupUrl = `${baseUrl}/signup?invitation_token=${invitation.token}`;
    try {
      await sendInvitationEmail({
        to: email,
        organizationName,
        inviterEmail: user.email ?? "",
        signupUrl,
      });
    } catch {
      // メール送信失敗時は招待レコードを削除
      await adminClient
        .from("organization_invitations")
        .delete()
        .eq("id", invitation.token);
      return { error: "招待メールの送信に失敗しました" };
    }

    revalidatePath("/dashboard/mypage");
    return { success: true, invited: true as const };
  }

  if (targetProfiles.length > 1) {
    return { error: "同一メールのユーザーが複数見つかりました" };
  }

  const targetProfile = targetProfiles[0];
  if (targetProfile.organization_id) {
    if (targetProfile.organization_id === profile.organization_id) {
      return { error: "対象ユーザーは既に同じ組織に所属しています" };
    }

    // 別組織所属ユーザー: 招待レコード作成 + メール通知
    const { error: inviteError } = await adminClient
      .from("organization_invitations")
      .insert({
        organization_id: profile.organization_id,
        email,
        invited_by: user.id,
      });

    if (inviteError) {
      return { error: "招待の作成に失敗しました: " + inviteError.message };
    }

    const dashboardUrl = `${baseUrl}/dashboard`;
    try {
      await sendExistingUserInvitationEmail({
        to: email,
        organizationName,
        inviterEmail: user.email ?? "",
        dashboardUrl,
      });
    } catch {
      // メール失敗でも招待レコードは残す（ダッシュボードで確認可能）
    }

    revalidatePath("/dashboard/mypage");
    return { success: true, invited: true as const };
  }

  // 組織未所属ユーザー: 即時追加（既存の動作）
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

export async function acceptInvitation(invitationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "認証が必要です" };
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invitation, error: fetchError } = await adminClient
    .from("organization_invitations")
    .select("id, organization_id, email, status, expires_at")
    .eq("id", invitationId)
    .single();

  if (fetchError || !invitation) {
    return { error: "招待が見つかりません" };
  }

  if (invitation.email.toLowerCase() !== user.email?.toLowerCase()) {
    return { error: "この招待はあなた宛てではありません" };
  }

  if (invitation.status !== "pending") {
    return { error: "この招待は既に処理済みです" };
  }

  if (new Date(invitation.expires_at) < new Date()) {
    await adminClient
      .from("organization_invitations")
      .update({ status: "expired" })
      .eq("id", invitationId);
    return { error: "この招待は期限切れです" };
  }

  // 組織を移動
  const { error: updateError } = await adminClient
    .from("profiles")
    .update({ organization_id: invitation.organization_id })
    .eq("id", user.id);

  if (updateError) {
    return { error: "組織の移動に失敗しました: " + updateError.message };
  }

  // 招待ステータスを更新
  await adminClient
    .from("organization_invitations")
    .update({ status: "accepted" })
    .eq("id", invitationId);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/mypage");
  return { success: true };
}

export async function declineInvitation(invitationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "認証が必要です" };
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invitation, error: fetchError } = await adminClient
    .from("organization_invitations")
    .select("id, email, status")
    .eq("id", invitationId)
    .single();

  if (fetchError || !invitation) {
    return { error: "招待が見つかりません" };
  }

  if (invitation.email.toLowerCase() !== user.email?.toLowerCase()) {
    return { error: "この招待はあなた宛てではありません" };
  }

  if (invitation.status !== "pending") {
    return { error: "この招待は既に処理済みです" };
  }

  await adminClient
    .from("organization_invitations")
    .update({ status: "declined" })
    .eq("id", invitationId);

  revalidatePath("/dashboard");
  return { success: true };
}
