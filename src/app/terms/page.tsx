import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "請求受取太郎の利用規約です。",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 md:p-10 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">利用規約</h1>
        <p className="text-sm text-gray-500">制定日: 2026年2月27日</p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第1条（適用）</h2>
          <p className="text-gray-700 leading-relaxed">
            本規約は、合同会社リベリオン（以下「当社」）が提供する「請求受取太郎」（以下「本サービス」）の
            利用条件を定めるものです。利用者は本規約に同意の上で本サービスを利用するものとします。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第2条（利用登録）</h2>
          <p className="text-gray-700 leading-relaxed">
            利用者は、当社所定の方法で利用登録を行うものとし、登録情報は真実かつ最新の内容であることを保証します。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第3条（アカウント管理）</h2>
          <p className="text-gray-700 leading-relaxed">
            利用者は、自己の責任においてアカウント情報を管理し、第三者に利用させてはなりません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第4条（禁止事項）</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>法令または公序良俗に反する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>第三者の権利・利益を侵害する行為</li>
            <li>不正アクセスまたはこれを試みる行為</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第5条（有料プランおよび支払い）</h2>
          <p className="text-gray-700 leading-relaxed">
            有料プランの利用者は、当社が別途定める利用料金を、Stripeを通じた決済方法により支払うものとします。
            月額料金は契約内容に基づき自動で更新・請求されます。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第6条（解約）</h2>
          <p className="text-gray-700 leading-relaxed">
            利用者は、当社が提供する契約管理画面（Stripeカスタマーポータル）から解約手続きを行うことができます。
            デジタルサービスの性質上、当社に故意または重過失がある場合を除き、原則として返金は行いません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第7条（サービス停止等）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、保守、障害対応、その他やむを得ない事由がある場合、事前通知の上または緊急時には通知なく、
            本サービスの全部または一部を停止できるものとします。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第8条（免責）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、本サービスに事実上または法律上の瑕疵がないことを保証するものではなく、
            当社の責に帰すべき事由を除き、利用者に生じた損害について責任を負いません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第9条（規約変更）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、必要と判断した場合には本規約を変更できるものとし、変更後の規約は本サイトに掲載した時点で効力を生じます。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第10条（準拠法・裁判管轄）</h2>
          <p className="text-gray-700 leading-relaxed">
            本規約は日本法に準拠し、本サービスに関して紛争が生じた場合は、札幌地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>
      </div>
    </main>
  );
}
