import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "請求受取太郎の特定商取引法に基づく表記です。",
};

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 md:p-10 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">特定商取引法に基づく表記</h1>
        <p className="text-sm text-gray-500">制定日: 2026年2月27日</p>

        <dl className="divide-y divide-gray-200 border border-gray-200 rounded-xl">
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">販売事業者</dt>
            <dd className="md:col-span-2 text-gray-700">合同会社リベリオン</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">運営責任者</dt>
            <dd className="md:col-span-2 text-gray-700">米塚皓司</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">所在地</dt>
            <dd className="md:col-span-2 text-gray-700">北海道札幌市厚別区厚別南2丁目3-30</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">電話番号</dt>
            <dd className="md:col-span-2 text-gray-700">090-6440-9121</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">メールアドレス</dt>
            <dd className="md:col-span-2 text-gray-700">yonetsuka@rebellion-inc.jp</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">販売価格</dt>
            <dd className="md:col-span-2 text-gray-700">
              Free: 0円 / 月、Pro: 980円 / 月、Business: 4,980円 / 月
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">商品代金以外の必要料金</dt>
            <dd className="md:col-span-2 text-gray-700">なし</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">支払方法</dt>
            <dd className="md:col-span-2 text-gray-700">Stripeによるクレジットカード決済</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">支払時期</dt>
            <dd className="md:col-span-2 text-gray-700">
              お申し込み時に初回決済が行われ、以後は契約内容に基づき毎月自動課金されます。
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">役務の提供時期</dt>
            <dd className="md:col-span-2 text-gray-700">
              決済手続き完了後、システム反映が完了次第ご利用いただけます。
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">解約方法</dt>
            <dd className="md:col-span-2 text-gray-700">
              ダッシュボードの契約管理（Stripeカスタマーポータル）からいつでも手続き可能です。
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">返品・返金</dt>
            <dd className="md:col-span-2 text-gray-700">
              デジタルサービスの性質上、原則として返品・返金には対応しておりません。
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
