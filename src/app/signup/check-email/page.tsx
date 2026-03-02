import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">メールを確認してください</h1>
          <p className="mt-3 text-sm text-gray-600">
            登録したメールアドレスに確認メールを送信しました。メール内のリンクを開いて登録を完了してください。
          </p>
          <Link
            href="/login"
            className="inline-flex mt-6 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            ログイン画面へ
          </Link>
        </div>
      </div>
    </div>
  );
}
