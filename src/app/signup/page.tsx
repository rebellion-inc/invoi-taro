"use client";

import { signup } from "@/app/auth/actions";
import Link from "next/link";
import Image from "next/image";
import { useActionState, useState } from "react";
import { Building2, Mail, Lock, ArrowRight, Loader2, Sparkles, Heart, Coffee } from "lucide-react";

export default function SignupPage() {
  const [withoutOrganization, setWithoutOrganization] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (_prevState: { error: string } | null, formData: FormData) => {
      return await signup(formData);
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
              START SMALL
            </span>
            <h1 className="text-4xl leading-tight font-bold text-gray-900">
              完璧じゃなくていい
              <br />
              まずは登録だけ
            </h1>
            <p className="text-gray-600 mt-4 leading-relaxed">
              最低限の入力で始められます。使いながら整えていけば、ちゃんと前進です。
            </p>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2 rounded-xl bg-white/70 px-4 py-3">
              <Heart className="w-4 h-4 text-rose-500" />
              やることを減らして続けやすく
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/70 px-4 py-3">
              <Coffee className="w-4 h-4 text-violet-500" />
              はじめは3項目だけでOK
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
              SIGN UP
            </span>
            <h2 className="text-3xl font-bold text-gray-900">はじめの一歩でOK</h2>
            <p className="text-gray-600 mt-2">細かい設定はあとからでも大丈夫です</p>
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
                  組織名（任意）
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    required={!withoutOrganization}
                    disabled={withoutOrganization}
                    className="w-full pl-12 pr-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none"
                    placeholder={withoutOrganization ? "いまは未所属で登録します" : "株式会社〇〇"}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="withoutOrganization"
                  value="true"
                  checked={withoutOrganization}
                  onChange={(event) => setWithoutOrganization(event.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                今は組織未所属で登録する
              </label>
               
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
                  この内容で始める
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              すでにアカウントがある方は{" "}
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
