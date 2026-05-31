export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBusinessByUserId, getReviewsByUserId } from "@/lib/db";
import { ReviewGenerator } from "@/components/dashboard/review-generator";
import { ReviewCard } from "@/components/dashboard/review-card";

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [business, reviews] = await Promise.all([
    getBusinessByUserId(session.user.id),
    getReviewsByUserId(session.user.id),
  ]);

  if (!business) redirect("/onboarding");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Responder</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Generate polished review replies and keep response history inside a bounded workspace.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
          <span className="text-gray-500">Saved responses: </span>
          <span className="font-semibold text-gray-900">{reviews.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-900">Generate Response</h2>
            <p className="mt-1 text-xs text-gray-500">Paste a review, select tone, and draft a reply.</p>
          </div>
          <ReviewGenerator
            businessId={business.id}
            defaultTone={business.tone}
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-base font-semibold text-gray-900">Response History</h2>
            <p className="mt-1 text-xs text-gray-500">Internal scroll keeps the page compact.</p>
          </div>

          {reviews.length === 0 ? (
            <div className="flex min-h-[340px] items-center justify-center p-6 text-center">
              <p className="text-sm text-gray-400">Your saved responses will appear here.</p>
            </div>
          ) : (
            <div className="max-h-[560px] space-y-3 overflow-y-auto p-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
