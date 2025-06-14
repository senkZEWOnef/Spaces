import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "../components/SessionContext";

import SiteNavbar from "../components/Navbar";
import ClientWrapper from "../components/ClientWrapper";
import Footer from "../components/Footer"; // ✅ NEW

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShareSpace",
  description: "Wedding album sharing made elegant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientWrapper>
          <SessionProvider>
            <SiteNavbar />
            {children}
            <Footer />
          </SessionProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
