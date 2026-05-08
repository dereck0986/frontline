import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { upsertSubscription, updateSubscriptionByStripeSubId } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const userId = checkoutSession.metadata?.user_id;
        const plan = checkoutSession.metadata?.plan as "starter" | "pro" | undefined;

        if (userId && plan && checkoutSession.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            checkoutSession.subscription as string
          );

          await upsertSubscription(userId, {
            stripe_subscription_id: sub.id,
            plan,
            status: "active",
            current_period_end: new Date(
              sub.current_period_end * 1000
            ).toISOString(),
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;

        await updateSubscriptionByStripeSubId(sub.id, {
          status: sub.status as "active" | "canceled" | "past_due" | "trialing",
          current_period_end: new Date(
            sub.current_period_end * 1000
          ).toISOString(),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        await updateSubscriptionByStripeSubId(sub.id, {
          plan: "free",
          status: "canceled",
          stripe_subscription_id: null,
          current_period_end: null,
        });
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
