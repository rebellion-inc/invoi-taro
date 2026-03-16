import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "請求受取太郎の利用規約です。",
  alternates: {
    canonical: "/terms",
  },
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
          <h2 className="text-xl font-semibold text-gray-900">第2条（定義）</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>「利用者」とは、本サービスを利用する法人または個人事業主をいいます。</li>
            <li>「登録情報」とは、利用登録時に当社へ提供された情報をいいます。</li>
            <li>
              「利用データ」とは、利用者が本サービスに入力・アップロードした請求書情報その他一切のデータをいいます。
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第3条（利用登録）</h2>
          <p className="text-gray-700 leading-relaxed">
            利用者は、真実かつ正確な情報を提供するものとします。
          </p>
          <p className="text-gray-700 leading-relaxed">当社は、以下の場合登録を拒否できるものとします。</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>虚偽情報の提供</li>
            <li>過去の規約違反</li>
            <li>反社会的勢力との関係</li>
            <li>その他不適当と判断した場合</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第4条（アカウント管理）</h2>
          <p className="text-gray-700 leading-relaxed">
            利用者は、自己の責任においてアカウント情報を管理し、第三者に利用させてはなりません。
          </p>
          <p className="text-gray-700 leading-relaxed">
            アカウント不正使用による損害について当社は責任を負いません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第5条（利用料金および支払）</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>利用料金は別途定める料金表に従います。</li>
            <li>月額料金は自動更新されます。</li>
            <li>解約は更新日の前日までに行う必要があります。</li>
            <li>日割返金は行いません。</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第6条（データの帰属および取扱い）</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>利用データの所有権は利用者に帰属します。</li>
            <li>当社は本サービス提供目的の範囲でのみ利用データを利用します。</li>
            <li>当社は、匿名加工・統計化したデータをサービス改善目的で利用できるものとします。</li>
            <li>利用者は、自己の責任においてデータのバックアップを行うものとします。</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第7条（禁止事項）</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>法令違反行為</li>
            <li>不正アクセス</li>
            <li>システム負荷を与える行為</li>
            <li>他者の権利侵害</li>
            <li>逆コンパイル、リバースエンジニアリング</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第8条（知的財産権）</h2>
          <p className="text-gray-700 leading-relaxed">
            本サービスに関する著作権、商標権その他一切の知的財産権は当社に帰属します。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第9条（サービス停止・変更・終了）</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>当社は、保守・障害対応等のためサービスを停止できます。</li>
            <li>当社は30日前の通知によりサービスを終了できます。</li>
            <li>終了時、利用データは一定期間後削除されます。</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第10条（保証の否認）</h2>
          <p className="text-gray-700 leading-relaxed">本サービスは「現状有姿」で提供されます。</p>
          <p className="text-gray-700 leading-relaxed">
            当社は、特定目的適合性・正確性・完全性を保証しません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第11条（損害賠償の制限）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社の責任は、直近6ヶ月間に利用者が支払った利用料金総額を上限とします。
          </p>
          <p className="text-gray-700 leading-relaxed">
            間接損害、逸失利益、特別損害について当社は責任を負いません。
          </p>
          <p className="text-gray-700 leading-relaxed">
            ただし、当社の故意または重過失による場合はこの限りではありません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第12条（秘密保持）</h2>
          <p className="text-gray-700 leading-relaxed">
            双方は、本サービスに関連して知り得た非公開情報を第三者へ開示してはなりません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第13条（反社会的勢力の排除）</h2>
          <p className="text-gray-700 leading-relaxed">
            利用者は反社会的勢力でないことを表明保証します。違反が判明した場合、当社は即時契約解除できます。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第14条（規約変更）</h2>
          <p className="text-gray-700 leading-relaxed">
            変更する場合、事前に合理的期間をもって通知します。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第15条（準拠法・裁判管轄）</h2>
          <p className="text-gray-700 leading-relaxed">
            日本法に準拠し、札幌地方裁判所を専属的合意管轄とします。
          </p>
        </section>
      </div>
    </main>
  );
}
