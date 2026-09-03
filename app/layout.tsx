import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ORG_LD, SITE_LD } from "@/lib/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://danangmls.com'),
  title: {
    default: 'DanangMLS — Houses for Rent & Sale in Da Nang, Vietnam',
    template: '%s — DanangMLS',
  },
  description: 'Browse houses, apartments, and villas for rent and for sale in Da Nang and Hoi An, Vietnam. Updated daily from live listings.',
  openGraph: {
    siteName: 'DanangMLS',
    locale: 'en_US',
    type: 'website',
    // Site-wide default. Listing pages override this with the property photo;
    // without it every non-listing share rendered an empty large-image card,
    // because twitter.card below promises one.
    images: [{
      url: '/og-default.jpg',
      width: 1200,
      height: 630,
      alt: 'DanangMLS — houses and apartments for rent and sale in Da Nang, Vietnam',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_LD) }} />
        {children}
      </body>
    </html>
  );
}
