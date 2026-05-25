import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/providers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ─── KONFIGURASI BRAND ─────────────────────────────
const BRAND = {
  name: "Lingkoraq",
  tagline: "Premium Bio Link Platform & Visual Editor",
  description:
    "Create stunning bio-link pages with Lingkoraq. The most advanced hybrid visual + code editor for professional bio links. Free, scalable, and beautiful.",
  url: "https://www.lingkoraq.my.id",
  ogImage: "/og-image.jpg",
  ogImageSquare: "/og-square.jpg",
  twitterImage: "/twitter-card.jpg",
  favicon: "/favicon.svg",
  locale: "id_ID",
  creator: "MHFADev",
  creatorUrl: "https://github.com/MHFADev",
  twitterHandle: "@mhfadev",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),

  title: {
    default: `${BRAND.name} - ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: [
    "bio link",
    "link in bio",
    "landing page builder",
    "professional bio link",
    "lingkoraq",
    "visual editor",
    "bio link indonesia",
    "linktree alternative",
    "personal landing page",
    "creator tools",
  ],
  authors: [{ name: BRAND.creator, url: BRAND.creatorUrl }],
  creator: BRAND.creator,
  publisher: BRAND.name,
  applicationName: BRAND.name,
  generator: "Next.js",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      "en-US": "/en",
    },
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-image-preview": "large",
    "max-video-preview": -1,
    "max-snippet": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: BRAND.favicon, type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: BRAND.favicon,
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    title: BRAND.name,
    statusBarStyle: "black-translucent",
  },

  verification: {
    google: "google-site-verification=XXXXXXXXXXXXXXXX",
    other: {
      me: [BRAND.creatorUrl],
    },
  },

  // ─── OPEN GRAPH ──────────────────────────────────
  openGraph: {
    title: `${BRAND.name} - ${BRAND.tagline}`,
    description: BRAND.description,
    url: BRAND.url,
    siteName: BRAND.name,
    locale: BRAND.locale,
    type: "website",
    alternateLocale: ["en_US"],
    images: [
      {
        url: BRAND.ogImage,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} - ${BRAND.tagline}`,
        type: "image/jpeg",
      },
      {
        url: BRAND.ogImageSquare,
        width: 600,
        height: 600,
        alt: `${BRAND.name} Logo / Square Preview`,
        type: "image/jpeg",
      },
    ],
  },

  // ─── TWITTER CARD ────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} - ${BRAND.tagline}`,
    description: BRAND.description,
    images: [BRAND.twitterImage],
    creator: BRAND.twitterHandle,
    site: BRAND.twitterHandle,
  },

  category: "technology",
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${BRAND.url}/#webapp`,
        name: BRAND.name,
        url: BRAND.url,
        description: BRAND.description,
        applicationCategory: "BusinessApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0.0",
        screenshot: {
          "@type": "ImageObject",
          url: `${BRAND.url}${BRAND.ogImage}`,
          width: 1200,
          height: 630,
        },
        featureList: [
          "Visual drag-and-drop editor",
          "Custom domain support",
          "Analytics dashboard",
          "SEO optimized pages",
          "Responsive mobile design",
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "124",
          bestRating: "5",
          worstRating: "1",
        },
        author: {
          "@type": "Person",
          name: BRAND.creator,
          url: BRAND.creatorUrl,
          sameAs: [BRAND.creatorUrl],
        },
        publisher: {
          "@type": "Organization",
          name: BRAND.name,
          url: BRAND.url,
          logo: {
            "@type": "ImageObject",
            url: `${BRAND.url}${BRAND.favicon}`,
            width: 512,
            height: 512,
          },
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BRAND.url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${BRAND.url}/#website`,
        url: BRAND.url,
        name: BRAND.name,
        description: BRAND.description,
        inLanguage: "id",
      },
      {
        "@type": "Organization",
        "@id": `${BRAND.url}/#organization`,
        name: BRAND.name,
        url: BRAND.url,
        logo: {
          "@type": "ImageObject",
          url: `${BRAND.url}${BRAND.favicon}`,
          width: 512,
          height: 512,
        },
        sameAs: [
          `https://twitter.com/${BRAND.twitterHandle.replace("@", "")}`,
          BRAND.creatorUrl,
        ],
      },
    ],
  };

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="schema-markup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta property="fb:app_id" content="123456789012345" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
       }
          
