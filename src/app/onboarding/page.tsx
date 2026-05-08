export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Check if business already set up
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", session.user.id)
    .single();

  if (business) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Frontline</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Set up your business
          </h1>
          <p className="text-gray-500 mt-2">
            This takes 60 seconds. Let&apos;s get your AI tuned to your brand.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <OnboardingForm userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
