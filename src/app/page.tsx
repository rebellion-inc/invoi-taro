import Link from "next/link";
import Image from "next/image";
import { Noto_Sans_JP } from "next/font/google";
import {
  ArrowRight,
  CheckCheck,
  ChevronRight,
  FileText,
  Link2,
  ListChecks,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import { ScrollFootprints } from "@/components/scroll-footprints";

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
  { step: "01", title: "リンクを共有", icon: Link2, align: "left" as const },
  {
    step: "02",
    title: "請求書を\n受け取り",
    icon: FileText,
    align: "right" as const,
  },
  { step: "03", title: "一覧で確認", icon: ListChecks, align: "left" as const },
  {
    step: "04",
    title: "支払い情報を\nチェック",
    icon: CheckCheck,
    align: "right" as const,
  },
];

const plans = [
  {
    name: "Free",
    price: "0",
    subtitle: "まずは気楽に試したい人に",
    description:
      "取引先を最大5社まで登録可能で月あたり30件まで請求書を管理できます。",
    cta: "無料で始める",
    recommended: false,
    specs: [
      { label: "取引社数：", value: "5社" },
      { label: "受取請求書数：", value: "30件" },
      { label: "CSV出力：", value: "-" },
      { label: "チーム招待：", value: "1人" },
    ],
  },
  {
    name: "Pro",
    price: "980",
    subtitle: "成長中の中小企業に最適",
    description:
      "取引先は最大50社まで登録可能。月あたり300件まで請求書を管理できます。",
    cta: "申し込む",
    recommended: true,
    specs: [
      { label: "取引社数：", value: "50社" },
      { label: "受取請求書数：", value: "300件" },
      { label: "CSV出力：", value: "対応" },
      { label: "チーム招待：", value: "3人" },
    ],
  },
  {
    name: "Business",
    price: "4,980",
    subtitle: "大規模・BPO事業者向け",
    description:
      "上限を気にせず使えるプランです。取引先・請求書を無制限で管理できます。",
    cta: "申し込む",
    recommended: false,
    specs: [
      { label: "取引社数：", value: "無制限" },
      { label: "受取請求書数：", value: "無制限" },
      { label: "CSV出力：", value: "対応" },
      { label: "チーム招待：", value: "無制限" },
    ],
  },
];

const reasons = [
  {
    title: "低コストで使用可能",
    body: "導入を検討している方やお試し利用に適した\nコストをかけずに導入できるサービスです。",
    imageSrc: "/lp/reason_01.png",
    imageAlt: "コストイメージ",
  },
  {
    title: "迷わないUI",
    body: "操作説明が不要で、初めての方でも\n直感的に使えるシンプルな画面設計です。",
    imageSrc: "/lp/reason_02.png",
    imageAlt: "UIイメージ",
  },
  {
    title: "すぐに始められる",
    body: "面倒な初期設定は必要ありません。\n登録後はすぐに利用を開始できます。",
    imageSrc: "/lp/reason_03.png",
    imageAlt: "すぐ始められるイメージ",
  },
  {
    title: "取引先に負担がかからない",
    body: "取引先はアカウントの登録が不要です。\nリンクひとつで請求書を送信できます。",
    imageSrc: "/lp/reason_04.png",
    imageAlt: "取引先イメージ",
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

function CallToActionSection() {
  return (
    <section className="bg-[#F8FAFC] px-6 py-10 lg:py-20">
      <div className="text-center">
        <p className="text-sm font-bold tracking-wider text-[#0676F6] lg:text-lg">
          \まずは無料で/
        </p>
        <div className="mt-1 flex items-center justify-center gap-3 lg:gap-5">
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            className="shrink-0 lg:w-7 lg:h-7"
            aria-hidden="true"
          >
            <path d="M10.5 21L21 10.5H0L10.5 21Z" fill="#0676F6" />
          </svg>
          <h2 className="text-xl font-bold tracking-wide text-[#333] lg:text-4xl">
            受取太郎を始めましょう
          </h2>
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            className="shrink-0 lg:w-7 lg:h-7"
            aria-hidden="true"
          >
            <path d="M10.5 21L21 10.5H0L10.5 21Z" fill="#0676F6" />
          </svg>
        </div>
      </div>
      <div className="mt-5 lg:mt-8 lg:flex lg:justify-center">
        <Link
          href="/signup"
          className="flex items-center gap-3 rounded-full bg-[#0676F6] py-2.5 pl-2.5 pr-5 lg:w-136.5 lg:py-4 lg:pl-4 lg:pr-8"
        >
          <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-white lg:h-22 lg:w-22">
            <span className="text-[10px] font-bold leading-tight text-[#0676F6] lg:text-sm">
              最短
            </span>
            <span className="text-lg font-bold leading-tight text-[#0676F6] lg:text-3xl">
              3分
            </span>
          </span>
          <span className="flex-1 text-center text-xl font-bold tracking-wider text-white lg:text-3xl">
            無料で始める
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-white lg:h-7 lg:w-7" />
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main
      className={`${notoSans.className} bg-white text-gray-900 tracking-[0.05em]`}
    >
      <div className="w-full bg-[#F7F9FC]">
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 px-4 py-2 backdrop-blur-sm lg:px-12 lg:py-0 lg:h-21">
          <div className="flex items-center justify-between gap-2 lg:h-full lg:mx-auto lg:max-w-341.5">
            <Link href="/dashboard/invoices" className="shrink-0">
              <Image
                src="/logo.png"
                alt="請求受取太郎"
                width={188}
                height={64}
                priority
                className="h-8 w-auto lg:h-16"
              />
            </Link>
            <div className="flex items-center gap-2 lg:gap-6">
              <Link
                href="/login"
                className="group inline-flex items-center gap-1.5 rounded-4xl bg-[#0676F6] px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-white hover:text-[#0676F6] hover:border hover:border-[#0676F6] lg:gap-2 lg:px-6 lg:py-2.5 lg:text-base"
              >
                <User className="h-4 w-4 fill-white stroke-white transition-colors group-hover:fill-[#0676F6] group-hover:stroke-[#0676F6] lg:h-6 lg:w-6" />
                ログイン
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-4xl px-3 py-1.5 font-medium text-[#0676F6] border border-[#0676F6] hover:bg-[#0676F6] hover:text-white transition-all text-xs lg:gap-2 lg:px-6 lg:py-2.5 lg:text-base"
              >
                無料で始める
                <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
              </Link>
            </div>
          </div>
        </header>

        <section className="relative h-[calc(100dvh-50px)] lg:h-173">
          <div className="absolute top-5 left-0 h-18 w-28 lg:left-4 lg:top-8 lg:h-24 lg:w-40">
            <Image
              className="absolute bottom-0 left-0 opacity-0 animate-fade-in lg:w-6 lg:h-6"
              style={{ animationDelay: "0s" }}
              src="/lp/footprint.png"
              alt="足跡のイラスト"
              width={18}
              height={18}
            />
            <Image
              className="absolute bottom-8 left-2 opacity-0 animate-fade-in lg:bottom-10 lg:left-4 lg:w-6 lg:h-6"
              style={{ animationDelay: "0.4s" }}
              src="/lp/footprint.png"
              alt="足跡のイラスト"
              width={18}
              height={18}
            />
            <Image
              className="absolute bottom-8 left-10 opacity-0 animate-fade-in lg:bottom-10 lg:left-14 lg:w-6 lg:h-6"
              style={{ animationDelay: "0.8s" }}
              src="/lp/footprint.png"
              alt="足跡のイラスト"
              width={18}
              height={18}
            />
            <Image
              className="absolute bottom-16 left-10 opacity-0 animate-fade-in lg:bottom-20 lg:left-14 lg:w-6 lg:h-6"
              style={{ animationDelay: "1.2s" }}
              src="/lp/footprint.png"
              alt="足跡のイラスト"
              width={18}
              height={18}
            />
            <Image
              className="absolute bottom-16 left-18 opacity-0 animate-fade-in lg:bottom-20 lg:left-24 lg:w-6 lg:h-6"
              style={{ animationDelay: "1.6s" }}
              src="/lp/footprint.png"
              alt="足跡のイラスト"
              width={18}
              height={18}
            />
          </div>
          <div className="flex h-full flex-col lg:flex-row-reverse lg:items-center lg:mx-auto lg:max-w-341.5 lg:px-10">
            <div className="pt-5 px-4 lg:flex-1 lg:pt-0 lg:px-0">
              <Image
                src="/lp/fv.png"
                alt="請求受取太郎のイメージ画像"
                width={1200}
                height={600}
                className="w-full h-auto object-cover object-center"
              />
            </div>
            <div className="mx-auto flex flex-1 flex-col gap-5 justify-center lg:mx-0 lg:items-start lg:flex-none lg:w-[45%] lg:gap-6 lg:pl-10">
              <p className="text-base font-bold text-gray-700 lg:text-2xl">
                <span className="text-4xl text-[#0676F6] lg:text-7xl">イヌ</span>
                でも使える！？
              </p>
              <h1 className="text-6xl font-bold lg:text-8xl">請求書管理</h1>
              <p className="flex items-center justify-center gap-2 text-sm text-gray-700 lg:justify-start lg:text-base">
                <QuickStartCheckIcon />
                最短3分!無料ですぐに使えます!
              </p>
              <div className="flex justify-center gap-2 lg:justify-start lg:gap-4">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-1.5 rounded-4xl bg-[#0676F6] px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-white hover:text-[#0676F6] hover:border hover:border-[#0676F6] lg:gap-2 lg:px-6 lg:py-2.5 lg:text-base"
                >
                  <User className="h-4 w-4 fill-white stroke-white transition-colors group-hover:fill-[#0676F6] group-hover:stroke-[#0676F6] lg:h-6 lg:w-6" />
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 rounded-4xl border border-[#0676F6] px-3 py-1.5 text-xs font-medium text-[#0676F6] transition-all hover:bg-[#0676F6] hover:text-white lg:gap-2 lg:px-6 lg:py-2.5 lg:text-base"
                >
                  無料で始める
                  <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-4 py-10 lg:px-12 lg:py-20">
          <h2 className="flex items-center justify-center gap-2 text-center text-lg font-bold lg:text-4xl lg:gap-3">
            <FootPrintIcon />
            こんなお悩みございませんか？
          </h2>
          <div className="my-9 space-y-10 lg:my-14 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:max-w-261.5 lg:mx-auto">
            {worries.map((worry, index) => (
              <article
                key={worry.text}
                className="rounded bg-white p-8 shadow-sm relative lg:p-6"
              >
                <p className="text-4xl font-bold text-[#0676F6] absolute -top-5 left-4 lg:text-5xl lg:-top-6">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <Image
                    src={worry.imageSrc}
                    alt={worry.imageAlt}
                    width={480}
                    height={320}
                    className="h-28 w-full object-contain lg:h-50 lg:mx-auto"
                  />
                </div>
                <p className="mt-3 text-sm font-bold leading-relaxed text-center lg:text-base lg:mt-6">
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

        <section className="px-4 py-10 bg-[#E5F2F9] relative lg:px-12 lg:py-20">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 lg:-top-8">
            <svg
              width="53"
              height="53"
              viewBox="0 0 53 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="lg:w-18 lg:h-18"
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
          <div className="px-4 lg:px-0 lg:max-w-261.5 lg:mx-auto">
            <h2 className="text-center text-lg font-bold tracking-widest lg:text-4xl">
              <span className="text-[#0676F6]">「受取太郎」</span>にお任せください！
            </h2>
            <p className="px-4 mt-6 max-w-xs mx-auto text-sm font-medium leading-[200%] text-gray-600 lg:max-w-none lg:text-base lg:w-fit lg:mx-auto lg:px-0 lg:mt-8">
              難しい操作や大がかりな運用は不要です。
              <br />
              請求書の受取・一覧管理・支払い状況の
              <br className="lg:hidden" />
              確認を<br className="hidden lg:block" />直感的に行えるシンプルな
              <br className="lg:hidden" />
              請求書管理機能を提供します。
            </p>
            <div className="mt-6 space-y-10 lg:mt-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-12">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl p-4 lg:p-0 lg:text-center"
                >
                    <div className="overflow-hidden rounded-xl bg-gray-100 p-2 lg:bg-transparent lg:p-0 lg:flex lg:justify-center">
                      <Image
                        src={feature.imageSrc}
                        alt={feature.imageAlt}
                        width={960}
                        height={600}
                        className="h-40 w-full object-contain lg:h-50 lg:w-50 lg:object-cover lg:rounded-xl"
                      />
                    </div>
                  <h3 className="mt-4 text-xl font-semibold lg:text-2xl lg:mt-6">
                    {feature.title}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700 lg:text-base lg:inline-block lg:text-left">
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

        <section className="bg-[#F8FAFC] px-4 py-10 lg:px-12 lg:py-20 max-w-sm mx-auto">
          <h2 className="text-center text-2xl font-bold flex items-center justify-center gap-2 lg:text-4xl lg:gap-3">
            <FootPrintIcon />
            ご利用の流れ
          </h2>
          <div className="mt-10 lg:mt-16 lg:flex lg:gap-5 lg:justify-center lg:items-start lg:max-w-261.5 lg:mx-auto">
            {flow.map((item, index) => {
              const Icon = item.icon;
              const isLeft = item.align === "left";
              const isLast = index === flow.length - 1;
              const isEven = index % 2 === 1;
              return (
                <div key={item.step} className={`lg:-ml-4 first:lg:ml-0 ${isEven ? "lg:mt-35" : "lg:mt-0"}`}>
                  <div
                    className={`flex ${
                      isLeft ? "justify-start" : "justify-end"
                    } lg:justify-center`}
                  >
                    <div className="relative h-42.5 w-42.5 rounded-full border border-[#D6E4F6] bg-[#E5F2F9] lg:h-65 lg:w-65">
                      <p
                        className={`absolute -top-3 text-sm font-bold leading-none text-[#0676F6] tracking-tight lg:text-base ${
                          isLeft ? "left-3" : "right-3"
                        } lg:left-3`}
                      >
                        STEP
                      </p>
                      <p
                        className={`absolute top-1.3 text-[32px] font-bold leading-none text-[#0676F6] tracking-tight lg:text-[40px] lg:top-2 ${
                          isLeft ? "left-3" : "right-3"
                        } lg:left-3`}
                      >
                        {item.step}
                      </p>
                      <p className="absolute top-10 left-1/2 w-full -translate-x-1/2 whitespace-pre-line text-center text-sm font-bold tracking-[0.7px] text-[#333] lg:top-14 lg:text-base">
                        {item.title}
                      </p>
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 lg:bottom-8">
                        <Icon
                          className="h-16 w-16 text-gray-600 lg:h-24 lg:w-24"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </div>
                  {!isLast && (
                    <>
                      <div
                        className={`flex lg:hidden absolute z-100${
                          isLeft
                            ? "justify-center pl-34"
                            : "justify-center pl-38"
                        }`}
                      >
                        <ScrollFootprints flip={!isLeft} />
                      </div>
                      <div
                        className={`hidden lg:flex lg:-mt-10 relative z-1 ${
                          isLeft
                            ? "lg:justify-center lg:translate-x-30 lg:-translate-y-2 lg:-rotate-15"
                            : "lg:justify-center lg:translate-x-35 lg:-translate-y-50 lg:-rotate-160"
                        }`}
                      >
                        <ScrollFootprints flip={!isLeft} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <CallToActionSection />

        <section className="bg-[#E5F2F9] px-4 py-12 lg:px-12 lg:py-20">
          <h2 className="text-center text-xl font-bold flex items-center justify-center gap-2 lg:text-4xl lg:gap-3">
            <FootPrintIcon />
            料金プラン
          </h2>
          <div className="mt-10 space-y-12 lg:mt-14 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-10 lg:max-w-261.5 lg:mx-auto lg:items-end">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className="relative"
              >
                {plan.recommended ? (
                  <div className="mx-auto -mb-0.75 flex h-8 w-41.5 items-center justify-center rounded-t-[10px] bg-[#0676F6] relative z-10">
                    <span className="text-sm font-bold text-white">
                      最もおすすめ
                    </span>
                  </div>
                ) : null}
                <div
                  className={`rounded-[15px] bg-white px-5 pt-6 pb-10 text-center shadow-md ${
                    plan.recommended
                      ? "border-[3px] border-[#0676F6]"
                      : ""
                  }`}
                >
                  <h3 className={`text-[40px] font-bold ${plan.recommended ? "text-[#0676F6]" : ""}`}>{plan.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/50 lg:hidden">
                    {plan.description}
                  </p>
                  <p className="hidden lg:block mt-2 text-sm leading-relaxed text-black/50">
                    {plan.subtitle}
                  </p>
                  <div className="mt-10 flex items-end justify-center gap-1 lg:mt-8">
                    <span className="pb-1 text-base font-medium text-[#333]">月額</span>
                    <span className="text-5xl font-bold leading-none text-[#333]">
                      {plan.price}
                    </span>
                    <span className="pb-1 text-xl font-bold text-[#333]">円</span>
                  </div>
                  <div className="hidden lg:block mt-8 space-y-3 text-left px-5">
                    {plan.specs.map((spec) => (
                      <div key={spec.label} className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 rounded-sm bg-[#0676F6] shrink-0" />
                        <span className="text-sm text-[#333]">{spec.label}</span>
                        <span className="ml-auto text-sm font-bold text-[#333]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 flex justify-center lg:mt-8">
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 rounded-full border border-[#0676F6] px-8 py-2.5 text-base font-bold text-[#0676F6] transition-all hover:bg-[#0676F6] hover:text-white"
                    >
                      {plan.cta}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#F8FAFC] px-5 py-10 lg:px-12 lg:py-20">
          <h2 className="text-center text-xl font-bold flex items-center justify-center gap-2 lg:text-4xl lg:gap-3">
            <FootPrintIcon />
            受取太郎が選ばれる理由
          </h2>
          <div className="mt-8 space-y-10 lg:mt-16 lg:space-y-16 lg:max-w-261.5 lg:mx-auto">
            {reasons.map((reason, index) => {
              const isImageLeft = index % 2 === 0;
              return (
                <article key={reason.title} className="relative pl-5 pt-5 lg:pl-0 lg:pt-0">
                  {/* Mobile POINT badge */}
                  <div className="absolute left-0 top-0 z-10 flex h-14.75 w-14.75 flex-col items-center justify-center rounded-xl bg-[#F7F9FC] lg:hidden">
                    <span className="text-xs font-bold leading-none text-[#0676F6]">
                      POINT
                    </span>
                    <span className="text-[28px] font-bold leading-none text-[#0676F6]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {/* Mobile layout */}
                  <div className="lg:hidden">
                    <div className="overflow-hidden rounded-xl">
                      <Image
                        src={reason.imageSrc}
                        alt={reason.imageAlt}
                        width={580}
                        height={406}
                        className="aspect-290/203 w-full object-cover"
                      />
                    </div>
                    <div className="mt-4 pl-2">
                      <h3 className="text-xl font-bold">{reason.title}</h3>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#333]">
                        {reason.body}
                      </p>
                    </div>
                  </div>
                  {/* PC layout - alternating zigzag */}
                  <div className={`hidden lg:flex lg:items-center lg:gap-16 ${isImageLeft ? "" : "lg:flex-row-reverse"}`}>
                    <div className="overflow-hidden rounded-xl shrink-0">
                      <Image
                        src={reason.imageSrc}
                        alt={reason.imageAlt}
                        width={580}
                        height={406}
                        className="w-100 h-70 object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-xs font-bold leading-none text-[#0676F6]">
                            POINT
                          </span>
                          <span className="text-[40px] font-bold leading-none text-[#0676F6]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold">{reason.title}</h3>
                      </div>
                      <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-[#333]">
                        {reason.body}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <CallToActionSection />

        <footer className="bg-[#E5F2F9] px-4 py-5 lg:py-12">
          <p className="text-center text-sm text-[#333] lg:text-base">
            © 2026 合同会社リベリオン
          </p>
          <div className="mt-3 flex justify-center gap-4 text-xs text-gray-500 lg:mt-4 lg:text-sm lg:gap-6">
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
