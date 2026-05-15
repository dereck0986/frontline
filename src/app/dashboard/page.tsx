export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBusinessByUserId, getSubscriptionByUserId } from "@/lib/db";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  BellRing,
  DollarSign,
  PlusCircle,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [business, subscription] = await Promise.all([
    getBusinessByUserId(session.user.id),
    getSubscriptionByUserId(session.user.id),
  ]);

  if (!business) redirect("/onboarding");

  const dashboardMetrics = {
    totalLeads: 42,
    qualifiedLeads: 18,
    followUpsDue: 7,
    appointmentsBooked: 11,
    revenueOpportunity: "$84,500",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Frontline Command Center
          </h1>
          <p className="text-gray-500 mt-1">
            {business.name} · Revenue Recovery Infrastructure
          </p>
        </div>

        <Link href="/dashboard/leads">
          <Button size="sm" className="gap-2">
            <PlusCircle size={16} />
            View Leads
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Leads"
          value={dashboardMetrics.totalLeads}
          subtitle="Captured leads"
          icon={Users}
          iconColor="text-brand-600"
          iconBg="bg-brand-50"
        />

        <StatCard
          title="Qualified Leads"
          value={dashboardMetrics.qualifiedLeads}
          subtitle="AI-qualified"
          icon={Users}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />

        <StatCard
          title="Follow-Ups Due"
          value={dashboardMetrics.followUpsDue}
          subtitle="Need attention"
          icon={BellRing}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />

        <StatCard
          title="Appointments"
          value={dashboardMetrics.appointmentsBooked}
          subtitle="Booked meetings"
          icon={CalendarDays}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />

        <StatCard
          title="Revenue Opportunity"
          value={dashboardMetrics.revenueOpportunity}
          subtitle="Potential pipeline"
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
      </div>

      {subscription?.plan === "free" && (
        <div className="rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 p-5 text-white flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">You&apos;re on the Free plan</p>
            <p className="text-sm text-white/80 mt-0.5">
              Upgrade to unlock AI follow-up automation, appointment booking,
              and advanced lead recovery workflows.
            </p>
          </div>

          <Link href="/dashboard/billing" className="shrink-0">
            <Button className="bg-white text-brand-700 hover:bg-brand-50" size="sm">
              Upgrade
            </Button>
          </Link>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              AI Lead Recovery System
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Frontline automatically responds, qualifies, follows up, and
              routes leads toward booked appointments.
            </p>
          </div>

          <Link href="/dashboard/leads">
            <Button variant="outline" size="sm">
              Open Lead Inbox
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900">
              Instant Response
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Responds to leads immediately through AI-driven workflows.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900">
              AI Qualification
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Scores urgency, opportunity value, and conversion potential.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900">
              Automated Follow-Up
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Keeps leads engaged until booked, closed, or recycled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
