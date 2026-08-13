import Hero from "@/components/Hero";
import CalculatorGrid from "@/components/CalculatorGrid";
import CustomCalculatorCTA from "@/components/CustomCalculatorCTA";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <CalculatorGrid />
        <CustomCalculatorCTA />
        <Newsletter />
      </main>
    </div>
  );
}
