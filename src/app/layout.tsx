import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lingkoraq.my.id"),
  title: {
    default: "Lingkoraq - Premium Bio Link Platform & Visual Editor",
    template: "%s | Lingkoraq"
  },
  description: "Create stunning bio-link pages with Lingkoraq. The most advanced hybrid visual + code editor for professional bio links. Free, scalable, and beautiful.",
  keywords: ["bio link", "link in bio", "landing page builder", "professional bio link", "lingkoraq", "visual editor"],
  authors: [{ name: "MHFADev", url: "https://github.com/MHFADev" }],
  creator: "MHFADev",
  publisher: "Lingkoraq",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Lingkoraq - Premium Bio Link Platform & Visual Editor",
    description: "Create stunning bio-link pages with Lingkoraq. The most advanced hybrid visual + code editor for professional bio links.",
    url: "https://www.lingkoraq.my.id",
    siteName: "Lingkoraq",
    images: [
      {
        url: "/og-image.png",
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
    images: ["/og-image.png"],
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
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
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
