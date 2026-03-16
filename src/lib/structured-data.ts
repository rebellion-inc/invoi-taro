import {
  getSiteUrl,
  SITE_NAME,
  SITE_DESCRIPTION,
  OGP_IMAGE_PATH,
} from "@/lib/site";

type WithContext<T> = T & { "@context": "https://schema.org" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonLdSchema = WithContext<Record<string, any>>;

export function getOrganizationSchema(): JsonLdSchema {
  const siteUrl = getSiteUrl().origin;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "合同会社リベリオン",
    url: siteUrl,
    logo: `${siteUrl}${OGP_IMAGE_PATH}`,
    description: SITE_DESCRIPTION,
  };
}

export function getWebSiteSchema(): JsonLdSchema {
  const siteUrl = getSiteUrl().origin;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: "合同会社リベリオン",
    },
    inLanguage: "ja",
  };
}

export function getSoftwareApplicationSchema(): JsonLdSchema {
  const siteUrl = getSiteUrl().origin;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "JPY",
        description:
          "取引先5件・請求書5件まで。まずは無料でお試しいただけます。",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "980",
        priceCurrency: "JPY",
        description:
          "取引先50件・請求書300件まで。成長中のビジネスに最適なプランです。",
      },
      {
        "@type": "Offer",
        name: "Business",
        price: "4980",
        priceCurrency: "JPY",
        description:
          "上限を気にせず使えるプランです。取引先・請求書を無制限で管理できます。",
      },
    ],
  };
}
