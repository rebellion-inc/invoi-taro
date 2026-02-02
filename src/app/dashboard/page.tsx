import { createClient } from "@/lib/supabase/server";
import { InvoiceList } from "./invoice-list";
import { InvoiceFilters } from "./invoice-filters";
import { FileText, TrendingUp, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "請求書一覧",
  description: "受け取った請求書の一覧を確認し、支払い状況を管理できます。",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; status?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user!.id)
    .single();

  // Build query
  let query = supabase
    .from("invoices")
    .select("*, vendors(name)")
    .eq("organization_id", profile!.organization_id)
    .order("uploaded_at", { ascending: false });

  // Apply month filter
  if (params.month) {
    const [year, month] = params.month.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    query = query
      .gte("uploaded_at", startDate.toISOString())
      .lte("uploaded_at", endDate.toISOString());
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
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">請求書一覧</h1>
          <p className="text-gray-500 text-sm">アップロードされた請求書を管理</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-2xl p-6 card-hover animate-fade-in stagger-1 opacity-0">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
              総数
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{invoices?.length || 0}<span className="text-lg text-gray-500 ml-1">件</span></p>
          <p className="text-sm text-gray-500">請求書数</p>
        </div>
        
        <div className="glass rounded-2xl p-6 card-hover animate-fade-in stagger-2 opacity-0">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
              合計
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">¥{totalAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">合計金額</p>
        </div>
        
        <div className="glass rounded-2xl p-6 card-hover animate-fade-in stagger-3 opacity-0">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
            <span className="text-xs font-medium text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
              要対応
            </span>
          </div>
          <p className="text-3xl font-bold text-rose-600 mb-1">¥{unpaidAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">未振込金額</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden animate-fade-in stagger-4 opacity-0">
        <div className="p-6 border-b border-gray-100">
          <InvoiceFilters currentMonth={params.month} currentStatus={params.status} />
        </div>
        <InvoiceList invoices={invoices || []} />
      </div>
    </div>
  );
}
