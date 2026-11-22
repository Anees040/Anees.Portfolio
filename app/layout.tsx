import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { MotionProvider } from "@/components/portfolio/motion";
import { AskAnees } from "@/components/portfolio/ask-anees";
import "./globals.css";

const display = Instrument_Serif({ variable: "--font-instrument-serif", weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" });
const sans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });
const mono = IBM_Plex_Mono({ variable: "--font-ibm-plex-mono", weight: "400", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Muhammad Anees — Software Developer",
  description: "Muhammad Anees is a Software Engineering student building thoughtful mobile applications and practical digital products. Explore SportLynk, FitPilot, Sukoon, and EduVerse.",
  applicationName: "Muhammad Anees — Personal Portfolio",
  authors: [{ name: "Muhammad Anees", url: "https://github.com/Anees040" }],
  icons: { icon: "/brand/monogram.svg" },
  openGraph: { title: "Muhammad Anees — Thoughtful software, real-world problems.", description: "Mobile development, backend engineering, and product thinking. A selection of work by Muhammad Anees.", type: "website", locale: "en_US" },
  twitter: { card: "summary", title: "Muhammad Anees — Software Developer", description: "Thoughtful software for real-world problems." },
};

export const viewport: Viewport = { themeColor: "#F4F0E8", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body><MotionProvider>{children}<AskAnees /></MotionProvider></body>
    </html>
  );
}
