import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono, Roboto_Slab } from "next/font/google";
import { getAbout } from "@/lib/content";
import { siteUrl } from "@/lib/siteUrl";
import "./globals.css";

// Headings: Cormorant Garamond, used only at 28px and above.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

// Body text.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Experience descriptions (impact line and bullets), regular weight only.
const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Labels, dates, tags and numbers.
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Title, description and share previews come from about.md. The preview image is public/og.png;
// the favicon is app/icon.svg and app/apple-icon.png (picked up by Next automatically).
export function generateMetadata(): Metadata {
  const about = getAbout();
  const title = `${about.name} · ${about.title}`;
  const image = { url: "/og.png", width: 1200, height: 630, alt: `${about.name}, ${about.title}` };
  return {
    metadataBase: siteUrl(),
    title,
    description: about.pitch,
    alternates: { canonical: "/" },
    openGraph: { type: "website", url: "/", siteName: about.name, title, description: about.pitch, images: [image] },
    twitter: { card: "summary_large_image", title, description: about.pitch, images: [image] },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${robotoSlab.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
