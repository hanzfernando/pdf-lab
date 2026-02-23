import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pdf-lab-by-hanz.vercel.app";

/**
 * Generates /sitemap.xml automatically via Next.js App Router.
 * Add new routes here as the app grows.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
