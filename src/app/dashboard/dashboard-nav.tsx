"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Menu,
  X,
  CreditCard,
} from "lucide-react";

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
  {
    href: "/dashboard/plans",
    label: "プラン",
    icon: CreditCard,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard/invoices" && pathname === "/dashboard") {
      return true;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard/invoices" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/logo.png"
                alt="請求受取太郎"
                width={150}
                height={45}
                priority
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:items-center sm:space-x-2">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                    isActive(href) ? "text-indigo-600" : "text-gray-700"
                  } hover:bg-white/50 hover:text-indigo-600 transition-all`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-xl p-2 text-gray-700 hover:bg-white/60 transition-all"
            aria-label="メニューを開閉"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 py-3 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
                  isActive(href) ? "text-indigo-600 bg-indigo-50" : "text-gray-700"
                } hover:bg-white/50 hover:text-indigo-600 transition-all`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
