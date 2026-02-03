"use client";

import { login } from "@/app/auth/actions";
import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: { error: string } | null, formData: FormData) => {
      return await login(formData);
    },
    null
  );

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="請求受取太郎"
                width={200}
                height={60}
                priority
                className="h-12 w-auto"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              おかえりなさい
            </h2>
            <p className="text-gray-600 mt-2">アカウントにログイン</p>
          </div>
          
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 animate-fade-in border border-red-100">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {state.error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={pending}
              className="w-full py-4 btn-primary text-white rounded-xl font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {pending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  ログイン中...
                </>
              ) : (
                <>
                  ログイン
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              アカウントをお持ちでない方は{" "}
              <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
                新規登録
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
