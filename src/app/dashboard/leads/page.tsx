export default function LeadsPage() {
  const mockLeads = [
    {
      id: "LD-1001",
      name: "Michael Torres",
      industry: "Real Estate",
      status: "Qualified",
      priority: "High",
      value: "$18,000",
    },
    {
      id: "LD-1002",
      name: "Sarah Mitchell",
      industry: "Security",
      status: "New",
      priority: "Urgent",
      value: "$9,500",
    },
    {
      id: "LD-1003",
      name: "David Chen",
      industry: "Contractors",
      status: "Appointment Booked",
      priority: "Medium",
      value: "$22,000",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Inbox</h1>
        <p className="text-gray-500 mt-1">
          Track, qualify, and manage incoming leads.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Lead</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Industry</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Priority</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Opportunity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {mockLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{lead.industry}</td>
                  <td className="px-6 py-4 text-gray-700">{lead.status}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">
                    {lead.value}
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
