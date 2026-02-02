"use server";

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

  revalidatePath("/dashboard");
  return { success: true };
}
