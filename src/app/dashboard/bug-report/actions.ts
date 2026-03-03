"use server";

import { sendEmailViaResend } from "@/lib/notifications/email";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type BugReportActionState = {
  error?: string;
  success?: boolean;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function createBugReport(
  formData: FormData
): Promise<BugReportActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "認証が必要です" };
  }

  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const description =
    (formData.get("description") as string | null)?.trim() ?? "";
  const pagePath = (formData.get("pagePath") as string | null)?.trim() ?? "";

  if (!title) {
    return { error: "件名を入力してください" };
  }

  if (!description) {
    return { error: "詳細を入力してください" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("organization_id, email")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.organization_id) {
    return { error: "組織情報の取得に失敗しました" };
  }

  const { data: bugReport, error: insertError } = await supabase
    .from("bug_reports")
    .insert({
      organization_id: profile.organization_id,
      reporter_user_id: user.id,
      title,
      description,
      page_path: pagePath || null,
    })
    .select("id")
    .single();

  if (insertError || !bugReport) {
    return {
      error: "バグレポートの送信に失敗しました: " + insertError?.message,
    };
  }

  const notificationTo = process.env.BUG_REPORT_NOTIFICATION_TO?.trim();
  if (!notificationTo) {
    console.error("BUG_REPORT_NOTIFICATION_TO is not set");
  } else {
    const reporterEmail = user.email ?? profile.email ?? "未設定";
    const locationLabel = pagePath || "未入力";
    const subject = `【請求受取太郎】バグレポート: ${title}`;
    const text = [
      "新しいバグレポートが送信されました。",
      `レポートID: ${bugReport.id}`,
      `送信者: ${reporterEmail}`,
      `発生ページ: ${locationLabel}`,
      `件名: ${title}`,
      "",
      "詳細:",
      description,
    ].join("\n");
    const html = `
      <p>新しいバグレポートが送信されました。</p>
      <ul>
        <li>レポートID: ${escapeHtml(bugReport.id)}</li>
        <li>送信者: ${escapeHtml(reporterEmail)}</li>
        <li>発生ページ: ${escapeHtml(locationLabel)}</li>
        <li>件名: ${escapeHtml(title)}</li>
      </ul>
      <p><strong>詳細:</strong></p>
      <pre style="white-space: pre-wrap;">${escapeHtml(description)}</pre>
    `;

    try {
      await sendEmailViaResend({
        to: [notificationTo],
        subject,
        text,
        html,
      });
    } catch (emailError) {
      console.error("Bug report email notification error:", emailError);
    }
  }

  revalidatePath("/dashboard/bug-report");
  return { success: true };
}
