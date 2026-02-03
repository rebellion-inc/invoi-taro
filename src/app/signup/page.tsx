"use client";

import { signup } from "@/app/auth/actions";
import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { Building2, Mail, Lock, ArrowRight, Loader2, UserPlus } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: { error: string } | null, formData: FormData) => {
      return await signup(formData);
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
              アカウント作成
            </h2>
            <p className="text-gray-600 mt-2">無料で始めましょう</p>
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
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                  組織名
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none"
                    placeholder="株式会社〇〇"
                  />
                </div>
              </div>
              
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
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none"
                    placeholder="6文字以上"
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
                  登録中...
                </>
              ) : (
                <>
                  アカウントを作成
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              既にアカウントをお持ちの方は{" "}
              <Link href="/login" className="text-indigo-600 font-medium hover:underline">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
