import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppBar from "@/components/AppBar";
import { ThemeProvider } from "@/context/ThemeContext";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Lab – Free Online PDF Merger, Splitter & Editor",
  description:
    "Merge, split, reorder and edit PDF pages online for free with PDF Lab. Secure PDF merging, page organizer and PDF tools that run in your browser.",
  keywords: [
    "PDF merger",
    "merge PDF online",
    "combine PDF files",
    "reorder PDF pages",
    "delete PDF pages",
    "split PDF",
    "online PDF editor",
    "free PDF tools",
    "PDF organizer",
    "PDF page rearrange",
  ],
  openGraph: {
    title: "PDF Lab – Free Online PDF Merger & Editor",
    description:
      "Fast, secure and free online PDF tools. Merge, split and rearrange PDF pages directly in your browser with PDF Lab.",
    siteName: "PDF Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Lab – Free Online PDF Merger & Editor",
    description:
      "Merge, split and organize PDF files online for free with PDF Lab.",
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
            <Analytics />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
