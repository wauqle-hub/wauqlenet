import type { Metadata } from "next";
import { Cinzel, Monda } from "next/font/google";
import GrainOverlay from "@/components/ui/GrainOverlay";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const monda = Monda({
  variable: "--font-monda",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wauqle | Bespoke Luxury Fashion & Personalized Clothing",
  description: "Wauqle is a bespoke luxury fashion brand focused on personalized and exclusive clothing experiences, offering quiet luxury and high-end custom suits.",
  metadataBase: new URL("https://wauqle.net"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wauqle | Bespoke Luxury Fashion",
    description: "Exclusive networking platform providing direct access to bespoke luxury fashion services.",
    url: "https://wauqle.net",
    siteName: "Wauqle",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Wauqle Luxury Fashion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wauqle | Bespoke Luxury Fashion",
    description: "Exclusive networking platform providing direct access to bespoke luxury fashion services.",
    site: "@wauqle_fashion",
    creator: "@wauqle_fashion",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://wauqle.com/#organization",
      "name": "Wauqle",
      "alternateName": "Wauqle Luxury Fashion",
      "url": "https://wauqle.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wauqle.com/logo.png"
      },
      "sameAs": [
        "https://instagram.com/wauqle_fashion",
        "https://www.facebook.com/wauqlefashion/",
        "https://www.youtube.com/@wauqle_fashion",
        "https://x.com/wauqle_fashion",
        "https://wauqle.net"
      ]
    },
    {
      "@type": "Brand",
      "@id": "https://wauqle.com/#brand",
      "name": "Wauqle",
      "description": "Bespoke luxury fashion brand focused on personalized and exclusive clothing experiences",
      "brand": {
        "@type": "Brand",
        "name": "Wauqle"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://wauqle.com/#website",
      "url": "https://wauqle.com",
      "name": "Wauqle",
      "publisher": {
        "@id": "https://wauqle.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://wauqle.com/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Service",
      "@id": "https://wauqle.net/#service",
      "name": "Wauqle Contact Platform",
      "description": "Exclusive networking platform providing direct access to bespoke luxury fashion services",
      "provider": {
        "@id": "https://wauqle.com/#organization"
      },
      "url": "https://wauqle.net",
      "sameAs": "https://wauqle.com"
    }
  ]
};

import { AuthProvider } from "@/components/providers/SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${monda.variable} ${cinzel.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        <GrainOverlay />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
