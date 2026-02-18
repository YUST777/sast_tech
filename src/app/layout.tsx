import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "sast — Autonomous AI Pentesting & Vulnerability Scanner",
    template: "%s | sast",
  },
  description:
    "sast is an autonomous AI cybersecurity agent that continuously scans, detects, and fixes security vulnerabilities in your codebase. OWASP Top 10 coverage, CI/CD integration, zero false positives.",
  keywords: [
    "AI pentesting",
    "autonomous security scanner",
    "vulnerability detection",
    "OWASP Top 10",
    "application security",
    "SAST",
    "DAST",
    "penetration testing",
    "cybersecurity AI",
    "code security",
    "DevSecOps",
    "CI/CD security",
    "automated security testing",
  ],
  authors: [{ name: "sast", url: "https://sast.tech" }],
  creator: "sast",
  publisher: "sast",
  category: "technology",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "sast — Autonomous AI Pentesting & Vulnerability Scanner",
    description:
      "Continuously scan, detect, and fix security vulnerabilities in your codebase with an autonomous AI agent. OWASP Top 10 coverage, zero false positives.",
    url: "https://sast.tech",
    siteName: "sast",
    locale: "en_US",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "sast — Autonomous AI Cybersecurity Agent" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "sast — Autonomous AI Pentesting & Vulnerability Scanner",
    description:
      "Continuously scan, detect, and fix security vulnerabilities with an autonomous AI agent. Zero false positives.",
    images: ["/icon-512.png"],
    creator: "@sast_tech",
    site: "@sast_tech",
  },
  alternates: {
    canonical: "https://sast.tech",
  },
  metadataBase: new URL("https://sast.tech"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${inter.variable} ${instrumentSerif.variable} antialiased`}
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
