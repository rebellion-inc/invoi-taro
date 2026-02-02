import Link from "next/link";
import { FileText, Upload, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-indigo-600 font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            シンプルで効率的な請求書管理
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            請求書管理を
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              もっとスマート
            </span>
            に
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            取引先からの請求書を簡単に収集・管理。
            専用リンクを共有するだけで、アカウント不要でアップロード可能。
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-8 py-4 btn-primary text-white rounded-xl font-medium text-lg shadow-lg"
            >
              無料で始める
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-medium text-lg border border-gray-200 hover:bg-gray-50 transition-all hover:shadow-md"
            >
              ログイン
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="glass p-8 rounded-2xl card-hover animate-fade-in stagger-1 opacity-0">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg animate-float">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              簡単アップロード
            </h3>
            <p className="text-gray-600 leading-relaxed">
              取引先に専用リンクを共有するだけ。面倒なアカウント作成は不要で、すぐに請求書をアップロードできます。
            </p>
          </div>
          
          <div className="glass p-8 rounded-2xl card-hover animate-fade-in stagger-2 opacity-0">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              スマート管理
            </h3>
            <p className="text-gray-600 leading-relaxed">
              月別・ステータス別に請求書を絞り込み。合計金額も自動計算で、経理業務を効率化します。
            </p>
          </div>
          
          <div className="glass p-8 rounded-2xl card-hover animate-fade-in stagger-3 opacity-0">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              ステータス追跡
            </h3>
            <p className="text-gray-600 leading-relaxed">
              未振込・振込済のステータスをワンクリックで切り替え。支払い漏れを防ぎます。
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="glass rounded-3xl p-12 text-center animate-fade-in stagger-4 opacity-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            今すぐ始めましょう
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            アカウント作成は無料。数分で請求書管理をスタートできます。
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 btn-primary text-white rounded-xl font-medium text-lg shadow-lg"
          >
            無料アカウントを作成
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
