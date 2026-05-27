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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders & Service Requests</h1>
        <p className="text-gray-500 mt-1">
          Demo operations queue for quote requests, customer orders, service requests, delivery needs, and urgent customer issues.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">Demo Mode Active</p>
        <p className="mt-1 text-sm text-amber-700">
          These are mocked order and service request records from {frontlineDemoData.account.businessName}. No live POS, inventory, CRM, or dispatch system is connected yet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <ClipboardList size={18} />
            <p className="text-sm">Open Requests</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{requests.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={18} />
            <p className="text-sm">Needs Attention</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-600">{urgentRequests.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-blue-600">
            <MessageSquareReply size={18} />
            <p className="text-sm">Replies Ready</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600">{requests.length}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{request.customerName}</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {getRequestTypeLabel(request.requestType)}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPriorityClasses(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{request.channel} · Estimated value {request.estimatedValue ?? "TBD"}</p>
              </div>

              <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                {request.estimatedValue ?? "Value TBD"}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer Request</p>
                <p className="mt-2 text-sm text-gray-700">{request.message}</p>
              </div>

              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">AI Suggested Reply</p>
                <p className="mt-2 text-sm text-emerald-900">{request.suggestedResponse}</p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Next Action</p>
                <p className="mt-2 text-sm text-blue-900">{request.nextAction}</p>
                {request.priority === "urgent" && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                    Human follow-up recommended today
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
