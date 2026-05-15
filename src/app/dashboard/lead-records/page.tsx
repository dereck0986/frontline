const demoLeads = [
  {
    id: "demo-001",
    name: "Michael Torres",
    contact: "michael@example.com",
    industry: "Real Estate",
    score: 82,
    priority: "high",
    summary: "Motivated lead requesting fast follow-up and appointment options.",
  },
  {
    id: "demo-002",
    name: "Sarah Mitchell",
    contact: "555-012-4421",
    industry: "Security",
    score: 76,
    priority: "medium",
    summary: "Potential client asking about coverage, availability, and pricing.",
  },
  {
    id: "demo-003",
    name: "David Chen",
    contact: "david@example.com",
    industry: "Contractors",
    score: 69,
    priority: "medium",
    summary: "Lead needs project estimate and should receive a structured follow-up.",
  },
];

export default function LeadRecordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Records</h1>
        <p className="text-gray-500 mt-1">
          Demo-safe lead inbox for Phase 1. Database persistence can be re-enabled after production tables are verified.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">Phase 1 Demo Mode</p>
        <p className="mt-1 text-sm text-amber-700">
          This page is protected from live database crashes while the sales demo flow is finalized.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Qualified Leads</h2>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {demoLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.contact}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{lead.industry}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">{lead.score}/100</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 capitalize">
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-md">{lead.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
