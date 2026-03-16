import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl().origin;

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date("2026-02-27"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date("2026-02-27"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/tokushoho`,
      lastModified: new Date("2026-02-27"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
