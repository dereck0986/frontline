import Link from "next/link";
import { frontlineDemoData } from "@/lib/demo-data";
import { AlertTriangle, CalendarDays, ClipboardList, MessageSquareReply, Users } from "lucide-react";

type OperationsItem = {
  id: string;
  type: "lead" | "review" | "schedule" | "order";
  title: string;
  subtitle: string;
  message: string;
  priority: string;
  nextAction: string;
  href: string;
};

function getPriorityClasses(priority: string) {
  if (priority === "urgent") return "bg-red-100 text-red-700";
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}

function getTypeIcon(type: OperationsItem["type"]) {
  if (type === "lead") return Users;
  if (type === "review") return MessageSquareReply;
  if (type === "schedule") return CalendarDays;
  return ClipboardList;
}

function getTypeClasses(type: OperationsItem["type"]) {
  if (type === "lead") return "bg-brand-50 text-brand-700";
  if (type === "review") return "bg-purple-50 text-purple-700";
  if (type === "schedule") return "bg-indigo-50 text-indigo-700";
  return "bg-emerald-50 text-emerald-700";
}

export default function OperationsPage() {
  const items: OperationsItem[] = [
    ...frontlineDemoData.leads.map((lead) => ({
      id: lead.id,
      type: "lead" as const,
      title: lead.fullName,
      subtitle: `${lead.industry.replace("_", " ")} · ${lead.source}`,
      message: lead.aiSummary,
      priority: lead.priority,
      nextAction: lead.suggestedNextAction,
      href: "/dashboard/lead-records",
    })),
    ...frontlineDemoData.reviews.map((review) => ({
      id: review.id,
      type: "review" as const,
      title: review.customerName,
      subtitle: `${review.source} · ${review.rating}/5 rating · ${review.sentiment}`,
      message: review.message,
      priority: review.priority,
      nextAction: review.nextAction,
      href: "/dashboard/reviews",
    })),
    ...frontlineDemoData.scheduleRequests.map((request) => ({
      id: request.id,
      type: "schedule" as const,
      title: request.customerName,
      subtitle: `${request.channel} · ${request.requestedService} · ${request.requestedTime}`,
      message: request.message,
      priority: request.priority,
      nextAction: request.nextAction,
      href: "/dashboard/scheduling",
    })),
    ...frontlineDemoData.orderRequests.map((request) => ({
      id: request.id,
      type: "order" as const,
      title: request.customerName,
      subtitle: `${request.channel} · ${request.requestType.replace("_", " ")} · ${request.estimatedValue ?? "Value TBD"}`,
      message: request.message,
      priority: request.priority,
      nextAction: request.nextAction,
      href: "/dashboard/orders",
    })),
  ].sort((a, b) => {
    const weight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
    return (weight[b.priority] ?? 0) - (weight[a.priority] ?? 0);
  });

  const urgentCount = items.filter((item) => item.priority === "urgent").length;
  const highCount = items.filter((item) => item.priority === "high").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Unified Operations Inbox</h1>
        <p className="text-gray-500 mt-1">
          One demo command center for leads, reviews, scheduling requests, orders, and urgent escalations.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">Demo Mode Active</p>
        <p className="mt-1 text-sm text-amber-700">
          This inbox combines mocked operational activity from {frontlineDemoData.account.businessName}. No live customer systems are connected yet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{items.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Urgent</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{urgentCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">High Priority</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">{highCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Open Opportunity</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{frontlineDemoData.metrics.estimatedOpenOpportunity}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Priority Operations Stream</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">Sorted by urgency so owners know what needs attention first.</p>
        </div>

        <div className="divide-y divide-gray-100">
          {items.map((item) => {
            const Icon = getTypeIcon(item.type);
            return (
              <div key={`${item.type}-${item.id}`} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getTypeClasses(item.type)}`}>
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                          {item.type}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPriorityClasses(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 capitalize">{item.subtitle}</p>
                      <p className="mt-3 max-w-3xl text-sm text-gray-700">{item.message}</p>
                      <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                        <span className="font-semibold">Next action: </span>{item.nextAction}
                      </div>
                    </div>
                  </div>

                  <Link href={item.href} className="rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-white lg:shrink-0">
                    Open Workflow
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
