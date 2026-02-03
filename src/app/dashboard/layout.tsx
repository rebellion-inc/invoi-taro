import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FileText, Users, LogOut, LayoutDashboard } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(*)")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <nav className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="請求受取太郎"
                  width={150}
                  height={45}
                  priority
                  className="h-8 w-auto"
                />
              </Link>
              <div className="ml-10 flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/50 hover:text-indigo-600 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  請求書一覧
                </Link>
                <Link
                  href="/dashboard/vendors"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-white/50 hover:text-indigo-600 transition-all"
                >
                  <Users className="w-4 h-4" />
                  取引先管理
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {profile?.organizations?.name?.[0] || "O"}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {profile?.organizations?.name}
                </span>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
