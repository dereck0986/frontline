import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});

export const PLANS = {
  starter: {
    name: "Starter",
    price: 49,
    priceId: process.env.STRIPE_STARTER_PRICE_ID ?? "",
    features: [
      "Up to 100 AI responses/month",
      "1 business location",
      "Professional tone profiles",
      "Response history",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    price: 129,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    features: [
      "Unlimited AI responses",
      "Up to 5 business locations",
      "All tone profiles",
      "Advanced analytics",
      "Priority support",
      "Custom tone training",
    ],
  },
} as const;
