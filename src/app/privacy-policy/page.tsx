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
          合同会社リベリオン（以下「当社」）は、当社が提供するクラウド型請求書受領・管理サービス
          「請求受取太郎」（以下「本サービス」）における、利用者の個人情報の取扱いについて、以下のとおり定めます。
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第1条（適用範囲）</h2>
          <p className="text-gray-700 leading-relaxed">
            本ポリシーは、本サービスの提供に関連して当社が取得する個人情報およびそれに準ずる情報の取扱いに適用されます。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第2条（取得する情報）</h2>
          <p className="text-gray-700 leading-relaxed">当社は、以下の情報を取得します。</p>
          <p className="text-gray-700 font-medium">1. 利用登録情報</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>メールアドレス</li>
            <li>氏名</li>
            <li>会社名</li>
            <li>その他登録時に入力された情報</li>
          </ul>
          <p className="text-gray-700 font-medium">2. 利用データ</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>請求書情報</li>
            <li>取引先情報</li>
            <li>アップロードファイルに含まれる情報</li>
          </ul>
          <p className="text-gray-700 font-medium">3. 決済関連情報</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              Stripe等の決済代行事業者を通じて提供される顧客識別情報（クレジットカード番号そのものは当社では保持しません）
            </li>
          </ul>
          <p className="text-gray-700 font-medium">4. ログ・技術情報</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>IPアドレス</li>
            <li>アクセス日時</li>
            <li>操作履歴</li>
            <li>ブラウザ情報</li>
            <li>デバイス情報</li>
            <li>Cookie情報</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第3条（利用目的）</h2>
          <p className="text-gray-700 leading-relaxed">当社は取得した情報を以下の目的で利用します。</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>本サービスの提供および運営</li>
            <li>本人確認および認証</li>
            <li>請求書の受領・管理・通知・CSV出力機能の提供</li>
            <li>料金請求、決済処理、契約管理</li>
            <li>不正利用の防止、セキュリティ対策</li>
            <li>障害対応および問い合わせ対応</li>
            <li>サービス改善および新機能開発（統計データとして利用する場合を含む）</li>
            <li>法令に基づく対応</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第4条（個人データの第三者提供）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、法令に基づく場合を除き、本人の同意なく個人データを第三者に提供しません。
          </p>
          <p className="text-gray-700 leading-relaxed">ただし、以下の場合はこの限りではありません。</p>
          <p className="text-gray-700 font-medium">1. 業務委託先への提供</p>
          <p className="text-gray-700 leading-relaxed">
            本サービスの運営に必要な範囲で、以下の事業者へ提供する場合があります。
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>決済代行事業者（例: Stripe, Inc.）</li>
            <li>クラウドインフラ事業者</li>
            <li>メール配信事業者</li>
            <li>ログ管理・監視サービス事業者</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">当社は、委託先に対し適切な監督を行います。</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第5条（外国にある第三者への提供）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、業務委託のため、外国に所在する事業者へ個人データを提供する場合があります。
          </p>
          <p className="text-gray-700 font-medium">例:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Stripe, Inc.（米国）</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            当社は、提供先が適切なデータ保護体制を整備していることを確認し、契約により個人情報の適切な取扱いを義務付けています。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第6条（安全管理措置）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、個人情報の漏えい、滅失、毀損の防止その他安全管理のため、以下の措置を講じます。
          </p>
          <p className="text-gray-700 font-medium">1. 組織的安全管理措置</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>個人情報管理責任者の設置</li>
            <li>取扱状況の定期的な点検</li>
          </ul>
          <p className="text-gray-700 font-medium">2. 人的安全管理措置</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>個人情報保護に関する社内教育</li>
            <li>秘密保持義務契約の締結</li>
          </ul>
          <p className="text-gray-700 font-medium">3. 物理的安全管理措置</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>アクセス制限された環境でのデータ管理</li>
          </ul>
          <p className="text-gray-700 font-medium">4. 技術的安全管理措置</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>通信の暗号化（SSL/TLS）</li>
            <li>アクセス制御および認証管理</li>
            <li>ログ監視</li>
            <li>不正アクセス対策</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第7条（保存期間）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、利用目的の達成に必要な期間、個人情報を保存します。利用契約終了後は、法令に基づく保存義務がある場合を除き、
            合理的な期間経過後に削除します。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第8条（Cookie等の利用）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、サービス改善および利用状況分析のため、Cookieおよび類似技術を利用することがあります。
          </p>
          <p className="text-gray-700 leading-relaxed">
            利用者はブラウザ設定によりCookieを無効化できますが、その場合一部機能が利用できないことがあります。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第9条（保有個人データの開示等）</h2>
          <p className="text-gray-700 leading-relaxed">
            利用者は、自己の保有個人データについて、開示、訂正、追加、削除、利用停止、第三者提供停止を請求できます。
          </p>
          <p className="text-gray-700 leading-relaxed">当社は、本人確認のうえ法令に従い対応します。</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第10条（匿名加工情報）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、取得した情報を個人を識別できない形式に加工した統計情報として利用する場合があります。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第11条（未成年者の利用）</h2>
          <p className="text-gray-700 leading-relaxed">
            未成年者が本サービスを利用する場合、法定代理人の同意を得るものとします。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第12条（本ポリシーの変更）</h2>
          <p className="text-gray-700 leading-relaxed">
            当社は、法令改正またはサービス内容変更に応じて本ポリシーを変更することがあります。
          </p>
          <p className="text-gray-700 leading-relaxed">重要な変更がある場合は、合理的な方法で通知します。</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">第13条（お問い合わせ窓口）</h2>
          <p className="text-gray-700">合同会社リベリオン</p>
          <p className="text-gray-700">所在地: 北海道札幌市厚別区厚別南2丁目3-30</p>
          <p className="text-gray-700">メールアドレス: yonetsuka@rebellion-inc.jp</p>
        </section>

      </div>
    </main>
  );
}
