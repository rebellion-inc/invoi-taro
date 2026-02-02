"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Filter } from "lucide-react";

type Props = {
  currentMonth?: string;
  currentStatus?: string;
};

export function InvoiceFilters({ currentMonth, currentStatus }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  // Generate month options (last 12 months)
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    months.push({ value, label });
  }

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4" />
          月を選択
        </label>
        <select
          value={currentMonth || ""}
          onChange={(e) => updateFilter("month", e.target.value)}
          className="block w-44 px-4 py-2.5 rounded-xl input-modern text-gray-900 text-sm focus:outline-none cursor-pointer"
        >
          <option value="">すべての期間</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Filter className="w-4 h-4" />
          ステータス
        </label>
        <select
          value={currentStatus || "all"}
          onChange={(e) => updateFilter("status", e.target.value === "all" ? "" : e.target.value)}
          className="block w-36 px-4 py-2.5 rounded-xl input-modern text-gray-900 text-sm focus:outline-none cursor-pointer"
        >
          <option value="all">すべて</option>
          <option value="unpaid">未振込</option>
          <option value="paid">振込済</option>
        </select>
      </div>
    </div>
  );
}
