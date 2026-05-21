import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "$500",
    period: "/mo",
    description: "Manual-Assisted AI lead recovery for first clients.",
    features: [
      "AI lead qualification",
      "Lead scoring and priority ranking",
      "Copy-ready SMS scripts",
      "Copy-ready email replies",
      "Call openers and follow-up questions",
      "Manual owner follow-up workflow",
    ],
    cta: "Start Manual AI",
    popular: true,
  },
  {
    name: "Pro",
    price: "$1,000",
    period: "/mo",
    description: "Twilio-powered SMS and call automation after revenue validation.",
    features: [
      "Everything in Starter",
      "Twilio SMS automation",
      "Missed-call recovery workflows",
      "Automated owner alerts",
      "Follow-up sequence automation",
      "Higher lead volume support",
    ],
    cta: "Request Pro Upgrade",
    popular: false,
  },
  {
    name: "Premium",
    price: "$1,500-$2,500",
    period: "/mo",
    description: "Voice automation and done-for-you setup for higher-value clients.",
    features: [
      "Everything in Pro",
      "VAPI voice workflows",
      "Custom lead scripts",
      "Done-for-you setup",
      "Workflow customization",
      "Priority support",
    ],
    cta: "Book Premium Setup",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-600 mb-3">Sales-ready launch pricing</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple pricing for lead recovery</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Start with Manual-Assisted AI. Upgrade to Twilio and voice automation after the system proves revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular ? "border-brand-600 shadow-lg shadow-brand-100" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    Launch Offer
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check size={16} className={plan.popular ? "text-brand-600" : "text-gray-400"} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/signup">
                <Button variant={plan.popular ? "primary" : "outline"} size="lg" className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Twilio and VAPI are upgrade layers. Starter works without paid phone automation.
        </p>
      </div>
    </section>
  );
}
