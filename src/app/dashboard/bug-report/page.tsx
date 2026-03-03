import type { Metadata } from "next";
import { Bug } from "lucide-react";
import { BugReportForm } from "./bug-report-form";

export const metadata: Metadata = {
  title: "バグレポート",
  description: "不具合報告を送信できます。",
};

export default async function BugReportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const params = await searchParams;
  const defaultPagePath = params.from ?? "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <Bug className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">バグレポート</h1>
          <p className="text-sm text-gray-500">
            不具合の内容を送信してください。改善に活用します。
          </p>
        </div>
      </div>

      <BugReportForm defaultPagePath={defaultPagePath} />
    </div>
  );
}
