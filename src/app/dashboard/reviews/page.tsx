export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { ReviewGenerator } from "@/components/dashboard/review-generator";
import { ReviewCard } from "@/components/dashboard/review-card";
import type { Database } from "@/types/database";

type Review = Database["public"]["Tables"]["reviews"]["Row"];
type Business = Database["public"]["Tables"]["businesses"]["Row"];

export default async function ReviewsPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const [{ data: businessRaw }, { data: reviewsRaw }] = await Promise.all([
    supabase
      .from("businesses")
      .select("*")
      .eq("user_id", session.user.id)
      .single(),
    supabase
      .from("reviews")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false }),
  ]);

  const business = businessRaw as Business | null;
  const reviews = reviewsRaw as Review[] | null;

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
        {/* Generator */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Generate Response
          </h2>
          <ReviewGenerator
            businessId={(business as Business).id}
            defaultTone={(business as Business).tone}
          />
        </div>

        {/* History */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Response History
          </h2>
          {!reviews || reviews.length === 0 ? (
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
