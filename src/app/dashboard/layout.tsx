export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Get business data
  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("user_id", session.user.id)
    .single();

  if (!business) {
    redirect("/onboarding");
  }

  const businessName = (business as { name: string }).name;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        userEmail={session.user.email ?? ""}
        businessName={businessName}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav businessName={businessName} userEmail={session.user.email ?? ""} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
