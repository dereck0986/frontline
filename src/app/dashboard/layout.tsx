export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBusinessByUserId } from "@/lib/db";
import { getNotificationsByUserId } from "@/lib/ops-side-effects";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const business = await getBusinessByUserId(session.user.id);
  if (!business) redirect("/onboarding");

  let unreadNotificationCount = 0;

  try {
    const notifications = await getNotificationsByUserId(session.user.id, 100);
    unreadNotificationCount = notifications.filter((notification) => notification.status === "unread").length;
  } catch (error) {
    console.error("Unable to load notification count", error);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        userEmail={session.user.email ?? ""}
        businessName={business.name}
        unreadNotificationCount={unreadNotificationCount}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav
          businessName={business.name}
          userEmail={session.user.email ?? ""}
          unreadNotificationCount={unreadNotificationCount}
        />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
