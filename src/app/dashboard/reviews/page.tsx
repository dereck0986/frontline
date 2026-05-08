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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Responder</h1>
        <p className="text-gray-500 mt-1">
          Paste a review, pick a tone, and let AI craft the perfect response.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Generate Response
          </h2>
          <ReviewGenerator
            businessId={business.id}
            defaultTone={business.tone}
          />
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Response History
          </h2>
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">
                Your saved responses will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
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
