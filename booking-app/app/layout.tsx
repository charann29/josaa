import type { Metadata } from "next";
import { EB_Garamond, Poppins } from "next/font/google";
import "./globals.css";

// Headings use EB Garamond; body uses Poppins. Loaded via next/font so they are
// self-hosted, preloaded, and don't flash — exposed as CSS variables.
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Book a 1-hour call — BeingWise",
  description:
    "Book a 1-hour JoSAA / CSAB expert call. Secure ₹2,999 payment, then pick a slot that works for you.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
