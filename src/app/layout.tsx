import type { Metadata, Viewport } from "next";
import { Amiri, Nunito } from "next/font/google";
import { BlockBackground } from "@/components/layout/block-background";
import { AppToaster } from "@/components/shared/app-toaster";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF4E6",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  keywords: [
    "Quran classes online",
    "Noorani Qaida",
    "Tajweed",
    "Hifz",
    "Quran for kids",
    "online Islamic school",
    "Quran With Urwa",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "education",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col font-sans">
        <BlockBackground />
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
