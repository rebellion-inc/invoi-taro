"use client";

import { useState } from "react";
import { deleteVendor } from "./actions";
import { Copy, Check, Trash2, Link, Users } from "lucide-react";

type Vendor = {
  id: string;
  name: string;
  upload_token: string;
  created_at: string;
};

export function VendorList({ vendors }: { vendors: Vendor[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getUploadUrl = (token: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/upload/${token}`;
    }
    return `/upload/${token}`;
  };

  const copyToClipboard = async (token: string, vendorId: string) => {
    const url = getUploadUrl(token);
    await navigator.clipboard.writeText(url);
    setCopiedId(vendorId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (vendorId: string) => {
    if (confirm("この取引先を削除しますか？関連する請求書も削除されます。")) {
      await deleteVendor(vendorId);
    }
  };

  if (vendors.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">取引先がありません</p>
        <p className="text-gray-400 text-sm mt-1">上のフォームから取引先を追加してください</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              取引先名
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              アップロードリンク
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              登録日
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vendors.map((vendor, index) => (
            <tr 
              key={vendor.id} 
              className="hover:bg-indigo-50/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {vendor.name[0]}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {vendor.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                    <Link className="w-4 h-4 text-gray-400" />
                    <code className="text-xs text-gray-600">
                      /upload/{vendor.upload_token.slice(0, 8)}...
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(vendor.upload_token, vendor.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      copiedId === vendor.id
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  >
                    {copiedId === vendor.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        コピーしました
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        コピー
                      </>
                    )}
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(vendor.created_at).toLocaleDateString("ja-JP")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => handleDelete(vendor.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
