import { frontlineDemoData } from "@/lib/demo-data";

function getPriorityClasses(priority: string) {
  if (priority === "urgent") return "bg-red-100 text-red-700";
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}

export default function LeadRecordsPage() {
  const demoLeads = frontlineDemoData.leads;
  const urgentLeads = demoLeads.filter((lead) => lead.priority === "urgent").length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Records</h1>
        <p className="mt-1 text-sm text-gray-500">
          Qualified leads, AI summaries, urgency, and next actions.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-500">Qualified</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{demoLeads.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-500">Urgent</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{urgentLeads}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-500">Pipeline</p>
          <p className="mt-1 text-xl font-bold text-emerald-600 sm:text-2xl">{frontlineDemoData.metrics.estimatedOpenOpportunity}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Qualified Leads</h2>
              <p className="text-xs text-gray-500">Mobile card view. Desktop table view.</p>
            </div>
            <span className="text-xs text-gray-500">{demoLeads.length} demo records</span>
          </div>
        </div>

        <div className="max-h-[560px] space-y-3 overflow-y-auto p-4 md:hidden">
          {demoLeads.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-900">{lead.fullName}</p>
                  <p className="truncate text-xs text-gray-500">{lead.email ?? lead.phone ?? "No contact"}</p>
                  <p className="mt-1 text-[11px] text-gray-400">{lead.source}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-emerald-600">{lead.qualificationScore}/100</p>
                  <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${getPriorityClasses(lead.priority)}`}>
                    {lead.priority}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium capitalize text-gray-700">
                  {lead.industry.replace("_", " ")}
                </span>
                {lead.needsHumanAttention && (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">
                    Human attention
                  </span>
                )}
              </div>

              <div className="mt-3 rounded-lg bg-white p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">AI Summary</p>
                <p className="mt-1 text-xs text-gray-700">{lead.aiSummary}</p>
              </div>

              <div className="mt-3 rounded-lg bg-blue-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">Next Action</p>
                <p className="mt-1 text-xs text-blue-900">{lead.suggestedNextAction}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden max-h-[560px] overflow-auto md:block">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Lead</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Industry</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">AI Summary</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {demoLeads.map((lead) => (
                <tr key={lead.id} className="align-top transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{lead.fullName}</p>
                    <p className="text-xs text-gray-500">{lead.email ?? lead.phone ?? "No contact"}</p>
                    <p className="mt-1 text-[11px] text-gray-400">{lead.source}</p>
                  </td>
                  <td className="px-4 py-3 text-xs capitalize text-gray-700">{lead.industry.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-600">{lead.qualificationScore}/100</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${getPriorityClasses(lead.priority)}`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="max-w-sm px-4 py-3 text-xs text-gray-600">{lead.aiSummary}</td>
                  <td className="max-w-sm px-4 py-3 text-xs text-gray-600">
                    <p>{lead.suggestedNextAction}</p>
                    {lead.needsHumanAttention && (
                      <p className="mt-2 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-700">
                        Human attention recommended
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
