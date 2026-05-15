type LeadProfilePageProps = {
  params: {
    id: string;
  };
};

const timeline = [
  "Lead captured",
  "AI qualification generated",
  "Follow-up sequence prepared",
  "Owner review pending",
];

export default function LeadProfilePage({ params }: LeadProfilePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Lead ID: {params.id}</p>
        <h1 className="text-2xl font-bold text-gray-900">Lead Command Center</h1>
        <p className="text-gray-500 mt-1">
          Central profile for qualification, follow-up, appointments, and owner actions.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">AI Summary</h2>
            <p className="mt-3 text-sm text-gray-600">
              This page is prepared for saved lead data. Once database persistence is fully connected, each lead record will display contact info, qualification score, summary, and next action here.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Follow-Up Timeline</h2>
            <div className="mt-5 space-y-3">
              {timeline.map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Next Action</h2>
            <p className="mt-3 text-sm text-gray-600">
              Ask qualification questions, confirm urgency, and offer two appointment windows.
            </p>
            <button className="mt-4 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
              Prepare Follow-Up
            </button>
          </div>

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
            <h2 className="text-lg font-semibold text-orange-800">Human Attention</h2>
            <p className="mt-3 text-sm text-orange-700">
              High-priority and urgent leads will appear here for owner review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
