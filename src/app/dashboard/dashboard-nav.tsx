"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, UserPlus } from "lucide-react";
import { logout } from "@/app/auth/actions";

type DashboardNavProps = {
  organizationName?: string | null;
  organizationInitial: string;
};

const navItems = [
  {
    href: "/dashboard/invoices",
    label: "請求書一覧",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/vendors",
    label: "取引先管理",
    icon: Users,
  },
  {
    href: "/dashboard/mypage",
    label: "マイページ",
    icon: UserPlus,
  },
];

export default function DashboardNav({
  organizationName,
  organizationInitial,
}: DashboardNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard/invoices" && pathname === "/dashboard") {
      return true;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:py-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/dashboard/invoices" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="請求受取太郎"
                width={150}
                height={45}
                priority
                className="h-8 w-auto"
              />
            </Link>
            <div className="sm:ml-10 flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                    isActive(href) ? "text-indigo-600" : "text-gray-700"
                  } hover:bg-white/50 hover:text-indigo-600 transition-all`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {organizationInitial}
              </div>
              <span className="max-w-28 truncate text-sm font-medium text-gray-700 sm:max-w-none">
                {organizationName}
              </span>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut className="w-4 h-4" />
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
