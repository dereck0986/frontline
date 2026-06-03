import Link from "next/link";
import { AlertTriangle, CalendarDays, ClipboardList, MessageSquareReply, Users } from "lucide-react";
import { frontlineDemoData } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";

type DemoItem = {
  id: string;
  type: "lead" | "review" | "schedule" | "order";
  title: string;
  subtitle: string;
  message: string;
  priority: string;
  nextAction: string;
};

function getPriorityClasses(priority: string) {
  if (priority === "urgent") return "bg-red-100 text-red-700";
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}

function getTypeIcon(type: DemoItem["type"]) {
  if (type === "lead") return Users;
  if (type === "review") return MessageSquareReply;
  if (type === "schedule") return CalendarDays;
  return ClipboardList;
}

function getTypeClasses(type: DemoItem["type"]) {
  if (type === "lead") return "bg-brand-50 text-brand-700";
  if (type === "review") return "bg-purple-50 text-purple-700";
  if (type === "schedule") return "bg-indigo-50 text-indigo-700";
  return "bg-emerald-50 text-emerald-700";
}

function getDemoItems(): DemoItem[] {
  return [
    ...frontlineDemoData.leads.map((lead) => ({
      id: lead.id,
      type: "lead" as const,
      title: lead.fullName,
      subtitle: `${lead.industry.replace("_", " ")} · ${lead.source}`,
      message: lead.aiSummary,
      priority: lead.priority,
      nextAction: lead.suggestedNextAction,
    })),
    ...frontlineDemoData.reviews.map((review) => ({
      id: review.id,
      type: "review" as const,
      title: review.customerName,
      subtitle: `${review.source} · ${review.rating}/5 rating · ${review.sentiment}`,
      message: review.message,
      priority: review.priority,
      nextAction: review.nextAction,
    })),
    ...frontlineDemoData.scheduleRequests.map((request) => ({
      id: request.id,
      type: "schedule" as const,
      title: request.customerName,
      subtitle: `${request.channel} · ${request.requestedService} · ${request.requestedTime}`,
      message: request.message,
      priority: request.priority,
      nextAction: request.nextAction,
    })),
    ...frontlineDemoData.orderRequests.map((request) => ({
      id: request.id,
      type: "order" as const,
      title: request.customerName,
      subtitle: `${request.channel} · ${request.requestType.replace("_", " ")} · ${request.estimatedValue ?? "Value TBD"}`,
      message: request.message,
      priority: request.priority,
      nextAction: request.nextAction,
    })),
  ].sort((a, b) => {
    const weight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
    return (weight[b.priority] ?? 0) - (weight[a.priority] ?? 0);
  });
}

export default function PublicDemoPage() {
  const items = getDemoItems();
  const urgentCount = items.filter((item) => item.priority === "urgent").length;
  const highCount = items.filter((item) => item.priority === "high").length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">F</div>
            <span className="text-lg font-bold text-gray-900">Frontline</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Start Pilot</Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Public demo</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Demo Operations Inbox</h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-500">
              A safe preview of Frontline&apos;s operations stream using mocked leads, reviews, scheduling requests, and order requests. No login or database access required.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 lg:max-w-md">
            <span className="font-semibold">Demo mode:</span> sample data only. Real accounts use the live database-backed dashboard.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-500">Total Items</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{items.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-500">Urgent</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{urgentCount}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-500">High Priority</p>
            <p className="mt-1 text-2xl font-bold text-orange-600">{highCount}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-500">Source</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">Demo</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <h2 className="text-base font-semibold text-gray-900">Priority Operations Stream</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">Fixed-height workspace sorted by urgency. Scroll inside the panel, not the whole page.</p>
          </div>

          <div className="max-h-[620px] divide-y divide-gray-100 overflow-y-auto">
            {items.map((item) => {
              const Icon = getTypeIcon(item.type);
              return (
                <div key={`${item.type}-${item.id}`} className="p-4 transition-colors hover:bg-gray-50">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getTypeClasses(item.type)}`}>
                        <Icon size={17} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium capitalize text-gray-700">{item.type}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${getPriorityClasses(item.priority)}`}>{item.priority}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500 capitalize">{item.subtitle}</p>
                        <p className="mt-2 max-w-3xl text-sm text-gray-700">{item.message}</p>
                        <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-900">
                          <span className="font-semibold">Next action: </span>{item.nextAction}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
