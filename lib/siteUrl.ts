/**
 * The site's absolute URL, read at build time so no domain is hard-coded.
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL (the production host, no protocol) on every build;
 * VERCEL_URL (this deployment's host) is the fallback for previews, then localhost for local builds.
 */
export function siteUrl(): URL {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return new URL(host ? `https://${host}` : "http://localhost:3000");
}
