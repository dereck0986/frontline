import { frontlineDemoData } from "@/lib/demo-data";

function getPriorityClasses(priority: string) {
  if (priority === "urgent") return "bg-red-100 text-red-700";
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}

export default function LeadRecordsPage() {
  const demoLeads = frontlineDemoData.leads;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Records</h1>
        <p className="text-gray-500 mt-1">
          Demo-safe lead inbox showing how Frontline stores qualified leads, AI summaries, urgency, and next actions.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">Demo Mode Active</p>
        <p className="mt-1 text-sm text-amber-700">
          These are mocked records from {frontlineDemoData.account.businessName}. No real customer data is connected.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Qualified Leads</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{demoLeads.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Urgent Leads</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {demoLeads.filter((lead) => lead.priority === "urgent").length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Open Opportunity</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{frontlineDemoData.metrics.estimatedOpenOpportunity}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Qualified Leads</h2>
            <p className="text-sm text-gray-500">Lead details, AI summaries, qualification scores, and next steps.</p>
          </div>
          <span className="text-sm text-gray-500">{demoLeads.length} demo records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Lead</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Industry</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Score</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Priority</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">AI Summary</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {demoLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors align-top">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{lead.fullName}</p>
                    <p className="text-xs text-gray-500">{lead.email ?? lead.phone ?? "No contact"}</p>
                    <p className="mt-2 text-xs text-gray-400">{lead.source}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700 capitalize">{lead.industry.replace("_", " ")}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">{lead.qualificationScore}/100</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPriorityClasses(lead.priority)}`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-sm">{lead.aiSummary}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-sm">
                    <p>{lead.suggestedNextAction}</p>
                    {lead.needsHumanAttention && (
                      <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                        Human attention recommended
                      </p>
                    )}
                    <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-gray-500">
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
