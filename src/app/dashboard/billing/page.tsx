export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSubscriptionByUserId } from "@/lib/db";
import { BillingContent } from "./billing-content";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const subscription = await getSubscriptionByUserId(session.user.id);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">
          Manage your subscription and payment details.
        </p>
      </div>

      <BillingContent
        subscription={subscription}
        userEmail={session.user.email ?? ""}
      />
    </div>
  );
}
