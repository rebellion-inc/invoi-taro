import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { InvoiceDetailForm } from "./invoice-detail-form";

export const metadata: Metadata = {
  title: "請求書詳細",
  description: "請求書の詳細を確認し、内容を更新できます。",
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) {
    notFound();
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*, vendors(name)")
    .eq("id", id)
    .eq("organization_id", profile.organization_id)
    .single();

  if (error || !invoice) {
    notFound();
  }

  const fileUrl = `/api/file/${encodeURIComponent(invoice.file_path)}`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">請求書詳細</h1>
          <p className="text-gray-500 text-sm">請求書情報の確認と更新</p>
        </div>
      </div>

      <div className="mb-6">
        <Link
          href="/dashboard/invoices"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          一覧へ戻る
        </Link>
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">取引先</p>
            <p className="text-lg font-semibold text-gray-900">
              {invoice.vendors?.name || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">アップロード日</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(invoice.uploaded_at).toLocaleDateString("ja-JP")}
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-gray-500">ファイル</p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  {invoice.file_name}
                </a>
              </div>
              <div className="md:text-right">
                <p className="text-sm text-gray-500">請求金額</p>
                <p className="text-lg font-semibold text-gray-900">
                  {invoice.amount != null ? `¥${invoice.amount.toLocaleString()}` : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvoiceDetailForm
        invoiceId={invoice.id}
        initialAmount={invoice.amount}
        initialInvoiceDate={invoice.invoice_date}
        initialStatus={invoice.status}
      />
    </div>
  );
}
