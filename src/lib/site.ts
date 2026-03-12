const FALLBACK_SITE_URL = "http://localhost:3000";

export const SITE_NAME = "請求受取太郎";
export const SITE_TAGLINE = "請求受領クラウド";
export const SITE_DESCRIPTION =
  "取引先に専用URLを送るだけで請求書を受け取り、一覧管理や支払い状況の確認までシンプルに行える請求受領クラウドです。";
export const SITE_OG_TITLE = `${SITE_NAME} | ${SITE_TAGLINE}`;
export const OGP_IMAGE_ALT = SITE_OG_TITLE;
export const OGP_IMAGE_PATH = "/ogp.jpg";
export const OGP_IMAGE_WIDTH = 1200;
export const OGP_IMAGE_HEIGHT = 628;

export function getSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    FALLBACK_SITE_URL;

  const normalized = /^https?:\/\//.test(candidate)
    ? candidate
    : `https://${candidate}`;

  return new URL(normalized);
}
