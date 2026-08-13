"use client";

import Script from "next/script";

const TARGET_ID = "hubspot-newsletter-form";

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          portalId: string;
          formId: string;
          target: string;
          region?: string;
        }) => void;
      };
    };
  }
}

/**
 * HubSpot programmatic embed for the newsletter signup.
 * Portal 45865556 / form 5d53e7d7-222e-40f9-a17a-4ca69a2cadb9.
 */
export default function NewsletterForm() {
  return (
    <div className="hubspot-form-wrap">
      <div id={TARGET_ID} />
      <Script
        src="https://js.hsforms.net/forms/embed/v2.js"
        strategy="afterInteractive"
        onReady={() => {
          window.hbspt?.forms.create({
            portalId: "45865556",
            formId: "5d53e7d7-222e-40f9-a17a-4ca69a2cadb9",
            region: "na1",
            target: `#${TARGET_ID}`,
          });
        }}
      />
    </div>
  );
}
