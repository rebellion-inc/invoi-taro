export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">メールを確認してください</h1>
          <p className="mt-3 text-sm text-gray-600">
            登録したメールアドレスに確認メールを送信しました。メール内のリンクを開いて登録を完了してください。
          </p>
        </div>
      </div>
    </div>
  );
}
