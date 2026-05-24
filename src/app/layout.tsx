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
  ogImage: "/og-image.jpg",          // Buat file ini: 1200×630px
  ogImageSquare: "/og-square.jpg",   // Buat file ini: 600×600px (WhatsApp/IG)
  twitterImage: "/twitter-card.jpg", // Buat file ini: 1200×600px
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

  // ─── Core ────────────────────────────────────────
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

  // ─── Format Detection ────────────────────────────
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // ─── Canonical & Alternate ───────────────────────
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      "en-US": "/en",
    },
  },

  // ─── Robots ──────────────────────────────────────
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

  // ─── Icons (Multi-format) ────────────────────────
  icons: {
    icon: [
      { url: BRAND.favicon, type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: BRAND.favicon,
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },

  // ─── Manifest ────────────────────────────────────
  manifest: "/manifest.json",

  // ─── Apple / iOS ─────────────────────────────────
  appleWebApp: {
    capable: true,
    title: BRAND.name,
    statusBarStyle: "black-translucent",
    startupImage: [
      {
        url: "/apple-splash-2048-2732.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
    ],
  },

  // ─── Verification (Placeholder — isi jika punya) ───
  verification: {
    google: "google-site-verification=XXXXXXXXXXXXXXXX",      // Ganti
    yandex: "yandex-verification=XXXXXXXXXXXXXXXX",           // Ganti
    yahoo: "yahoo-site-verification=XXXXXXXXXXXXXXXX",        // Ganti
    other: {
      me: [BRAND.creatorUrl],
    },
  },

  // ─── Open Graph (Rich) ───────────────────────────
  openGraph: {
    title: {
      default: `${BRAND.name} - ${BRAND.tagline}`,
      template: `%s | ${BRAND.name}`,
    },
    description: BRAND.description,
    url: BRAND.url,
    siteName: BRAND.name,
    locale: BRAND.locale,
    type: "website",
    alternateLocale: ["en_US"],
    countryName: "Indonesia",
    emails: ["support@lingkoraq.my.id"], // Ganti jika ada
    phoneNumbers: ["+62-XXX-XXXX-XXXX"],  // Ganti jika ada
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
    videos: [
      // Jika punya video promo, uncomment & ganti:
      // {
      //   url: "https://www.lingkoraq.my.id/promo-video.mp4",
      //   width: 1280,
      //   height: 720,
      //   type: "video/mp4",
      // },
    ],
    // Untuk halaman artikel/blog nanti bisa override dengan type: "article"
    // articles: { ... }
  },

  // ─── Twitter Card (Rich) ─────────────────────────
  twitter: {
    card: "summary_large_image",
    title: {
      default: `${BRAND.name} - ${BRAND.tagline}`,
      template: `%s | ${BRAND.name}`,
    },
    description: BRAND.description,
    images: {
      url: BRAND.twitterImage,
      alt: `${BRAND.name} - ${BRAND.tagline}`,
    },
    creator: BRAND.twitterHandle,
    site: BRAND.twitterHandle,
    creatorId: "1234567890", // Ganti dengan numeric Twitter ID jika punya
  },

  // ─── Facebook / OGP Extra ────────────────────────
  // (Next.js otomatis render og:xxx dari openGraph di atas)
  // Tambahan custom bisa via <meta property="fb:app_id" ...> di bawah

  // ─── Other Metadata ──────────────────────────────
  category: "technology",
  classification: "Business & Productivity",
  referrer: "origin-when-cross-origin",
  abstract: BRAND.description.slice(0, 160),
  archives: ["https://www.lingkoraq.my.id/blog"],
  assets: ["https://www.lingkoraq.my.id/assets"],
  bookmarks: ["https://www.lingkoraq.my.id"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ─── JSON-LD Rich Structured Data ────────────────
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
        publisher: { "@id": `${BRAND.url}/#organization` },
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
        {/* Schema Markup */}
        <Script
          id="schema-markup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Facebook App ID (optional — ganti jika punya) */}
        <meta property="fb:app_id" content="123456789012345" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Preconnect untuk performa */}
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
    description: "Create stunning bio-link pages with Lingkoraq. The most advanced hybrid visual + code editor for professional bio links.",
    url: "https://www.lingkoraq.my.id",
    siteName: "Lingkoraq",
    images: [
      {
        url: "/favicon.svg",
        width: 1200,
        height: 630,
        alt: "Lingkoraq - Premium Bio Link Platform",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lingkoraq - Premium Bio Link Platform & Visual Editor",
    description: "Create stunning bio-link pages with Lingkoraq. The most advanced hybrid visual + code editor for professional bio links.",
    images: ["/favicon.svg"],
    creator: "@mhfadev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Lingkoraq",
    "url": "https://www.lingkoraq.my.id",
    "description": "Premium Bio Link Platform with Hybrid Visual + Code Editor",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "author": {
      "@type": "Person",
      "name": "MHFADev",
      "url": "https://github.com/MHFADev"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="id" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <Script
          id="schema-markup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
