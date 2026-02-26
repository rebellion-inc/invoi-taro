"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateInvoiceStatus(invoiceId: string, status: "unpaid" | "paid") {
  const supabase = await createClient();

  const { error } = await supabase
    .from("invoices")
    .update({
      status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    })
    .eq("id", invoiceId);

  if (error) {
    return { error: "ステータスの更新に失敗しました: " + error.message };
  }

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
  return { success: true };
}

export async function updateInvoiceDetails(formData: FormData) {
  const supabase = await createClient();

  const invoiceId = formData.get("invoiceId") as string;
  const amountRaw = (formData.get("amount") as string | null) ?? "";
  const invoiceDate = (formData.get("invoiceDate") as string | null) ?? "";
  const status = formData.get("status") as string;

  if (!invoiceId) {
    return { error: "請求書が見つかりません" };
  }

  if (status !== "paid" && status !== "unpaid") {
    return { error: "ステータスが不正です" };
  }

  const trimmedAmount = amountRaw.trim();
  const amountValue = trimmedAmount ? Number.parseInt(trimmedAmount, 10) : null;
  if (trimmedAmount && Number.isNaN(amountValue)) {
    return { error: "請求金額が不正です" };
  }

  const { error } = await supabase
    .from("invoices")
    .update({
      amount: amountValue,
      invoice_date: invoiceDate ? invoiceDate : null,
      status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    })
    .eq("id", invoiceId);

  if (error) {
    return { error: "請求書の更新に失敗しました: " + error.message };
  }

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
  return { success: true };
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createClient();

  if (!invoiceId) {
    return { error: "請求書が見つかりません" };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "認証が必要です" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.organization_id) {
    return { error: "組織が見つかりません" };
  }

  const { data: invoice, error: fetchError } = await supabase
    .from("invoices")
    .select("file_path, organization_id")
    .eq("id", invoiceId)
    .eq("organization_id", profile.organization_id)
    .single();

  if (fetchError || !invoice) {
    return { error: "請求書が見つかりません" };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { error: "サーバー設定エラーが発生しました" };
  }

  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  const { error: deleteError } = await adminClient
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .eq("organization_id", invoice.organization_id);

  if (deleteError) {
    return { error: "削除に失敗しました: " + deleteError.message };
  }

  let storageErrorMessage: string | null = null;
  if (invoice.file_path) {
    const { error: storageError } = await adminClient.storage
      .from("invoices")
      .remove([invoice.file_path]);

    if (storageError) {
      storageErrorMessage = storageError.message;
    }
  }

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${invoiceId}`);

  if (storageErrorMessage) {
    return { error: "ファイルの削除に失敗しました: " + storageErrorMessage };
  }

  return { success: true };
}
