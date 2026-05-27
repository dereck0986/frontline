import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { OperationsDemo } from "@/components/landing/operations-demo";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <OperationsDemo />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
