import { INDUSTRY_QUESTIONS } from "@/lib/lead-qualification";

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

export default function LeadsPage() {
  const nextQuestions = INDUSTRY_QUESTIONS.security.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Inbox</h1>
        <p className="text-gray-500 mt-1">
          Capture leads manually, qualify them with AI, and prepare follow-up.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Manual Lead Intake</h2>
          <p className="text-sm text-gray-500 mt-1">
            Use this until Twilio and VAPI are connected.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Full name" />
            <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Phone number" />
            <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Email" />
            <select className="rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white" defaultValue="security">
              <option value="real_estate">Real Estate</option>
              <option value="security">Security</option>
              <option value="contractors">Contractors</option>
              <option value="med_spas">Med Spas</option>
              <option value="rentals">Rentals</option>
            </select>
            <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Lead source" />
            <input className="rounded-lg border border-gray-200 px-4 py-3 text-sm" placeholder="Estimated opportunity value" />
          </div>

          <textarea
            className="mt-4 min-h-32 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
            placeholder="Paste the lead message, missed-call note, form submission, or inquiry here..."
          />

          <div className="mt-4 flex justify-end">
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Qualify Lead
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">AI Qualification Preview</h2>
          <p className="text-sm text-gray-500 mt-1">
            Demo output using Frontline scoring logic.
          </p>

          <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
            <p className="text-sm text-emerald-700 font-semibold">Score: 87/100</p>
            <p className="text-sm text-gray-700 mt-2">
              High-intent security lead. Needs coverage details, guard type, and shift requirements before booking.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-3">
              <p className="text-xs font-semibold text-orange-700">Priority</p>
              <p className="text-sm text-gray-800">High</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">Suggested Next Action</p>
              <p className="text-sm text-gray-800">Ask qualification questions and offer two appointment windows.</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-900">Next questions</p>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              {nextQuestions.map((question) => (
                <li key={question} className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
        </div>
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
