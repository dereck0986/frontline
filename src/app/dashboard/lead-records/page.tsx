import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLeadsByUserId } from "@/lib/db";

export default async function LeadRecordsPage() {
  const session = await getServerSession(authOptions);
  const leads = session?.user?.id ? await getLeadsByUserId(session.user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Records</h1>
        <p className="text-gray-500 mt-1">Database-backed lead inbox for saved Frontline leads.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Saved Leads</h2>
          <span className="text-sm text-gray-500">{leads.length} total</span>
        </div>

        {leads.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-gray-900">No saved leads yet.</p>
            <p className="text-sm text-gray-500 mt-1">Use Lead Intake to qualify and save your first lead.</p>
          </div>
        ) : (
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
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{lead.full_name}</p>
                      <p className="text-xs text-gray-500">{lead.email ?? lead.phone ?? lead.id}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700 capitalize">{lead.industry.replace(/_/g, " ")}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">{lead.qualification_score}/100</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 capitalize">
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-md">{lead.ai_summary ?? "No summary yet."}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
