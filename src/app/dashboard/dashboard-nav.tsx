"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, UserPlus, Sparkles } from "lucide-react";
import { logout } from "@/app/auth/actions";

type DashboardNavProps = {
  organizationName?: string | null;
  organizationInitial: string;
};

const navItems = [
  {
    href: "/dashboard/invoices",
    label: "請求書",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/vendors",
    label: "取引先",
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
    <nav className="glass sticky top-0 z-50 border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Link href="/dashboard/invoices" className="flex items-center gap-3 shrink-0">
              <Image
                src="/logo.png"
                alt="請求受取太郎"
                width={150}
                height={45}
                priority
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex flex-wrap items-center gap-2 lg:ml-6">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive(href)
                      ? "bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-md"
                      : "text-gray-700 bg-white/65 hover:bg-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-rose-700">
              <Sparkles className="w-3.5 h-3.5" />
              今日もいいペース
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-2xl">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {organizationInitial}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {organizationName}
              </span>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 bg-white/70 hover:bg-red-50 hover:text-red-600 transition-all"
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
