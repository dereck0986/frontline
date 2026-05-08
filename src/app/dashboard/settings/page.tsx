export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";
import type { Database } from "@/types/database";

type Business = Database["public"]["Tables"]["businesses"]["Row"];

export default async function SettingsPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data: businessRaw } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  const business = businessRaw as Business | null;

  if (!business) redirect("/onboarding");

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Update your business profile and tone preferences.
        </p>
      </div>

      <SettingsForm business={business as Business} />
    </div>
  );
}
