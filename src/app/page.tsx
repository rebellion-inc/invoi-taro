import Link from "next/link";
import Image from "next/image";
import { Noto_Sans_JP } from "next/font/google";
import {
  ArrowRight,
  CheckCheck,
  FileText,
  Link2,
  ListChecks,
  User,
} from "lucide-react";
import type { Metadata } from "next";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "ホーム",
  description: "請求受取太郎のサービス紹介ページです。",
};

const worries = [
  {
    text: "振り込みを忘れてしまう",
    imageSrc: "/lp/worry_1.png",
    imageAlt: "請求書に追われる人物のイラスト",
  },
  {
    text: "請求管理ツールの使い方が<br>難しくて覚えられない",
    imageSrc: "/lp/worry_2.png",
    imageAlt: "書類が散らばって困っている人物のイラスト",
  },
  {
    text: "高機能な管理ツールは<br>導入・運用の負担が大きい",
    imageSrc: "/lp/worry_3.png",
    imageAlt: "書類を見て悩む人物のイラスト",
  },
];

const features = [
  {
    title: "請求書の受け取り",
    points: ["取引先にリンクを送るだけ", "取引先はアカウント登録不要"],
    imageSrc: "/lp/leaveit-1.png",
    imageAlt: "請求書アップロード画面のイメージ",
  },
  {
    title: "一覧で管理",
    points: ["月別・一覧で並ぶ", "書類を探さなくてよい"],
    imageSrc: "/lp/leaveit-2.png",
    imageAlt: "請求書一覧画面のイメージ",
  },
  {
    title: "支払い状況の確認",
    points: ["未払い/支払い済が一目でわかる", "支払い漏れを防ぐ"],
    imageSrc: "/lp/leaveit-3.png",
    imageAlt: "請求書ステータス画面のイメージ",
  },
];

const flow = [
  { step: "01", title: "リンクを共有", icon: Link2 },
  { step: "02", title: "請求書を受け取り", icon: FileText },
  { step: "03", title: "一覧で確認", icon: ListChecks },
  { step: "04", title: "支払い情報をチェック", icon: CheckCheck },
];

const plans = [
  {
    name: "Free",
    price: "0",
    description:
      "取引先を最大5社まで登録可能で月あたり30件まで請求書を管理できます。",
    cta: "無料で始める",
    recommended: false,
  },
  {
    name: "Pro",
    price: "980",
    description:
      "取引先は最大50社まで登録可能。月あたり300件まで請求書を管理できます。",
    cta: "申し込む",
    recommended: true,
  },
  {
    name: "Business",
    price: "4,980",
    description:
      "上限を気にせず使えるプランです。取引先・請求書を無制限で管理できます。",
    cta: "申し込む",
    recommended: false,
  },
];

const reasons = [
  {
    title: "低コストで使用可能",
    body: "導入を検討している方や、お試し利用に適したコストをかけずに導入できるサービスです。",
  },
  {
    title: "迷わないUI",
    body: "操作説明が不要で、初めての方でも直感的に使えるシンプルな画面設計です。",
  },
  {
    title: "すぐに始められる",
    body: "面倒な初期設定は不要で登録後すぐに利用を開始できます。",
  },
  {
    title: "取引先に負担をかけない",
    body: "取引先はアカウント登録不要です。リンクを送るだけなので手間をかけさせません。",
  },
];

function FootPrintIcon() {
  return (
    <svg
      width="24"
      height="21"
      viewBox="0 0 24 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <mask
        id="mask0_118_427"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="21"
      >
        <rect width="24" height="20.3077" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_118_427)">
        <path
          d="M19.611 18.4533C17.6334 21.3485 13.9361 19.803 12.0557 19.8743C9.23522 19.9811 6.80444 21.131 5.14585 18.5474C3.95584 16.6938 3.65774 14.5973 6.32571 12.0348C7.16373 11.2299 8.1432 7.76435 12.0209 7.70903C16.7671 7.64132 17.3682 11.0618 18.0932 11.9421C20.326 14.653 20.9403 16.5072 19.611 18.4533Z"
          fill="#0676F6"
          fillOpacity="0.5"
        />
        <ellipse
          cx="3.48176"
          cy="8.10644"
          rx="2.83268"
          ry="3.25933"
          transform="rotate(-34.4431 3.48176 8.10644)"
          fill="#0676F6"
          fillOpacity="0.5"
        />
        <ellipse
          cx="8.99969"
          cy="3.75051"
          rx="2.83268"
          ry="3.38495"
          transform="rotate(-20.8702 8.99969 3.75051)"
          fill="#0676F6"
          fillOpacity="0.5"
        />
        <ellipse
          cx="15.7433"
          cy="3.83646"
          rx="2.83268"
          ry="3.43681"
          transform="rotate(18.5866 15.7433 3.83646)"
          fill="#0676F6"
          fillOpacity="0.5"
        />
        <ellipse
          cx="20.9657"
          cy="7.99825"
          rx="2.58472"
          ry="3.04683"
          transform="rotate(19.4045 20.9657 7.99825)"
          fill="#0676F6"
          fillOpacity="0.5"
        />
      </g>
    </svg>
  );
}

function QuickStartCheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="8" fill="#26D326" />
      <mask id="path-2-inside-1_116_357" fill="white">
        <path d="M9.46387 1.33093L13.7065 5.57357L6.90922 12.3709L2.66658 8.12822L9.46387 1.33093Z" />
      </mask>
      <path
        d="M6.90922 12.3709L5.49501 13.7851H8.32344L6.90922 12.3709ZM13.7065 5.57357L12.2923 4.15936L5.49501 10.9566L6.90922 12.3709L8.32344 13.7851L15.1207 6.98779L13.7065 5.57357ZM6.90922 12.3709L8.32344 10.9566L4.0808 6.714L2.66658 8.12822L1.25237 9.54243L5.49501 13.7851L6.90922 12.3709Z"
        fill="white"
        mask="url(#path-2-inside-1_116_357)"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main
      className={`${notoSans.className} bg-white text-gray-900 tracking-[0.05em]`}
    >
      <div className="w-full bg-[#F7F9FC]">
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <Link href="/dashboard/invoices" className="shrink-0">
              <Image
                src="/logo.png"
                alt="請求受取太郎"
                width={100}
                height={34}
                priority
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-4xl bg-[#0676F6] px-3 py-1.5 text-xs font-medium text-white"
              >
                <User className="h-4 w-4 fill-white stroke-white" />
                ログイン
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-4xl px-3 py-1.5 font-medium text-[#0676F6] border border-[#0676F6] hover:bg-[#0676F6] hover:text-white transition-all text-xs"
              >
                無料で始める
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        <section className="relative h-[calc(100dvh-50px)]">
          <div className="absolute top-5 left-0 h-18 w-28">
            <Image
              className="absolute bottom-0 left-0 opacity-0 animate-fade-in"
              style={{ animationDelay: "0s" }}
              src="/lp/footprint.png"
              alt="足跡のイラスト"
              width={18}
              height={18}
            />
            <Image
              className="absolute bottom-8 left-2 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
              src="/lp/footprint.png"
              alt="足跡のイラスト"
              width={18}
              height={18}
            />
            <Image
              className="absolute bottom-8 left-10 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.8s" }}
              src="/lp/footprint.png"
              alt="足跡のイラスト"
              width={18}
              height={18}
            />
            <Image
              className="absolute bottom-16 left-10 opacity-0 animate-fade-in"
              style={{ animationDelay: "1.2s" }}
              src="/lp/footprint.png"
              alt="足跡のイラスト"
              width={18}
              height={18}
            />
            <Image
              className="absolute bottom-16 left-18 opacity-0 animate-fade-in"
              style={{ animationDelay: "1.6s" }}
              src="/lp/footprint.png"
              alt="足跡のイラスト"
              width={18}
              height={18}
            />
          </div>
          <div className="flex h-full flex-col">
            <div className="pt-5 px-4">
              <Image
                src="/lp/fv.png"
                alt="請求受取太郎のイメージ画像"
                width={1200}
                height={600}
                className="w-full h-auto object-cover object-center"
              />
            </div>
            <div className="mx-auto flex flex-1 flex-col gap-5 justify-center">
              <p className="text-base font-bold text-gray-700">
                <span className="text-4xl text-[#0676F6]">イヌ</span>
                でも使える！？
              </p>
              <h1 className="text-6xl font-bold">請求書管理</h1>
              <p className="flex items-center justify-center gap-2 text-sm text-gray-700">
                <QuickStartCheckIcon />
                最短3分!無料ですぐに使えます!
              </p>
              <div className="flex justify-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-4xl bg-[#0676F6] px-3 py-1.5 text-xs font-medium text-white"
                >
                  <User className="h-4 w-4 fill-white stroke-white" />
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 rounded-4xl border border-[#0676F6] px-3 py-1.5 text-xs font-medium text-[#0676F6] transition-all hover:bg-[#0676F6] hover:text-white"
                >
                  無料で始める
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-4 py-10">
          <h2 className="flex items-center justify-center gap-2 text-center text-lg font-bold">
            <FootPrintIcon />
            こんなお悩みございませんか？
          </h2>
          <div className="my-9 space-y-10">
            {worries.map((worry, index) => (
              <article
                key={worry.text}
                className="rounded bg-white p-8 shadow-sm relative"
              >
                <p className="text-4xl font-bold text-[#0676F6] absolute -top-5 left-4">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <Image
                    src={worry.imageSrc}
                    alt={worry.imageAlt}
                    width={480}
                    height={320}
                    className="h-28 w-full object-contain"
                  />
                </div>
                <p className="mt-3 text-sm font-bold leading-relaxed text-center">
                  {worry.text.split("<br>").map((line, lineIndex) => (
                    <span key={`${worry.imageSrc}-${lineIndex}`}>
                      {line}
                      {lineIndex < worry.text.split("<br>").length - 1 ? (
                        <br />
                      ) : null}
                    </span>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-10 bg-[#E5F2F9] relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <svg
              width="53"
              height="53"
              viewBox="0 0 53 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="14.9727"
                y="7.9541"
                width="23.3944"
                height="18.7155"
                fill="#0676F6"
              />
              <path
                d="M26.4678 52.9354L52.9355 26.4677H6.01365e-05L26.4678 52.9354Z"
                fill="#0676F6"
              />
            </svg>
          </div>
          <div className="px-4">
            <h2 className="text-center text-lg font-bold tracking-widest">
              <span className="text-[#0676F6]">「受取太郎」</span>にお任せください！
            </h2>
            <p className="px-4 mt-6 max-w-xs text-xs leading-loose text-gray-600">
              難しい操作や大がかりな運用は不要です。
              <br />
              請求書の受取・一覧管理・支払い状況の
              <br />
              確認を直感的に行えるシンプルな
              <br />
              請求書管理機能を提供します。
            </p>
            <div className="mt-6 space-y-10">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl p-4"
                >
                    <div className="overflow-hidden rounded-xl bg-gray-100 p-2">
                      <Image
                        src={feature.imageSrc}
                        alt={feature.imageAlt}
                        width={960}
                        height={600}
                        className="h-40 w-full object-contain"
                      />
                    </div>
                  <h3 className="mt-4 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0">
                          <QuickStartCheckIcon />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-4 py-10">
          <h2 className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <FootPrintIcon />
            ご利用の流れ
            </h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {flow.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.step}
                  className="rounded-2xl bg-white p-4 text-center shadow-sm"
                >
                  <p className="text-xs font-semibold text-[#0676F6]">
                    STEP {item.step}
                  </p>
                  <div className="mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                    <Icon className="h-7 w-7 text-[#0676F6]" />
                  </div>
                  <p className="mt-3 text-sm font-medium">{item.title}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-[#0676F6] px-4 py-10 text-white">
          <p className="text-center text-sm">まずは無料で</p>
          <h2 className="mt-1 text-center text-3xl font-bold">
            受取太郎を始めましょう
          </h2>
          <div className="mt-6">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-base font-semibold text-[#0676F6]"
            >
              無料で始める
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-4 py-10">
          <h2 className="text-center text-2xl font-bold">料金プラン</h2>
          <div className="mt-6 space-y-4">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-2xl border p-5 ${
                  plan.recommended
                    ? "border-[#0676F6] bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.recommended ? (
                  <p className="mb-2 text-right text-xs font-semibold text-[#0676F6]">
                    最もおすすめ
                  </p>
                ) : null}
                <h3 className="text-3xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                <p className="mt-4 text-sm text-gray-600">月額</p>
                <p className="text-4xl font-bold">
                  {plan.price}
                  <span className="ml-1 text-lg font-medium">円</span>
                </p>
                <Link
                  href="/signup"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0676F6] px-4 py-3 text-sm font-semibold text-white"
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-10">
          <h2 className="text-center text-2xl font-bold">
            受取太郎が選ばれる理由
          </h2>
          <div className="mt-6 space-y-4">
            {reasons.map((reason, index) => (
              <article
                key={reason.title}
                className="rounded-2xl border border-gray-200 p-4"
              >
                <p className="text-xs font-semibold text-[#0676F6]">
                  POINT {String(index + 1).padStart(2, "0")}
                </p>
                <div className="mt-3 h-32 rounded-xl bg-gray-100" />
                <h3 className="mt-3 text-lg font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {reason.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#0676F6] px-4 py-10 text-white">
          <p className="text-center text-sm">まずは無料で</p>
          <h2 className="mt-1 text-center text-3xl font-bold">
            受取太郎を始めましょう
          </h2>
          <div className="mt-6">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-base font-semibold text-[#0676F6]"
            >
              無料で始める
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        <footer className="border-t border-gray-200 px-4 py-6">
          <p className="text-center text-xs text-gray-500">
            ©2026 rebellion.inc
          </p>
          <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500">
            <Link href="/privacy-policy" className="hover:underline">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:underline">
              利用規約
            </Link>
            <Link href="/tokushoho" className="hover:underline">
              特商法
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
