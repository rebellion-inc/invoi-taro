"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bug } from "lucide-react";

export function BugReportFab() {
  const pathname = usePathname();

  if (pathname === "/dashboard/bug-report") {
    return null;
  }

  const href = pathname
    ? `/dashboard/bug-report?from=${encodeURIComponent(pathname)}`
    : "/dashboard/bug-report";

  return (
    <Link
      href={href}
      aria-label="バグを報告"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg transition-colors hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
    >
      <Bug className="h-6 w-6" />
    </Link>
  );
}
