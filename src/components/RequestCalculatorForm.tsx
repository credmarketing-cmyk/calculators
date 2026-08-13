"use client";

import Script from "next/script";

/**
 * HubSpot "no-code" embed for the calculator request form.
 * Portal 45865556 / form 4850c567-b5ec-4d73-bfb0-a527d61c4d45.
 * The embed script scans the page for `.hs-form-frame` and swaps it for an iframe.
 */
export default function RequestCalculatorForm() {
  return (
    <div className="hubspot-form-wrap">
      <div
        className="hs-form-frame"
        data-region="na1"
        data-form-id="4850c567-b5ec-4d73-bfb0-a527d61c4d45"
        data-portal-id="45865556"
      />
      <Script
        src="https://js.hsforms.net/forms/embed/45865556.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
