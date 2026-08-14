import type { Metadata } from "next";
import Script from "next/script";
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
      <body className="antialiased">
        {children}

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YNX33C60FK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YNX33C60FK');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "y2bqho20w5");
          `}
        </Script>
      </body>
    </html>
  );
}
