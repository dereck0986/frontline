"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/stripe";
import { Check, CreditCard, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

const PLAN_ORDER = ["free", "starter", "pro"] as const;

interface BillingContentProps {
  subscription: Subscription | null;
  userEmail: string;
}

export function BillingContent({ subscription, userEmail }: BillingContentProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPlan = subscription?.plan ?? "free";

  const handleUpgrade = async (plan: "starter" | "pro") => {
    setError(null);
    setLoading(plan);

    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email: userEmail }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to start checkout");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setError(null);
    setLoading("manage");

    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to open portal");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Current Plan
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 capitalize">
                {currentPlan}
              </span>
              <Badge
                variant={
                  subscription?.status === "active" ? "success" : "warning"
                }
              >
                {subscription?.status ?? "active"}
              </Badge>
            </div>
            {subscription?.current_period_end && (
              <p className="text-sm text-gray-500 mt-1">
                Renews{" "}
                {new Date(subscription.current_period_end).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </p>
            )}
          </div>
          {currentPlan !== "free" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageBilling}
              loading={loading === "manage"}
              className="gap-2"
            >
              <CreditCard size={14} />
              Manage billing
            </Button>
          )}
        </div>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["starter", "pro"] as const).map((planKey) => {
            const plan = PLANS[planKey];
            const isCurrent = currentPlan === planKey;
            const isDowngrade =
              PLAN_ORDER.indexOf(currentPlan) > PLAN_ORDER.indexOf(planKey);

            return (
              <div
                key={planKey}
                className={cn(
                  "rounded-xl border p-6",
                  isCurrent
                    ? "border-brand-600 bg-brand-50"
                    : planKey === "pro"
                    ? "border-gray-200 bg-white"
                    : "border-gray-200 bg-white"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">{plan.name}</h3>
                  {isCurrent && (
                    <Badge variant="info">Current plan</Badge>
                  )}
                </div>
                <div className="mb-5">
                  <span className="text-3xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Check size={14} className="text-brand-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isCurrent ? "secondary" : "primary"}
                  className="w-full"
                  disabled={isCurrent}
                  loading={loading === planKey}
                  onClick={() => handleUpgrade(planKey)}
                >
                  {isCurrent
                    ? "Current plan"
                    : isDowngrade
                    ? "Downgrade"
                    : "Upgrade"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
