"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Filter } from "lucide-react";

type Props = {
  currentMonth?: string;
  currentStatus?: string;
  baseMonth: string;
};

const getMonthOptions = (baseMonth: string) => {
  const [year, month] = baseMonth.split("-").map(Number);
  const baseIndex = year * 12 + (month - 1);
  return Array.from({ length: 12 }, (_, i) => {
    const index = baseIndex - i;
    const optionYear = Math.floor(index / 12);
    const optionMonth = (index % 12) + 1;
    const value = `${optionYear}-${String(optionMonth).padStart(2, "0")}`;
    const label = `${optionYear}年${optionMonth}月`;
    return { value, label };
  });
};

export function InvoiceFilters({ currentMonth, currentStatus, baseMonth }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard/invoices?${params.toString()}`);
  };

  const months = getMonthOptions(baseMonth);

  return (
    <div className="aoi-stage rounded-2xl p-4 flex flex-wrap gap-4 items-end">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4" />
          月でしぼる
        </label>
        <select
          value={currentMonth || "all"}
          onChange={(e) => updateFilter("month", e.target.value)}
          className="block w-48 px-4 py-2.5 rounded-xl input-modern text-gray-900 text-sm focus:outline-none cursor-pointer"
        >
          <option value="all">すべての月</option>
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
          状態
        </label>
        <select
          value={currentStatus || "all"}
          onChange={(e) => updateFilter("status", e.target.value === "all" ? "" : e.target.value)}
          className="block w-40 px-4 py-2.5 rounded-xl input-modern text-gray-900 text-sm focus:outline-none cursor-pointer"
        >
          <option value="all">すべて</option>
          <option value="unpaid">これから</option>
          <option value="paid">対応ずみ</option>
        </select>
      </div>
    </div>
  );
}
