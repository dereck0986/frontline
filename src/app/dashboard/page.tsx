export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getBusinessByUserId,
  getLeadsByUserId,
  getOperationEventsByUserId,
  getOrderRequestsByUserId,
  getSchedulingRequestsByUserId,
  getSubscriptionByUserId,
  type Lead,
  type OperationEvent,
  type OrderRequest,
  type SchedulingRequest,
} from "@/lib/db";
import { getNotificationsByUserId, type NotificationRecord } from "@/lib/ops-side-effects";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  BellRing,
  PlusCircle,
  ClipboardList,
  Command,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [business, subscription] = await Promise.all([
    getBusinessByUserId(session.user.id),
    getSubscriptionByUserId(session.user.id),
  ]);

  if (!business) redirect("/onboarding");

  let leads: Lead[] = [];
  let operationEvents: OperationEvent[] = [];
  let schedulingRequests: SchedulingRequest[] = [];
  let orderRequests: OrderRequest[] = [];
  let notifications: NotificationRecord[] = [];

  try {
    [leads, operationEvents, schedulingRequests, orderRequests, notifications] = await Promise.all([
      getLeadsByUserId(session.user.id, 25),
      getOperationEventsByUserId(session.user.id, 25),
      getSchedulingRequestsByUserId(session.user.id, 25),
      getOrderRequestsByUserId(session.user.id, 25),
      getNotificationsByUserId(session.user.id, 25),
    ]);
  } catch (error) {
    console.error("Unable to load command center data", error);
  }

  const unreadNotifications = notifications.filter((notification) => notification.status === "unread");
  const urgentEvents = operationEvents.filter((event) => event.priority === "urgent" || event.priority === "high");
  const latestLead = leads[0];
  const latestEvent = operationEvents[0];
  const latestSchedule = schedulingRequests[0];
  const latestOrder = orderRequests[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Frontline Command Center
          </h1>
          <p className="text-gray-500 mt-1">
            {business.name} · Live operations overview
          </p>
        </div>

        <Link href="/dashboard/operations" className="w-full sm:w-auto">
          <Button size="sm" className="w-full sm:w-auto gap-2 whitespace-nowrap">
            <PlusCircle size={16} />
            Open Operations
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Unread Alerts" value={unreadNotifications.length} subtitle="Need attention" icon={BellRing} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Open Events" value={operationEvents.length} subtitle="Operations stream" icon={Command} iconColor="text-brand-600" iconBg="bg-brand-50" />
        <StatCard title="Recent Leads" value={leads.length} subtitle="Saved leads" icon={Users} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        <StatCard title="Scheduling" value={schedulingRequests.length} subtitle="Booking requests" icon={CalendarDays} iconColor="text-indigo-600" iconBg="bg-indigo-50" />
        <StatCard title="Orders" value={orderRequests.length} subtitle="Service/order requests" icon={ClipboardList} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      {urgentEvents.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          <p className="font-semibold">Priority operations detected</p>
          <p className="mt-1">{urgentEvents.length} high or urgent item{urgentEvents.length === 1 ? "" : "s"} need review in the Operations Inbox.</p>
        </div>
      )}

      {subscription?.plan === "free" && (
        <div className="rounded-xl border border-brand-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-gray-900">You&apos;re on the Free plan</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Starter is $500/mo. Pro is $1,000/mo. Premium setup is $1,500–$2,500/mo.
              </p>
            </div>

            <Link href="/dashboard/billing" className="w-full sm:w-auto shrink-0">
              <Button className="w-full sm:w-auto" size="sm">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Live Operations Snapshot</h2>
            <p className="text-sm text-gray-500 mt-1">
              Recent activity from the database-backed operations, lead, scheduling, order, and notification systems.
            </p>
          </div>

          <Link href="/dashboard/notifications" className="w-full sm:w-auto shrink-0">
            <Button variant="outline" size="sm" className="w-full sm:w-auto whitespace-nowrap">
              View Notifications
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <Users className="h-5 w-5 text-brand-600" />
            <p className="mt-3 text-sm font-semibold text-gray-900">Latest Lead</p>
            <p className="mt-1 text-sm text-gray-500">{latestLead ? `${latestLead.full_name} · ${latestLead.priority}` : "No saved leads yet."}</p>
          </div>
          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <Command className="h-5 w-5 text-orange-600" />
            <p className="mt-3 text-sm font-semibold text-gray-900">Latest Operation</p>
            <p className="mt-1 text-sm text-gray-500">{latestEvent ? latestEvent.title : "No operations events yet."}</p>
          </div>
          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <CalendarDays className="h-5 w-5 text-indigo-600" />
            <p className="mt-3 text-sm font-semibold text-gray-900">Scheduling</p>
            <p className="mt-1 text-sm text-gray-500">{latestSchedule ? `${latestSchedule.customer_name} · ${latestSchedule.requested_service}` : "No scheduling requests yet."}</p>
          </div>
          <div className="rounded-lg border border-gray-100 p-4 bg-gray-50">
            <ClipboardList className="h-5 w-5 text-emerald-600" />
            <p className="mt-3 text-sm font-semibold text-gray-900">Orders / Requests</p>
            <p className="mt-1 text-sm text-gray-500">{latestOrder ? `${latestOrder.customer_name} · ${latestOrder.request_type}` : "No order requests yet."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
