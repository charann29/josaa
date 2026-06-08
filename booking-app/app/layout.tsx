import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
