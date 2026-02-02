import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "アカウント作成",
  description: "請求受取太郎のアカウントを作成して、請求書管理を始めましょう。",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
