import { Outfit } from "next/font/google";
import Link from "next/link";
import "./calculator-theme.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`calc-page ${outfit.variable}`}>
      <div className="gutter l" />
      <div className="gutter r" />

      <div className="back">
        <div className="back-in">
          <Link href="/#calculators">
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
