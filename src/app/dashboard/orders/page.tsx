import { frontlineDemoData } from "@/lib/demo-data";
import { ClipboardList, AlertTriangle, MessageSquareReply } from "lucide-react";

function getPriorityClasses(priority: string) {
  if (priority === "urgent") return "bg-red-100 text-red-700";
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}

function getRequestTypeLabel(type: string) {
  if (type === "service_request") return "Service Request";
  if (type === "quote") return "Quote Request";
  return "Order";
}

export default function OrdersPage() {
  const requests = frontlineDemoData.orderRequests;
  const urgentRequests = requests.filter((request) => request.priority === "urgent" || request.priority === "high");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders & Service Requests</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Compact operations queue for quotes, orders, service requests, dispatch needs, and urgent customer issues.
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 lg:max-w-md">
          <span className="font-semibold">Demo mode:</span> mocked order and service records from {frontlineDemoData.account.businessName}.
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <ClipboardList size={16} />
            <p className="text-xs">Requests</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{requests.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={16} />
            <p className="text-xs">Attention</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-red-600">{urgentRequests.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-blue-600">
            <MessageSquareReply size={16} />
            <p className="text-xs">Replies</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-blue-600">{requests.length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">Request Queue</h2>
          <p className="mt-1 text-xs text-gray-500">Fixed-height workspace with internal scrolling.</p>
        </div>

        <div className="max-h-[560px] space-y-3 overflow-y-auto p-4">
          {requests.map((request) => (
            <div key={request.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">{request.customerName}</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
                      {getRequestTypeLabel(request.requestType)}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${getPriorityClasses(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{request.channel} · Estimated value {request.estimatedValue ?? "TBD"}</p>
                </div>

                <div className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                  {request.estimatedValue ?? "Value TBD"}
                </div>
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Customer Request</p>
                  <p className="mt-1 text-xs text-gray-700">{request.message}</p>
                </div>

                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">AI Reply</p>
                  <p className="mt-1 text-xs text-emerald-900">{request.suggestedResponse}</p>
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">Next Action</p>
                  <p className="mt-1 text-xs text-blue-900">{request.nextAction}</p>
                  {request.priority === "urgent" && (
                    <p className="mt-2 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-700">
                      Human follow-up recommended today
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
