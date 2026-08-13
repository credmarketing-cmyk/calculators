import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free MEP & HVAC Calculators for Trade Professionals",
  description:
    "Use free electrical, HVAC, fire safety and plumbing calculators to size systems, estimate costs and design projects faster. Built for contractors and engineers.",
  metadataBase: new URL("https://toolsfortrades.pro"),
  openGraph: {
    title: "Free MEP & HVAC Calculators for Trade Professionals",
    description:
      "Use free electrical, HVAC, fire safety and plumbing calculators to size systems, estimate costs and design projects faster. Built for contractors and engineers.",
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
