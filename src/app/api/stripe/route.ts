import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";
import { getSubscriptionByUserId, upsertSubscription } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  plan: z.enum(["starter", "pro"]),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const plan = PLANS[body.plan];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const subscription = await getSubscriptionByUserId(session.user.id);
  let customerId = subscription?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: body.email,
      metadata: { user_id: session.user.id },
    });
    customerId = customer.id;

    await upsertSubscription(session.user.id, {
      stripe_customer_id: customerId,
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${appUrl}/dashboard/billing?success=true`,
    cancel_url: `${appUrl}/dashboard/billing`,
    metadata: { user_id: session.user.id, plan: body.plan },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
