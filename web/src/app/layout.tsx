import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
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
    default: "sast — Autonomous AI Cybersecurity Agent",
    template: "%s | sast",
  },
  description:
    "An autonomous AI agent that scans, detects, and fixes security vulnerabilities in your codebase — continuously.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "sast — Autonomous AI Cybersecurity Agent",
    description:
      "An autonomous AI agent that scans, detects, and fixes security vulnerabilities in your codebase — continuously.",
    url: "https://sast.tech",
    siteName: "sast",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "sast logo" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "sast — Autonomous AI Cybersecurity Agent",
    description:
      "An autonomous AI agent that scans, detects, and fixes security vulnerabilities in your codebase — continuously.",
    images: ["/icon-512.png"],
    creator: "@sast_tech",
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
        {children}
      </body>
    </html>
  );
}
