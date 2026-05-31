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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Records</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Compact lead command center for qualified leads, AI summaries, urgency, and next actions.
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 lg:max-w-md">
          <span className="font-semibold">Demo mode:</span> mocked lead records from {frontlineDemoData.account.businessName}.
        </div>
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
          <p className="text-xs text-gray-500">Opportunity</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{frontlineDemoData.metrics.estimatedOpenOpportunity}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Qualified Leads</h2>
              <p className="text-xs text-gray-500">Fixed-height table with internal scrolling.</p>
            </div>
            <span className="text-xs text-gray-500">{demoLeads.length} demo records</span>
          </div>
        </div>

        <div className="max-h-[560px] overflow-auto">
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
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-gray-500">
                      {lead.questionsToAsk.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ul>
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
