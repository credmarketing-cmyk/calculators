import Link from "next/link";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "./calculator-theme.css";

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="calc-page">
      <div className="gutter l" />
      <div className="gutter r" />

      <div className="back">
        <div className="back-in">
          <Link href="/calculators#calculators">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path
                d="M12 7H2M6 3L2 7l4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All Calculators
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
