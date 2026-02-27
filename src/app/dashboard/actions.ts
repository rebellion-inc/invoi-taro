"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getPlanLimits, isPlanTier } from "@/lib/plan-limits";
import { sendInvoiceUploadedNotification } from "@/lib/notifications/invoice-notifications";
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

export async function createManualInvoice(formData: FormData) {
  const supabase = await createClient();

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

  const vendorId = formData.get("vendorId");
  const file = formData.get("file");
  const amountRaw = (formData.get("amount") as string | null) ?? "";
  const invoiceDate = (formData.get("invoiceDate") as string | null) ?? "";

  if (!vendorId || typeof vendorId !== "string") {
    return { error: "取引先を選択してください" };
  }

  if (!(file instanceof File)) {
    return { error: "請求書ファイルを選択してください" };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: "ファイルサイズは10MB以下にしてください" };
  }

  const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "PDF, PNG, JPG形式のファイルのみアップロードできます" };
  }

  const trimmedAmount = amountRaw.trim();
  const amountValue = trimmedAmount ? Number.parseInt(trimmedAmount, 10) : null;
  if (trimmedAmount && Number.isNaN(amountValue)) {
    return { error: "請求金額が不正です" };
  }
  if (amountValue !== null && amountValue < 0) {
    return { error: "請求金額は0以上で入力してください" };
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
  if (planLimits.maxInvoices !== null) {
    const { count: invoiceCount, error: countError } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", profile.organization_id);

    if (countError) {
      return { error: "請求書数の確認に失敗しました: " + countError.message };
    }

    if ((invoiceCount ?? 0) >= planLimits.maxInvoices) {
      return {
        error: `現在のプランの上限に達しています（受取可能請求書は最大${planLimits.maxInvoices}件）`,
      };
    }
  }

  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select("id, name")
    .eq("id", vendorId)
    .eq("organization_id", profile.organization_id)
    .single();

  if (vendorError || !vendor) {
    return { error: "取引先が見つかりません" };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { error: "サーバー設定エラーが発生しました" };
  }

  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  const timestamp = Date.now();
  const ext = file.name.split(".").pop() || "bin";
  const filePath = `${profile.organization_id}/${vendorId}/${timestamp}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await adminClient.storage
    .from("invoices")
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: "ファイルのアップロードに失敗しました: " + uploadError.message };
  }

  const { data: invoice, error: insertError } = await adminClient
    .from("invoices")
    .insert({
      vendor_id: vendorId,
      organization_id: profile.organization_id,
      file_path: filePath,
      file_name: file.name,
      amount: amountValue,
      invoice_date: invoiceDate || null,
    })
    .select("id, organization_id, file_name, amount, invoice_date")
    .single();

  if (insertError || !invoice) {
    await adminClient.storage.from("invoices").remove([filePath]);
    return { error: "請求書の登録に失敗しました: " + insertError?.message };
  }

  try {
    await sendInvoiceUploadedNotification({
      supabase: adminClient,
      invoiceId: invoice.id,
      organizationId: invoice.organization_id,
      vendorName: vendor.name,
      fileName: invoice.file_name,
      amount: invoice.amount,
      invoiceDate: invoice.invoice_date,
    });
  } catch (notificationError) {
    console.error("Upload notification error:", notificationError);
  }

  revalidatePath("/dashboard/invoices");
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
