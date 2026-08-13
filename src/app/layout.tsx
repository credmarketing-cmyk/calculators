import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";

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
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
