import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { InvoiceList } from "../invoice-list";
import { InvoiceFilters } from "../invoice-filters";
import { FileText, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "請求書一覧",
  description: "受け取った請求書の一覧を確認し、支払い状況を管理できます。",
};

const tokyoMonthFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "numeric",
});

const getTokyoMonth = () => {
  const parts = tokyoMonthFormatter.formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return `${year}-${String(month).padStart(2, "0")}`;
};

export default async function DashboardInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const baseMonth = getTokyoMonth();
  const selectedMonth = params.month ?? baseMonth;

  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user!.id)
    .single();

  if (!profile?.organization_id) {
    return (
        <div className="aoi-stage glass rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">請求書一覧</h1>
          <p className="text-gray-600 mb-4">
            招待を受けると、ここに請求書が並びます。まずはマイページを確認しましょう。
          </p>
        <Link
          href="/dashboard/mypage"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200"
        >
          マイページへ
        </Link>
      </div>
    );
  }

  // Build query
  let query = supabase
    .from("invoices")
    .select("*, vendors(name)")
    .eq("organization_id", profile.organization_id)
    .order("uploaded_at", { ascending: false });

  // Apply due date month filter
  if (selectedMonth && selectedMonth !== "all") {
    const [year, month] = selectedMonth.split("-").map(Number);
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const nextMonthStart =
      month === 12
        ? `${year + 1}-01-01`
        : `${year}-${String(month + 1).padStart(2, "0")}-01`;
    query = query
      .gte("invoice_date", startDate)
      .lt("invoice_date", nextMonthStart);
  }

  // Apply status filter
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data: invoices } = await query;

  // Calculate totals
  const totalAmount = invoices?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
  const unpaidAmount = invoices?.filter(inv => inv.status === "unpaid").reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;

  return (
    <div>
      <div className="aoi-stage glass rounded-3xl p-6 mb-8">
        <span className="aoi-kicker mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          INVOICE VIEW
        </span>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">請求書一覧</h1>
            <p className="text-gray-500 text-sm">今日やる分だけ、ゆるく確認</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mt-4">迷ったら「これから」の項目だけ見ればOKです。</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="aoi-stage rounded-3xl p-6 animate-fade-in stagger-1 opacity-0">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
              件数
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{invoices?.length || 0}<span className="text-lg text-gray-500 ml-1">件</span></p>
          <p className="text-sm text-gray-500">受け取った枚数</p>
        </div>
        
        <div className="aoi-stage rounded-3xl p-6 animate-fade-in stagger-2 opacity-0">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
              いまの合計
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">¥{totalAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">金額のめやす</p>
        </div>
        
        <div className="aoi-stage rounded-3xl p-6 animate-fade-in stagger-3 opacity-0">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
            <span className="text-xs font-medium text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
              これから
            </span>
          </div>
          <p className="text-3xl font-bold text-rose-600 mb-1">¥{unpaidAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">まだ対応中の金額</p>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden animate-fade-in stagger-4 opacity-0">
        <div className="p-6 border-b border-gray-100">
          <InvoiceFilters
            currentMonth={selectedMonth}
            currentStatus={params.status}
            baseMonth={baseMonth}
          />
        </div>
        <InvoiceList invoices={invoices || []} />
      </div>
    </div>
  );
}
