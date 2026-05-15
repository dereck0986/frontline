"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";
import type { Subscription } from "@/lib/db";

interface BillingContentProps {
  subscription: Subscription | null;
  userEmail: string;
}

const plans = [
  {
    name: "Starter",
    price: "$500/mo",
    badge: "Launch offer",
    description: "Manual-Assisted AI lead recovery for first clients.",
    features: ["AI lead qualification", "Lead scoring", "Copy-ready SMS scripts", "Copy-ready email replies", "Call openers", "Manual follow-up workflow"],
  },
  {
    name: "Pro",
    price: "$1,000/mo",
    badge: "Automation upgrade",
    description: "Twilio-powered SMS and call automation upgrade.",
    features: ["Everything in Starter", "Twilio SMS automation", "Missed-call recovery", "Owner alerts", "Automated follow-up sequences", "Higher lead volume"],
  },
  {
    name: "Premium",
    price: "$1,500-$2,500/mo",
    badge: "Done-for-you",
    description: "Premium setup with voice automation and custom workflows.",
    features: ["Everything in Pro", "VAPI voice workflows", "Done-for-you setup", "Custom scripts", "Workflow customization", "Priority support"],
  },
];

export function BillingContent({ subscription, userEmail }: BillingContentProps) {
  const currentPlan = subscription?.plan ?? "free";

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Current Plan</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 capitalize">{currentPlan}</span>
              <Badge variant={subscription?.status === "active" ? "success" : "warning"}>{subscription?.status ?? "active"}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-2">Billing contact: {userEmail}</p>
          </div>
          <Badge variant="info">Manual-Assisted Mode</Badge>
        </div>
      </Card>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-semibold text-emerald-800">Launch Mode: Manual-Assisted AI</p>
        <p className="mt-1 text-sm text-emerald-700">
          Starter customers get AI qualification, scripts, and clear next actions without paid phone automation. Automation becomes the Pro upgrade after revenue validates demand.
        </p>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                </div>
                <Badge variant="info">{plan.badge}</Badge>
              </div>
              <div className="mb-5">
                <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-brand-600 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.name === "Starter" ? "primary" : "outline"}>
                {plan.name === "Starter" ? "Start Manual AI" : "Request Upgrade"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        Payment checkout can be connected after offer validation. For first clients, use a simple invoice or payment link.
      </div>
    </div>
  );
}
