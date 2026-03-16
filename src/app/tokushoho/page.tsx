import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "請求受取太郎の特定商取引法に基づく表記です。",
  alternates: {
    canonical: "/tokushoho",
  },
};

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 md:p-10 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">特定商取引法に基づく表記</h1>
        <p className="text-sm text-gray-500">制定日: 2026年2月27日</p>

        <dl className="divide-y divide-gray-200 border border-gray-200 rounded-xl">
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">1. 販売事業者</dt>
            <dd className="md:col-span-2 text-gray-700">合同会社リベリオン</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">2. 運営責任者</dt>
            <dd className="md:col-span-2 text-gray-700">米塚 皓司</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">3. 所在地</dt>
            <dd className="md:col-span-2 text-gray-700">
              〒004-0022
              <br />
              北海道札幌市厚別区厚別南2丁目3-30
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">4. 電話番号</dt>
            <dd className="md:col-span-2 text-gray-700">電話番号：090-6440-9121</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">5. メールアドレス</dt>
            <dd className="md:col-span-2 text-gray-700">info@rebellion-inc.jp</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">6. 販売価格（税込）</dt>
            <dd className="md:col-span-2 text-gray-700 space-y-1">
              <p>Freeプラン：0円 / 月</p>
              <p>Proプラン：980円（税込） / 月</p>
              <p>Businessプラン：4,980円（税込） / 月</p>
              <p>※価格は変更される場合があります。変更する場合は事前に通知します。</p>
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">7. 商品代金以外の必要料金</dt>
            <dd className="md:col-span-2 text-gray-700">
              インターネット接続に必要な通信料等は利用者の負担となります。
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">8. 支払方法</dt>
            <dd className="md:col-span-2 text-gray-700">クレジットカード決済（Stripeによるオンライン決済）</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">9. 支払時期</dt>
            <dd className="md:col-span-2 text-gray-700 space-y-1">
              <p>初回：申込時に即時決済</p>
              <p>以後：契約更新日に自動課金（毎月同日）</p>
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">10. 役務の提供時期</dt>
            <dd className="md:col-span-2 text-gray-700">決済手続き完了後、直ちに利用可能となります。</dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">11. 契約期間および自動更新</dt>
            <dd className="md:col-span-2 text-gray-700 space-y-1">
              <p>本サービスは月額課金制です。</p>
              <p>契約は1ヶ月単位で自動更新されます。</p>
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">12. 解約方法および解約期限</dt>
            <dd className="md:col-span-2 text-gray-700 space-y-1">
              <p>解約は、契約管理画面（Stripeカスタマーポータル）より行うことができます。</p>
              <p>解約手続きは、次回更新日の前日までに完了する必要があります。</p>
              <p>解約が完了した場合、次回更新日以降の課金は発生しません。</p>
              <p>※日割り返金は行いません。</p>
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">13. 返品・返金について</dt>
            <dd className="md:col-span-2 text-gray-700 space-y-1">
              <p>本サービスはデジタル役務提供であるため、利用開始後の返品・返金には原則として応じません。</p>
              <p>ただし、当社の故意または重過失による重大な不具合がある場合はこの限りではありません。</p>
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">14. 動作環境</dt>
            <dd className="md:col-span-2 text-gray-700 space-y-1">
              <p>本サービスは以下の環境での利用を推奨します。</p>
              <ul className="list-disc list-inside">
                <li>最新版のGoogle Chrome、Safari、Microsoft Edge</li>
                <li>インターネット接続環境</li>
              </ul>
            </dd>
          </div>
          <div className="grid md:grid-cols-3 gap-2 p-4">
            <dt className="font-semibold text-gray-900">15. 表現および再現性</dt>
            <dd className="md:col-span-2 text-gray-700">
              本サービスの効果や機能については、利用環境や入力内容により結果が異なる場合があります。特定の成果を保証するものではありません。
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
