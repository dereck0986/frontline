export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";
import { ReviewCard } from "@/components/dashboard/review-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Database } from "@/types/database";
import {
  Star,
  MessageSquare,
  Clock,
  TrendingUp,
  PlusCircle,
} from "lucide-react";

type Review = Database["public"]["Tables"]["reviews"]["Row"];
type Business = Database["public"]["Tables"]["businesses"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

export default async function DashboardPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const [{ data: businessRaw }, { data: reviewsRaw }, { data: subscriptionRaw }] =
    await Promise.all([
      supabase
        .from("businesses")
        .select("*")
        .eq("user_id", session.user.id)
        .single(),
      supabase
        .from("reviews")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", session.user.id)
        .single(),
    ]);

  const business = businessRaw as Business | null;
  const reviews = reviewsRaw as Review[] | null;
  const subscription = subscriptionRaw as Pick<Subscription, "plan" | "status"> | null;

  if (!business) redirect("/onboarding");

  const allReviews = reviews ?? [];
  const totalReviews = allReviews.length;
  const pendingResponses = allReviews.filter(
    (r) => r.status === "pending"
  ).length;
  const avgRating =
    totalReviews > 0
      ? (
          allReviews.reduce((sum, r) => sum + r.star_rating, 0) / totalReviews
        ).toFixed(1)
      : "—";

  // Mock reputation score (85 base + weighted by ratings)
  const reputationScore =
    totalReviews > 0
      ? Math.min(
          99,
          Math.round(
            70 +
              (allReviews.reduce((sum, r) => sum + r.star_rating, 0) /
                (totalReviews * 5)) *
                25
          )
        )
      : 72;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {business.name} · {business.location}
          </p>
        </div>
        <Link href="/dashboard/reviews">
          <Button size="sm" className="gap-2">
            <PlusCircle size={16} />
            New Response
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Reputation Score"
          value={`${reputationScore}/100`}
          subtitle="Based on your responses"
          icon={TrendingUp}
          iconColor="text-brand-600"
          iconBg="bg-brand-50"
        />
        <StatCard
          title="Total Reviews"
          value={totalReviews}
          subtitle="All time"
          icon={Star}
          iconColor="text-yellow-600"
          iconBg="bg-yellow-50"
        />
        <StatCard
          title="Avg. Rating"
          value={avgRating}
          subtitle="Across all reviews"
          icon={Star}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Pending Responses"
          value={pendingResponses}
          subtitle="Need attention"
          icon={Clock}
          iconColor={pendingResponses > 0 ? "text-orange-600" : "text-gray-600"}
          iconBg={pendingResponses > 0 ? "bg-orange-50" : "bg-gray-50"}
        />
      </div>

      {/* Plan Banner */}
      {subscription?.plan === "free" && (
        <div className="rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 p-5 text-white flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">You&apos;re on the Free plan</p>
            <p className="text-sm text-white/80 mt-0.5">
              Upgrade to unlock unlimited AI responses and advanced features.
            </p>
          </div>
          <Link href="/dashboard/billing" className="shrink-0">
            <Button className="bg-white text-brand-700 hover:bg-brand-50" size="sm">
              Upgrade
            </Button>
          </Link>
        </div>
      )}

      {/* Recent Reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Reviews
          </h2>
          <Link
            href="/dashboard/reviews"
            className="text-sm text-brand-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {allReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <MessageSquare
              size={40}
              className="text-gray-300 mx-auto mb-3"
            />
            <p className="text-gray-500 font-medium">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">
              Paste your first review to generate an AI response
            </p>
            <Link href="/dashboard/reviews">
              <Button size="sm" variant="outline">
                Generate your first response
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {allReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
