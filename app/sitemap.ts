import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";

// Written once at build time, so it works with the static export. The site is a single page.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl().toString(), changeFrequency: "monthly", priority: 1 }];
}
