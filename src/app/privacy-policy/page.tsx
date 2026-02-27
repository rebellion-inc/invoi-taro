import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "請求受取太郎の個人情報保護方針です。",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 md:p-10 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">プライバシーポリシー</h1>
        <p className="text-sm text-gray-500">制定日: 2026年2月27日</p>
        <p className="text-gray-700 leading-relaxed">
          合同会社リベリオン（以下「当社」）は、当社が提供する「請求受取太郎」（以下「本サービス」）における、
          利用者の個人情報の取扱いについて、以下のとおり定めます。
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">1. 取得する情報</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>アカウント登録情報（メールアドレス等）</li>
            <li>請求書データおよびアップロードファイルに含まれる情報</li>
            <li>ログ情報（アクセス日時、操作履歴、IPアドレス等）</li>
            <li>決済に関する情報（Stripeを通じて提供される顧客識別情報等）</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">2. 利用目的</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>本サービスの提供、本人確認、認証のため</li>
            <li>請求書の受領、管理、通知、CSV出力等の機能提供のため</li>
            <li>料金請求、決済、契約管理のため</li>
            <li>不正利用の防止、障害対応、問い合わせ対応のため</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">3. 第三者提供</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、法令に基づく場合を除き、本人の同意なく個人情報を第三者へ提供しません。
            ただし、決済・インフラ運用等の業務委託先（例: Stripe、クラウドサービス事業者）に必要な範囲で情報を提供することがあります。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">4. 安全管理措置</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、個人情報への不正アクセス、漏えい、滅失、毀損を防止するため、
            アクセス制御その他必要かつ適切な安全管理措置を講じます。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">5. 開示・訂正・利用停止等</h2>
          <p className="text-gray-700 leading-relaxed">
            本人から自己の個人情報について開示、訂正、利用停止等の請求があった場合、法令に従い適切に対応します。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">6. お問い合わせ窓口</h2>
          <p className="text-gray-700">メールアドレス: yonetsuka@rebellion-inc.jp</p>
          <p className="text-gray-700">事業者名: 合同会社リベリオン</p>
          <p className="text-gray-700">所在地: 北海道札幌市厚別区厚別南2丁目3-30</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">7. 改定</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、法令改正やサービス内容の変更に応じて、本ポリシーを改定することがあります。
            改定後は本ページに掲載した時点で効力を生じます。
          </p>
        </section>
      </div>
    </main>
  );
}
