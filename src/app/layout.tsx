import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { SessionProvider } from "../components/SessionContext";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

import SiteNavbar from "../components/Navbar";
import ClientWrapper from "../components/ClientWrapper";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShareSpace - Wedding Photo Sharing Made Beautiful",
  description: "Create beautiful collaborative photo albums for weddings and special events. Let your guests contribute memories that last forever.",
  keywords: "wedding photos, photo sharing, collaborative album, event photography, memory sharing",
  authors: [{ name: "ShareSpace" }],
  creator: "ShareSpace",
  publisher: "ShareSpace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "ShareSpace - Wedding Photo Sharing Made Beautiful",
    description: "Create beautiful collaborative photo albums for weddings and special events.",
    url: "https://sharespace.com",
    siteName: "ShareSpace",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShareSpace - Wedding Photo Sharing Made Beautiful",
    description: "Create beautiful collaborative photo albums for weddings and special events.",
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
    google: "google-site-verification-token",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#667eea" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ShareSpace" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientWrapper>
          <ErrorBoundary>
            <SessionProvider>
              <SiteNavbar />
              {/* Add padding-top to account for fixed navbar */}
              <main style={{ paddingTop: '76px' }}>
                {children}
              </main>
              <Footer />
            </SessionProvider>
          </ErrorBoundary>
        </ClientWrapper>
      </body>
    </html>
  );
}
