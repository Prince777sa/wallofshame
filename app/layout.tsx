import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Great Wall - Accountability Platform for Gaza",
  description: "A platform documenting public figures and corporations who support or oppose military operations in Gaza. Track positions on humanitarian issues with verified evidence and make informed decisions.",
  keywords: ["Gaza", "Palestine", "accountability", "humanitarian law", "international justice", "public figures", "corporate responsibility", "human rights"],
  authors: [{ name: "The Great Wall Team" }],
  creator: "The Great Wall",
  publisher: "The Great Wall",
  metadataBase: new URL("https://thegreatwall.world"),
  openGraph: {
    title: "The Great Wall - Accountability Platform for Gaza",
    description: "Document and track public figures and corporations supporting or opposing military operations in Gaza. Evidence-based accountability for humanitarian issues.",
    url: "https://thegreatwall.world",
    siteName: "The Great Wall",
    images: [
      {
        url: "/1.png",
        width: 1200,
        height: 630,
        alt: "The Great Wall - Accountability Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Great Wall - Accountability Platform for Gaza",
    description: "Document and track public figures and corporations supporting or opposing military operations in Gaza.",
    images: ["/1.png"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="TGW" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
