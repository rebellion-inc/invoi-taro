"use client";

import { login } from "@/app/auth/actions";
import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { Mail, Lock, ArrowRight, Loader2, Sparkles, Coffee, Palette } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: { error: string } | null, formData: FormData) => {
      return await login(formData);
    },
    null
  );

  return (
    <div className="aoi-shell min-h-screen bg-gradient-mesh flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid gap-6 lg:grid-cols-[1.1fr_1fr] animate-fade-in">
        <div className="aoi-stage glass rounded-3xl p-8 lg:p-10 hidden lg:flex flex-col justify-between">
          <div>
            <span className="aoi-kicker mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              FEEL GOOD MODE
            </span>
            <h1 className="text-4xl leading-tight font-bold text-gray-900">
              がんばりすぎない
              <br />
              請求管理にしよう
            </h1>
            <p className="text-gray-600 mt-4 leading-relaxed">
              細かい設定はあとでOK。今日はログインして、ひとつ確認できたら十分です。
            </p>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2 rounded-xl bg-white/70 px-4 py-3">
              <Coffee className="w-4 h-4 text-rose-500" />
              5分だけ触って終わりでも大丈夫
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/70 px-4 py-3">
              <Palette className="w-4 h-4 text-violet-500" />
              今日は「見える化」だけ進める
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl shadow-xl p-8">
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
            <span className="aoi-kicker mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              LOGIN
            </span>
            <h2 className="text-3xl font-bold text-gray-900">おかえりなさい</h2>
            <p className="text-gray-600 mt-2">今日はひとつ進めば十分です</p>
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
                  ログインする
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              はじめての方は{" "}
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
