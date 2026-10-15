import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";

// Written once at build time, so it works with the static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
