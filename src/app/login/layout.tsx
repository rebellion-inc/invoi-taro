import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログイン",
  description: "請求受取太郎にログインして、請求書を管理しましょう。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
