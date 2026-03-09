import Link from "next/link";

const legalLinks = [
  { href: "/privacy-policy", label: "プライバシーポリシー" },
  { href: "/tokushoho", label: "特定商取引法に基づく表記" },
  { href: "/terms", label: "利用規約" },
];

type SiteFooterProps = {
  className?: string;
  innerClassName?: string;
};

export function SiteFooter({
  className = "",
  innerClassName = "",
}: SiteFooterProps) {
  const footerClassName = ["text-center text-sm text-gray-500", className]
    .filter(Boolean)
    .join(" ");
  const linksClassName = [
    "flex flex-wrap justify-center gap-x-6 gap-y-2",
    innerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <footer className={footerClassName}>
      <div className={linksClassName}>
        {legalLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="hover:text-gray-700 underline-offset-2 hover:underline"
          >
            {label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
