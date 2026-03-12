import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { InvoiceFlowTutorial } from "@/components/tutorial/invoice-flow-tutorial";
import {
  getSiteUrl,
  OGP_IMAGE_ALT,
  OGP_IMAGE_HEIGHT,
  OGP_IMAGE_PATH,
  OGP_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_TITLE,
} from "@/lib/site";

const GTM_ID = "GTM-WRZL3ZT5";
const GOOGLE_SITE_VERIFICATION = "v-3XRebbEY8cY29E5NEQAlejN6u8Ydamki0OQrUoNUs";
const metadataBase = getSiteUrl();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase,
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: SITE_OG_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: OGP_IMAGE_PATH,
        width: OGP_IMAGE_WIDTH,
        height: OGP_IMAGE_HEIGHT,
        alt: OGP_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_OG_TITLE,
    description: SITE_DESCRIPTION,
    images: [OGP_IMAGE_PATH],
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <Script id="google-tag-manager" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {children}
        <InvoiceFlowTutorial />
      </body>
    </html>
  );
}
