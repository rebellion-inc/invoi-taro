import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmailViaResend } from "./email";

type NotificationType = "uploaded" | "due_date_morning";

type BaseNotificationInput = {
  supabase: SupabaseClient;
  invoiceId: string;
  organizationId: string;
  vendorName: string;
  fileName: string;
  amount: number | null;
  invoiceDate: string | null;
};

function formatAmount(amount: number | null) {
  return amount === null ? "未入力" : `¥${amount.toLocaleString("ja-JP")}`;
}

async function getOrganizationRecipients(
  supabase: SupabaseClient,
  organizationId: string
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("organization_id", organizationId);

  if (error) {
    throw new Error(`通知先メールアドレスの取得に失敗しました: ${error.message}`);
  }

  const recipients = [...new Set((data ?? []).map((profile) => profile.email).filter(Boolean))];
  return recipients;
}

async function insertNotificationLog(
  supabase: SupabaseClient,
  input: {
    invoiceId: string;
    organizationId: string;
    notificationType: NotificationType;
    notificationKey: string;
  }
) {
  const { error } = await supabase.from("invoice_notifications").insert({
    invoice_id: input.invoiceId,
    organization_id: input.organizationId,
    notification_type: input.notificationType,
    notification_key: input.notificationKey,
  });

  if (!error) {
    return true;
  }

  if (error.code === "23505") {
    return false;
  }

  throw new Error(`通知ログの保存に失敗しました: ${error.message}`);
}

async function deleteNotificationLog(supabase: SupabaseClient, notificationKey: string) {
  const { error } = await supabase
    .from("invoice_notifications")
    .delete()
    .eq("notification_key", notificationKey);

  if (error) {
    console.error("Failed to delete notification log:", error);
  }
}

export async function sendInvoiceUploadedNotification(input: BaseNotificationInput) {
  const recipients = await getOrganizationRecipients(input.supabase, input.organizationId);
  if (recipients.length === 0) {
    return { sent: false, reason: "no_recipients" as const };
  }

  const notificationKey = `uploaded:${input.invoiceId}`;
  const inserted = await insertNotificationLog(input.supabase, {
    invoiceId: input.invoiceId,
    organizationId: input.organizationId,
    notificationType: "uploaded",
    notificationKey,
  });

  if (!inserted) {
    return { sent: false, reason: "already_sent" as const };
  }

  const dueDateLabel = input.invoiceDate ?? "未入力";
  const amountLabel = formatAmount(input.amount);
  const subject = "【請求受取太郎】新しい請求書がアップロードされました";
  const text = [
    "新しい請求書がアップロードされました。",
    `取引先: ${input.vendorName}`,
    `ファイル名: ${input.fileName}`,
    `請求金額: ${amountLabel}`,
    `請求期日: ${dueDateLabel}`,
  ].join("\n");
  const html = `
    <p>新しい請求書がアップロードされました。</p>
    <ul>
      <li>取引先: ${input.vendorName}</li>
      <li>ファイル名: ${input.fileName}</li>
      <li>請求金額: ${amountLabel}</li>
      <li>請求期日: ${dueDateLabel}</li>
    </ul>
  `;

  try {
    await sendEmailViaResend({
      to: recipients,
      subject,
      text,
      html,
    });
    return { sent: true, reason: "sent" as const };
  } catch (error) {
    await deleteNotificationLog(input.supabase, notificationKey);
    throw error;
  }
}

export async function sendInvoiceDueReminderNotification(
  input: BaseNotificationInput & { reminderDateJst: string }
) {
  const recipients = await getOrganizationRecipients(input.supabase, input.organizationId);
  if (recipients.length === 0) {
    return { sent: false, reason: "no_recipients" as const };
  }

  const notificationKey = `due_date_morning:${input.invoiceId}:${input.reminderDateJst}`;
  const inserted = await insertNotificationLog(input.supabase, {
    invoiceId: input.invoiceId,
    organizationId: input.organizationId,
    notificationType: "due_date_morning",
    notificationKey,
  });

  if (!inserted) {
    return { sent: false, reason: "already_sent" as const };
  }

  const dueDateLabel = input.invoiceDate ?? "未入力";
  const amountLabel = formatAmount(input.amount);
  const subject = `【請求受取太郎】本日期日の請求書があります（${input.vendorName}）`;
  const text = [
    "本日期日の請求書があります。",
    `取引先: ${input.vendorName}`,
    `ファイル名: ${input.fileName}`,
    `請求金額: ${amountLabel}`,
    `請求期日: ${dueDateLabel}`,
  ].join("\n");
  const html = `
    <p>本日期日の請求書があります。</p>
    <ul>
      <li>取引先: ${input.vendorName}</li>
      <li>ファイル名: ${input.fileName}</li>
      <li>請求金額: ${amountLabel}</li>
      <li>請求期日: ${dueDateLabel}</li>
    </ul>
  `;

  try {
    await sendEmailViaResend({
      to: recipients,
      subject,
      text,
      html,
    });
    return { sent: true, reason: "sent" as const };
  } catch (error) {
    await deleteNotificationLog(input.supabase, notificationKey);
    throw error;
  }
}
