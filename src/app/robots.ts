import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl().origin;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/terms", "/privacy-policy", "/tokushoho"],
        disallow: [
          "/dashboard/",
          "/login",
          "/signup",
          "/upload/",
          "/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
