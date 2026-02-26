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

  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("file_path")
    .eq("vendor_id", vendorId);

  if (invoicesError) {
    return { error: "請求書の取得に失敗しました: " + invoicesError.message };
  }

  const filePaths = (invoices || [])
    .map((invoice) => invoice.file_path)
    .filter((filePath): filePath is string => Boolean(filePath));

  const { error: invoiceDeleteError } = await supabase
    .from("invoices")
    .delete()
    .eq("vendor_id", vendorId);

  if (invoiceDeleteError) {
    return { error: "請求書の削除に失敗しました: " + invoiceDeleteError.message };
  }

  const { error: vendorDeleteError } = await supabase
    .from("vendors")
    .delete()
    .eq("id", vendorId);

  if (vendorDeleteError) {
    return { error: "削除に失敗しました: " + vendorDeleteError.message };
  }

  let storageErrorMessage: string | null = null;
  if (filePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("invoices")
      .remove(filePaths);

    if (storageError) {
      storageErrorMessage = storageError.message;
    }
  }

  revalidatePath("/dashboard/vendors");
  revalidatePath("/dashboard/invoices");

  if (storageErrorMessage) {
    return { error: "請求書ファイルの削除に失敗しました: " + storageErrorMessage };
  }

  return { success: true };
}
