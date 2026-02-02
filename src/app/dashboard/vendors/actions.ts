"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createVendor(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "認証が必要です" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) {
    return { error: "組織が見つかりません" };
  }

  const name = formData.get("name") as string;

  const { error } = await supabase.from("vendors").insert({
    name,
    organization_id: profile.organization_id,
  });

  if (error) {
    return { error: "取引先の作成に失敗しました: " + error.message };
  }

  revalidatePath("/dashboard/vendors");
  return { success: true };
}

export async function deleteVendor(vendorId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("vendors").delete().eq("id", vendorId);

  if (error) {
    return { error: "削除に失敗しました: " + error.message };
  }

  revalidatePath("/dashboard/vendors");
  return { success: true };
}
