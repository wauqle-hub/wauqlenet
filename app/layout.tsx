import type { Metadata } from "next";
import { Cinzel, Monda } from "next/font/google";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "@/components/ui/CustomCursor";
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
  title: "Wauqlé — Exclusively for You | Connexions",
  description: "Wauqlé — A space dedicated to individuality, personal expression, and absolute exclusivity. Discover an experience designed entirely, exclusively for you.",
  metadataBase: new URL("https://www.wauqle.net"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wauqlé — Exclusively for You | Connexions",
    description: "Wauqlé — A space dedicated to individuality, personal expression, and absolute exclusivity. Discover an experience designed entirely, exclusively for you.",
    url: "https://www.wauqle.net",
    siteName: "Wauqlé",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Wauqlé",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wauqlé — Exclusively for You | Connexions",
    description: "Wauqlé — A space dedicated to individuality, personal expression, and absolute exclusivity. Discover an experience designed entirely, exclusively for you.",
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
      "@id": "https://www.wauqle.net/#organization",
      "name": "Wauqlé",
      "url": "https://www.wauqle.net",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.wauqle.net/logo.png"
      },
      "sameAs": [
        "https://instagram.com/wauqle_fashion",
        "https://www.facebook.com/wauqlefashion/",
        "https://www.youtube.com/@wauqle_fashion",
        "https://x.com/wauqle_fashion"
      ]
    },
    {
      "@type": "Brand",
      "@id": "https://www.wauqle.net/#brand",
      "name": "Wauqlé",
      "description": "A space dedicated to individuality, personal expression, and absolute exclusivity.",
      "brand": {
        "@type": "Brand",
        "name": "Wauqlé"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.wauqle.net/#website",
      "url": "https://www.wauqle.net",
      "name": "Wauqlé",
      "publisher": {
        "@id": "https://www.wauqle.net/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://www.wauqle.net/#webpage",
      "url": "https://www.wauqle.net",
      "name": "Wauqlé — Exclusively for You | Connexions",
      "isPartOf": {
        "@id": "https://www.wauqle.net/#website"
      }
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
        <link rel="preload" as="image" href="/hero-bg-v3.png" media="(min-width: 768px)" />
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
        <CustomCursor />
        <AuthProvider>
          <div className="site-wrapper">
            {children}
          </div>
          <div className="mobile-restriction-overlay">
            <div className="mobile-restriction-content">
              <div className="mobile-restriction-divider"></div>
              <p className="mobile-restriction-desc">Our vision exceeds the limits of this screen</p>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
