"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const SPECIAL_CODE = "thanksForUsing!!";

export async function unlockProBySpecialCode(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "認証が必要です" };
  }

  const specialCode = ((formData.get("specialCode") as string | null) ?? "").trim();
  if (!specialCode) {
    return { error: "コードを入力してください" };
  }

  if (specialCode !== SPECIAL_CODE) {
    return { error: "コードが正しくありません" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) {
    return { error: "組織に所属していないため利用できません" };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { error: "サーバー設定エラーが発生しました" };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return { error: "サーバー設定エラーが発生しました" };
  }

  const adminClient = createAdminClient(supabaseUrl, serviceRoleKey);
  const { error } = await adminClient
    .from("organizations")
    .update({ plan_tier: "pro" })
    .eq("id", profile.organization_id);

  if (error) {
    return { error: "プラン更新に失敗しました: " + error.message };
  }

  revalidatePath("/dashboard/plans");
  revalidatePath("/dashboard");
  return { success: true };
}
