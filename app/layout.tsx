import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Cursor } from "@/components/ui/Cursor";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const title = `${profile.name} — ${profile.role}`;
const description = `${profile.name} is a ${profile.role} building scalable, production-grade web apps with React, Next.js, Node.js, Express and MongoDB.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s | ${profile.name}` },
  description,
  keywords: [
    profile.name,
    "Full Stack Developer",
    "MERN",
    "Next.js",
    "React",
    "Node.js",
    "Portfolio",
    "Bengaluru",
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    siteName: `${profile.name} Portfolio`,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: profile.siteUrl,
  image: new URL(profile.photoFull, profile.siteUrl).toString(),
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: "IIFA Degree Institute" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Gnanamani College of Technology" },
  sameAs: socials.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <a
          href="#main"
          className="focus:bg-primary sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
