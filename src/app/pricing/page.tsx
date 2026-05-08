import { Navbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-16">
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
