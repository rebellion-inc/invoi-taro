"use client";

import { updateInvoiceStatus } from "./actions";
import { useState } from "react";
import { FileText, ExternalLink, Loader2 } from "lucide-react";

type Invoice = {
  id: string;
  file_name: string;
  file_path: string;
  amount: number | null;
  invoice_date: string | null;
  status: string;
  uploaded_at: string;
  vendors: { name: string } | null;
};

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (invoiceId: string, newStatus: "unpaid" | "paid") => {
    setUpdating(invoiceId);
    await updateInvoiceStatus(invoiceId, newStatus);
    setUpdating(null);
  };

  const handleViewFile = (filePath: string) => {
    window.open(`/api/file/${encodeURIComponent(filePath)}`, "_blank");
  };

  if (invoices.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">請求書がありません</p>
        <p className="text-gray-400 text-sm mt-1">取引先からの請求書がここに表示されます</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              取引先
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              ファイル名
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              請求金額
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              請求期日
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              アップロード日
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              ステータス
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {invoices.map((invoice, index) => (
            <tr 
              key={invoice.id} 
              className="hover:bg-indigo-50/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {invoice.vendors?.name?.[0] || "?"}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {invoice.vendors?.name || "-"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleViewFile(invoice.file_path)}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  {invoice.file_name.length > 20 
                    ? invoice.file_name.slice(0, 20) + "..." 
                    : invoice.file_name}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-semibold text-gray-900">
                  {invoice.amount ? `¥${invoice.amount.toLocaleString()}` : "-"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {invoice.invoice_date
                  ? new Date(invoice.invoice_date).toLocaleDateString("ja-JP")
                  : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(invoice.uploaded_at).toLocaleDateString("ja-JP")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() =>
                    handleStatusChange(
                      invoice.id,
                      invoice.status === "paid" ? "unpaid" : "paid"
                    )
                  }
                  disabled={updating === invoice.id}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    invoice.status === "paid"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  } ${updating === invoice.id ? "opacity-50" : "cursor-pointer"}`}
                >
                  {updating === invoice.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : null}
                  {invoice.status === "paid" ? "振込済" : "未振込"}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => handleViewFile(invoice.file_path)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  表示
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
