import { frontlineDemoData } from "@/lib/demo-data";
import { CalendarDays, Clock, MessageSquareReply } from "lucide-react";

function getPriorityClasses(priority: string) {
  if (priority === "urgent") return "bg-red-100 text-red-700";
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}

export default function SchedulingPage() {
  const requests = frontlineDemoData.scheduleRequests;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scheduling Operations</h1>
        <p className="text-gray-500 mt-1">
          Demo booking queue for appointment requests, tours, consultations, and scheduling follow-up.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">Demo Mode Active</p>
        <p className="mt-1 text-sm text-amber-700">
          These are mocked scheduling requests from {frontlineDemoData.account.businessName}. No live calendar is connected yet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <CalendarDays size={18} />
            <p className="text-sm">Booking Requests</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{requests.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-orange-600">
            <Clock size={18} />
            <p className="text-sm">High Priority</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-orange-600">
            {requests.filter((request) => request.priority === "high" || request.priority === "urgent").length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <MessageSquareReply size={18} />
            <p className="text-sm">Replies Ready</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{requests.length}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{request.customerName}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPriorityClasses(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{request.channel} · {request.requestedService}</p>
              </div>

              <div className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                {request.requestedTime}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer Message</p>
                <p className="mt-2 text-sm text-gray-700">{request.message}</p>
              </div>

              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">AI Suggested Reply</p>
                <p className="mt-2 text-sm text-emerald-900">{request.suggestedResponse}</p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Next Action</p>
                <p className="mt-2 text-sm text-blue-900">{request.nextAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
