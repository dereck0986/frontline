export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBusinessByUserId, getSubscriptionByUserId } from "@/lib/db";
import { frontlineDemoData } from "@/lib/demo-data";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  BellRing,
  DollarSign,
  PlusCircle,
  Star,
  ClipboardList,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [business, subscription] = await Promise.all([
    getBusinessByUserId(session.user.id),
    getSubscriptionByUserId(session.user.id),
  ]);

  if (!business) redirect("/onboarding");

  const demo = frontlineDemoData;
  const dashboardMetrics = {
    totalLeads: demo.metrics.totalLeads,
    qualifiedLeads: demo.leads.filter((lead) => lead.status === "qualified").length,
    followUpsDue: demo.metrics.urgentItems,
    appointmentsBooked: demo.metrics.scheduleRequests,
    revenueOpportunity: demo.metrics.estimatedOpenOpportunity,
    reviewsPending: demo.metrics.reviewsPending,
    orderRequests: demo.metrics.orderRequests,
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-semibold">Demo mode active</p>
        <p className="mt-1">{demo.account.notice}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Frontline Command Center
          </h1>
          <p className="text-gray-500 mt-1">
            {business.name || demo.account.businessName} · Revenue Recovery Infrastructure
          </p>
        </div>

        <Link href="/dashboard/lead-records" className="w-full sm:w-auto">
          <Button size="sm" className="w-full sm:w-auto gap-2 whitespace-nowrap">
            <PlusCircle size={16} />
            View Leads
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Leads" value={dashboardMetrics.totalLeads} subtitle="Demo captured leads" icon={Users} iconColor="text-brand-600" iconBg="bg-brand-50" />
        <StatCard title="Qualified Leads" value={dashboardMetrics.qualifiedLeads} subtitle="AI-qualified" icon={Users} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        <StatCard title="Urgent Items" value={dashboardMetrics.followUpsDue} subtitle="Need attention" icon={BellRing} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Scheduling" value={dashboardMetrics.appointmentsBooked} subtitle="Booking requests" icon={CalendarDays} iconColor="text-indigo-600" iconBg="bg-indigo-50" />
        <StatCard title="Opportunity" value={dashboardMetrics.revenueOpportunity} subtitle="Open pipeline" icon={DollarSign} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      {subscription?.plan === "free" && (
        <div className="rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 p-5 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">You&apos;re on the Free plan</p>
              <p className="text-sm text-white/80 mt-0.5">
                Starter is $500/mo. Pro is $1,000/mo. Premium setup is $1,500–$2,500/mo.
              </p>
            </div>

            <Link href="/dashboard/billing" className="w-full sm:w-auto shrink-0">
              <Button className="w-full sm:w-auto bg-white text-brand-700 hover:bg-brand-50" size="sm">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Demo Operations Feed</h2>
            <p className="text-sm text-gray-500 mt-1">
              Sample leads, reviews, scheduling requests, and order requests show how Frontline supports day-to-day business operations.
            </p>
          </div>

          <Link href="/dashboard/lead-records" className="w-full sm:w-auto shrink-0">
            <Button variant="outline" size="sm" className="w-full sm:w-auto whitespace-nowrap">
              Open Lead Inbox
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <Users className="h-5 w-5 text-brand-600" />
            <p className="mt-3 text-sm font-semibold text-gray-900">Latest Lead</p>
            <p className="mt-1 text-sm text-gray-500">{demo.leads[0].aiSummary}</p>
          </div>
          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <Star className="h-5 w-5 text-yellow-600" />
            <p className="mt-3 text-sm font-semibold text-gray-900">Review Queue</p>
            <p className="mt-1 text-sm text-gray-500">{demo.reviews[1].nextAction}</p>
          </div>
          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <CalendarDays className="h-5 w-5 text-indigo-600" />
            <p className="mt-3 text-sm font-semibold text-gray-900">Scheduling</p>
            <p className="mt-1 text-sm text-gray-500">{demo.scheduleRequests[0].nextAction}</p>
          </div>
          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <ClipboardList className="h-5 w-5 text-emerald-600" />
            <p className="mt-3 text-sm font-semibold text-gray-900">Orders / Requests</p>
            <p className="mt-1 text-sm text-gray-500">{demo.orderRequests[0].nextAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
