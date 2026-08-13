import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Calculators For Field Service Pros | ZenTrades",
  description:
    "Access 50+ specialized calculators designed by experts. From financial planning to engineering calculations, get accurate results in seconds with ZenTrades' professional-grade tools.",
  metadataBase: new URL("https://calculators.zentrades.pro"),
  openGraph: {
    title: "Calculators For Field Service Pros | ZenTrades",
    description:
      "Access 50+ specialized calculators designed by experts for fire, plumbing, electrical, and HVAC pros.",
    siteName: "ZenTrades Calculators",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
