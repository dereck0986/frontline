import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-brand-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Ready to take control of your reputation?
        </h2>
        <p className="text-xl text-brand-200 max-w-2xl mx-auto mb-10">
          Join 2,400+ businesses already using Frontline to turn reviews into
          revenue. Start your free 14-day trial today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50 w-full sm:w-auto gap-2"
            >
              Start Free Trial
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="#pricing">
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-brand-500 w-full sm:w-auto"
            >
              View pricing
            </Button>
          </Link>
        </div>
        <p className="text-sm text-brand-300 mt-6">
          No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}
