export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBusinessByUserId, getSchedulingRequestsByUserId } from "@/lib/db";
import { frontlineDemoData } from "@/lib/demo-data";
import { CalendarDays, Clock, MessageSquareReply } from "lucide-react";

type DisplaySchedulingRequest = {
  id: string;
  customerName: string;
  channel: string;
  requestedService: string;
  requestedTime: string | null;
  message: string;
  priority: string;
  suggestedResponse: string | null;
  nextAction: string | null;
};

function getPriorityClasses(priority: string) {
  if (priority === "urgent") return "bg-red-100 text-red-700";
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}

function normalizeDemoRequest(request: (typeof frontlineDemoData.scheduleRequests)[number]): DisplaySchedulingRequest {
  return {
    id: request.id,
    customerName: request.customerName,
    channel: request.channel,
    requestedService: request.requestedService,
    requestedTime: request.requestedTime,
    message: request.message,
    priority: request.priority,
    suggestedResponse: request.suggestedResponse,
    nextAction: request.nextAction,
  };
}

export default async function SchedulingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const business = await getBusinessByUserId(session.user.id);
  if (!business) redirect("/onboarding");

  const persistedRequests = await getSchedulingRequestsByUserId(session.user.id);
  const hasPersistedRequests = persistedRequests.length > 0;

  const requests: DisplaySchedulingRequest[] = hasPersistedRequests
    ? persistedRequests.map((request) => ({
        id: request.id,
        customerName: request.customer_name,
        channel: request.channel,
        requestedService: request.requested_service,
        requestedTime: request.requested_time,
        message: request.message,
        priority: request.priority,
        suggestedResponse: request.suggested_response,
        nextAction: request.next_action,
      }))
    : frontlineDemoData.scheduleRequests.map(normalizeDemoRequest);

  const highPriorityCount = requests.filter((request) => request.priority === "high" || request.priority === "urgent").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduling Operations</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {hasPersistedRequests ? "Showing saved scheduling requests from your Frontline database." : "Showing demo scheduling requests until your first saved request is created."}
          </p>
        </div>
        {!hasPersistedRequests && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 lg:max-w-md">
            <span className="font-semibold">Demo mode:</span> mocked scheduling requests from {frontlineDemoData.account.businessName}.
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-indigo-600">
            <CalendarDays size={16} />
            <p className="text-xs">Requests</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{requests.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-orange-600">
            <Clock size={16} />
            <p className="text-xs">Priority</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-orange-600">{highPriorityCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <MessageSquareReply size={16} />
            <p className="text-xs">Replies</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{requests.length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">Booking Queue</h2>
          <p className="mt-1 text-xs text-gray-500">Fixed-height workspace with internal scrolling.</p>
        </div>

        <div className="max-h-[560px] space-y-3 overflow-y-auto p-4">
          {requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">{request.customerName}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${getPriorityClasses(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{request.channel} · {request.requestedService}</p>
                </div>

                <div className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                  {request.requestedTime ?? "Time TBD"}
                </div>
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Customer Message</p>
                  <p className="mt-1 text-xs text-gray-700">{request.message}</p>
                </div>

                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">AI Reply</p>
                  <p className="mt-1 text-xs text-emerald-900">{request.suggestedResponse ?? "No reply drafted yet."}</p>
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">Next Action</p>
                  <p className="mt-1 text-xs text-blue-900">{request.nextAction ?? "Confirm availability and schedule follow-up."}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
