import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppBar from "@/components/AppBar";
import { ThemeProvider } from "@/context/ThemeContext";
import { Analytics } from "@vercel/analytics/next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pdf-lab-by-hanz.vercel.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "PDF Lab – Free Online PDF Merger & Editor, No Sign-up",
  description:
    "Merge PDF files without uploading to a server. Free browser-based PDF merger, page reorder and delete tool — no account, no install required.",
  keywords: [
    // Long-tail, lower-competition targets
    "merge PDF files without uploading to server",
    "combine PDFs in browser without account",
    "free PDF merger no sign up",
    "reorder PDF pages online free",
    "delete PDF pages online no upload",
    "PDF merger that works in browser",
    "split PDF online no registration",
    "browser based PDF editor free",
    // Broader backup terms
    "merge PDF online",
    "combine PDF files",
    "online PDF editor",
    "free PDF tools",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "PDF Lab – Free Online PDF Merger, No Sign-up",
    description:
      "Merge, split and reorder PDF pages directly in your browser. No account, no install — 100% private.",
    siteName: "PDF Lab",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Lab – Free Online PDF Merger, No Sign-up",
    description:
      "Merge, split and reorder PDF pages in your browser — no account or install needed.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <AppBar />
          <main className="w-full max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
