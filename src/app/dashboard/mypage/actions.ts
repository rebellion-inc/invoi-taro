"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

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
